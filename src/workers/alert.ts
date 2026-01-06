// Alert worker - handles alert generation
import { AlertMessage } from '../models/messages';

/**
 * Generate an alert message for a given data point
 * @param data - The data point to generate an alert for
 * @returns void
 */
export async function alert(data: AlertMessage): Promise<void> {
  console.log('Generating alert for data:', data);
  const alertMessage = `Patient ${data.patient_id} has a ${data.abnormality_type} ${data.abnormality_severity} alert for device ${data.device_id} at ${data.measurement_timestamp}. The measurement was ${data.measurement_value} ${data.measurement_unit}. The abnormality message is: ${data.abnormality_message} Raw Data: ${data.rawDataRef}`;
  console.log(alertMessage);
}

