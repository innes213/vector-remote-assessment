import fs from 'fs';
import os from 'os';
import path from 'path';
import crypto from 'crypto';
import { ingest } from './ingest';

describe('ingest', () => {
  let tmpDir: string;
  let cwdSpy: jest.SpyInstance<string, []>;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ingest-test-'));
    cwdSpy = jest.spyOn(process, 'cwd').mockReturnValue(tmpDir);
  });

  afterEach(() => {
    cwdSpy.mockRestore();
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('writes new data to rawData directory and returns file path', async () => {
    const data = { foo: 'bar' };
    const filePath = await ingest(data);

    expect(filePath).toBeDefined();
    const expectedDir = path.join(tmpDir, 'rawData');
    expect(fs.existsSync(expectedDir)).toBe(true);
    expect(fs.existsSync(filePath as string)).toBe(true);

    const stored = JSON.parse(fs.readFileSync(filePath as string, 'utf-8'));
    expect(stored).toEqual(data);
  });

  it('does not rewrite data if checksum already exists', async () => {
    const data = { foo: 'bar' };
    const checksum = crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
    const dirPath = path.join(tmpDir, 'rawData');
    const existingPath = path.join(dirPath, `${checksum}.raw`);
    fs.mkdirSync(dirPath, { recursive: true });
    fs.writeFileSync(existingPath, JSON.stringify({ existing: true }));

    const result = await ingest(data);

    expect(result).toBeUndefined();
    const stored = JSON.parse(fs.readFileSync(existingPath, 'utf-8'));
    expect(stored).toEqual({ existing: true });
  });
});

