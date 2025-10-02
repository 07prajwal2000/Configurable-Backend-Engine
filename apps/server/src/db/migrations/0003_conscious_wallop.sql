CREATE TYPE "public"."encoding_types" AS ENUM('plaintext', 'base64', 'hex');--> statement-breakpoint
CREATE TABLE "app_config" (
	"id" serial PRIMARY KEY NOT NULL,
	"keyName" varchar(100),
	"description" text,
	"value" text,
	"isEncrypted" boolean DEFAULT false,
	"encoding_type" "encoding_types",
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "blocks" ALTER COLUMN "id" SET DEFAULT '0199a0d1-60ae-7b1c-8ea9-71850a08257b';--> statement-breakpoint
ALTER TABLE "edges" ALTER COLUMN "id" SET DEFAULT '0199a0d1-60ae-7b1c-8ea9-71867200d139';--> statement-breakpoint
ALTER TABLE "routes" ALTER COLUMN "id" SET DEFAULT '0199a0d1-60ac-789d-8a23-5672bbee30e8';