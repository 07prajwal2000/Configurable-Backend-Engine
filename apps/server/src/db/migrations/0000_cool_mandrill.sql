CREATE TYPE "public"."encoding_types" AS ENUM('plaintext', 'base64', 'hex');--> statement-breakpoint
CREATE TABLE "app_config" (
	"id" serial PRIMARY KEY NOT NULL,
	"key_name" varchar(100),
	"description" text,
	"value" text,
	"is_encrypted" boolean DEFAULT false,
	"encoding_type" "encoding_types",
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "blocks" (
	"id" varchar(50) PRIMARY KEY DEFAULT '019a512d-b012-729d-9338-0bfe335fe912' NOT NULL,
	"type" varchar(100),
	"position" json,
	"data" json,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"route_id" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "edges" (
	"id" varchar(50) PRIMARY KEY DEFAULT '019a512d-b012-729d-9338-0bff6b87f421' NOT NULL,
	"from" varchar(50),
	"to" varchar(50),
	"from_handle" varchar(50),
	"to_handle" varchar(50),
	"route_id" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "integrations" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"group" varchar(255),
	"variant" varchar(255),
	"config" jsonb
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" varchar(50) PRIMARY KEY DEFAULT '019a512d-b00f-707b-9d3f-201cf661aa08' NOT NULL,
	"name" varchar(50),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"hidden" boolean DEFAULT false,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "routes" (
	"id" varchar(50) PRIMARY KEY DEFAULT '019a512d-b011-7f17-ba3c-5727f089146d' NOT NULL,
	"name" varchar(50),
	"path" text,
	"active" boolean DEFAULT false,
	"project_id" varchar(50) DEFAULT NULL,
	"method" varchar(8),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" varchar(50),
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "blocks" ADD CONSTRAINT "blocks_route_id_routes_id_fk" FOREIGN KEY ("route_id") REFERENCES "public"."routes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "edges" ADD CONSTRAINT "edges_from_blocks_id_fk" FOREIGN KEY ("from") REFERENCES "public"."blocks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "edges" ADD CONSTRAINT "edges_to_blocks_id_fk" FOREIGN KEY ("to") REFERENCES "public"."blocks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "edges" ADD CONSTRAINT "edges_route_id_routes_id_fk" FOREIGN KEY ("route_id") REFERENCES "public"."routes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "routes" ADD CONSTRAINT "routes_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;