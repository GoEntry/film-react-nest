import { TskvLogger } from '../tskv.logger';

describe('TskvLogger', () => {
  let logger: TskvLogger;
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleDebugSpy: jest.SpyInstance;

  // Мок для Date.toISOString() чтобы тесты были предсказуемыми
  const mockDate = new Date('2023-01-01T12:00:00Z');
  const mockISOString = mockDate.toISOString();

  beforeEach(() => {
    logger = new TskvLogger();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    consoleDebugSpy = jest.spyOn(console, 'debug').mockImplementation();

    // Мокаем Date.now() и toISOString()
    jest
      .spyOn(global.Date.prototype, 'toISOString')
      .mockReturnValue(mockISOString);
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    consoleDebugSpy.mockRestore();
    jest.restoreAllMocks();
  });

  describe('formatMessage', () => {
    it('should format message in TSKV format with level and message', () => {
      const result = logger.formatMessage('log', 'test message');

      expect(result).toContain('level=log');
      expect(result).toContain('message=test message');
      expect(result).toContain(`timestamp=${mockISOString}`);
      expect(result.split('\t').length).toBeGreaterThanOrEqual(3); // Минимум 3 пары ключ-значение
    });

    it('should include optional parameters in TSKV format', () => {
      const result = logger.formatMessage('log', 'test message', {
        param1: 'value1',
      });

      expect(result).toContain('level=log');
      expect(result).toContain('message=test message');
      expect(result).toContain('params=');
      expect(result).toContain(`timestamp=${mockISOString}`);
    });

    it('should escape special characters in values', () => {
      const result = logger.formatMessage(
        'log',
        'test\tmessage\nwith\tspecial\\chars',
      );

      expect(result).toContain(
        'message=test\\tmessage\\nwith\\tspecial\\\\chars',
      );
      expect(result).not.toContain('\n'); // Проверяем, что перевод строки был экранирован

      // Проверяем, что в значении нет неэкранированной табуляции
      expect(result).not.toContain('test\tmessage');

      // Проверяем, что табуляции используются как разделители
      expect(result.includes('\t')).toBe(true);
    });
  });

  describe('log methods', () => {
    it('should call console.log with formatted message for log level', () => {
      logger.log('test log');
      expect(consoleLogSpy).toHaveBeenCalled();

      const call = consoleLogSpy.mock.calls[0][0];
      expect(call).toContain('level=log');
      expect(call).toContain('message=test log');
    });

    it('should call console.error with formatted message for error level', () => {
      logger.error('test error');
      expect(consoleErrorSpy).toHaveBeenCalled();

      const call = consoleErrorSpy.mock.calls[0][0];
      expect(call).toContain('level=error');
      expect(call).toContain('message=test error');
    });

    it('should call console.warn with formatted message for warn level', () => {
      logger.warn('test warning');
      expect(consoleWarnSpy).toHaveBeenCalled();

      const call = consoleWarnSpy.mock.calls[0][0];
      expect(call).toContain('level=warn');
      expect(call).toContain('message=test warning');
    });

    it('should call console.debug with formatted message for debug level', () => {
      logger.debug('test debug');
      expect(consoleDebugSpy).toHaveBeenCalled();

      const call = consoleDebugSpy.mock.calls[0][0];
      expect(call).toContain('level=debug');
      expect(call).toContain('message=test debug');
    });

    it('should call console.log with formatted message for verbose level', () => {
      logger.verbose('test verbose');
      expect(consoleLogSpy).toHaveBeenCalled();

      const call = consoleLogSpy.mock.calls[0][0];
      expect(call).toContain('level=verbose');
      expect(call).toContain('message=test verbose');
    });
  });
});
