DROP INDEX "idx_sessions_ip_address";--> statement-breakpoint
ALTER TABLE "credential" ADD COLUMN "valid" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "credential" ADD COLUMN "invalidated_at" timestamp with time zone;--> statement-breakpoint
CREATE INDEX "idx_status" ON "application" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_credentials_user_id" ON "credential" USING btree ("user_id");--> statement-breakpoint
ALTER TABLE "credential" DROP COLUMN "created_by";--> statement-breakpoint
ALTER TABLE "credential" DROP COLUMN "updated_at";--> statement-breakpoint
ALTER TABLE "credential" DROP COLUMN "updated_by";--> statement-breakpoint
ALTER TABLE "credential" DROP COLUMN "is_deleted";--> statement-breakpoint
ALTER TABLE "credential" DROP COLUMN "deleted_at";--> statement-breakpoint
ALTER TABLE "credential" DROP COLUMN "deleted_by";--> statement-breakpoint
ALTER TABLE "credential" DROP COLUMN "version";