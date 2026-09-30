const BASE_URL = '/api';

function getHeaders() {
  const token = localStorage.getItem('telc_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // Auth
  login: async (email, password) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login fehlgeschlagen');
    return data;
  },

  register: async (userData) => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registrierung fehlgeschlagen');
    return data;
  },

  demoLogin: async (role) => {
    const res = await fetch(`${BASE_URL}/auth/demo-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Demo-Login fehlgeschlagen');
    return data;
  },

  getMe: async () => {
    const res = await fetch(`${BASE_URL}/auth/me`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Nicht autorisiert');
    return res.json();
  },

  // Admin
  getUsers: async () => {
    const res = await fetch(`${BASE_URL}/admin/users`, { headers: getHeaders() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Fehler beim Laden der Benutzer');
    return data.users;
  },

  toggleUserStatus: async (userId) => {
    const res = await fetch(`${BASE_URL}/admin/users/${userId}/toggle-status`, {
      method: 'PATCH',
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Fehler beim Ändern des Status');
    return data;
  },

  deleteUser: async (userId) => {
    const res = await fetch(`${BASE_URL}/admin/users/${userId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Fehler beim Löschen des Benutzers');
    return data;
  },

  digitizePaper: async (formData) => {
    const token = localStorage.getItem('telc_token');
    const res = await fetch(`${BASE_URL}/admin/digitize-paper`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Digitalisierungsfehler');
    return data;
  },

  // Topics & Instant Practice
  getTopicsData: async () => {
    const res = await fetch(`${BASE_URL}/topics`, { headers: getHeaders() });
    const data = await res.json();
    return data.topicsData;
  },

  getSingleTopic: async (section, subteil, topicId) => {
    const res = await fetch(`${BASE_URL}/topics/${section}/${subteil}/${topicId}`, { headers: getHeaders() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Thema nicht gefunden');
    return data;
  },

  evaluateInstant: async (payload) => {
    const res = await fetch(`${BASE_URL}/evaluate-instant`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Fehler bei der Auswertung');
    return data.scorecard;
  },

  gradeEssayWithAI: async (payload) => {
    const res = await fetch(`${BASE_URL}/ai/grade-essay`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'KI-Bewertungsfehler');
    return data;
  },

  updateAdminTopic: async (section, subteil, topicId, updatedTopicData) => {
    const res = await fetch(`${BASE_URL}/admin/topics/${section}/${subteil}/${topicId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updatedTopicData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Fehler beim Speichern der Änderungen');
    return data;
  },

  deleteAdminTopic: async (section, subteil, topicId) => {
    const res = await fetch(`${BASE_URL}/admin/topics/${section}/${subteil}/${topicId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Fehler beim Löschen');
    return data;
  }
};
