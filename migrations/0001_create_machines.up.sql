CREATE TABLE `machines` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(50) NOT NULL,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `machine_user_id_name_uniq` (`user_id`,`name`),
  KEY `user_id_idx` (`user_id`)
);