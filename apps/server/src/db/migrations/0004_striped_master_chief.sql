CREATE TABLE "integrations" (
	"id" uuid PRIMARY KEY NOT NULL,
	"group" varchar(255),
	"variant" varchar(255),
	"config" jsonb
);
--> statement-breakpoint
ALTER TABLE "blocks" DROP CONSTRAINT "blocks_routeId_routes_id_fk";
--> statement-breakpoint
ALTER TABLE "blocks" ALTER COLUMN "id" SET DEFAULT '0199b538-670a-7faa-8f7d-f4e710f12e4b';--> statement-breakpoint
ALTER TABLE "edges" ALTER COLUMN "id" SET DEFAULT '0199b538-670b-7eb7-99cb-4e06226ed9ad';--> statement-breakpoint
ALTER TABLE "routes" ALTER COLUMN "id" SET DEFAULT '0199b538-6709-7123-b2eb-3d98f8856ba2';