import { randomUUID } from "crypto";
import { DboSensorData } from "../db/sensor-data";
import { DboSensorStatisticcs } from "../db/sensor-statistics";
import { AnalyticalPlatform } from "../analytical-platform";

interface AnalyseSensorStatisticsInput {
  sqlSensorData: DboSensorData[];
}
interface AnalyseSensorStatisticsOutput {
  sqlSensorStatistics: DboSensorStatisticcs[];
  data: DboSensorStatisticcs[];
}

export const analyseSensorStatistics = async (
  input: AnalyseSensorStatisticsInput
): Promise<AnalyseSensorStatisticsOutput> => {
  const { sqlSensorData } = input;
  const analyse = AnalyticalPlatform.analyse(sqlSensorData);
  const sqlSensorStatistics = analyse.map((datum) => ({
    id: randomUUID(),
    ...datum,
  }));
  return { sqlSensorStatistics, data: sqlSensorStatistics };
};
