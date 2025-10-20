ALTER TABLE "routes" DROP CONSTRAINT "routes_projectId_projects_id_fk";
--> statement-breakpoint
ALTER TABLE "blocks" ALTER COLUMN "id" SET DEFAULT '0199fe72-2256-7d2d-b09a-5352ffafb0fe';--> statement-breakpoint
ALTER TABLE "edges" ALTER COLUMN "id" SET DEFAULT '0199fe72-2256-7d2d-b09a-535306f87b57';--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "id" SET DEFAULT '0199fe72-2253-7a43-9d83-171a24ff291c';--> statement-breakpoint
ALTER TABLE "routes" ALTER COLUMN "id" SET DEFAULT '0199fe72-2255-7a09-8539-968a264174ec';--> statement-breakpoint
ALTER TABLE "routes" ALTER COLUMN "projectId" DROP DEFAULT;