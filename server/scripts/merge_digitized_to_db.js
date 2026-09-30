import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');

const lv1Path = path.join(ROOT, 'data', 'lv1_topics.json');
const lv2Path = path.join(ROOT, 'data', 'lv2_topics.json');
const lv3Path = path.join(ROOT, 'data', 'lv3_topics.json');
const sbPath = path.join(ROOT, 'data', 'sb_topics.json');
const guidePath = path.join(ROOT, 'data', 'lv2_guide.json');
const dbPath = path.join(ROOT, 'database.json');

const lv1Topics = JSON.parse(fs.readFileSync(lv1Path, 'utf8'));
const lv2Topics = JSON.parse(fs.readFileSync(lv2Path, 'utf8'));
const lv3Topics = JSON.parse(fs.readFileSync(lv3Path, 'utf8'));
const sbTopics = JSON.parse(fs.readFileSync(sbPath, 'utf8'));
const guide = JSON.parse(fs.readFileSync(guidePath, 'utf8'));

const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Helper to merge while deduplicating by id
function mergeTopics(existingList = [], newList = []) {
  const map = new Map();
  existingList.forEach(t => map.set(t.id, t));
  newList.forEach(t => map.set(t.id, t));
  return Array.from(map.values());
}

// 1. Lesen Teil 1
db.topicsData.leseverstehen.teil1.topics = mergeTopics(
  db.topicsData.leseverstehen.teil1.topics,
  lv1Topics
);

// 2. Lesen Teil 2
db.topicsData.leseverstehen.teil2.topics = mergeTopics(
  db.topicsData.leseverstehen.teil2.topics,
  lv2Topics
);
db.topicsData.leseverstehen.teil2.guide = guide;

// 3. Lesen Teil 3
db.topicsData.leseverstehen.teil3.topics = mergeTopics(
  db.topicsData.leseverstehen.teil3.topics,
  lv3Topics
);

// 4. Sprachbausteine
db.topicsData.sprachbausteine.teil1.topics = mergeTopics(
  db.topicsData.sprachbausteine.teil1.topics,
  sbTopics
);

// Write to database.json
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');

console.log('Successfully updated database.json with digitized topics:');
console.log(`- Lesen Teil 1: ${db.topicsData.leseverstehen.teil1.topics.length} topics`);
console.log(`- Lesen Teil 2: ${db.topicsData.leseverstehen.teil2.topics.length} topics`);
console.log(`- Lesen Teil 3: ${db.topicsData.leseverstehen.teil3.topics.length} topics`);
console.log(`- Sprachbausteine: ${db.topicsData.sprachbausteine.teil1.topics.length} topics`);
