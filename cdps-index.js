var express = require('express');
var router = express.Router();
var multer  = require('multer');

var tracks_dir = process.env.TRACKS_DIR || './media/';

var trackController = require('./cdps-track_controller');

router.get('/', function(req, res) {
  res.render('./cdps-index');
});
/*
router.get('/tracks', trackController.list);

router.get('/tracks/new', trackController.new);

router.get('/tracks/:trackId', trackController.show);*/

router.post('/upload', multer({inMemory:true}), trackController.create);

router.delete('/delete/:trackId', trackController.destroy);

module.exports = router;
