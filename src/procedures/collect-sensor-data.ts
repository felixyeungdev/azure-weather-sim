import { randomUUID } from "crypto";
import { DboSensorData } from "../db/sensor-data";
import { generateSensors } from "../sensors/sensors";

interface CollectSensorDataInput {
  numberOfSensors: number;
}
interface CollectSensorDataOutput {
  data: DboSensorData[];
  sqlSensorData: DboSensorData[];
}

export const collectSensorData = async (
  input: CollectSensorDataInput
): Promise<CollectSensorDataOutput> => {
  const { numberOfSensors } = input;
  const sensors = generateSensors(numberOfSensors);
  const data = await sensors.collectData();

  // match the database schema
  const sqlSensorData: DboSensorData[] = data.map((d) => ({
    id: randomUUID(), // gives it a unique id UUID V4
    sensor_id: d.id,
    temperature: d.temperature,
    wind_speed: d.windSpeed,
    relative_humidity: d.relativeHumidity,
    co2: d.co2,
    recorded_at: new Date(d.recordedAt),
  }));

  return { sqlSensorData, data: sqlSensorData };
};
