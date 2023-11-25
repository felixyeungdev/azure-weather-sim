ALTER DATABASE db SET CHANGE_TRACKING = ON (CHANGE_RETENTION = 7 DAYS, AUTO_CLEANUP = ON);


DROP TABLE IF EXISTS "sensor_data";
CREATE TABLE "sensor_data" (
	"id" uniqueidentifier PRIMARY KEY NOT NULL,
	"sensor_id" integer NOT NULL,
	"temperature" integer NOT NULL,
	"wind_speed" integer NOT NULL,
	"relative_humidity" integer NOT NULL,
	"co2" integer NOT NULL,
	"recorded_at" datetime2 NOT NULL,
	CONSTRAINT "unique_recorded_at" UNIQUE("id","recorded_at")
);
ALTER TABLE "sensor_data" ENABLE CHANGE_TRACKING;

CREATE INDEX "sensor_data_recorded_at" ON "sensor_data" ("recorded_at" DESC);


DROP TABLE IF EXISTS "sensor_statistics";
CREATE TABLE "sensor_statistics" (
	"id" uniqueidentifier PRIMARY KEY NOT NULL,
	"sensor_id" integer NOT NULL,
	"temperature_min" numeric NOT NULL,
	"temperature_max" numeric NOT NULL,
	"temperature_avg" numeric NOT NULL,
	"wind_speed_min" numeric NOT NULL,
	"wind_speed_max" numeric NOT NULL,
	"wind_speed_avg" numeric NOT NULL,
	"relative_humidity_min" numeric NOT NULL,
	"relative_humidity_max" numeric NOT NULL,
	"relative_humidity_avg" numeric NOT NULL,
	"co2_min" numeric NOT NULL,
	"co2_max" numeric NOT NULL,
	"co2_avg" numeric NOT NULL,
	"analysed_at" datetime2 NOT NULL,
	CONSTRAINT "unique_analysed_at" UNIQUE("id","analysed_at")
)

CREATE INDEX "sensor_statistics_analysed_at" ON "sensor_statistics" ("analysed_at" DESC);