import { JsonLogger } from '../json.logger';

describe('JsonLogger', () => {
  let logger: JsonLogger;
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleDebugSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new JsonLogger();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    consoleDebugSpy = jest.spyOn(console, 'debug').mockImplementation();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    consoleDebugSpy.mockRestore();
  });

  describe('formatMessage', () => {
    it('should format message as JSON with level and message', () => {
      const result = logger.formatMessage('log', 'test message');
      const parsed = JSON.parse(result);

      expect(parsed).toHaveProperty('level', 'log');
      expect(parsed).toHaveProperty('message', 'test message');
      expect(parsed).toHaveProperty('optionalParams');
    });

    it('should include optional parameters in the JSON', () => {
      const result = logger.formatMessage('log', 'test message', {
        param1: 'value1',
      });
      const parsed = JSON.parse(result);

      expect(parsed).toHaveProperty('optionalParams');
      expect(parsed.optionalParams).toContainEqual({ param1: 'value1' });
    });
  });

  describe('log methods', () => {
    it('should call console.log with formatted message for log level', () => {
      logger.log('test log');
      expect(consoleLogSpy).toHaveBeenCalled();

      const call = consoleLogSpy.mock.calls[0][0];
      const parsed = JSON.parse(call);
      expect(parsed.level).toBe('log');
      expect(parsed.message).toBe('test log');
    });

    it('should call console.error with formatted message for error level', () => {
      logger.error('test error');
      expect(consoleErrorSpy).toHaveBeenCalled();

      const call = consoleErrorSpy.mock.calls[0][0];
      const parsed = JSON.parse(call);
      expect(parsed.level).toBe('error');
      expect(parsed.message).toBe('test error');
    });

    it('should call console.warn with formatted message for warn level', () => {
      logger.warn('test warning');
      expect(consoleWarnSpy).toHaveBeenCalled();

      const call = consoleWarnSpy.mock.calls[0][0];
      const parsed = JSON.parse(call);
      expect(parsed.level).toBe('warn');
      expect(parsed.message).toBe('test warning');
    });

    it('should call console.debug with formatted message for debug level', () => {
      logger.debug('test debug');
      expect(consoleDebugSpy).toHaveBeenCalled();

      const call = consoleDebugSpy.mock.calls[0][0];
      const parsed = JSON.parse(call);
      expect(parsed.level).toBe('debug');
      expect(parsed.message).toBe('test debug');
    });

    it('should call console.log with formatted message for verbose level', () => {
      logger.verbose('test verbose');
      expect(consoleLogSpy).toHaveBeenCalled();

      const call = consoleLogSpy.mock.calls[0][0];
      const parsed = JSON.parse(call);
      expect(parsed.level).toBe('verbose');
      expect(parsed.message).toBe('test verbose');
    });
  });
});
