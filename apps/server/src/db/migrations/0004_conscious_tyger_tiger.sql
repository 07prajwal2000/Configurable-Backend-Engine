ALTER TABLE "blocks" ALTER COLUMN "id" SET DEFAULT '019a84a7-7b63-7970-8c1a-2b154bd1346d';--> statement-breakpoint
ALTER TABLE "edges" ALTER COLUMN "id" SET DEFAULT '019a84a7-7b64-7467-893e-114a462fb1c9';--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "id" SET DEFAULT '019a84a7-7b61-71dd-9ba9-e2d6efb09dee';--> statement-breakpoint
ALTER TABLE "routes" ALTER COLUMN "id" SET DEFAULT '019a84a7-7b63-7970-8c1a-2b147219f89b';--> statement-breakpoint
CREATE INDEX "idx_app_config_key_name" ON "app_config" USING btree ("key_name");--> statement-breakpoint
CREATE INDEX "idx_app_config_is_encrypted" ON "app_config" USING btree ("is_encrypted");--> statement-breakpoint
CREATE INDEX "idx_app_config_encoding_type" ON "app_config" USING btree ("encoding_type");--> statement-breakpoint
CREATE INDEX "idx_blocks_route_id" ON "blocks" USING btree ("route_id");--> statement-breakpoint
CREATE INDEX "idx_edges_from" ON "edges" USING btree ("from");--> statement-breakpoint
CREATE INDEX "idx_edges_to" ON "edges" USING btree ("to");--> statement-breakpoint
CREATE INDEX "idx_edges_route_id" ON "edges" USING btree ("route_id");--> statement-breakpoint
CREATE INDEX "idx_integrations_name" ON "integrations" USING btree ("name");--> statement-breakpoint
CREATE INDEX "idx_integrations_group" ON "integrations" USING btree ("group");--> statement-breakpoint
CREATE INDEX "idx_integrations_variant" ON "integrations" USING btree ("variant");--> statement-breakpoint
CREATE INDEX "idx_projects_name" ON "projects" USING btree ("name");--> statement-breakpoint
CREATE INDEX "idx_projects_updated_at" ON "projects" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX "idx_routes_project_id" ON "routes" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "idx_routes_path" ON "routes" USING btree ("path");