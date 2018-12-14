// router
'use strict';
const express = require('express');
const router = express.Router();

const home = require('./home');
const getParcel = require('./api/getParcel');

router.get('/', home.get);

router.get("/api/getParcel", getParcel.get);

module.exports = router;