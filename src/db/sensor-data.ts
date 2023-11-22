export interface DboSensorData {
  id: number;
  sensor_id: number;
  temperature: number;
  wind_speed: number;
  relative_humidity: number;
  co2: number;
  recorded_at: Date;
}
