# Architecture Design Document

## Problem Analysis 
This system takes in a large volume of critical data that is diverse and expected to grow. In order to process this data effectively, we will use an event-driven architecture that takes in data, stores the raw data, then transforms the data in to an internal schema for analysis and interum storage.

Processing is broken in to stages with dedicated workers/nodes/consumers that can be independently scaled and updated as necessary. 
Unprocessed or failed events will be stored in a dead-letter queue for triage and potential re-processing. 

### Critical components and mitigation
Message broker - should be replicated as this is the core of the design
Consumers - These auto-scale to a point but performance needs to be monitored to determine if more partitioning needs to occur. 
Storage (disk/bucket and dbs) - These should be replicated and scale but need to be monitored. For internal processing dbs, sharding by patient id is probably the best choice.

### Stages
#### Gateway
Handles auth, general request validation, and security. If a request is valid, then an ingestion event is emitted.

#### Ingestion
Raw data is stored (disk or S3 bucket for example) for auditing and retreval for clinical reports.

#### Trasformation
For internal processing, we transform the diverse incoming data into an interal format that allows for:
* Decoupling from changes in external formats for easier extensibility
* Unified storage strategy (database schema) for internal caching

#### Analysis
Measurement data events are grouped by patient and processed in chronological order by measurement time. 
* If data is abnormal, an alert message is generated with the analysis outcome and a reference to the original data.
* Measurement and result data are cached by patient for conext in future analysis or report generation
* Emit alert message with analysis and reference to original data.

#### Alerting
This stage posts the alert to the clinic, if needed, via channel determined by clinic. Alert management is out of scope of this document, but it is likely that some kind of caching stage might be needed here if a clinic is not responding or if we want to bundle less-critical alerts.

## Architecture Diagram 

![High-Level Architecture](./VRC%20Overview.png "High Level Architecture")

## Data Models
### Ingestion
input: Any format from a supported device. 

### Raw Storage
input: rawStorageMessage
###


## Architectural Decision Record 

### ADR-1: Use Kafka for Data Pipeline Infrastructure
#### Context
Our system needs to ingest and analyze a lot of critical data, but not in real-time. We need scalability and flexibility in order to grow. Additionally, we are likely subject to compliance audits.

#### Options Considered
1. Kafka
2. SQS
3. Build our own
#### Decision
We will use Kafka and configure it for more than the scale we want to target.

#### Consequences
Kafka is highly reliable and it can auto scale to a point and is auditable.
The downsides to Kafka are that is complex, and has higher overhead than a simple message broker service. Also, if we need to scale beyond what we have initially configured, that scaling needs to be done in advance. 

### ADR-2: Remap Incoming Data to Internal Measurement Data Format
#### Context
The system receives measurement data in various formats. New formats may need to be ingested in the future. We either need to transform the data into an internal format, or trust that it is in an ideal format for analysis, and build a pipeline that handles all formats throughout.
#### Options Considered
1. Trust that he incoming schemas are already ideal for analysis. We ideally need the original data anyway for reporting back to clinics.
2. Convert to an internal format that is optimal for our analysis and storage. Also may allow for novel processing and/or ML pipelines.
#### Decision
We will use an internal schema, driven by our analysis needs and store the original data as well.

#### Consequences
Additional storage of raw data is required. Our internal schema may need to be updated should a new measurement and analysis protocol be introduced.

## Scalability Strategy
Since we've broken our flow into stages implemented as individual consumer groups, we can use Kafka's auto-scaling to a point. 
The next limitation to size is our internal storage. If we use manages services are 

## Observability
Here we describe what to measure wrt the data pipeline. 

### Metrics
#### Performance
* Health of each consumer
* Latency of each stage
* CPU, and Memory 
* Storage usage

#### Functional/Operational
* Overall worker error count and rate
* Incoming request rate
* Measurement freshness
* Message queue size
* Dead Letter Queue size



