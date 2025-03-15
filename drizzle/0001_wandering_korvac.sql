ALTER TABLE "creation" ALTER COLUMN "extra_args" SET DEFAULT '{"width":null,"height":null}'::jsonb;--> statement-breakpoint
CREATE INDEX "creation_is_public_idx" ON "creation" USING btree ("is_public");--> statement-breakpoint
ALTER TABLE "votes" ADD CONSTRAINT "vote_creation_user_unique" UNIQUE("creation_id","user_id");