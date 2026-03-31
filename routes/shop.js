const express = require('express');

const shopController = require('../controllers/shops');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/', shopController.getIndex);