ALTER TABLE "votes" RENAME TO "vote";--> statement-breakpoint
ALTER TABLE "vote" DROP CONSTRAINT "votes_creation_id_creation_id_fk";
--> statement-breakpoint
ALTER TABLE "vote" DROP CONSTRAINT "votes_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "vote" ADD CONSTRAINT "vote_creation_id_creation_id_fk" FOREIGN KEY ("creation_id") REFERENCES "public"."creation"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vote" ADD CONSTRAINT "vote_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;