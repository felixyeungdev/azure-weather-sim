import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
  app,
  input,
} from "@azure/functions";
import { DboSensorStatistics } from "../db/sensor-statistics";
import { getSensorStatistics } from "../procedures/get-sensor-statistics";
import { json } from "../utils/json";

/**
 * Gets the most recent sensor statistics for each sensor
 */
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
  try {
    const sqlStatistics = context.extraInputs.get(
      sqlInput
    ) as DboSensorStatistics[];
    const { data } = await getSensorStatistics({ sqlStatistics });
    return json({ data });
  } catch (error) {
    context.error(error);
    return json({ error });
  }
}

/**
 * HTTP Trigger for this function (Task 3 for video demonstration only)
 */
app.http("sensor-statistics", {
  methods: ["GET"],
  authLevel: "anonymous",
  extraInputs: [sqlInput],
  handler,
});
