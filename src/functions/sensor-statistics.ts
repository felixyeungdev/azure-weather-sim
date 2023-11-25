import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
  app,
  input,
} from "@azure/functions";
import { json } from "../utils/json";
import { getSensorStatistics } from "../procedures/get-sensor-statistics";
import { DboSensorStatisticcs } from "../db/sensor-statistics";

const sqlInput = input.sql({
  commandText:
    "Select recent.* from (SELECT TOP (20)  * FROM [dbo].[sensor_statistics] order by analysed_at desc) recent order by sensor_id",
  commandType: "Text",
  connectionStringSetting: "SqlConnectionString",
});

export async function handler(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  const sqlStatistics = context.extraInputs.get(
    sqlInput
  ) as DboSensorStatisticcs[];
  const { data } = await getSensorStatistics({ sqlStatistics });
  return json({ data });
}

app.http("sensor-statistics", {
  methods: ["GET"],
  authLevel: "anonymous",
  extraInputs: [sqlInput],
  handler,
});
