// client helper: end the session and go back to the login page
export async function logout(router) {
  try {
    await fetch('/api/auth/logout', { method: 'POST' });
  } catch {}
  router.replace('/login');
  router.refresh();
}
