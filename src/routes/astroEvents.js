const express = require('express');
const router = express.Router();
const { getEvents } = require('../services/astroEvents');

router.get('/', (req, res) => {
  const range = Math.min(Number(req.query.range) || 30, 90); // не больше 90 дней
  const data = getEvents(range);
  res.json(data);
});

module.exports = router;
