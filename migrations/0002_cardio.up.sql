-- Create exercise types table with strength and cardio types
CREATE TABLE `exercise_types` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`id`));

INSERT INTO `exercise_types` (`id`, `name`) VALUES (1, 'strength');
INSERT INTO `exercise_types` (`id`, `name`) VALUES (2, 'cardio');

-- Add exercise type column to exercises table, default to strength
ALTER TABLE `exercises` 
ADD COLUMN `exercise_type_id` INT NOT NULL DEFAULT 1 AFTER `name`,
ADD INDEX `exercises_exercise_type_id_fk_idx` (`exercise_type_id` ASC);

-- Add foreign key constraint to exercise type
ALTER TABLE `exercises` 
ADD CONSTRAINT `exercises_exercise_type_id_fk`
  FOREIGN KEY (`exercise_type_id`)
  REFERENCES `exercise_types` (`id`)
  ON DELETE RESTRICT;

-- Make cardio columns nullable / optional
ALTER TABLE `workouts` 
CHANGE COLUMN `weight` `weight` INT NULL DEFAULT NULL ,
CHANGE COLUMN `reps` `reps` INT NULL DEFAULT NULL ,
CHANGE COLUMN `sets` `sets` INT NULL DEFAULT NULL ;

-- Add cardio columns to workouts table
ALTER TABLE `workouts` 
ADD COLUMN `distance` DECIMAL(6,2) NULL DEFAULT NULL AFTER `sets`,
ADD COLUMN `duration_seconds` VARCHAR(45) NULL DEFAULT NULL AFTER `distance`,
ADD COLUMN `resistance` DECIMAL(6,2) NULL DEFAULT NULL AFTER `duration_seconds`;
