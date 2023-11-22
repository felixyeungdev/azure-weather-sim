import { randomBetween } from "../utils/random-between";

const dataRanges: {
  [key: string]: [number, number];
} = {
  temperature: [8, 15],
  windSpeed: [15, 25],
  relativeHumidity: [40, 70],
  co2: [500, 1500],
};

export class Sensor {
  private sensorId: number;

  constructor(sensorId: number) {
    this.sensorId = sensorId;
  }

  get id() {
    return this.sensorId;
  }

  #getRandomData(range: [number, number]) {
    return randomBetween(...range);
  }

  async getTemperature() {
    return this.#getRandomData(dataRanges.temperature);
  }

  async getWindSpeed() {
    return this.#getRandomData(dataRanges.windSpeed);
  }

  async getRelativeHumidity() {
    return this.#getRandomData(dataRanges.relativeHumidity);
  }

  async getCO2() {
    return this.#getRandomData(dataRanges.co2);
  }

  async collectData() {
    const [temperature, windSpeed, relativeHumidity, co2] = await Promise.all([
      this.getTemperature(),
      this.getWindSpeed(),
      this.getRelativeHumidity(),
      this.getCO2(),
    ]);

    return {
      temperature,
      windSpeed,
      relativeHumidity,
      co2,
    };
  }
}
