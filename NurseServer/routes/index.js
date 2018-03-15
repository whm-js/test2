'use strict';
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('./section/index', { title: 'Test Page.', layout: './engine/layout' });
});

module.exports = router;
