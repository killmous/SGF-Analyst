--
-- Create a database to hold the game data of all games
--

PRAGMA foreign_keys = ON;
CREATE TABLE games(
	id				INTEGER PRIMARY KEY,
	data			TEXT, --JSON encoded
	title			TEXT,
	players_black	TEXT,
	players_white	TEXT,
	rankings_black	TEXT,
	rankings_white	TEXT,
	komi			REAL,
	handicap		INTEGER,
	date 			DATE,
	event			TEXT,
	winner			TEXT
);