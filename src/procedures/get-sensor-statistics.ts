import { DboSensorStatisticcs } from "../db/sensor-statistics";

const createMinMaxAvg = (min: number, avg: number, max: number) => {
  return { min, avg, max };
};

interface GetSensorStatisticsInput {
  sqlStatistics: DboSensorStatisticcs[];
}
interface GetSensorStatisticsOutput {
  data: {
    id: string;
    sensor_id: number;
    analysed_at: Date;
    co2: {
      min: number;
      avg: number;
      max: number;
    };
    relative_humidity: {
      min: number;
      avg: number;
      max: number;
    };
    temperature: {
      min: number;
      avg: number;
      max: number;
    };
    wind_speed: {
      min: number;
      avg: number;
      max: number;
    };
  }[];
}

export const getSensorStatistics = async (
  input: GetSensorStatisticsInput
): Promise<GetSensorStatisticsOutput> => {
  const { sqlStatistics } = input;
  const pretty = sqlStatistics.map((row) => {
    const {
      id,
      sensor_id,
      analysed_at,
      co2_min,
      co2_avg,
      co2_max,
      relative_humidity_min,
      relative_humidity_avg,
      relative_humidity_max,
      temperature_min,
      temperature_avg,
      temperature_max,
      wind_speed_min,
      wind_speed_avg,
      wind_speed_max,
    } = row;
    return {
      id,
      sensor_id,
      analysed_at,
      co2: createMinMaxAvg(co2_min, co2_avg, co2_max),
      relative_humidity: createMinMaxAvg(
        relative_humidity_min,
        relative_humidity_avg,
        relative_humidity_max
      ),
      temperature: createMinMaxAvg(
        temperature_min,
        temperature_avg,
        temperature_max
      ),
      wind_speed: createMinMaxAvg(
        wind_speed_min,
        wind_speed_avg,
        wind_speed_max
      ),
    };
  });

  return { data: pretty };
};
