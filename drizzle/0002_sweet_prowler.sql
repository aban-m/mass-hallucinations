CREATE TABLE "user_access" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"creation_id" uuid NOT NULL,
	CONSTRAINT "user_access_creation_user_unique" UNIQUE("creation_id","user_id")
);
--> statement-breakpoint
ALTER TABLE "user_access" ADD CONSTRAINT "user_access_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_access" ADD CONSTRAINT "user_access_creation_id_creation_id_fk" FOREIGN KEY ("creation_id") REFERENCES "public"."creation"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_access_user_idx" ON "user_access" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_access_creation_idx" ON "user_access" USING btree ("creation_id");--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "can_access";