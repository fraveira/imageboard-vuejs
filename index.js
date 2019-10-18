const express = require('express');
const app = express();
const db = require('./db');
const multer = require('multer');
const uidSafe = require('uid-safe');
const path = require('path');
const s3 = require('./s3');
const { s3Url } = require('./config');

app.use(express.static('./public'));

app.use(express.json());

const diskStorage = multer.diskStorage({
	destination: function(req, file, callback) {
		callback(null, __dirname + '/uploads');
	},
	filename: function(req, file, callback) {
		uidSafe(24).then(function(uid) {
			callback(null, uid + path.extname(file.originalname));
		});
	}
});

const uploader = multer({
	storage: diskStorage,
	limits: {
		fileSize: 3097152
	}
});

app.get('/images', (req, res) => {
	db
		.getPictures()
		.then(({ rows }) => {
			res.json(rows);
		})
		.catch((err) => {
			console.log('Error happened when fetching the pictures', err);
		});
});

app.get('/images/:imageId', (req, res) => {
	var id = req.params.imageId;

	db
		.getPicInfo(id)
		.then(({ rows }) => {
			res.json(rows);
		})
		.catch((err) => {
			console.log('Error happened when rendering the PIC with the specific url', err);
		});
});

app.post('/upload', uploader.single('image'), s3.upload, function(req, res) {
	const { username, title, desc } = req.body;
	const imageUrl = `${s3Url}${req.file.filename}`;
	db
		.addPictures(username, title, desc, imageUrl)
		.then(function({ rows }) {
			res.json({
				username,
				title,
				description: desc,
				url: imageUrl,
				id: rows[0].id
			});
			//send image info to client // PLUS THE ID OF THE IMG.
		})
		.catch(function(err) {
			console.log(err);
			res.sendStatus(500);
		});
});

// MAKE APP POST ROUTE FOR COMMENTS.

app.post('/comment', function(req, res) {
	const { usercmt, comment, currImg } = req.body;
	db.postingComments(usercmt, comment, currImg).then(function({ rows }) {
		res.json({
			usercmt,
			comment,
			id: rows[0].id
		});
	});
});

app.get('/comment', function(req, res) {
	let { id } = req.query;
	console.log('This is the req.query', req.query);
	db.showAllComments(id).then(function({ rows }) {
		res.json(rows);
	});
});

app.listen(8080, () => console.log(`Image board server is listening.`));
