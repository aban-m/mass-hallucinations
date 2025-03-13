CREATE TABLE "creation" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"is_public" boolean DEFAULT false NOT NULL,
	"title" varchar(120) NOT NULL,
	"description" varchar(500) NOT NULL,
	"prompt" varchar(2048) NOT NULL,
	"seed" integer NOT NULL,
	"extra_args" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" varchar(256) NOT NULL,
	"name" varchar(256) NOT NULL,
	"is_admin" boolean DEFAULT false NOT NULL,
	"credit" integer DEFAULT 50 NOT NULL,
	"can_access" jsonb DEFAULT '{"ids":[]}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "votes" (
	"id" uuid PRIMARY KEY NOT NULL,
	"creation_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"vote" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "creation" ADD CONSTRAINT "creation_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "votes" ADD CONSTRAINT "votes_creation_id_creation_id_fk" FOREIGN KEY ("creation_id") REFERENCES "public"."creation"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "votes" ADD CONSTRAINT "votes_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "creation_user_idx" ON "creation" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "vote_creation_idx" ON "votes" USING btree ("creation_id");--> statement-breakpoint
CREATE INDEX "vote_user_idx" ON "votes" USING btree ("user_id");