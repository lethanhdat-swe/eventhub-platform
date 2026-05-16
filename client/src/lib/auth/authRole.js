/** @param {{ role?: string }|null|undefined} user */
export function isAdminUser(user) {
  return user?.role === 'ADMIN';
}
