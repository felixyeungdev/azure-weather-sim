import { DboSensorData } from "../db/sensor-data";
import { DboSensorStatisticcs } from "../db/sensor-statistics";

export class AnalyticalPlatform {
  static getMinMaxAvg(data: number[]) {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const avg = data.reduce((acc, datum) => acc + datum, 0) / data.length;
    return { min, max, avg };
  }

  static analyse(data: DboSensorData[]) {
    const analysedAt = new Date();
    const bySensorId = data.reduce(
      (acc, datum) => {
        const { sensor_id } = datum;
        if (!acc[sensor_id]) {
          acc[sensor_id] = [];
        }
        acc[sensor_id].push(datum);
        return acc;
      },
      {} as {
        [key: number]: DboSensorData[];
      }
    );

    const analysis = Object.entries(bySensorId).map(
      ([sensorId, sensorData]) => {
        const temperature = this.getMinMaxAvg(
          sensorData.map((datum) => datum.temperature)
        );
        const windSpeed = this.getMinMaxAvg(
          sensorData.map((datum) => datum.wind_speed)
        );
        const relativeHumidity = this.getMinMaxAvg(
          sensorData.map((datum) => datum.relative_humidity)
        );
        const co2 = this.getMinMaxAvg(sensorData.map((datum) => datum.co2));
        return {
          sensor_id: sensorData[0].sensor_id,
          temperature_min: temperature.min,
          temperature_max: temperature.max,
          temperature_avg: temperature.avg,
          wind_speed_min: windSpeed.min,
          wind_speed_max: windSpeed.max,
          wind_speed_avg: windSpeed.avg,
          relative_humidity_min: relativeHumidity.min,
          relative_humidity_max: relativeHumidity.max,
          relative_humidity_avg: relativeHumidity.avg,
          co2_min: co2.min,
          co2_max: co2.max,
          co2_avg: co2.avg,
          analysed_at: analysedAt,
        } as Omit<DboSensorStatisticcs, "id">;
      }
    );

    return analysis;
  }
}
