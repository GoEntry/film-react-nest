import { LoggerFactory } from '../logger.factory';
import { DevLogger } from '../dev.logger';
import { JsonLogger } from '../json.logger';
import { TskvLogger } from '../tskv.logger';

describe('LoggerFactory', () => {
  describe('createLogger', () => {
    it('should create DevLogger by default', () => {
      const logger = LoggerFactory.createLogger();
      expect(logger).toBeInstanceOf(DevLogger);
    });

    it('should create DevLogger when type is "dev"', () => {
      const logger = LoggerFactory.createLogger('dev');
      expect(logger).toBeInstanceOf(DevLogger);
    });

    it('should create JsonLogger when type is "json"', () => {
      const logger = LoggerFactory.createLogger('json');
      expect(logger).toBeInstanceOf(JsonLogger);
    });

    it('should create TskvLogger when type is "tskv"', () => {
      const logger = LoggerFactory.createLogger('tskv');
      expect(logger).toBeInstanceOf(TskvLogger);
    });

    it('should create DevLogger for unknown type', () => {
      const logger = LoggerFactory.createLogger('unknown');
      expect(logger).toBeInstanceOf(DevLogger);
    });
  });
});
