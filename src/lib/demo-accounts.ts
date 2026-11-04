/** Public demo logins (seeded on production). Shown on /login for testers. */
export const demoAccounts = {
  admin: {
    label: "Admin panel",
    email: "admin@srimagicale.in",
    password: "admin123",
    redirect: "/admin",
  },
  bp: {
    label: "BP member dashboard",
    email: "bp@srimagicale.in",
    password: "bp123456",
    redirect: "/dashboard",
    hint: "Business Purpose — team, wallet, trading courses",
  },
  edu: {
    label: "Edu member dashboard",
    email: "edu@srimagicale.in",
    password: "edu123456",
    redirect: "/dashboard",
    hint: "Education package — LMS only",
  },
  /** @deprecated Use bp@srimagicale.in — kept for old bookmarks */
  legacyBp: {
    label: "BP (legacy alias)",
    email: "demo@srimagicale.in",
    password: "demo123",
    redirect: "/dashboard",
  },
} as const;

export const loginDemoList = [demoAccounts.bp, demoAccounts.edu, demoAccounts.admin] as const;
