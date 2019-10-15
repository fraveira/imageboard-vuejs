const spicedPg = require('spiced-pg');
const db = spicedPg(process.env.DATABASE_URL || `postgres:postgres:postgres@localhost:5432/imageboard`);

module.exports.getPictures = () => {
	return db.query(`SELECT * FROM images ORDER BY created_at DESC;`);
};

module.exports.addPictures = (username, title, desc, imageUrl) => {
	return db.query(`INSERT INTO images (username, title, description, url) values ($1, $2, $3, $4) RETURNING id;`, [
		username,
		title,
		desc,
		imageUrl
	]);
};

// We need to store
// addPictures adds the picture to local folder. DONE.
// We need to grab the picture and send it to AMZ. DONE
//
//return DONE.
// res.json that.
// unshift in vue. OK
// This DB.js has to take 4 values that are coming from line 59 in index.js. OK
// It needs to insert them into the table. OK
// THEN in the same index.js file we need to, in THEN, say that res.json is the new value added to the row.
