ALTER TABLE `sessions` 
ADD COLUMN `ended_on` DATETIME NULL AFTER `created_on`;