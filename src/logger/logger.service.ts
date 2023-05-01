import {
  Injectable,
  LoggerService as BuildInLoggerService,
} from '@nestjs/common';

@Injectable()
export class LoggerService implements BuildInLoggerService {
  debug(message: any, ...optionalParams: any[]) {
    console.debug(`🐛 ${message}`, ...optionalParams);
  }

  warn(message: any, ...optionalParams: any[]) {
    console.warn(`🚨 ${message}`, ...optionalParams);
  }

  log(message: any, ...optionalParams: any[]) {
    console.log(`✏️ ${message}`, ...optionalParams);
  }

  error(message: any, ...optionalParams: any[]) {
    console.error(`💥 ${message}`, ...optionalParams);
  }
}
