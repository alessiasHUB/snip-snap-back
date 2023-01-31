/*----------DELETE TABLES----------*/
DROP TABLE IF EXISTS snip_snap_comments;
DROP TABLE IF EXISTS snip_snaps;


/*----------SNIP SNAP TABLE----------*/
CREATE TABLE snip_snaps (
  id SERIAL PRIMARY KEY,
  date date,
  title VARCHAR(255) DEFAULT NULL,
  body VARCHAR(255) NOT NULL);

/*----------COMMENTS TABLE----------*/
CREATE TABLE snip_snap_comments (
 comment_id SERIAL PRIMARY KEY,
 snip_snap_id INT,
 comment_body VARCHAR(255) NOT NULL,
  FOREIGN KEY (snip_snap_id) REFERENCES snip_snaps(id));


/*----------INSERT STATEMENTS----------*/
INSERT INTO snip_snaps (date, title, body)
VALUES 
('2022-01-01', 'First Paste', 'This is my first snip snap.'),
('2022-02-01', 'Second Paste', 'This is my second snip snap.'),
('2022-03-01', 'Third Paste', 'This is my third snip snap.'),
('2022-04-01', 'Fourth Paste', 'This is my fourth snip snap.'),
('2022-05-01', 'Fifth Paste', 'This is my fifth snip snap.');

INSERT INTO snip_snap_comments (snip_snap_id, comment_body)
VALUES 
(1, 'This is a great first snip snap!'),
(2, 'This is a great second snip snap!'),
(3, 'This is a great third snip snap!'),
(4, 'This is a great fourth snip snap!'),
(5, 'This is a great fifth snip snap!');