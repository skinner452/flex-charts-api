ALTER TABLE `machines` RENAME INDEX `machines_user_id_name_uniq` TO `machine_user_id_name_uniq`;
ALTER TABLE `machines` RENAME INDEX `machines_user_id_idx` TO `user_id_idx`;