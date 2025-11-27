/**
 * نظام الصلاحيات (Permissions System)
 * يحدد صلاحيات كل دور ويتحقق منها
 */

export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
}

export enum Permission {
  // إدارة المديرين
  MANAGE_ADMINS = 'manage_admins',
  VIEW_ADMINS = 'view_admins',
  
  // إدارة المنتجات
  CREATE_PRODUCT = 'create_product',
  EDIT_PRODUCT = 'edit_product',
  DELETE_PRODUCT = 'delete_product',
  VIEW_PRODUCTS = 'view_products',
  
  // إدارة التصنيفات
  CREATE_CATEGORY = 'create_category',
  EDIT_CATEGORY = 'edit_category',
  DELETE_CATEGORY = 'delete_category',
  VIEW_CATEGORIES = 'view_categories',
  
  // إدارة الطلبات
  VIEW_ORDERS = 'view_orders',
  UPDATE_ORDER_STATUS = 'update_order_status',
  DELETE_ORDER = 'delete_order',
  
  // التقارير
  VIEW_REPORTS = 'view_reports',
  VIEW_ACTIVITY_LOG = 'view_activity_log',
}

/**
 * تعريف الصلاحيات لكل دور
 */
const rolePermissions: Record<Role, Permission[]> = {
  [Role.SUPER_ADMIN]: [
    // صلاحيات كاملة - كل شيء
    Permission.MANAGE_ADMINS,
    Permission.VIEW_ADMINS,
    Permission.CREATE_PRODUCT,
    Permission.EDIT_PRODUCT,
    Permission.DELETE_PRODUCT,
    Permission.VIEW_PRODUCTS,
    Permission.CREATE_CATEGORY,
    Permission.EDIT_CATEGORY,
    Permission.DELETE_CATEGORY,
    Permission.VIEW_CATEGORIES,
    Permission.VIEW_ORDERS,
    Permission.UPDATE_ORDER_STATUS,
    Permission.DELETE_ORDER,
    Permission.VIEW_REPORTS,
    Permission.VIEW_ACTIVITY_LOG,
  ],
  
  [Role.ADMIN]: [
    // إدارة كاملة ما عدا المديرين
    Permission.VIEW_ADMINS, // عرض فقط
    Permission.CREATE_PRODUCT,
    Permission.EDIT_PRODUCT,
    Permission.DELETE_PRODUCT,
    Permission.VIEW_PRODUCTS,
    Permission.CREATE_CATEGORY,
    Permission.EDIT_CATEGORY,
    Permission.DELETE_CATEGORY,
    Permission.VIEW_CATEGORIES,
    Permission.VIEW_ORDERS,
    Permission.UPDATE_ORDER_STATUS,
    Permission.DELETE_ORDER,
    Permission.VIEW_REPORTS,
    Permission.VIEW_ACTIVITY_LOG,
  ],
  
  [Role.EDITOR]: [
    // عرض وتعديل فقط - بدون حذف
    Permission.VIEW_PRODUCTS,
    Permission.EDIT_PRODUCT, // تعديل فقط
    Permission.VIEW_CATEGORIES,
    Permission.VIEW_ORDERS,
    Permission.UPDATE_ORDER_STATUS, // تحديث حالة الطلبات
    Permission.VIEW_REPORTS,
  ],
};

/**
 * التحقق من صلاحية المستخدم
 * @param userRole دور المستخدم
 * @param requiredPermission الصلاحية المطلوبة
 * @param customPermissions صلاحيات مخصصة إضافية (من database)
 * @returns true إذا كان لديه الصلاحية
 */
export function hasPermission(
  userRole: Role,
  requiredPermission: Permission,
  customPermissions?: Permission[]
): boolean {
  // Super Admin لديه صلاحية كاملة دائماً
  if (userRole === Role.SUPER_ADMIN) {
    return true;
  }

  // تحقق من الصلاحيات الافتراضية للدور
  const defaultPermissions = rolePermissions[userRole] || [];
  if (defaultPermissions.includes(requiredPermission)) {
    return true;
  }

  // تحقق من الصلاحيات المخصصة
  if (customPermissions && customPermissions.includes(requiredPermission)) {
    return true;
  }

  return false;
}

/**
 * التحقق من وجود واحدة من الصلاحيات
 * @param userRole دور المستخدم
 * @param requiredPermissions قائمة الصلاحيات المطلوبة (واحدة على الأقل)
 * @param customPermissions صلاحيات مخصصة
 * @returns true إذا كان لديه واحدة على الأقل
 */
export function hasAnyPermission(
  userRole: Role,
  requiredPermissions: Permission[],
  customPermissions?: Permission[]
): boolean {
  return requiredPermissions.some((permission) =>
    hasPermission(userRole, permission, customPermissions)
  );
}

/**
 * التحقق من وجود جميع الصلاحيات
 * @param userRole دور المستخدم
 * @param requiredPermissions قائمة الصلاحيات المطلوبة (كلها)
 * @param customPermissions صلاحيات مخصصة
 * @returns true إذا كان لديه كل الصلاحيات
 */
export function hasAllPermissions(
  userRole: Role,
  requiredPermissions: Permission[],
  customPermissions?: Permission[]
): boolean {
  return requiredPermissions.every((permission) =>
    hasPermission(userRole, permission, customPermissions)
  );
}

/**
 * الحصول على جميع صلاحيات دور معين
 * @param role الدور
 * @returns قائمة الصلاحيات
 */
export function getPermissionsForRole(role: Role): Permission[] {
  return rolePermissions[role] || [];
}

/**
 * الحصول على وصف الصلاحية بالعربية
 * @param permission الصلاحية
 * @returns الوصف بالعربية
 */
export function getPermissionLabel(permission: Permission): string {
  const labels: Record<Permission, string> = {
    [Permission.MANAGE_ADMINS]: 'إدارة المديرين',
    [Permission.VIEW_ADMINS]: 'عرض المديرين',
    [Permission.CREATE_PRODUCT]: 'إضافة منتج',
    [Permission.EDIT_PRODUCT]: 'تعديل منتج',
    [Permission.DELETE_PRODUCT]: 'حذف منتج',
    [Permission.VIEW_PRODUCTS]: 'عرض المنتجات',
    [Permission.CREATE_CATEGORY]: 'إضافة تصنيف',
    [Permission.EDIT_CATEGORY]: 'تعديل تصنيف',
    [Permission.DELETE_CATEGORY]: 'حذف تصنيف',
    [Permission.VIEW_CATEGORIES]: 'عرض التصنيفات',
    [Permission.VIEW_ORDERS]: 'عرض الطلبات',
    [Permission.UPDATE_ORDER_STATUS]: 'تحديث حالة الطلب',
    [Permission.DELETE_ORDER]: 'حذف طلب',
    [Permission.VIEW_REPORTS]: 'عرض التقارير',
    [Permission.VIEW_ACTIVITY_LOG]: 'عرض سجل النشاطات',
  };
  
  return labels[permission] || permission;
}

/**
 * الحصول على وصف الدور بالعربية
 * @param role الدور
 * @returns الوصف بالعربية
 */
export function getRoleLabel(role: Role): string {
  const labels: Record<Role, string> = {
    [Role.SUPER_ADMIN]: 'مدير أعلى',
    [Role.ADMIN]: 'مدير',
    [Role.EDITOR]: 'محرر',
  };
  
  return labels[role] || role;
}
