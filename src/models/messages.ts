export interface AlertMessage {
  patient_id: string;
  device_id: string;
  measurement_id: string;
  measurement_value: number;
  measurement_unit: string;
  measurement_timestamp: string;
  abnormality_type: string;
  abnormality_severity: string;
  abnormality_message: string;
  rawDataRef: string;
}

export interface TransformMessage {
  rawDataRef: string;
  rawData: unknown;
}

export interface VRCMeasurement {
  patient_id: string;
  device_id: string;
  measurement_id: string;
  measurement_value: number;
  measurement_normal_range: [number, number];
  measurement_unit: string;
  measurement_timestamp: string;
  rawDataRef: string;
}