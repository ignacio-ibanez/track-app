var fs = require('fs');
var track_model = require('./cdps-track_model');

// Escribe una nueva canción en el registro de canciones.
// TODO:
// - Escribir en tracks.cdpsfy.es el fichero de audio contenido en req.files.track.buffer
// - Escribir en el registro la verdadera url generada al añadir el fichero en el servidor tracks.cdpsfy.es
exports.create = function (req, res) {
	var track = req.files.track;
	console.log('Recibido audio: ', track)
	var id = track.name.split('.')[0];
	var name = track.originalname.split('.')[0];
	
	// TODO: cambiar url
	var url = '/media/' + track.originalname;
	var path = '/mnt/nas/'+name;
	
	// Guardamos la cancion.
   	fs.writeFile(path, track.buffer, function(err) {
	    if(err) {
	      return console.log(err);
	    }
	    console.log("Audio guardado.");
	}); 

	// Escribe los metadatos de la nueva canción en el registro.
	track_model.tracks[id] = {
		name: name,
		url: url
	};
	
	res.status(200).send('Archivo subido.');
};

// Borra una canción (trackId) del registro de canciones 
// TODO:
// - Eliminar en tracks.cdpsfy.es el fichero de audio correspondiente a trackId
exports.destroy = function (req, res) {
	var trackId = req.params.trackId;

	// Aquí debe implementarse el borrado del fichero de audio indetificado por trackId en tracks.cdpsfy.es
	var track = track_model.tracks[trackId];
	var trackName = track.name + '.mp3';
	fs.unlinkSync('./public/media/' + trackName);
	// Borra la entrada del registro de datos
	delete track_model.tracks[trackId];
	res.redirect('/tracks');
};
