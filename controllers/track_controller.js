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
exports.create = function (req, res) {
	var track = req.files.track;
	var id = track.name.split('.')[0];
	var name = track.originalname.split('.')[0];
	console.log('Recibido nuevo fichero de audio.', name);
	var url = 'http://tracks.cdpsfy.es/mnt/nas/'+name+'.mp3';
	console.log('URL descarga: '+url);

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
	needle.post('http://tracks.cdpsfy.es/upload', data, { /*headers: { content_length: Buffer.byteLength(data) },*/ multipart:true}, function(err,result){
		if(err) {
			console.log('ERROR: ', err);
			//Redirigimos a tracks
			res.redirect('/tracks');
                        console.log('Redirigiendo a /tracks');
		} else {
			console.log('Resultado:', result.body);
			// Añdimos la cancion al modelo
       			 track_model.tracks[id] = {
                		name: name,
                		url: url
        		}

			//Redirigimos a /tracks
		        res.redirect('/tracks');
        		console.log('Redirigiendo a /tracks');
		}
	});        
};

// Borra una canción (trackId) del registro de canciones 
exports.destroy = function (req, res) {
	var id = req.params.trackId;
	console.log('Archivo a borrar: ', id);
	
	//Creamos y enviamos peticion para borrar el archivo
	var options = {
  		username: 'root',
  		password: 'xxxx'
	}
 	var track = track_model.tracks[id];
	var url = 'http://tracks.cdpsfy.es/delete/'+track.name;
	console.log('url: ', url);
	needle.delete(url, null, options, function(err, resp) {
  		if(err) {
			console.log('ERROR :', err);
			res.redirect('/tracks');
		} else {
			console.log('Resultado: ', resp.body);

			// Borra la entrada del registro de datos
		        delete track_model.tracks[id];
			console.log('Redirigiendo a tracks');
			res.redirect('/tracks');
		}	
	});
};
