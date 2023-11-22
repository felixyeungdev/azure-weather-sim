import { app, InvocationContext, output, Timer } from "@azure/functions";
import { sensors } from "../sensors/sensors";
import { DboSensorData } from "../db/sensor-data";
import { randomUUID } from "crypto";

const sqlOutput = output.sql({
  commandText: "dbo.sensor_data",
  connectionStringSetting: "SqlConnectionString",
});

export async function test(
  myTimer: Timer,
  context: InvocationContext
): Promise<void> {
  try {
    const data = await sensors.collectData();
    const sqlData: DboSensorData[] = data.map((d) => ({
      id: randomUUID(),
      sensor_id: d.id,
      temperature: d.temperature,
      wind_speed: d.windSpeed,
      relative_humidity: d.relativeHumidity,
      co2: d.co2,
      recorded_at: new Date(d.recordedAt),
    }));
    context.extraOutputs.set(sqlOutput, sqlData);
  } catch (error) {
    context.error(error);
  }
}

app.timer("collect-sensor-data", {
  schedule: "*/5 * * * * *",
  extraOutputs: [sqlOutput],
  handler: test,
});
