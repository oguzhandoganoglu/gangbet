const express = require('express');
const { uploadBetPhoto } = require('../controllers/photoController');
const upload = require('../utils/s3Upload');

const router = express.Router();

// Fotoğraf yükleme endpoint'i
router.post('/upload-bet-photo', upload.single('photo'), uploadBetPhoto);

module.exports = router;