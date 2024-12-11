CREATE TABLE `sets` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `machine_id` INT NOT NULL,
  `weight` INT NOT NULL,
  `reps` INT NOT NULL,
  `datetime` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `sets_machine_id_fk_idx` (`machine_id` ASC),
  CONSTRAINT `sets_machine_id_fk`
    FOREIGN KEY (`machine_id`)
    REFERENCES `machines` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
;
