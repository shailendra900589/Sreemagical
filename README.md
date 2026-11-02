# Sri Magicale — Education & Youth Empowerment (Next.js)

Professional web platform for **SM Groups / Sri Magicale**: public marketing site, member dashboard (Edu & BP packages), MLM-style compensation engine, and admin controls for **live percentage updates** and **team tree insertion**.

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- Prisma ORM + SQLite (dev) — switch `DATABASE_URL` to PostgreSQL for production
- Cookie sessions (`sm_session`)

## Quick start

```bash
cd sri-magicale
npm install
npm run db:push
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Demo accounts (after seed)

| Role   | Email                 | Password  |
|--------|------------------------|-----------|
| Admin  | admin@srimagicale.in   | admin123  |
| Member | demo@srimagicale.in    | demo123   |

## Business rules implemented

- **Edu (₹5,000)**: LMS access only — no direct / level / royalty commissions on join.
- **BP (₹10,000)**: Edu + trading modules + commissions on join.
- **Direct sponsor income**: configurable standard / offer % (admin).
- **Level income**: 10 uplines, each with admin-configurable %.
- **Royalty**: Silver / Gold / Diamond pool % of monthly BP turnover (admin + qualification fields stored).

## Admin panel

- `/admin/settings` — change referral, level, royalty, and package fees anytime.
- `/admin/team` — insert a member ID between an upline and their direct downline.

## Referral URLs

```
/signup?Signup=<base64url(memberCode)>&Leg=L
/signup?Signup=<base64url(memberCode)>&Leg=R
```

## Production notes

- Set `DATABASE_URL` to PostgreSQL and run migrations.
- Set `NEXT_PUBLIC_APP_URL` for correct referral links.
- Add payment gateway webhooks before go-live (registration currently records enrollment immediately).
- Schedule royalty distribution (cron calling `distributeRoyaltyForPeriod` in `src/lib/compensation.ts`).
