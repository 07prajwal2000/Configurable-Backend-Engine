ALTER TABLE "blocks" ALTER COLUMN "id" SET DEFAULT '019a0777-3868-76ee-b3cf-13778c8a41c5';--> statement-breakpoint
ALTER TABLE "edges" ALTER COLUMN "id" SET DEFAULT '019a0777-3868-76ee-b3cf-1378593f9847';--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "id" SET DEFAULT '019a0777-3865-7718-b3ae-4cdfc6769dea';--> statement-breakpoint
ALTER TABLE "routes" ALTER COLUMN "id" SET DEFAULT '019a0777-3867-7abe-9a0f-cb595d09ae91';--> statement-breakpoint
ALTER TABLE "routes" ADD COLUMN "createdBy" varchar(50);