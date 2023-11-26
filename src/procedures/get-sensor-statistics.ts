import { DboSensorStatisticcs } from "../db/sensor-statistics";
import { prettyDboSensorStatisticcs } from "../utils/pretty";

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
  const pretty = sqlStatistics.map(prettyDboSensorStatisticcs);
  return { data: pretty };
};
