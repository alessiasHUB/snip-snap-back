/*----------DELETE TABLES----------*/
DROP TABLE IF EXISTS snip_snap_comments;
DROP TABLE IF EXISTS snip_snaps;


/*----------SNIP SNAP TABLE----------*/
CREATE TABLE snip_snaps (
  id SERIAL PRIMARY KEY,
  post_date timestamp DEFAULT CURRENT_TIMESTAMP,
  title VARCHAR(255) DEFAULT NULL,
  body VARCHAR(500) NOT NULL);

/*----------COMMENTS TABLE----------*/
CREATE TABLE snip_snap_comments (
 comment_id SERIAL PRIMARY KEY,
 snip_snap_id INT,
 comment_body VARCHAR(255) NOT NULL,
 post_date timestamp DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (snip_snap_id) REFERENCES snip_snaps(id));


/*----------INSERT STATEMENTS----------*/
INSERT INTO snip_snaps (title, body)
VALUES 
('First Paste', 'This is my first snip snap.'),
('Second Paste', 'This is my second snip snap.'),
('Third Paste', 'This is my third snip snap.'),
('Fourth Paste', 'This is my fourth snip snap.'),
('Fifth Paste', 'This is my fifth snip snap.');

INSERT INTO snip_snap_comments (snip_snap_id, comment_body)
VALUES 
(1, 'This is a great first snip snap!'),
(2, 'This is a great second snip snap!'),
(3, 'This is a great third snip snap!'),
(4, 'This is a great fourth snip snap!'),
(5, 'This is a great fifth snip snap!');
