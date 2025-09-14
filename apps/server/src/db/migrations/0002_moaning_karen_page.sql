ALTER TABLE "blocks" ALTER COLUMN "id" SET DEFAULT '01994544-30c4-7094-9350-2293582cf9ad';--> statement-breakpoint
ALTER TABLE "edges" ALTER COLUMN "id" SET DEFAULT '01994544-30c5-7222-8e05-70e9a4af7c03';--> statement-breakpoint
ALTER TABLE "routes" ALTER COLUMN "id" SET DEFAULT '01994544-30c2-7f59-9173-4f87e30587fd';--> statement-breakpoint
ALTER TABLE "edges" ADD CONSTRAINT "edges_from_blocks_id_fk" FOREIGN KEY ("from") REFERENCES "public"."blocks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "edges" ADD CONSTRAINT "edges_to_blocks_id_fk" FOREIGN KEY ("to") REFERENCES "public"."blocks"("id") ON DELETE no action ON UPDATE no action;