import { Sensor, SensorData } from "./sensor";

const NUMBER_OF_SENSORS = 20; // 20 sensors according to specs

/**
 * This represents a group of sensors
 */
export class SensorGroup {
  private sensors: Sensor[] = [];

  public addSensor(sensor: Sensor) {
    this.sensors.push(sensor);
  }

  /**
   *
   * @returns collect all data from all sensors simultaneously
   */
  public async collectData(): Promise<SensorData[]> {
    return await Promise.all(
      this.sensors.map((sensor) => sensor.collectData())
    );
  }
}

export const sensors = new SensorGroup();

for (let index = 0; index < NUMBER_OF_SENSORS; index++) {
  sensors.addSensor(new Sensor(index));
}

export const generateSensors = (numberOfSensors: number) => {
  const sensors = new SensorGroup();

  for (let index = 0; index < numberOfSensors; index++) {
    sensors.addSensor(new Sensor(index));
  }

  return sensors;
};
