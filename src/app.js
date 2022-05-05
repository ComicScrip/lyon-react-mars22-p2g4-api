const express = require('express');
const db = require('./db');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/api', (req, res) => res.send('Welcome to the Pic&Move API'));

app.use(express.json());

app.get('/api/paths', async (req, res) => {
  const { name } = req.query;
  let sql = 'SELECT * FROM path';
  const valuesToEscape = [];
  if (name) {
    sql += ' WHERE name LIKE ?';
    valuesToEscape.push(`%${name}%`);
  }

  try {
    const [path] = await db.promise().query(sql, valuesToEscape);
    res.send(path);
  } catch (err) {
    console.error(err);
    res.status(500).send('Something wrong happened');
  }
});

app.get('/api/paths/:id', async (req, res) => {
  try {
    const [[path]] = await db
      .promise()
      .query('SELECT * FROM path WHERE id = ?', [req.params.id]);

    if (path) res.send(path);
    else res.sendStatus(404);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

module.exports.app = app;
