ALTER TABLE `sets` 
DROP FOREIGN KEY `sets_session_id_fk`,
DROP INDEX `sets_session_id_fk_idx`,
DROP COLUMN `session_id`;

DROP TABLE `sessions`;