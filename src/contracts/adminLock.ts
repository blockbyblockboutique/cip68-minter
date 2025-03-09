import { NativeScript } from '@meshsdk/core';

export const adminLockScript = (adminPKH: string): NativeScript => ({
  type: 'all',
  scripts: [{ type: 'sig', keyHash: adminPKH }],
});

export const getAdminLockAddress = (adminPKH: string): NativeScript => {
  return adminLockScript(adminPKH); // Returns script, not address
};