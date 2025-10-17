ALTER TABLE "edges" DROP CONSTRAINT "edges_from_blocks_id_fk";
--> statement-breakpoint
ALTER TABLE "edges" DROP CONSTRAINT "edges_to_blocks_id_fk";
--> statement-breakpoint
ALTER TABLE "blocks" ALTER COLUMN "id" SET DEFAULT '0199ee56-833b-7684-99d8-8c3fc7e9a52a';--> statement-breakpoint
ALTER TABLE "edges" ALTER COLUMN "id" SET DEFAULT '0199ee56-833c-7c2d-92a5-897c28f72f2a';--> statement-breakpoint
ALTER TABLE "routes" ALTER COLUMN "id" SET DEFAULT '0199ee56-8339-70fd-85ad-721c865b38cd';--> statement-breakpoint
ALTER TABLE "blocks" ADD CONSTRAINT "blocks_routeId_routes_id_fk" FOREIGN KEY ("routeId") REFERENCES "public"."routes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "edges" ADD CONSTRAINT "edges_from_blocks_id_fk" FOREIGN KEY ("from") REFERENCES "public"."blocks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "edges" ADD CONSTRAINT "edges_to_blocks_id_fk" FOREIGN KEY ("to") REFERENCES "public"."blocks"("id") ON DELETE cascade ON UPDATE no action;