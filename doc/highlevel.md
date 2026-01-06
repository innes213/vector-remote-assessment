# System At a High Level
Vector serves healthcare organizations that remotely monitor patients with chronic conditions. Patient data arrives throughout the day from various monitoring devices, and our system must identify which data points require clinical attention and route them to the appropriate care team. The platform must handle multiple types of monitoring data, each with different clinical significance and urgency levels.

# System Requirements
* Scale: Support 3x growth in patient volume (100K → 300K patients) with proportional increase in daily data transmissions
* Clinical Accuracy: Maintain 95% sensitivity in identifying alerts that require clinical review (minimize both false positives and false negatives)
* Data Diversity: Handle multiple types of monitoring data with different formats, frequencies, and clinical rules
* Intelligent Routing: Direct alerts to appropriate clinical teams based on severity, data type, and patient context
* Extensibility: Allow for future expansion to new monitoring types and clinical protocols

:::mermaid
flowchart LR
    A[Devices] -->|Data| B(Ingest)
    B -->C(Store)
    B -->D{Analyze}
    D -->|Alert Required| E[Notify Clinic]
:::

Given that we want to scale number of device events, support multiple data formats, and emit alerts, an event-driven architecture will be utilized and stages will be decoupled as much as possible.

## Stages
### Security
Gateway implementing DDOS protection and request validation.
### Ingestion
Raw measurements are saved in something like S3 bucket for reference, grouped by device_id
Incoming payloads are passed to something like an AWS Lambda for parsing. Lambdas convert incoming data into an internal format. As more devices are added, these lambdas can easily scale. As new incoming formats are introduced, suport only need be added to these lambdas.

### Analysis


### Alerting
Should a `measurement` be cause for alerting a clinic, 

# Assumptions
* Always only one patient per device.
* If a device is given to a new patient, the `device_id` is not updated.
* If a patient has more than one device, their patient_id is the same on each device if and only if the devices are associated with the same clinic.

## Incoming Data
* Data comes directly from devices
* There are multiple schemas, but all data contains:
  * Device info that includes a `device_id` that uniquely identifies the device
  * one or more `measurement`s consisting of a `label`, numeric `value`, `unit` and `timestamp`.
  * Thresholds or analysis rule is specified in the data.

  ## Analysis

## Questions

