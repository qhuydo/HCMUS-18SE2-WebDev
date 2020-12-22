CREATE SCHEMA hcmus-18se2-webdev-group05-e-education;
--  course
CREATE TABLE course (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(45) NOT NULL,
  category INT NULL,
  sub_category INT NULL,
  full_price VARCHAR(45) NOT NULL,
  price VARCHAR(45) NULL DEFAULT 0,
  discount VARCHAR(45) NULL DEFAULT 0,
  image_sm TEXT NULL,
  image TEXT NULL,
  short_description TEXT NULL,
  full_description TEXT NULL,
  last_update DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  view_count INT NULL DEFAULT 0,
  rating_count INT NULL DEFAULT 0,
  total_rating INT UNSIGNED NULL DEFAULT 0,
  student_count INT NULL DEFAULT 0, 
  completion TINYINT NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE INDEX id_UNIQUE (id ASC) VISIBLE);

-- instructor
CREATE TABLE instructor (
  username VARCHAR(45) NOT NULL,
  password TEXT NOT NULL,
  fullname VARCHAR(45) NOT NULL,
  birth_date DATE NULL,
  email VARCHAR(45) NOT NULL,
  email VARCHAR(45) NOT NULL,
  photo TEXT NULL,
  bio TEXT NULL,
  about_me TEXT NULL,
  website TEXT NULL,
  twitter TEXT NULL,
  facebook TEXT NULL,
  linkedin TEXT NULL,
  youtube TEXT NULL,
  total_students INT NOT NULL DEFAULT 0,
  total_reviews INT NOT NULL DEFAULT 0,
  PRIMARY KEY (username),
  UNIQUE INDEX username_UNIQUE (username ASC) VISIBLE,
  UNIQUE INDEX email_UNIQUE (email ASC) VISIBLE);

-- student
CREATE TABLE student (
  username VARCHAR(45) NOT NULL,
  password TEXT NOT NULL,
  fullname VARCHAR(45) NOT NULL,
  birth_date DATE NULL,
  email VARCHAR(45) NOT NULL,
  photo TEXT NULL,
  bio TEXT NULL,
  about_me TEXT NULL,
  website TEXT NULL,
  twitter TEXT NULL,
  facebook TEXT NULL,
  linkedin TEXT NULL,
  youtube TEXT NULL,
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
  comment TEXT NULL,
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
  video TEXT NULL,
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
  username VARCHAR(45) NOT NULL,
  password TEXT NOT NULL,
  name VARCHAR(45) NOT NULL,
  email VARCHAR(45) NOT NULL,
  PRIMARY KEY (username),
  UNIQUE INDEX username_UNIQUE (username ASC) VISIBLE);

-- category
CREATE TABLE category (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(45) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX name_UNIQUE (name ASC) VISIBLE);

-- sub_category
CREATE TABLE sub_category (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  category_id INT UNSIGNED NOT NULL,
  name VARCHAR(45) NOT NULL,
  PRIMARY KEY (id, category_id),
  INDEX fk_sub_category_category_idx (category_id ASC) VISIBLE,
  CONSTRAINT fk_sub_category_category
    FOREIGN KEY (category_id)
    REFERENCES category (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

-- foreign key
ALTER TABLE course 
ADD INDEX fk_course_category_table_idx (category ASC) VISIBLE;
;
ALTER TABLE course 
ADD CONSTRAINT fk_course_category_table
  FOREIGN KEY (category)
  REFERENCES category (id)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION,
ADD CONSTRAINT fk_course_sub_category_table
  FOREIGN KEY (sub_category)
  REFERENCES sub_category (id)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

-- course_instructor
CREATE TABLE course_instructor (
  course_id INT UNSIGNED NOT NULL,
  username VARCHAR(45) NOT NULL,
  PRIMARY KEY (course_id, username),
  INDEX fk_course_instructor_instructor_idx (username ASC) VISIBLE,
  CONSTRAINT fk_course_instructor_course
    FOREIGN KEY (course_id)
    REFERENCES course (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_course_instructor_instructor
    FOREIGN KEY (username)
    REFERENCES instructor (username)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);