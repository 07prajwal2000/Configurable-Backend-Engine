ALTER TABLE "blocks" ALTER COLUMN "id" SET DEFAULT '0199fdda-8e93-7325-a9d2-e6796807c0a3';--> statement-breakpoint
ALTER TABLE "edges" ALTER COLUMN "id" SET DEFAULT '0199fdda-8e94-77b3-86e5-e62e1a9207e5';--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "id" SET DEFAULT '0199fdda-8e91-7040-aa1d-08fbee243b9b';--> statement-breakpoint
ALTER TABLE "routes" ALTER COLUMN "id" SET DEFAULT '0199fdda-8e92-7761-b300-b6776c52e333';--> statement-breakpoint
ALTER TABLE "routes" ALTER COLUMN "projectId" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "routes" ALTER COLUMN "projectId" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "routes" ADD CONSTRAINT "routes_projectId_projects_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;