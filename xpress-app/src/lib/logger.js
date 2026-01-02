const LOG_LEVELS = {
  DEBUG: "DEBUG",
  INFO: "INFO",
  WARN: "WARN",
  ERROR: "ERROR",
  SUCCESS: "SUCCESS"
};

const LOG_COLORS = {
  DEBUG: "\x1b[36m",    // Cyan
  INFO: "\x1b[34m",     // Blue
  WARN: "\x1b[33m",     // Yellow
  ERROR: "\x1b[31m",    // Red
  SUCCESS: "\x1b[32m"   // Green
};

const RESET_COLOR = "\x1b[0m";

class Logger {
  constructor(moduleName = "App") {
    this.moduleName = moduleName;
  }

  getTimestamp() {
    return new Date().toISOString();
  }

  formatMessage(level, message, data = null) {
    const timestamp = this.getTimestamp();
    const color = LOG_COLORS[level] || "";
    const prefix = `[${timestamp}] [${this.moduleName}] [${level}]`;
    
    if (data) {
      return `${color}${prefix} ${message}${RESET_COLOR}`, data;
    }
    return `${color}${prefix} ${message}${RESET_COLOR}`;
  }

  debug(message, data = null) {
    if (data) {
      console.log(this.formatMessage(LOG_LEVELS.DEBUG, message, data), data);
    } else {
      console.log(this.formatMessage(LOG_LEVELS.DEBUG, message));
    }
  }

  info(message, data = null) {
    if (data) {
      console.log(this.formatMessage(LOG_LEVELS.INFO, message, data), data);
    } else {
      console.log(this.formatMessage(LOG_LEVELS.INFO, message));
    }
  }

  warn(message, data = null) {
    if (data) {
      console.warn(this.formatMessage(LOG_LEVELS.WARN, message, data), data);
    } else {
      console.warn(this.formatMessage(LOG_LEVELS.WARN, message));
    }
  }

  error(message, data = null) {
    if (data) {
      console.error(this.formatMessage(LOG_LEVELS.ERROR, message, data), data);
    } else {
      console.error(this.formatMessage(LOG_LEVELS.ERROR, message));
    }
  }

  success(message, data = null) {
    if (data) {
      console.log(this.formatMessage(LOG_LEVELS.SUCCESS, message, data), data);
    } else {
      console.log(this.formatMessage(LOG_LEVELS.SUCCESS, message));
    }
  }

  // API specific logging
  logApiCall(method, endpoint, payload = null) {
    this.info(`📡 ${method} ${endpoint}`, payload);
  }

  logApiResponse(status, message, data = null) {
    if (status >= 200 && status < 300) {
      this.success(`✅ API Response ${status}: ${message}`, data);
    } else if (status >= 400 && status < 500) {
      this.warn(`⚠️ API Response ${status}: ${message}`, data);
    } else if (status >= 500) {
      this.error(`❌ API Response ${status}: ${message}`, data);
    }
  }

  logApiError(error, context = "") {
    this.error(`❌ API Error ${context}: ${error.message}`, error);
  }

  // Performance logging
  logPerformance(operation, duration) {
    if (duration > 1000) {
      this.warn(`⏱️ ${operation} took ${duration}ms (slow)`, { duration });
    } else {
      this.info(`⏱️ ${operation} took ${duration}ms`, { duration });
    }
  }
}

export default Logger;
