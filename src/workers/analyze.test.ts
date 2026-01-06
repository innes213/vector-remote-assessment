import { analyze } from './analyze';
import { AlertMessage, VRCMeasurement } from '../models/messages';

const baseMeasurement: VRCMeasurement = {
  patient_id: 'pat-1',
  device_id: 'dev-1',
  measurement_id: 'hr-123',
  measurement_value: 72,
  measurement_normal_range: [50, 120],
  measurement_unit: 'beats/minute',
  measurement_timestamp: '2026-01-05T02:40:58-08:00',
  rawDataRef: '/tmp/raw/hr-123.raw',
};

describe('analyze worker', () => {
  it('returns undefined when measurement is within normal range', async () => {
    const result = await analyze(baseMeasurement);
    expect(result).toBeUndefined();
  });

  it('returns an AlertMessage when measurement is above normal range', async () => {
    const high: VRCMeasurement = {
      ...baseMeasurement,
      measurement_value: 200,
    };

    const result = await analyze(high);

    expect(result).toEqual<AlertMessage>({
      patient_id: 'pat-1',
      device_id: 'dev-1',
      measurement_id: 'hr-123',
      measurement_value: 200,
      measurement_unit: 'beats/minute',
      measurement_timestamp: '2026-01-05T02:40:58-08:00',
      abnormality_type: 'HEART_RATE_ABNORMAL',
      abnormality_severity: 'high',
      abnormality_message: 'Measurement is outside normal range',
      rawDataRef: '/tmp/raw/hr-123.raw',
    });
  });

  it('returns an AlertMessage when measurement is below normal range', async () => {
    const low: VRCMeasurement = {
      ...baseMeasurement,
      measurement_value: 20,
    };

    const result = await analyze(low);

    expect(result).not.toBeUndefined();
    expect(result?.measurement_value).toBe(20);
    expect(result?.abnormality_type).toBe('HEART_RATE_ABNORMAL');
  });
});



