import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
  app,
  input,
  output,
} from "@azure/functions";
import { json } from "../utils/json";
import { DboSensorData } from "../db/sensor-data";
import { AnalyticalPlatform } from "../analytical-platform";
import { randomUUID } from "crypto";

const sqlInput = input.sql({
  commandText:
    "select top 2000 * from dbo.sensor_data order by recorded_at desc",
  commandType: "Text",
  connectionStringSetting: "SqlConnectionString",
});

const sqlOutput = output.sql({
  commandText: "dbo.sensor_statistics",
  connectionStringSetting: "SqlConnectionString",
});

export async function httpTrigger1(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  const data = context.extraInputs.get(sqlInput) as DboSensorData[];
  const analyse = AnalyticalPlatform.analyse(data);

  context.extraOutputs.set(
    sqlOutput,
    analyse.map((datum) => ({
      id: randomUUID(),
      ...datum,
    }))
  );

  return json({ analyse, data });
}

app.http("analyse-sensor-statistics", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  extraInputs: [sqlInput],
  extraOutputs: [sqlOutput],
  handler: httpTrigger1,
});
