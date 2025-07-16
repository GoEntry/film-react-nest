import { LoggerService } from '@nestjs/common';
import { DevLogger } from './dev.logger';
import { JsonLogger } from './json.logger';
import { TskvLogger } from './tskv.logger';

export type LoggerType = 'dev' | 'json' | 'tskv';

export class LoggerFactory {
  static createLogger(type?: string): LoggerService {
    switch (type) {
      case 'json':
        return new JsonLogger();
      case 'tskv':
        return new TskvLogger();
      case 'dev':
      default:
        return new DevLogger();
    }
  }
}
