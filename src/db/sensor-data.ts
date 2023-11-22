export interface DboSensorData {
  id: string;
  sensor_id: number;
  temperature: number;
  wind_speed: number;
  relative_humidity: number;
  co2: number;
  recorded_at: Date;
}
