import { randomBetween } from "../utils/random-between";

/**
 * Data for randomly simulating sensor data, inclusively according to specs
 */
const dataRanges: {
  [key: string]: [number, number];
} = {
  temperature: [8, 15],
  windSpeed: [15, 25],
  relativeHumidity: [40, 70],
  co2: [500, 1500],
};

/**
 * Represents what collecting sensor data will give
 */
export interface SensorData {
  id: number;
  temperature: number;
  windSpeed: number;
  relativeHumidity: number;
  co2: number;
  recordedAt: string;
}

/**
 * This class represents a sensor, which can collect data
 */
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

  /**
   * Simulate real world data collection where you would want to collect data from different sensors at the same time
   */
  async collectData(): Promise<SensorData> {
    const recordedAt = new Date().toISOString();
    const [temperature, windSpeed, relativeHumidity, co2] = await Promise.all([
      this.getTemperature(),
      this.getWindSpeed(),
      this.getRelativeHumidity(),
      this.getCO2(),
    ]);

    return {
      id: this.id,
      temperature,
      windSpeed,
      relativeHumidity,
      co2,
      recordedAt,
    };
  }
}
