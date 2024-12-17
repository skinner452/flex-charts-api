CREATE TABLE `sessions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` VARCHAR(50) NOT NULL,
  `created_on` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `sessions_user_id_idx` (`user_id` ASC)
);

ALTER TABLE `sets` 
ADD COLUMN `session_id` INT NOT NULL AFTER `machine_id`,
ADD INDEX `sets_session_id_fk_idx` (`session_id` ASC);

ALTER TABLE `sets` 
ADD CONSTRAINT `sets_session_id_fk`
  FOREIGN KEY (`session_id`)
  REFERENCES `sessions` (`id`)
  ON DELETE CASCADE
  ON UPDATE NO ACTION;
