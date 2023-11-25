import fs from "fs/promises";

const api =
  "https://serverless-oriented-koala.azurewebsites.net/api/collect-sensor-data";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const callApi = async (sensors: number) => {
  const now = Date.now();
  const res = await fetch(`${api}?sensors=${sensors}`, {
    method: "POST",
  });
  if (res.status !== 200) console.log("Error fetching");
  return Date.now() - now;
};

const benchmark = async () => {
  const now = Date.now();
  let sensors = 20;
  const increments = 20;
  const targetSensors = 20 * 100;
  const stats: number[] = [];

  while (sensors <= targetSensors) {
    const timeTaken = await callApi(sensors);
    stats.push(timeTaken);
    console.log(`Called ${sensors} sensors, time taken: ${timeTaken}ms`);
    sensors += increments;
  }

  await fs.writeFile(
    `./stats/sensors-${now}.json`,
    JSON.stringify(stats),
    "utf-8"
  );
};

benchmark();
