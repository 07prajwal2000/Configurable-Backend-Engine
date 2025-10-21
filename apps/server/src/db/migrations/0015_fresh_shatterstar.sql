ALTER TABLE "blocks" ALTER COLUMN "id" SET DEFAULT '019a077f-9894-7584-b206-0b87bbf5e9f0';--> statement-breakpoint
ALTER TABLE "edges" ALTER COLUMN "id" SET DEFAULT '019a077f-9894-7584-b206-0b88fe6d2f5d';--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "id" SET DEFAULT '019a077f-9891-7f1b-b701-e75da1fadcd9';--> statement-breakpoint
ALTER TABLE "routes" ALTER COLUMN "id" SET DEFAULT '019a077f-9893-71d7-a3ad-dc82cbdfcbe4';--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "hidden" boolean DEFAULT false;