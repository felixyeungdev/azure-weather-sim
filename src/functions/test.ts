import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { sensors } from "../sensors/sensors";
import { json } from "../utils/json";

export async function test(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  const name = request.query.get("name") || (await request.text()) || "world";

  try {
    const data = await sensors.collectData();

    return json({
      message: `Hello, ${name}!`,
      data,
    });
  } catch (error) {
    return json({
      message: `Hello, ${name}!`,
      error,
    });
  }
}

app.http("test", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: test,
});
