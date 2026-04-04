const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080;
const DATA_DIR = path.join(__dirname, 'data');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

app.use(express.json({ limit: '5mb' }));
app.use(express.static('site'));

// GET /api/store/:key
app.get('/api/store/:key', (req, res) => {
  const file = path.join(DATA_DIR, req.params.key + '.json');
  if (!fs.existsSync(file)) return res.json(null);
  try {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    res.json(data);
  } catch (e) {
    res.json(null);
  }
});

// PUT /api/store/:key
app.put('/api/store/:key', (req, res) => {
  const key = req.params.key.replace(/[^a-zA-Z0-9_\-]/g, '');
  const file = path.join(DATA_DIR, key + '.json');
  try {
    fs.writeFileSync(file, JSON.stringify(req.body, null, 2), 'utf8');
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => console.log('Server running on port ' + PORT));
