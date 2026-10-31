import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_verse_schedule_source" AS ENUM('auto', 'manual');
  CREATE TABLE "verses" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"active" boolean DEFAULT true,
  	"last_shown_on" varchar,
  	"times_shown" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "verses_locales" (
  	"text" varchar NOT NULL,
  	"reference" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "verse_schedule" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"day" varchar,
  	"verse_id" integer NOT NULL,
  	"source" "enum_verse_schedule_source" DEFAULT 'manual',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "verses_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "verse_schedule_id" integer;
  ALTER TABLE "verses_locales" ADD CONSTRAINT "verses_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."verses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "verse_schedule" ADD CONSTRAINT "verse_schedule_verse_id_verses_id_fk" FOREIGN KEY ("verse_id") REFERENCES "public"."verses"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "verses_last_shown_on_idx" ON "verses" USING btree ("last_shown_on");
  CREATE INDEX "verses_updated_at_idx" ON "verses" USING btree ("updated_at");
  CREATE INDEX "verses_created_at_idx" ON "verses" USING btree ("created_at");
  CREATE UNIQUE INDEX "verses_locales_locale_parent_id_unique" ON "verses_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "verses_locales_parent_id_idx" ON "verses_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "verse_schedule_day_idx" ON "verse_schedule" USING btree ("day");
  CREATE INDEX "verse_schedule_verse_idx" ON "verse_schedule" USING btree ("verse_id");
  CREATE INDEX "verse_schedule_updated_at_idx" ON "verse_schedule" USING btree ("updated_at");
  CREATE INDEX "verse_schedule_created_at_idx" ON "verse_schedule" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_verses_fk" FOREIGN KEY ("verses_id") REFERENCES "public"."verses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_verse_schedule_fk" FOREIGN KEY ("verse_schedule_id") REFERENCES "public"."verse_schedule"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_verses_id_idx" ON "payload_locked_documents_rels" USING btree ("verses_id");
  CREATE INDEX "payload_locked_documents_rels_verse_schedule_id_idx" ON "payload_locked_documents_rels" USING btree ("verse_schedule_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "verses" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "verses_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "verse_schedule" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "verses" CASCADE;
  DROP TABLE "verses_locales" CASCADE;
  DROP TABLE "verse_schedule" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_verses_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_verse_schedule_fk";
  
  DROP INDEX "payload_locked_documents_rels_verses_id_idx";
  DROP INDEX "payload_locked_documents_rels_verse_schedule_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "verses_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "verse_schedule_id";
  DROP TYPE "public"."enum_verse_schedule_source";`)
}
