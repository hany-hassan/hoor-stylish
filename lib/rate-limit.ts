/**
 * نظام Rate Limiting لمنع هجمات Brute Force
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
  lockedUntil?: number;
}

// تخزين في memory (في production يجب استخدام Redis)
const rateLimitStore = new Map<string, RateLimitEntry>();

export interface RateLimitConfig {
  maxAttempts: number; // عدد المحاولات المسموح بها
  windowMs: number; // النافذة الزمنية بالميلي ثانية
  lockDurationMs: number; // مدة القفل بعد تجاوز الحد
}

// إعدادات افتراضية
const DEFAULT_CONFIG: RateLimitConfig = {
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  lockDurationMs: 30 * 60 * 1000, // 30 دقيقة
};

/**
 * التحقق من Rate Limit
 * @param identifier معرف فريد (مثل IP أو email)
 * @param config إعدادات مخصصة (اختياري)
 * @returns { allowed: boolean, remaining: number, resetTime: number }
 */
export function checkRateLimit(
  identifier: string,
  config: Partial<RateLimitConfig> = {}
): { allowed: boolean; remaining: number; resetTime: number; lockedUntil?: number } {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const now = Date.now();
  const key = `ratelimit:${identifier}`;
  
  let entry = rateLimitStore.get(key);

  // إذا لم يكن هناك إدخال أو انتهت النافذة الزمنية
  if (!entry || now > entry.resetTime) {
    entry = {
      count: 1,
      resetTime: now + finalConfig.windowMs,
    };
    rateLimitStore.set(key, entry);
    
    return {
      allowed: true,
      remaining: finalConfig.maxAttempts - 1,
      resetTime: entry.resetTime,
    };
  }

  // تحقق من القفل
  if (entry.lockedUntil && now < entry.lockedUntil) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
      lockedUntil: entry.lockedUntil,
    };
  }

  // إذا كان القفل انتهى، أعد تعيين العداد
  if (entry.lockedUntil && now >= entry.lockedUntil) {
    entry.count = 1;
    entry.lockedUntil = undefined;
    entry.resetTime = now + finalConfig.windowMs;
    rateLimitStore.set(key, entry);
    
    return {
      allowed: true,
      remaining: finalConfig.maxAttempts - 1,
      resetTime: entry.resetTime,
    };
  }

  // زيادة العداد
  entry.count++;
  
  // إذا تجاوز الحد، قفل الحساب
  if (entry.count > finalConfig.maxAttempts) {
    entry.lockedUntil = now + finalConfig.lockDurationMs;
    rateLimitStore.set(key, entry);
    
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
      lockedUntil: entry.lockedUntil,
    };
  }

  rateLimitStore.set(key, entry);
  
  return {
    allowed: true,
    remaining: finalConfig.maxAttempts - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * إعادة تعيين Rate Limit لمعرف معين
 * @param identifier المعرف
 */
export function resetRateLimit(identifier: string): void {
  const key = `ratelimit:${identifier}`;
  rateLimitStore.delete(key);
}

/**
 * تنظيف الإدخالات القديمة (يجب تشغيله بشكل دوري)
 */
export function cleanupRateLimits(): void {
  const now = Date.now();
  
  for (const [key, entry] of rateLimitStore.entries()) {
    // حذف العناصر التي انتهت نافذتها الزمنية ولم تعد مقفلة
    if (now > entry.resetTime && (!entry.lockedUntil || now > entry.lockedUntil)) {
      rateLimitStore.delete(key);
    }
  }
}

// تنظيف تلقائي كل ساعة
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimits, 60 * 60 * 1000); // كل ساعة
}

/**
 * الحصول على IP من Request
 */
export function getIP(request: Request): string {
  // محاولة الحصول على IP الحقيقي من headers
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIp) {
    return realIp;
  }
  
  // fallback
  return 'unknown';
}
