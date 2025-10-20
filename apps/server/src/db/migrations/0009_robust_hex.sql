ALTER TABLE "blocks" ALTER COLUMN "id" SET DEFAULT '0199fe70-9d62-7a36-bde7-e1b159bac191';--> statement-breakpoint
ALTER TABLE "edges" ALTER COLUMN "id" SET DEFAULT '0199fe70-9d62-7a36-bde7-e1b24c21c476';--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "id" SET DEFAULT '0199fe70-9d5e-7ce5-8819-fc6e805d78e9';--> statement-breakpoint
ALTER TABLE "routes" ALTER COLUMN "id" SET DEFAULT '0199fe70-9d60-7442-822e-73637430bdb2';--> statement-breakpoint
ALTER TABLE "routes" ALTER COLUMN "projectId" SET DEFAULT NULL;