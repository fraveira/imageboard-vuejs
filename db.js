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

module.exports.getPicInfo = (id) => {
	return db.query(`SELECT * FROM images WHERE id = $1;`, [ id ]);
};
