// Ingest worker - handles data ingestion
import * as crypto from 'crypto';
import fs from 'fs';
import path from 'path';

export async function ingest(data: unknown): Promise<string | undefined> {
  console.log('Ingesting data:', data);
  // Generate a checksum of the data
  const checksum = crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
  console.log('Checksum:', checksum);

  // Ensure storage directory exists
  const dirPath = path.join(process.cwd(), 'rawData');
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  // Check if a file with the checksum already exists
  const filePath = path.join(dirPath, `${checksum}.raw`);
  if (fs.existsSync(filePath)) {
    console.log('Data already ingested');
    return;
  }

  // Save the data to a file
  fs.writeFileSync(filePath, JSON.stringify(data));
  console.log('Data ingested to', filePath);
  return filePath;
}
