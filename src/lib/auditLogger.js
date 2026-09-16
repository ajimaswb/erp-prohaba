import { prisma } from './prisma';

/**
 * Creates an audit log entry.
 * @param {Object} params
 * @param {string} params.userId - ID of the user performing the action
 * @param {string} params.action - CREATE, UPDATE, DELETE, APPROVE, REJECT
 * @param {string} params.module - Module name (e.g., USERS, PROJECTS, WORKSHOP)
 * @param {string} params.recordId - ID of the record being modified
 * @param {Object} [params.oldValue] - Previous state of the record (for UPDATE/DELETE)
 * @param {Object} [params.newValue] - New state of the record (for CREATE/UPDATE)
 * @param {string} [params.ipAddress] - IP Address of the requester if available
 */
export async function logAudit({ userId, action, module, recordId, oldValue = null, newValue = null, ipAddress = null }) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        module,
        recordId,
        oldValue: oldValue ? JSON.stringify(oldValue) : null,
        newValue: newValue ? JSON.stringify(newValue) : null,
        ipAddress,
      }
    });
  } catch (error) {
    console.error('Failed to create audit log:', error);
  }
}
