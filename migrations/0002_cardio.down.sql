-- Drop cardio columns from workouts table
ALTER TABLE `workouts` 
DROP COLUMN `incline`,
DROP COLUMN `duration_seconds`,
DROP COLUMN `distance`;

-- Replace null values with 0
UPDATE `workouts` SET `weight` = 0 WHERE `weight` IS NULL;
UPDATE `workouts` SET `reps` = 0 WHERE `reps` IS NULL;

-- Make cardio columns not nullable
ALTER TABLE `workouts` 
CHANGE COLUMN `weight` `weight` INT NOT NULL ,
CHANGE COLUMN `reps` `reps` INT NOT NULL ,
CHANGE COLUMN `sets` `sets` INT NOT NULL ;

-- Drop foreign key and index to exercise type
ALTER TABLE `exercises` 
DROP FOREIGN KEY `exercises_exercise_type_id_fk`,
DROP INDEX `exercises_exercise_type_id_fk_idx`;

-- Drop exercise type column from exercises table
ALTER TABLE `exercises` 
DROP COLUMN `exercise_type_id`;

-- Drop exercise types table
DROP TABLE `exercise_types`;