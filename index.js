const express = require('express');
const app = express();
const db = require('./db');

app.use(express.static('./public'));

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

app.listen(8080, () => console.log(`Image board server is listening.`));
