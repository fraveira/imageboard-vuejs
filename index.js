const express = require('express');
const app = express();
const db = require('./db');
const multer = require('multer');
const uidSafe = require('uid-safe');
const path = require('path');
const s3 = require('./s3');
const { s3Url } = require('./config');

app.use(express.static('./public'));

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

app.post('/upload', uploader.single('image'), s3.upload, function(req, res) {
	// // If we get here, multer will call next. To verify that that works, multer adds a property called file (req.file)
	// if (req.file) {
	// 	const { username, desc, title } = req.body;
	// 	res.sendStatus(200);
	// 	// Insert into the database a new row for the image. BUT ONLY AFTER THEY GO TO AMZ.
	// 	// it worked!
	// } else {
	// 	// din work.
	// 	res.sendStatus(500);
	// }

	const { username, title, desc } = req.body;
	const imageUrl = `${s3Url}/${req.file.filename}`;
	db
		.addPictures(username, title, desc, imageUrl)
		.then(function({ rows }) {
			//res.json({
			//username, title, desc, imageUrl, id: rows[0].id
			//})
			//send image info to client // PLUS THE ID OF THE IMG.
		})
		.catch(function(err) {
			console.log(err);
			res.sendStatus(500);
		});
});

app.listen(8080, () => console.log(`Image board server is listening.`));
