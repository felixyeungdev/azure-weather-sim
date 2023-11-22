import { HttpResponseInit } from "@azure/functions";

export const json = (
  data: any,
  options: Partial<HttpResponseInit> = {}
): HttpResponseInit => {
  return {
    jsonBody: data,
    ...options,
  };
};
