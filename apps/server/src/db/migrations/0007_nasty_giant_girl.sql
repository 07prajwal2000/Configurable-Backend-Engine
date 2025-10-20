CREATE TABLE "projects" (
	"id" varchar(50) PRIMARY KEY DEFAULT '0199fdd8-7284-7fab-be8c-4c2929263dfc' NOT NULL,
	"name" varchar(50),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "blocks" ALTER COLUMN "id" SET DEFAULT '0199fdd8-7286-74ae-bc7e-53d3e0628286';--> statement-breakpoint
ALTER TABLE "edges" ALTER COLUMN "id" SET DEFAULT '0199fdd8-7287-7590-8146-ca24245ac038';--> statement-breakpoint
ALTER TABLE "routes" ALTER COLUMN "id" SET DEFAULT '0199fdd8-7285-7f92-8ed5-52b00c6c12c8';--> statement-breakpoint
ALTER TABLE "routes" ADD COLUMN "active" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "routes" ADD COLUMN "projectId" varchar(50) DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "routes" ADD COLUMN "updatedAt" timestamp DEFAULT now() NOT NULL;