ALTER TABLE "creation" DROP CONSTRAINT "creation_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "user_access" DROP CONSTRAINT "user_access_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "user_access" DROP CONSTRAINT "user_access_creation_id_creation_id_fk";
--> statement-breakpoint
ALTER TABLE "vote" DROP CONSTRAINT "vote_creation_id_creation_id_fk";
--> statement-breakpoint
ALTER TABLE "creation" ADD CONSTRAINT "creation_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "user_access" ADD CONSTRAINT "user_access_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "user_access" ADD CONSTRAINT "user_access_creation_id_creation_id_fk" FOREIGN KEY ("creation_id") REFERENCES "public"."creation"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "vote" ADD CONSTRAINT "vote_creation_id_creation_id_fk" FOREIGN KEY ("creation_id") REFERENCES "public"."creation"("id") ON DELETE cascade ON UPDATE cascade;