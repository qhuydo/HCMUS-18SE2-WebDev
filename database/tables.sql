-- CREATE SCHEMA hcmus-18se2-webdev-group05-e-education;
--  course
CREATE TABLE course (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(45) NOT NULL,
  category INT NULL,
  sub_category INT NULL,
  full_price VARCHAR(45) NOT NULL,
  price VARCHAR(45) NULL DEFAULT 0,
  discount VARCHAR(45) NULL DEFAULT 0,
  image_sm VARCHAR(255) NULL,
  image VARCHAR(255) NULL,
  short_description VARCHAR(45) NULL,
  full_description VARCHAR(45) NULL,
  last_update VARCHAR(45) NULL,
  view_count INT NULL DEFAULT 0,
  rating_count INT NULL DEFAULT 0,
  rating_point VARCHAR(45) NULL,
  student_count INT NULL DEFAULT 0, 
  completion TINYINT NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE INDEX id_UNIQUE (id ASC) VISIBLE);

-- instructor
CREATE TABLE instructor (
  username VARCHAR(45) NOT NULL,
  password VARCHAR(256) NOT NULL,
  fullname VARCHAR(45) NOT NULL,
  birth_date DATE NULL,
  email VARCHAR(45) NOT NULL,
  photo VARCHAR(255) NULL,
  bio VARCHAR(45) NULL,
  about_me VARCHAR(45) NULL,
  website VARCHAR(45) NULL,
  twitter VARCHAR(45) NULL,
  facebook VARCHAR(45) NULL,
  linkedin VARCHAR(45) NULL,
  youtube VARCHAR(45) NULL,
  total_students INT NOT NULL DEFAULT 0,
  total_reviews INT NOT NULL DEFAULT 0,
  PRIMARY KEY (username),
  UNIQUE INDEX username_UNIQUE (username ASC) VISIBLE,
  UNIQUE INDEX email_UNIQUE (email ASC) VISIBLE);

-- student
CREATE TABLE student (
  username VARCHAR(45) NOT NULL,
  password VARCHAR(256) NOT NULL,
  fullname VARCHAR(45) NOT NULL,
  birth_date DATE NULL,
  email VARCHAR(45) NOT NULL,
  photo VARCHAR(255) NULL,
  bio VARCHAR(45) NULL,
  about_me VARCHAR(45) NULL,
  website VARCHAR(45) NULL,
  twitter VARCHAR(45) NULL,
  facebook VARCHAR(45) NULL,
  linkedin VARCHAR(45) NULL,
  youtube VARCHAR(45) NULL,
  PRIMARY KEY (username),
  UNIQUE INDEX username_UNIQUE (username ASC) VISIBLE,
  UNIQUE INDEX email_UNIQUE (email ASC) VISIBLE);

-- course_student
CREATE TABLE course_student (
  course_id INT UNSIGNED NOT NULL,
  username VARCHAR(45) NOT NULL,
  PRIMARY KEY (course_id, username),
  INDEX fk_course_student_student_idx (username ASC) VISIBLE,
  CONSTRAINT fk_course_student_course
    FOREIGN KEY (course_id)
    REFERENCES course (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_course_student_student
    FOREIGN KEY (username)
    REFERENCES student (username)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

-- course_rating
CREATE TABLE course_rating (
  course_id INT UNSIGNED NOT NULL,
  username VARCHAR(45) NOT NULL,
  point INT UNSIGNED NOT NULL DEFAULT 1,
  comment VARCHAR(45) NULL,
  feedback_date DATETIME NOT NULL,
  PRIMARY KEY (course_id, username),
  INDEX fk_course_rating_student_idx (username ASC) VISIBLE,
  CONSTRAINT fk_course_rating_course
    FOREIGN KEY (course_id)
    REFERENCES course (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_course_rating_student
    FOREIGN KEY (username)
    REFERENCES student (username)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);
  
-- course_content
CREATE TABLE course_content (
  chapter_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  course_id INT UNSIGNED NOT NULL,
  chapter_name VARCHAR(45) NOT NULL,
  lecture_count INT NULL DEFAULT 0,
  length VARCHAR(45) NULL,
  PRIMARY KEY (chapter_id, course_id),
  CONSTRAINT fk_course_content_course
    FOREIGN KEY (course_id)
    REFERENCES course (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

-- lecture
CREATE TABLE lecture (
  lecture_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  course_id INT UNSIGNED NOT NULL,
  chapter_id INT UNSIGNED NOT NULL,
  name VARCHAR(45) NOT NULL,
  video VARCHAR(255) NULL,
  length VARCHAR(45) NULL,
  PRIMARY KEY (lecture_id, course_id, chapter_id),
  INDEX fk_lecture_course_content_idx (chapter_id ASC) VISIBLE,
  CONSTRAINT fk_lecture_course
    FOREIGN KEY (course_id)
    REFERENCES course (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_lecture_course_content
    FOREIGN KEY (chapter_id)
    REFERENCES course_content (chapter_id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

-- student_lecturer
CREATE TABLE student_lecture (
  username VARCHAR(45) NOT NULL,
  course_id INT UNSIGNED NOT NULL,
  chapter_id INT UNSIGNED NOT NULL,
  lecture_id INT UNSIGNED NOT NULL,
  timestamp VARCHAR(45) NULL,
  completion TINYINT NOT NULL DEFAULT 0,
  PRIMARY KEY (username, course_id, chapter_id, lecture_id),
  UNIQUE INDEX account_UNIQUE (username ASC) VISIBLE,
  INDEX fk_student_lecture_course_idx (course_id ASC) VISIBLE,
  INDEX fk_student_lecture_chapter_idx (chapter_id ASC) VISIBLE,
  INDEX fk_student_lecture_lecture_idx (lecture_id ASC) VISIBLE,
  CONSTRAINT fk_student_lecture_student
    FOREIGN KEY (username)
    REFERENCES student (username)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_student_lecture_course
    FOREIGN KEY (course_id)
    REFERENCES course (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_student_lecture_chapter
    FOREIGN KEY (chapter_id)
    REFERENCES course_content (chapter_id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_student_lecture_lecture
    FOREIGN KEY (lecture_id)
    REFERENCES lecture (lecture_id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

-- watchlist
CREATE TABLE watchlist (
  course_id INT UNSIGNED NOT NULL,
  username VARCHAR(45) NOT NULL,
  PRIMARY KEY (course_id, username),
  UNIQUE INDEX username_UNIQUE (username ASC) VISIBLE,
  CONSTRAINT fk_watchlist_course
    FOREIGN KEY (course_id)
    REFERENCES course (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_watchlist_student
    FOREIGN KEY (username)
    REFERENCES student (username)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

-- administrator
CREATE TABLE administrator (
  username INT NOT NULL,
  password VARCHAR(45) NOT NULL,
  name VARCHAR(45) NOT NULL,
  email VARCHAR(45) NOT NULL,
  PRIMARY KEY (username),
  UNIQUE INDEX username_UNIQUE (username ASC) VISIBLE);
