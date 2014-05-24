--
-- Create a database to hold the game data of all games
--

PRAGMA foreign_keys = ON;
CREATE TABLE games(
	id				INTEGER PRIMARY KEY,
	data			TEXT, --JSON encoded
	sgf				TEXT, --sgf data for html board
	title			TEXT,
	players_black	TEXT,
	players_white	TEXT,
	rankings_black	TEXT,
	rankings_white	TEXT,
	size			INTEGER,
	komi			REAL,
	handicap		INTEGER,
	date 			DATE,
	event			TEXT,
	winner			TEXT
);