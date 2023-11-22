import { Sensor } from "./sensor";

const NUMBER_OF_SENSORS = 20;

export class SensorGroup {
  private sensors: Sensor[] = [];

  public addSensor(sensor: Sensor) {
    this.sensors.push(sensor);
  }

  public async collectData() {
    return await Promise.all(
      this.sensors.map((sensor) => sensor.collectData())
    );
  }
}

export const sensors = new SensorGroup();

for (let index = 0; index < NUMBER_OF_SENSORS; index++) {
  sensors.addSensor(new Sensor(index));
}
