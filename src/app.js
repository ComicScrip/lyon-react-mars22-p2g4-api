/* eslint-disable no-unreachable-loop */
/* eslint-disable camelcase */
const express = require('express');
const db = require('./db');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/api', (req, res) => res.send('Welcome to the Pic&Move API'));

app.use(express.json());

app.get('/api/paths', async (req, res) => {
  let sql = 'SELECT * FROM path';

  function filters(filterObject) {
    const array = [];

    for (const filterName in filterObject) {
      const filterValue = filterObject[filterName];

      if (filterValue !== '') {
        if (filterName === 'city_location') {
          array.push(`${filterName} LIKE '${filterValue}'`);
        } else if (filterName === 'length') {
          array.push(`${filterName} <= ${filterValue}`);
        } else if (filterName === 'difficulty') {
          array.push(`${filterName} = ${filterValue}`);
        }
      }
    }
    if (array.length !== 0) {
      sql += ` WHERE ${array.join(' AND ')}`;
    }
    console.log(filterObject);
  }

  filters(req.query);

  try {
    const [path] = await db.promise().query(sql);
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

db.connect((err) => {
  if (err) console.error('Error connecting to database');
});

module.exports.app = app;
