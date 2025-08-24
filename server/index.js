require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3001;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

app.use(express.json());

app.get('/click', async (req, res) => {
  const { affiliate_id, campaign_id, click_id } = req.query;

  if (!affiliate_id || !campaign_id || !click_id) {
    return res.status(400).json({ error: 'Missing required query parameters' });
  }

  try {
    const query = 'INSERT INTO clicks(affiliate_id, campaign_id, click_id) VALUES($1, $2, $3) RETURNING *';
    const values = [affiliate_id, campaign_id, click_id];
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/postback', async (req, res) => {
  const { affiliate_id, click_id, amount, currency } = req.query;

  if (!affiliate_id || !click_id || !amount || !currency) {
    return res.status(400).json({ error: 'Missing required query parameters' });
  }

  try {
    const clickQuery = 'SELECT * FROM clicks WHERE affiliate_id = $1 AND click_id = $2';
    const clickValues = [affiliate_id, click_id];
    const clickResult = await pool.query(clickQuery, clickValues);

    if (clickResult.rows.length === 0) {
      return res.status(404).json({ error: 'Click not found' });
    }

    const conversionQuery = 'INSERT INTO conversions(click_id, amount, currency) VALUES($1, $2, $3) RETURNING *';
    const conversionValues = [clickResult.rows[0].id, amount, currency];
    const conversionResult = await pool.query(conversionQuery, conversionValues);

    res.status(201).json({ status: 'success', message: 'Conversion tracked', data: conversionResult.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/clicks', async (req, res) => {
  const { affiliate_id } = req.query;

  if (!affiliate_id) {
    return res.status(400).json({ error: 'Missing required query parameter: affiliate_id' });
  }

  try {
    const query = 'SELECT * FROM clicks WHERE affiliate_id = $1 ORDER BY timestamp DESC';
    const values = [affiliate_id];
    const result = await pool.query(query, values);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/conversions', async (req, res) => {
  const { affiliate_id } = req.query;

  if (!affiliate_id) {
    return res.status(400).json({ error: 'Missing required query parameter: affiliate_id' });
  }

  try {
    const query = 'SELECT c.* FROM conversions c JOIN clicks cl ON c.click_id = cl.id WHERE cl.affiliate_id = $1';
    const values = [affiliate_id];
    const result = await pool.query(query, values);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});