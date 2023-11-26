import { randomUUID } from "crypto";
import { AnalyticalPlatform } from "../analytical-platform";
import { DboSensorData } from "../db/sensor-data";
import { DboSensorStatistics } from "../db/sensor-statistics";
import {
  PrettyDboSensorStatistics,
  prettyDboSensorStatistics,
} from "../utils/pretty";

interface AnalyseSensorStatisticsInput {
  sqlSensorData: DboSensorData[];
}
interface AnalyseSensorStatisticsOutput {
  sqlSensorStatistics: DboSensorStatistics[];
  data: PrettyDboSensorStatistics[];
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
  return {
    sqlSensorStatistics,
    data: sqlSensorStatistics.map(prettyDboSensorStatistics),
  };
};
