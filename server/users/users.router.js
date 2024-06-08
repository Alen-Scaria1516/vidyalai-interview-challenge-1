const express = require('express');
const { fetchAllUsers, fetchUserById } = require('./users.service');

const router = express.Router();

router.get('/', async (req, res) => {
  const users = await fetchAllUsers();

  res.json(users);
});

router.get('/:id', async (req, res) => {
  const userId = req.params.id;
  const user = await fetchUserById(userId);
  res.json(user);
});

module.exports = router;
