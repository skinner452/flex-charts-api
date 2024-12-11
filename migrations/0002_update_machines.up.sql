ALTER TABLE `machines` RENAME INDEX `machine_user_id_name_uniq` TO `machines_user_id_name_uniq`;
ALTER TABLE `machines` RENAME INDEX `user_id_idx` TO `machines_user_id_idx`;