var fs = require('fs');
var track_model = require('./cdps-track_model');

// Escribe una nueva canción en el registro de canciones y la guarda en el cluster
exports.create = function (req, res) {
	var track = req.files.track;
	console.log('Recibido audio: ', track)
	var id = track.name.split('.')[0];
	console.log('id guardado en listener: ', id);
	var name = track.originalname.split('.')[0];
	
	// TODO: cambiar url
	var url = '/mnt/nas/' + track.originalname;
	var path = '/mnt/nas/'+name;
	
	// Guardamos la cancion en el cluster
   	fs.writeFile(path, track.buffer, function(err) {
	    if(err) {
	      return console.log(err);
	    }
	    console.log("Audio guardado.");
	}); 

	// Escribe los metadatos de la nueva canción en el registro.
	track_model.tracks[name] = {
		name: name,
		url: url
	};
	
	res.status(200).send('Archivo subido.');
};

// Borra una canción (trackId) del registro de canciones 
// TODO:
// - Eliminar en tracks.cdpsfy.es el fichero de audio correspondiente a trackId
exports.destroy = function (req, res) {
	console.log("En DELETE");
	var id = req.params.trackId;

	// Aquí debe implementarse el borrado del fichero de audio indetificado por trackId en tracks.cdpsfy.es
	var track = track_model.tracks[id];
	//var name = track.name + '.mp3';
	console.log('Path a borrar: ', track.url);
	fs.unlinkSync(track.url);

	// Borra la entrada del registro de datos
	delete track_model.tracks[id];
	
	console.log('Exito borrando archivo');
	res.status(200).send('Archivo eliminado: '+id);
};
