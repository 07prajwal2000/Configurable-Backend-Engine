ALTER TABLE "blocks" ALTER COLUMN "id" SET DEFAULT '0199d4d2-13d7-7486-995a-2422b7ac91df';--> statement-breakpoint
ALTER TABLE "edges" ALTER COLUMN "id" SET DEFAULT '0199d4d2-13d7-7486-995a-24230561708d';--> statement-breakpoint
ALTER TABLE "routes" ALTER COLUMN "id" SET DEFAULT '0199d4d2-13d5-7a4f-97b8-b7960c0a8e1c';--> statement-breakpoint
ALTER TABLE "integrations" ADD COLUMN "name" varchar(255);