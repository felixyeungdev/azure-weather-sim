import {
  HttpResponseInit,
  InvocationContext,
  app,
  input,
  output,
  trigger,
} from "@azure/functions";
import { DboSensorData } from "../db/sensor-data";
import { analyseSensorStatistics } from "../procedures/analyse-sensor-statistics";
import { json } from "../utils/json";

/**
 * Collect some most recent data for processing
 */
const sqlInput = input.sql({
  commandText:
    "select top 2000 * from dbo.sensor_data order by recorded_at desc",
  commandType: "Text",
  connectionStringSetting: "SqlConnectionString",
});

/**
 * Store processed data
 */
const sqlOutput = output.sql({
  commandText: "dbo.sensor_statistics",
  connectionStringSetting: "SqlConnectionString",
});

export async function handler(
  request: any,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const sqlSensorData = context.extraInputs.get(sqlInput) as DboSensorData[];
    const { data, sqlSensorStatistics } = await analyseSensorStatistics({
      sqlSensorData,
    });

    context.extraOutputs.set(sqlOutput, sqlSensorStatistics);

    return json({ data });
  } catch (error) {
    context.error(error);
    return json({ error });
  }
}

/**
 * SQL Trigger for this function (Task 3)
 */
app.generic("analyse-sensor-statistics-sql", {
  handler,
  trigger: trigger.generic({
    type: "sqlTrigger",
    tableName: "dbo.sensor_data",
    connectionStringSetting: "SqlConnectionString",
  }),
  extraInputs: [sqlInput],
  extraOutputs: [sqlOutput],
});

/**
 * HTTP Trigger for this function (Task 2)
 */
app.http("analyse-sensor-statistics", {
  methods: ["POST"],
  authLevel: "anonymous",
  extraInputs: [sqlInput],
  extraOutputs: [sqlOutput],
  handler,
});
