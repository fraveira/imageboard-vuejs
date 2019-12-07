const spicedPg = require('spiced-pg');
const db = spicedPg(process.env.DATABASE_URL || `postgres:postgres:postgres@localhost:5432/imageboard`);

module.exports.getPictures = () => {
	return db.query(`SELECT * FROM images ORDER BY created_at DESC LIMIT 8;`);
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

module.exports.postingComments = (usercmt, comment, currImg) => {
	return db.query(`INSERT INTO comments (comment, usercmt, imageId) values ($1, $2, $3) RETURNING id`, [
		comment,
		usercmt,
		currImg
	]);
};

module.exports.showAllComments = (imageId) => {
	return db.query(`SELECT * FROM comments WHERE imageId = $1 ORDER BY created_at DESC`, [ imageId ]);
};

module.exports.getMoreImages = (lastId) => {
	return db.query(
		`
        SELECT *, (
        SELECT id FROM images
        ORDER BY id ASC
        LIMIT 1
        )
        AS lowest_id FROM images
        WHERE id < $1
        ORDER BY id DESC
        LIMIT 4`,
		[ lastId ]
	);
};
