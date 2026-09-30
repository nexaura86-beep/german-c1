import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db } from './db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'telc_c1_hochschule_secret_key_2026_super_secure';

export function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
      name: user.name
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Nicht authentifiziert (Kein Token)' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = db.getUserById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'Benutzerkonto nicht gefunden' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Ungültiges oder abgelaufenes Token' });
  }
}

export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Zugriff verweigert: Nur für Administratoren' });
  }
  next();
}

export function requireActiveUser(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Nicht eingeloggt' });
  }
  if (req.user.role === 'admin') {
    return next();
  }
  if (req.user.status !== 'active') {
    return res.status(403).json({
      error: 'Dein Konto wartet noch auf die Freischaltung durch den Administrator.',
      status: req.user.status,
      isPending: true
    });
  }
  next();
}
