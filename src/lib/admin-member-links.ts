/** Opens the member’s real `/dashboard` as admin (impersonation + exit bar). */
export function memberPanelHref(memberId: string) {
  return `/api/admin/impersonate?memberId=${encodeURIComponent(memberId)}`;
}
