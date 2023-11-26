import { DboSensorStatistics } from "../db/sensor-statistics";
import { prettyDboSensorStatistics } from "../utils/pretty";

interface GetSensorStatisticsInput {
  sqlStatistics: DboSensorStatistics[];
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
  const pretty = sqlStatistics.map(prettyDboSensorStatistics);
  return { data: pretty };
};
