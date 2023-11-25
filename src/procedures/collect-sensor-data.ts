import { randomUUID } from "crypto";
import { DboSensorData } from "../db/sensor-data";
import { sensors } from "../sensors/sensors";

interface CollectSensorDataInput {}
interface CollectSensorDataOutput {
  data: DboSensorData[];
  sqlSensorData: DboSensorData[];
}

export const collectSensorData = async (
  input: CollectSensorDataInput
): Promise<CollectSensorDataOutput> => {
  const data = await sensors.collectData();

  const sqlSensorData: DboSensorData[] = data.map((d) => ({
    id: randomUUID(),
    sensor_id: d.id,
    temperature: d.temperature,
    wind_speed: d.windSpeed,
    relative_humidity: d.relativeHumidity,
    co2: d.co2,
    recorded_at: new Date(d.recordedAt),
  }));

  return { sqlSensorData, data: sqlSensorData };
};
