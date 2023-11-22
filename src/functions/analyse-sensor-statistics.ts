import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
  app,
  input,
  output,
  trigger,
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

export async function sqlTrigger(
  request: any,
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

app.generic("analyse-sensor-statistics", {
  handler: sqlTrigger,
  trigger: trigger.generic({
    type: "sqlTrigger",
    tableName: "dbo.sensor_data",
    connectionStringSetting: "SqlConnectionString",
  }),
  extraInputs: [sqlInput],
  extraOutputs: [sqlOutput],
});
