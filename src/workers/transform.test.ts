import { transform } from './transform';
import { TransformMessage, VRCMeasurement } from '../models/messages';
import { FhirObservation } from '../models/FhirObservation';

const baseObservation: FhirObservation = {
  resourceType: 'Observation',
  id: 'hr-123',
  status: 'final',
  code: {
    coding: [
      {
        system: 'http://loinc.org',
        code: '8867-4',
      },
    ],
  },
  subject: {
    reference: 'Patient/pat-1',
  },
  device: {
    reference: 'Device/dev-1',
  },
  effectiveDateTime: '2026-01-05T02:40:58-08:00',
  valueQuantity: {
    value: 72,
    unit: 'beats/minute',
    system: 'http://unitsofmeasure.org',
    code: '/min',
  },
};

describe('transform worker', () => {
  it('builds a VRCMeasurement from valid FHIR observation', async () => {
    const message: TransformMessage = {
      rawDataRef: '/tmp/raw/hr-123.raw',
      rawData: baseObservation,
    };

    const result: VRCMeasurement = await transform(message);

    expect(result).toEqual({
      patient_id: 'pat-1',
      device_id: 'dev-1',
      measurement_id: 'hr-123',
      measurement_value: 72,
      measurement_normal_range: [50, 120],
      measurement_unit: 'beats/minute',
      measurement_timestamp: '2026-01-05T02:40:58-08:00',
      rawDataRef: '/tmp/raw/hr-123.raw',
    });
  });

  it('throws error when required fields are missing', async () => {
    const invalidObservation: Partial<FhirObservation> = {
      resourceType: 'Observation',
      status: 'final',
      code: {
        coding: [
          {
            system: 'http://loinc.org',
            code: '8867-4',
          },
        ],
      },
      // subject missing
      effectiveDateTime: '2026-01-05T02:40:58-08:00',
      valueQuantity: {
        value: 72,
        unit: 'beats/minute',
        system: 'http://unitsofmeasure.org',
        code: '/min',
      },
    } as FhirObservation;

    const message: TransformMessage = {
      rawDataRef: '/tmp/raw/hr-123.raw',
      rawData: invalidObservation,
    };

    await expect(transform(message)).rejects.toThrow('Missing required fields');
  });
});



