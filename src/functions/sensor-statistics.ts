import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
  app,
  input,
} from "@azure/functions";
import { json } from "../utils/json";

const sqlInput = input.sql({
  commandText:
    "Select recent.* from (SELECT TOP (20)  * FROM [dbo].[sensor_statistics] order by analysed_at desc) recent order by sensor_id",
  commandType: "Text",
  connectionStringSetting: "SqlConnectionString",
});

export async function sqlTrigger(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  const data = context.extraInputs.get(sqlInput);
  return json(data);
}

app.http("sensor-statistics", {
  methods: ["GET"],
  authLevel: "anonymous",
  extraInputs: [sqlInput],
  handler: sqlTrigger,
});
