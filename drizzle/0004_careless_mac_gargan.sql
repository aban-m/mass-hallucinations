ALTER TABLE "user" ADD COLUMN "username" varchar(20) NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_username_unique" UNIQUE("username");