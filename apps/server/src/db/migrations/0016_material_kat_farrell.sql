ALTER TABLE "blocks" ALTER COLUMN "id" SET DEFAULT '019a4c0f-f984-7da8-b964-4a56df0ada15';--> statement-breakpoint
ALTER TABLE "edges" ALTER COLUMN "id" SET DEFAULT '019a4c0f-f984-7da8-b964-4a57b2f5a9b2';--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "id" SET DEFAULT '019a4c0f-f982-7b09-8e96-b3869220c476';--> statement-breakpoint
ALTER TABLE "routes" ALTER COLUMN "id" SET DEFAULT '019a4c0f-f983-7d46-ae5e-ff2194c4bed4';--> statement-breakpoint
ALTER TABLE "edges" ADD COLUMN "routeId" varchar(50);--> statement-breakpoint
ALTER TABLE "edges" ADD CONSTRAINT "edges_routeId_routes_id_fk" FOREIGN KEY ("routeId") REFERENCES "public"."routes"("id") ON DELETE cascade ON UPDATE no action;