CREATE TABLE "dbo.sensor_data" (
	"id" uniqueidentifier PRIMARY KEY NOT NULL,
	"sensor_id" integer NOT NULL,
	"temperature" integer NOT NULL,
	"wind_speed" integer NOT NULL,
	"relative_humidity" integer NOT NULL,
	"co2" integer NOT NULL,
	"recorded_at" timestamp NOT NULL,
	CONSTRAINT "unique_recorded_at" UNIQUE("id","recorded_at")
);
