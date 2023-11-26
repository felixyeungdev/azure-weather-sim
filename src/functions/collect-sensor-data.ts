import {
  app,
  HttpResponseInit,
  InvocationContext,
  output,
} from "@azure/functions";
import { collectSensorData } from "../procedures/collect-sensor-data";
import { json } from "../utils/json";

/**
 * Store collected data
 */
const sqlOutput = output.sql({
  commandText: "dbo.sensor_data",
  connectionStringSetting: "SqlConnectionString",
});

export async function handler(
  req: any,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const { sqlSensorData, data } = await collectSensorData({
      numberOfSensors: 20,
    });
    context.extraOutputs.set(sqlOutput, sqlSensorData);
    return json({ data });
  } catch (error) {
    context.error(error);
    return json({ error });
  }
}

/**
 * Timer Trigger for this function (Task 3)
 */
app.timer("collect-sensor-data-timer", {
  schedule: "*/5 * * * * *",
  extraOutputs: [sqlOutput],
  handler,
});

/**
 * HTTP Trigger for this function (Task 1)
 */
app.http("collect-sensor-data", {
  methods: ["POST"],
  authLevel: "anonymous",
  extraOutputs: [sqlOutput],
  handler,
});
