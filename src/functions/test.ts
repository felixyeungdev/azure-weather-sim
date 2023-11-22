import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { sensors } from "../sensors/sensors";

export async function test(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  const name = request.query.get("name") || (await request.text()) || "world";

  try {
    const data = await sensors.collectData();

    return { body: `Hello, ${name}! data: ${JSON.stringify(data)}` };
  } catch (error) {
    return { body: `Hello, ${name}! error: ${error}` };
  }
}

app.http("test", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: test,
});
