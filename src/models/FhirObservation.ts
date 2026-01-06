export interface FhirObservation {
  resourceType: "Observation";
  id?: string;

  status: "registered" | "preliminary" | "final" | "amended";

  category?: Array<{
    coding?: Array<{
      system?: string;
      code?: string;
      display?: string;
    }>;
  }>;

  code: {
    coding: Array<{
      system: string;   // e.g. http://loinc.org
      code: string;     // e.g. 8867-4
      display?: string;
    }>;
  };

  subject: {
    reference: string; // e.g. Patient/pat-983472
  };

  device?: {
    reference: string; // e.g. Device/ax9-002341
  };

  effectiveDateTime: string; // ISO 8601 timestamp

  issued?: string; // ISO 8601 timestamp

  valueQuantity: {
    value: number;
    unit: string;    // e.g. beats/minute
    system: string;  // http://unitsofmeasure.org
    code: string;    // e.g. /min
  };

  interpretation?: Array<{
    coding?: Array<{
      system?: string;
      code?: string;
      display?: string;
    }>;
  }>;

  bodySite?: {
    coding?: Array<{
      system?: string;
      code?: string;
      display?: string;
    }>;
  };

  method?: {
    coding?: Array<{
      system?: string;
      code?: string;
      display?: string;
    }>;
  };
}
