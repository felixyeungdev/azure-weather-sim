import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
  output,
} from "@azure/functions";
import { sensors } from "../sensors/sensors";
import { json } from "../utils/json";
import { DboSensorData } from "../db/sensor-data";
import { randomUUID } from "crypto";

const sqlOutput = output.sql({
  commandText: "dbo.sensor_data",
  connectionStringSetting: "SqlConnectionString",
});

export async function test(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  const name = request.query.get("name") || (await request.text()) || "world";

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

    return json({
      message: `Hello, ${name}!`,
      data: sqlData,
    });
  } catch (error) {
    return json({
      message: `Hello, ${name}!`,
      error,
    });
  }
}

app.http("test", {
  methods: ["POST"],
  authLevel: "anonymous",
  extraOutputs: [sqlOutput],
  handler: test,
});
