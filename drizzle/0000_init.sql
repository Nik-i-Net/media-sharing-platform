CREATE TYPE "public"."blob_status" AS ENUM('pending', 'ready', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."payment_provider" AS ENUM('stripe');--> statement-breakpoint
CREATE TYPE "public"."plan_id" AS ENUM('free', 'pro');--> statement-breakpoint
CREATE TYPE "public"."subscription_status" AS ENUM('active', 'canceled');--> statement-breakpoint
CREATE TABLE "albums" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"name" varchar(50) NOT NULL,
	"is_public" boolean NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "albums_uploads" (
	"album_id" uuid NOT NULL,
	"upload_id" uuid NOT NULL,
	CONSTRAINT "albums_uploads_album_id_upload_id_pk" PRIMARY KEY("album_id","upload_id")
);
--> statement-breakpoint
CREATE TABLE "blobs" (
	"id" uuid PRIMARY KEY NOT NULL,
	"hash" "bytea" NOT NULL,
	"mime_type" varchar(50) NOT NULL,
	"size_bytes" bigint NOT NULL,
	"status" "blob_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "blobs_hash_unique" UNIQUE("hash")
);
--> statement-breakpoint
CREATE TABLE "payment_profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"provider" "payment_provider" NOT NULL,
	"provider_customer_id" varchar(50) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "plans" (
	"id" "plan_id" PRIMARY KEY NOT NULL,
	"allowed_mime_types" jsonb NOT NULL,
	"max_file_size_bytes" bigint NOT NULL,
	"max_total_storage_bytes" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"plan_id" "plan_id" NOT NULL,
	"provider" "payment_provider" NOT NULL,
	"provider_subscription_id" varchar(50) NOT NULL,
	"status" "subscription_status" NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "uploads" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"blob_id" uuid NOT NULL,
	"file_name" varchar(50) NOT NULL,
	"is_public" boolean DEFAULT true NOT NULL,
	"expires_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_counters" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"total_storage_bytes" bigint NOT NULL,
	"total_uploads" integer NOT NULL,
	"total_albums" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "total_storage_bytes_not_negative" CHECK ("user_counters"."total_storage_bytes" >= 0),
	CONSTRAINT "total_uploads_not_negative" CHECK ("user_counters"."total_uploads" >= 0),
	CONSTRAINT "total_albums_not_negative" CHECK ("user_counters"."total_albums" >= 0)
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"auth0_user_id" varchar(50) NOT NULL,
	"email" varchar(255),
	"email_verified" boolean NOT NULL,
	"identities" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "users_auth0_user_id_unique" UNIQUE("auth0_user_id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "albums" ADD CONSTRAINT "albums_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "albums_uploads" ADD CONSTRAINT "albums_uploads_album_id_albums_id_fk" FOREIGN KEY ("album_id") REFERENCES "public"."albums"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "albums_uploads" ADD CONSTRAINT "albums_uploads_upload_id_uploads_id_fk" FOREIGN KEY ("upload_id") REFERENCES "public"."uploads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_profiles" ADD CONSTRAINT "payment_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "uploads" ADD CONSTRAINT "uploads_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "uploads" ADD CONSTRAINT "uploads_blob_id_blobs_id_fk" FOREIGN KEY ("blob_id") REFERENCES "public"."blobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_counters" ADD CONSTRAINT "user_counters_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_albums_userId_createdAtDESC" ON "albums" USING btree ("user_id","created_at" desc);--> statement-breakpoint
CREATE UNIQUE INDEX "unique_payment_profiles_provider_providerUserId" ON "payment_profiles" USING btree ("provider","provider_customer_id");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_subscriptions_provider_providerSubscriptionId" ON "subscriptions" USING btree ("provider","provider_subscription_id");--> statement-breakpoint
CREATE INDEX "subscriptions_status_expires_at_index" ON "subscriptions" USING btree ("status","expires_at");--> statement-breakpoint
CREATE INDEX "uploads_expires_at_index" ON "uploads" USING btree ("expires_at");