import * as dotenv from 'dotenv';
import * as fs from 'fs';

export class ConfigService {

  private readonly envConfig: Record<string, string>;

  constructor(filePath: string) {
    if (filePath.length > 0) {
      this.envConfig = dotenv.parse(fs.readFileSync(filePath));
    }
  }

  get(key: string): any {
    return (this.envConfig) ? this.envConfig[key] : process.env[key];
  }
}
