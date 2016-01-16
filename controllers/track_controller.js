var fs = require('fs');
var track_model = require('./../models/track');
var request = require('request');
var needle = require('needle');

// Devuelve una lista de las canciones disponibles y sus metadatos
exports.list = function (req, res) {
	var tracks = track_model.tracks;
	res.render('tracks/index', {tracks: tracks});
};

// Devuelve la vista del formulario para subir una nueva canción
exports.new = function (req, res) {
	res.render('tracks/new');
};

// Devuelve la vista de reproducción de una canción.
// El campo track.url contiene la url donde se encuentra el fichero de audio
exports.show = function (req, res) {
	var track = track_model.tracks[req.params.trackId];
	track.id = req.params.trackId;
	res.render('tracks/show', {track: track});
};

// Escribe una nueva canción en el registro de canciones.
// TODO:
// - Escribir en tracks.cdpsfy.es el fichero de audio contenido en req.files.track.buffer
// - Escribir en el registro la verdadera url generada al añadir el fichero en el servidor tracks.cdpsfy.es
exports.create = function (req, res) {
	var track = req.files.track;
	var id = track.name.split('.')[0];
	var name = track.originalname.split('.')[0];
	console.log('Recibido nuevo fichero de audio.', name);
	var url = 'http://10.1.2.1/download'+name;

	// Creamos el form-data con el buffer y nombre del track original
	var data = {
  		track: {
    			buffer       : track.buffer,
    			filename     : name,
    			content_type : 'application/octet-stream', 
			content_length: track.buffer.length
 		 }
	}

	// Realizamos el post con el form-data
	needle.post('http://10.1.2.1/upload', data, { /*headers: { content_length: Buffer.byteLength(data) },*/ multipart:true}, function(err,result){
		if(err) {
			console.log('ERROR: ', err);
		} else {
			console.log('Resultado:', result.body);
		}
	});
        
	//Redirigimos a /tracks
	res.redirect('/tracks');
	console.log('Redirigiendo a /tracks');
};

// Borra una canción (trackId) del registro de canciones 
// TODO:
// - Eliminar en tracks.cdpsfy.es el fichero de audio correspondiente a trackId
exports.destroy = function (req, res) {
	var trackId = req.params.trackId;

	// Aquí debe implementarse el borrado del fichero de audio indetificado por trackId en tracks.cdpsfy.es

	// Borra la entrada del registro de datos
	delete track_model.tracks[trackId];
	res.redirect('/tracks');
};
