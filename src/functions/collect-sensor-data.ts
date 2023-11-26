import {
  app,
  HttpHandler,
  HttpRequest,
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

type test = HttpHandler;

export async function handler(
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const _sensors = req.query.get("sensors");
    const sensors = _sensors ? parseInt(_sensors) : 20;

    const { sqlSensorData, data } = await collectSensorData({
      numberOfSensors: sensors,
    });
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
