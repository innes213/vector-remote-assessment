# Vector Remote Pipeline

A minimal Node.js/TypeScript pipeline that ingests FHIR Observation payloads, persists the raw data, transforms it into an internal measurement format, analyzes for abnormalities, and emits alerts.

This is meant to be a greatly simplified model of a larger event-driven system developed within a short timebox. In a larger system, for example, the workers would all be implemented as individual tasks that could scale to handle hundreds of thousands of measurements/observations and raw data would not be stored locally.

This is not a production-ready project. Some key lacking features:
1. Full handling of all possible incoming data types
2. Observability beyond primitive logging
3. Complete unit test coverage
4. Flexible scaling
5. Robust analysis

## Setup
- Requirements: Node.js 18+, npm
- Install dependencies:
  - `npm install`
- Run dev server (ts-node):
  - `npm run dev`
- Run build + start (compiled to `dist`):
  - `npm run build && npm start`
- Run tests (Jest):
  - `npm test`
  Clean artifacts, rawData and node_modules
  - `npm run clean`

## API

### POST /ingest
- Description: Ingests a FHIR Observation payload and triggers the transform → analyze → alert pipeline via events.
- Request body: FHIR Observation JSON (see `sampleData/fhir-normal.json` or `sampleData/fhir-abnormal.json`).
- Response: `{ "message": "Successfully ingested data" }`
- Behavior:
  - Calculates a SHA-256 checksum of the payload.
  - Writes the raw payload to `rawData/<checksum>.raw` (created if absent).
  - Emits a `transform` event with `{ rawDataRef, rawData }`.
  - Subsequent listeners call `transform` → `analyze` → `alert`.
  - If the same payload is sent again, it logs “Data already ingested” and skips rewriting the file.

Example (normal measurement):
```bash
curl -X POST http://localhost:3000/ingest \
  -H "Content-Type: application/json" \
  --data-binary @sampleData/fhir-normal.json
```
Example (abnormal measurement):
```bash
curl -X POST http://localhost:3000/ingest \
  -H "Content-Type: application/json" \
  --data-binary @sampleData/fhir-abnormal.json

### GET /health
- Description: Simple health check.
- Response: `{ "status": "ok" }`

## Tech Stack
- Node.js + TypeScript: Modern, type-safe runtime and language for backend services.
- Express: Lightweight HTTP server framework for backend services
- EventEmitter: Simple in-process pub/sub to chain ingest → transform → analyze → alert without extra infrastructure. In a distributed system this would be replaced by a message broker.
- Jest + ts-jest + Supertest: Testing stack for both units (workers) and HTTP endpoints.
- Crypto/FS/Path (built-ins): Checksum generation and local persistence of raw payloads.

## Notes
- Raw data when ingested is stored under `rawData/` relative to the project root.


