const express = require('express');
const router = express.Router();
const { processCheckout } = require('../controllers/checkoutController');

router.route('/')
  .post(processCheckout);

module.exports = router;