export interface DboSensorStatisticcs {
  id: string;
  sensor_id: number;
  temperature_min: number;
  temperature_max: number;
  temperature_avg: number;
  wind_speed_min: number;
  wind_speed_max: number;
  wind_speed_avg: number;
  relative_humidity_min: number;
  relative_humidity_max: number;
  relative_humidity_avg: number;
  co2_min: number;
  co2_max: number;
  co2_avg: number;
  analysed_at: Date;
}
