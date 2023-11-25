import {
  app,
  HttpResponseInit,
  InvocationContext,
  output,
} from "@azure/functions";
import { collectSensorData } from "../procedures/collect-sensor-data";
import { json } from "../utils/json";

const sqlOutput = output.sql({
  commandText: "dbo.sensor_data",
  connectionStringSetting: "SqlConnectionString",
});

export async function handler(
  myTimer: any,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const { sqlSensorData, data } = await collectSensorData({});
    context.extraOutputs.set(sqlOutput, sqlSensorData);
    return json({ data });
  } catch (error) {
    context.error(error);
  }
}

app.timer("collect-sensor-data-timer", {
  schedule: "*/5 * * * * *",
  extraOutputs: [sqlOutput],
  handler,
});

app.http("collect-sensor-data", {
  methods: ["POST"],
  authLevel: "anonymous",
  extraOutputs: [sqlOutput],
  handler,
});
