import { HttpResponseInit } from "@azure/functions";

/**
 * wrapper around azure's response
 */
export const json = (
  data: any,
  options: Partial<HttpResponseInit> = {}
): HttpResponseInit => {
  return {
    jsonBody: data,
    ...options,
  };
};
