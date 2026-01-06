// Analyze worker - handles data analysis

import { AlertMessage, VRCMeasurement } from "../models/messages";

export async function analyze(data: VRCMeasurement): Promise<AlertMessage|undefined> {
  console.log('Analyzing data:', data);
  if (data.measurement_value < data.measurement_normal_range[0] || data.measurement_value > data.measurement_normal_range[1]) {
    const alertMessage: AlertMessage = {
      patient_id: data.patient_id,
      device_id: data.device_id,
      measurement_id: data.measurement_id,
      measurement_value: data.measurement_value,
      measurement_unit: data.measurement_unit,
      measurement_timestamp: data.measurement_timestamp,
      abnormality_type: 'HEART_RATE_ABNORMAL',
      abnormality_severity: 'high',
      abnormality_message: 'Measurement is outside normal range',
      rawDataRef: data.rawDataRef,
    };
    return alertMessage;
  }
  console.log('Data is within normal range');
}

