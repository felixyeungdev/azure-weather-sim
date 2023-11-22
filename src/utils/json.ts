import { HttpResponseInit } from "@azure/functions";

export const json = (
  data: any,
  options: Partial<HttpResponseInit> = {}
): HttpResponseInit => {
  return {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data, null, 2),
    ...options,
  };
};
