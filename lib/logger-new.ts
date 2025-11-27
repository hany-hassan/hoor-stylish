import { prisma } from './prisma';

/**
 * نظام Logger موحد للمشروع
 * يستبدل console.log و console.error
 */

export enum LogLevel {
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  DEBUG = 'debug',
}

export interface LogData {
  level: LogLevel;
  message: string;
  details?: any;
  adminId?: string;
  route?: string;
  timestamp: Date;
}

class Logger {
  /**
   * تسجيل معلومات عامة
   */
  static info(message: string, details?: any, adminId?: string): void {
    this.log(LogLevel.INFO, message, details, adminId);
  }

  /**
   * تسجيل تحذيرات
   */
  static warn(message: string, details?: any, adminId?: string): void {
    this.log(LogLevel.WARN, message, details, adminId);
  }

  /**
   * تسجيل أخطاء
   */
  static error(message: string, error?: any, adminId?: string): void {
    const details = error instanceof Error 
      ? { message: error.message, stack: error.stack }
      : error;
    this.log(LogLevel.ERROR, message, details, adminId);
  }

  /**
   * تسجيل معلومات debug (في development فقط)
   */
  static debug(message: string, details?: any): void {
    if (process.env.NODE_ENV === 'development') {
      this.log(LogLevel.DEBUG, message, details);
    }
  }

  /**
   * الدالة الرئيسية للتسجيل
   */
  private static log(
    level: LogLevel,
    message: string,
    details?: any,
    adminId?: string
  ): void {
    const logData: LogData = {
      level,
      message,
      details,
      adminId,
      timestamp: new Date(),
    };

    // في development: اطبع في console
    if (process.env.NODE_ENV === 'development') {
      const emoji = this.getEmoji(level);
      console.log(`${emoji} [${level.toUpperCase()}] ${message}`, details || '');
    }

    // في production: سجل في database فقط للأخطاء المهمة
    if (process.env.NODE_ENV === 'production' && level !== LogLevel.DEBUG) {
      this.saveToDatabase(logData).catch((err) => {
        // fallback to console if database fails
        console.error('Failed to save log to database:', err);
      });
    }
  }

  /**
   * حفظ اللوج في قاعدة البيانات
   */
  private static async saveToDatabase(logData: LogData): Promise<void> {
    try {
      // استخدام جدول ActivityLog الموجود
      if (logData.adminId) {
        await prisma.activityLog.create({
          data: {
            action: `[${logData.level.toUpperCase()}] ${logData.message}`,
            details: logData.details ? JSON.stringify(logData.details) : null,
            adminId: logData.adminId,
          },
        });
      }
    } catch (error) {
      // إذا فشل الحفظ، اطبع في console
      console.error('Logger database save failed:', error);
    }
  }

  /**
   * الحصول على emoji حسب المستوى
   */
  private static getEmoji(level: LogLevel): string {
    switch (level) {
      case LogLevel.INFO:
        return 'ℹ️';
      case LogLevel.WARN:
        return '⚠️';
      case LogLevel.ERROR:
        return '❌';
      case LogLevel.DEBUG:
        return '🔍';
      default:
        return '📝';
    }
  }
}

export default Logger;
