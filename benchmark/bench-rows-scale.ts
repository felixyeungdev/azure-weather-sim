import fs from "fs/promises";

const api =
  "https://serverless-oriented-koala.azurewebsites.net/api/collect-sensor-data";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const callApi = async () => {
  const now = Date.now();
  const res = await fetch(api, { method: "POST" });
  if (res.status !== 200) console.log("Error fetching");
  return Date.now() - now;
};

const benchmark = async () => {
  const now = Date.now();
  let timesCalled = 0;
  const targetTimesCalled = 100000 - 1000;
  const stats: number[] = [];

  while (timesCalled < targetTimesCalled) {
    const timeTaken = await callApi();
    stats.push(timeTaken);
    timesCalled++;
    console.log(`Called ${timesCalled} times, time taken: ${timeTaken}ms`);
    // await sleep(50);
  }

  await fs.writeFile(
    `./stats/rows-${now}.json`,
    JSON.stringify(stats),
    "utf-8"
  );
};

benchmark();
