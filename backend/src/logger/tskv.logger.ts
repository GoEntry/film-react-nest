import { LoggerService, Injectable } from '@nestjs/common';

@Injectable()
export class TskvLogger implements LoggerService {
  /**
   * Formats a message in TSKV format (Tab-Separated Key-Value)
   * Example: level=log\tmessage=Server started\tparams=[]
   */
  formatMessage(level: string, message: any, ...optionalParams: any[]): string {
    // Start with the level
    let tskvString = `level=${level}`;

    // Add the message
    tskvString += `\tmessage=${this.escapeValue(String(message))}`;

    // Add optional parameters if they exist
    if (optionalParams && optionalParams.length > 0) {
      // Try to stringify the params safely
      let paramsString = '';
      try {
        paramsString = JSON.stringify(optionalParams);
      } catch (e) {
        paramsString = String(optionalParams);
      }
      tskvString += `\tparams=${this.escapeValue(paramsString)}`;
    }

    // Add timestamp
    tskvString += `\ttimestamp=${new Date().toISOString()}`;

    return tskvString;
  }

  /**
   * Escapes special characters in TSKV values
   */
  private escapeValue(value: string): string {
    // Replace tabs, newlines and backslashes with their escaped versions
    return value
      .replace(/\\/g, '\\\\')
      .replace(/\t/g, '\\t')
      .replace(/\n/g, '\\n');
  }

  /**
   * Write a 'log' level log.
   */
  log(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('log', message, optionalParams));
  }

  /**
   * Write an 'error' level log.
   */
  error(message: any, ...optionalParams: any[]) {
    console.error(this.formatMessage('error', message, optionalParams));
  }

  /**
   * Write a 'warn' level log.
   */
  warn(message: any, ...optionalParams: any[]) {
    console.warn(this.formatMessage('warn', message, optionalParams));
  }

  /**
   * Write a 'debug' level log.
   */
  debug(message: any, ...optionalParams: any[]) {
    console.debug(this.formatMessage('debug', message, optionalParams));
  }

  /**
   * Write a 'verbose' level log.
   */
  verbose(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('verbose', message, optionalParams));
  }
}
