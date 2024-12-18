CREATE TABLE `exercises` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(50) NOT NULL,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `exercises_user_id_name_uniq` (`user_id`,`name`),
  KEY `exercises_user_id_idx` (`user_id`)
);

CREATE TABLE `sessions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(50) NOT NULL,
  `created_on` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ended_on` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_idx` (`user_id`)
);

CREATE TABLE `workouts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `exercise_id` int NOT NULL,
  `session_id` int NOT NULL,
  `weight` int NOT NULL,
  `reps` int NOT NULL,
  `sets` int NOT NULL,
  `created_on` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `sets_session_id_fk_idx` (`session_id`),
  KEY `workouts_exercise_id_fk_idx` (`exercise_id`),
  CONSTRAINT `workouts_exercise_id_fk` FOREIGN KEY (`exercise_id`) REFERENCES `exercises` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `workouts_session_id_fk` FOREIGN KEY (`session_id`) REFERENCES `sessions` (`id`) ON DELETE RESTRICT
);
