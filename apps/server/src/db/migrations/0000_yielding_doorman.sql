CREATE TABLE "blocks" (
	"id" varchar(50) PRIMARY KEY DEFAULT '019942de-5938-760a-a337-10c520ddad5f' NOT NULL,
	"type" varchar(100),
	"position" json,
	"data" json,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp,
	"routeId" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "edges" (
	"id" varchar(50) PRIMARY KEY DEFAULT '019942de-5939-717e-a886-c3ca04f3ba1c' NOT NULL,
	"from" varchar(50),
	"to" varchar(50),
	"fromHandle" varchar(50),
	"toHandle" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "routes" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50),
	"path" text,
	"method" varchar(8),
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "blocks" ADD CONSTRAINT "blocks_routeId_routes_id_fk" FOREIGN KEY ("routeId") REFERENCES "public"."routes"("id") ON DELETE no action ON UPDATE no action;