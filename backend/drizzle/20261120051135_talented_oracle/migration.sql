CREATE TABLE `Todo` (
	`id` int AUTO_INCREMENT PRIMARY KEY,
	`id_user` int NOT NULL,
	`activity` varchar(191) NOT NULL,
	`finished` boolean NOT NULL DEFAULT false
);
--> statement-breakpoint
CREATE TABLE `User` (
	`id` int AUTO_INCREMENT PRIMARY KEY,
	`fullname` varchar(191) NOT NULL,
	`email` varchar(191) NOT NULL,
	`username` varchar(191) NOT NULL,
	`password` varchar(191) NOT NULL,
	CONSTRAINT `username_unique` UNIQUE INDEX(`username`)
);
--> statement-breakpoint
ALTER TABLE `Todo` ADD CONSTRAINT `Todo_id_user_User_id_fkey` FOREIGN KEY (`id_user`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;