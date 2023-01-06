CREATE TABLE paste_bin_data (
  id SERIAL PRIMARY KEY,
  date date,
  title VARCHAR(255) DEFAULT NULL,
  body VARCHAR(255) NOT NULL);
  
  INSERT INTO paste_bin_data (date, title, body)
VALUES
('2022-01-01', 'First Post', 'This is the body of my first post'),
('2022-01-02', 'Second Post', 'This is the body of my second post'),
('2022-01-03', 'Third Post', 'This is the body of my third post');

CREATE TABLE paste_comments (
 comment_id SERIAL PRIMARY KEY,
 paste_id INT,
 comment_body VARCHAR(255) NOT NULL,
  FOREIGN KEY (paste_id) REFERENCES paste_bin_data(id))
  
  INSERT INTO paste_comments (paste_id, comment_body)
  VALUES 
  (1, 'Wow, cool first post bro'),
  (5, 'Hmm interesting...'),
  (3, 'Who asked');