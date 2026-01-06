// Transform worker - handles data transformation
import { FhirObservation } from '../models/FhirObservation';
import { TransformMessage, VRCMeasurement } from '../models/messages';

export async function transform(data: TransformMessage): Promise<VRCMeasurement> {
  console.log('Transforming data stored at:', data.rawDataRef);
  const rawData: FhirObservation = data.rawData as FhirObservation;
  const patientId = rawData.subject?.reference?.split('/')[1];
  const deviceId = rawData.device?.reference?.split('/')[1];
  const measurementId = rawData.id;
  const measurementValue = rawData.valueQuantity?.value;
  const measurementUnit = rawData.valueQuantity?.unit;
  const measurementTimestamp = rawData.effectiveDateTime;
  // Make sure all required fields are present
  if (!patientId || !deviceId || !measurementId || !measurementValue || !measurementUnit || !measurementTimestamp) {
    throw new Error('Missing required fields');
  }
  const vrcMeasurement: VRCMeasurement = {
    patient_id: patientId,
    device_id: deviceId,
    measurement_id: measurementId,
    measurement_value: measurementValue,
    measurement_normal_range: [50, 120], // for demo purposes, we'll use a fixed range
    measurement_unit: measurementUnit,
    measurement_timestamp: measurementTimestamp,
    rawDataRef: data.rawDataRef,
  };
  return vrcMeasurement;
}
