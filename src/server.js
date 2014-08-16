var http = require('http'),
	fs = require('fs'),
	path = require('path'),
	mimeTypes = require('./mimeTypes.json'),
	filePath = path.resolve(__dirname, '..');

var fourOhFour = function(res){
	res.writeHead(404);
	res.end('Not Found');
	return;
};

var getType = function(req){
	var typeReg = /\.(\w)+$/,
		typeMatch = req.url.match(typeReg),
		typeText = (typeMatch === null) ? 'html' : typeMatch[0].replace(/\./,''),
		type = mimeTypes.html;

	for(var fileType in mimeTypes){
		if(fileType === typeText) type = mimeTypes[fileType];
	}
	return type;
};

function serveFile (res, path, type){
	res.writeHead(200, {
		'Content-type':type + '; charset=utf-8',
		'Content-Language':'en'
	});
	fs.createReadStream(path).pipe(res);
};

var server = http.createServer(function(req,res){
	var path = (req.url === '/') ? filePath + 'index.html' : filePath + req.url;
	if(req.method === 'GET'){
		fs.stat(path, function(err,stat){
			if(err || !stat.isFile()){
				fourOhFour(res);
			}else{
				serveFile(res, path, getType(req));
			}
		});
	}
});

exports.start = function(){
	server.listen(3000);
	console.log('localhost:3000');
};
