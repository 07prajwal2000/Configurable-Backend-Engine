ALTER TABLE "blocks" ALTER COLUMN "id" SET DEFAULT '0199fe72-d8bd-7c80-b6c5-9cf5ccd4d336';--> statement-breakpoint
ALTER TABLE "edges" ALTER COLUMN "id" SET DEFAULT '0199fe72-d8be-7904-ad46-e2df135715af';--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "id" SET DEFAULT '0199fe72-d8bb-7ea9-81ac-009d9b108f8f';--> statement-breakpoint
ALTER TABLE "routes" ALTER COLUMN "id" SET DEFAULT '0199fe72-d8bd-7c80-b6c5-9cf4508e0350';--> statement-breakpoint
ALTER TABLE "routes" ALTER COLUMN "projectId" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "routes" ADD CONSTRAINT "routes_projectId_projects_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;