-- ----------------------------------------------------------------------------------------
-- TRIGGERS THAT UPDATE VALUES OF `course` table
-- ----------------------------------------------------------------------------------------
-- course last update
DROP TRIGGER IF EXISTS `lecture_AFTER_INSERT`;

DELIMITER $$
-- USE `hcmus-18se2-webdev-group05-e-education`$$
CREATE DEFINER = CURRENT_USER TRIGGER `lecture_AFTER_INSERT` AFTER INSERT ON `lecture` FOR EACH ROW
BEGIN
	UPDATE course SET last_update = NOW() WHERE NEW.course_id = course.id;
END$$
DELIMITER ;

DROP TRIGGER IF EXISTS`lecture_AFTER_UPDATE`;

DELIMITER $$
-- USE `hcmus-18se2-webdev-group05-e-education`$$
CREATE DEFINER = CURRENT_USER TRIGGER`lecture_AFTER_UPDATE` AFTER UPDATE ON `lecture` FOR EACH ROW
BEGIN
	UPDATE course SET last_update = NOW() WHERE OLD.course_id = course.id;
	UPDATE course SET last_update = NOW() WHERE NEW.course_id = course.id;
END$$
DELIMITER ;

DROP TRIGGER IF EXISTS`lecture_AFTER_DELETE`;

DELIMITER $$
-- USE `hcmus-18se2-webdev-group05-e-education`$$
CREATE DEFINER = CURRENT_USER TRIGGER`lecture_AFTER_DELETE` AFTER DELETE ON `lecture` FOR EACH ROW
BEGIN
	UPDATE course SET last_update = NOW() WHERE OLD.course_id = course.id;
END$$
DELIMITER ;


DROP TRIGGER IF EXISTS `course_content_AFTER_INSERT`;

DELIMITER $$
-- USE `hcmus-18se2-webdev-group05-e-education`$$
CREATE DEFINER = CURRENT_USER TRIGGER `course_content_AFTER_INSERT` AFTER INSERT ON `course_content` FOR EACH ROW
BEGIN
	UPDATE course SET last_update = NOW() WHERE NEW.course_id = course.id;
END$$
DELIMITER ;


DROP TRIGGER IF EXISTS `course_content_AFTER_UPDATE`;

DELIMITER $$
-- USE `hcmus-18se2-webdev-group05-e-education`$$
CREATE DEFINER = CURRENT_USER TRIGGER `course_content_AFTER_UPDATE` AFTER UPDATE ON `course_content` FOR EACH ROW
BEGIN
	UPDATE course SET last_update = NOW() WHERE OLD.course_id = course.id;
	UPDATE course SET last_update = NOW() WHERE NEW.course_id = course.id;
END$$
DELIMITER ;

DROP TRIGGER IF EXISTS `course_content_AFTER_DELETE`;

DELIMITER $$
-- USE `hcmus-18se2-webdev-group05-e-education`$$
CREATE DEFINER = CURRENT_USER TRIGGER `course_content_AFTER_DELETE` AFTER DELETE ON `course_content` FOR EACH ROW
BEGIN
	UPDATE course SET last_update = NOW() WHERE OLD.course_id = course.id;
END$$
DELIMITER ;

-- --------------------------------------------
-- rating count & rating point
DROP TRIGGER IF EXISTS `course_rating_AFTER_INSERT`;

DELIMITER $$
-- USE `hcmus-18se2-webdev-group05-e-education`$$
CREATE DEFINER=`root`@`localhost` TRIGGER `course_rating_AFTER_INSERT` AFTER INSERT ON `course_rating` FOR EACH ROW BEGIN
	UPDATE course SET total_rating = total_rating + NEW.point, rating_count =  rating_count + 1 WHERE id = NEW.course_id;
    UPDATE 
		course_rating INNER JOIN  course_instructor ON course_rating.course_id = course_instrcutor.course_id
        INNER JOIN instructor ON course_instructor.username = instructor.username
	SET total_reviews = total_reviews + 1 WHERE NEW.course_id = course_instructor.course_id;
END$$
DELIMITER ;


DROP TRIGGER IF EXISTS `course_rating_AFTER_UPDATE`;

DELIMITER $$
-- USE `hcmus-18se2-webdev-group05-e-education`$$
CREATE DEFINER=`root`@`localhost` TRIGGER `course_rating_AFTER_UPDATE` AFTER UPDATE ON `course_rating` FOR EACH ROW BEGIN
	UPDATE course SET total_rating = total_rating + NEW.point, rating_count =  rating_count + 1 WHERE id = NEW.course_id;
	UPDATE course SET total_rating = total_rating - OLD.point, rating_count =  rating_count - 1 WHERE id = OLD.course_id;
			
    UPDATE 
		course_rating INNER JOIN  course_instructor ON course_rating.course_id = course_instrcutor.course_id
        INNER JOIN instructor ON course_instructor.username = instructor.username
	SET total_reviews = total_reviews - 1 WHERE OLD.course_id = course_instructor.course_id;
    
    UPDATE 
		course_rating INNER JOIN  course_instructor ON course_rating.course_id = course_instrcutor.course_id
        INNER JOIN instructor ON course_instructor.username = instructor.username
	SET total_reviews = total_reviews + 1 WHERE NEW.course_id = course_instructor.course_id;
END$$
DELIMITER ;
DROP TRIGGER IF EXISTS `course_rating_AFTER_DELETE`;

DELIMITER $$
-- USE `hcmus-18se2-webdev-group05-e-education`$$
CREATE DEFINER=`root`@`localhost` TRIGGER `course_rating_AFTER_DELETE` AFTER DELETE ON `course_rating` FOR EACH ROW BEGIN
	UPDATE course SET total_rating = total_rating - OLD.point, rating_count =  rating_count - 1 WHERE id = OLD.course_id;
    UPDATE 
		course_rating INNER JOIN  course_instructor ON course_rating.course_id = course_instrcutor.course_id
        INNER JOIN instructor ON course_instructor.username = instructor.username
	SET total_reviews = total_reviews - 1 WHERE OLD.course_id = course_instructor.course_id;
END$$
DELIMITER ;


-- --------------------------------------------
-- student count
DROP TRIGGER IF EXISTS instructor.username`course_student_AFTER_INSERT`;

DELIMITER $$
-- USE `hcmus-18se2-webdev-group05-e-education`$$
CREATE DEFINER=`root`@`localhost` TRIGGER `course_student_AFTER_INSERT` AFTER INSERT ON `course_student` FOR EACH ROW BEGIN
    UPDATE course
    SET  student_count = student_count  + 1
    WHERE id = NEW.course_id;
    
    UPDATE instructor INNER JOIN course_instructor ON instructor.username = course_instructor.username
    SET total_students = total_students + 1
    WHERE NEW.course_id = course_instructor.course_id;
END$$
DELIMITER ;


DROP TRIGGER IF EXISTS instructor.username`course_student_AFTER_DELETE`;

DELIMITER $$
-- USE `hcmus-18se2-webdev-group05-e-education`$$
CREATE DEFINER=`root`@`localhost` TRIGGER `course_student_AFTER_DELETE` AFTER DELETE ON `course_student` FOR EACH ROW BEGIN
	UPDATE course
    SET  student_count = student_count - 1
    WHERE id = OLD.course_id;
    
    UPDATE instructor INNER JOIN course_instructor ON instructor.username = course_instructor.username
    SET total_students = total_students - 1
    WHERE OLD.course_id = course_instructor.course_id;
END$$
DELIMITER ;

DROP TRIGGER IF EXISTS instructor.username`course_student_AFTER_UPDATE`;

DELIMITER $$
-- USE `hcmus-18se2-webdev-group05-e-education`$$
CREATE DEFINER=`root`@`localhost` TRIGGER `course_student_AFTER_UPDATE` AFTER UPDATE ON `course_student` FOR EACH ROW BEGIN

	UPDATE course
    SET  student_count = student_count - 1
    WHERE id = OLD.course_id;

    UPDATE course
    SET  student_count = student_count  + 1
    WHERE id = NEW.course_id;
    
	UPDATE instructor INNER JOIN course_instructor ON instructor.username = course_instructor.username
    SET total_students = total_students + 1
    WHERE NEW.course_id = course_instructor.course_id;
    
    UPDATE instructor INNER JOIN course_instructor ON instructor.username = course_instructor.username
    SET total_students = total_students - 1
    WHERE OLD.course_id = course_instructor.course_id;
END$$
DELIMITER ;


-- ----------------------------------------------------------------------------------------
-- TRIGGERS THAT UPDATE VALUES OF `instructor` table
-- ----------------------------------------------------------------------------------------
-- total students (course_student)

-- total reviews (course_rating)