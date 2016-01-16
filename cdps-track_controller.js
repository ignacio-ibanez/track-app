var fs = require('fs');

// Escribe una nueva canción en el registro de canciones y la guarda en el cluster
exports.create = function (req, res) {
	var track = req.files.track;
	console.log('Recibido audio: ', track)
	var id = track.name.split('.')[0];
	console.log('id guardado en listener: ', id);
	var name = track.originalname.split('.')[0];
	var path = '/mnt/nas/'+name;
	
	// Guardamos la cancion en el cluster
   	fs.writeFile(path, track.buffer, function(err) {
	    if(err) {
	      return console.log(err);
	    }
	    console.log("Audio guardado.");
	}); 

	res.status(200).send('Archivo subido.');
};

// Borra una canción (trackId) del registro de canciones 
exports.destroy = function (req, res) {
	var id = req.params.trackId;	
	console.log("Borrando: "+id);

	// Borramos el archivo
	fs.unlinkSync('/mnt/nas/'+id);

	console.log('Exito borrando archivo');
	res.status(200).send('Archivo eliminado: '+id);
};
