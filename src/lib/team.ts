import { prisma } from "./prisma";

export class TeamInsertError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TeamInsertError";
  }
}

/**
 * Inserts `insertUserId` between sponsor `aboveUserId` and direct downline `belowUserId`.
 * After: insertUser.sponsorId = aboveUserId, belowUser.sponsorId = insertUserId
 */
export async function insertMemberInTeam(params: {
  aboveUserId: string;
  insertUserId: string;
  belowUserId: string;
}) {
  const { aboveUserId, insertUserId, belowUserId } = params;

  if (aboveUserId === insertUserId || insertUserId === belowUserId || aboveUserId === belowUserId) {
    throw new TeamInsertError("All three members must be distinct.");
  }

  const [above, insert, below] = await Promise.all([
    prisma.user.findUnique({ where: { id: aboveUserId } }),
    prisma.user.findUnique({ where: { id: insertUserId } }),
    prisma.user.findUnique({ where: { id: belowUserId } }),
  ]);

  if (!above || !insert || !below) {
    throw new TeamInsertError("One or more member IDs were not found.");
  }

  if (below.sponsorId !== aboveUserId) {
    throw new TeamInsertError(
      "The 'below' member must be a direct downline of the 'above' member for this insertion.",
    );
  }

  if (insertUserId === aboveUserId) {
    throw new TeamInsertError("Cannot insert a member under themselves.");
  }

  // Prevent cycles: insert user cannot be in below's downline chain
  let cursor: string | null = belowUserId;
  while (cursor) {
    if (cursor === insertUserId) {
      throw new TeamInsertError("Insertion would create a circular sponsor chain.");
    }
    const node: { sponsorId: string | null } | null = await prisma.user.findUnique({
      where: { id: cursor },
      select: { sponsorId: true },
    });
    cursor = node?.sponsorId ?? null;
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: insertUserId },
      data: { sponsorId: aboveUserId },
    }),
    prisma.user.update({
      where: { id: belowUserId },
      data: { sponsorId: insertUserId },
    }),
  ]);

  return { ok: true as const, above: above.memberCode, insert: insert.memberCode, below: below.memberCode };
}

/** Move member directly under a new sponsor (new leg). Does not shift existing downlines. */
export async function reparentMember(params: { memberUserId: string; newSponsorUserId: string }) {
  const { memberUserId, newSponsorUserId } = params;
  if (memberUserId === newSponsorUserId) {
    throw new TeamInsertError("Member cannot be their own sponsor.");
  }

  const [member, sponsor] = await Promise.all([
    prisma.user.findUnique({ where: { id: memberUserId } }),
    prisma.user.findUnique({ where: { id: newSponsorUserId } }),
  ]);
  if (!member || !sponsor) {
    throw new TeamInsertError("Member or sponsor not found.");
  }

  let cursor: string | null = newSponsorUserId;
  while (cursor) {
    if (cursor === memberUserId) {
      throw new TeamInsertError("Cannot place a member under their own downline (cycle).");
    }
    const row: { sponsorId: string | null } | null = await prisma.user.findUnique({
      where: { id: cursor },
      select: { sponsorId: true },
    });
    cursor = row?.sponsorId ?? null;
  }

  await prisma.user.update({
    where: { id: memberUserId },
    data: { sponsorId: newSponsorUserId },
  });

  return {
    ok: true as const,
    member: member.memberCode,
    sponsor: sponsor.memberCode,
  };
}

export async function countTeamStats(userId: string) {
  const allUsers = await prisma.user.findMany({
    select: { id: true, sponsorId: true, packageType: true, isActive: true },
  });

  const childrenMap = new Map<string, string[]>();
  for (const u of allUsers) {
    if (!u.sponsorId) continue;
    const list = childrenMap.get(u.sponsorId) ?? [];
    list.push(u.id);
    childrenMap.set(u.sponsorId, list);
  }

  const teamIds = new Set<string>();
  const queue = [...(childrenMap.get(userId) ?? [])];
  while (queue.length) {
    const id = queue.shift()!;
    if (teamIds.has(id)) continue;
    teamIds.add(id);
    queue.push(...(childrenMap.get(id) ?? []));
  }

  const teamMembers = allUsers.filter((u) => teamIds.has(u.id));
  const activeMembers = teamMembers.filter((u) => u.isActive).length;
  const directReferrals = childrenMap.get(userId)?.length ?? 0;

  let maxDepth = 0;
  function depthFrom(nodeId: string, d: number) {
    maxDepth = Math.max(maxDepth, d);
    for (const child of childrenMap.get(nodeId) ?? []) {
      depthFrom(child, d + 1);
    }
  }
  depthFrom(userId, 0);

  return {
    totalTeam: teamIds.size,
    activeMembers,
    directReferrals,
    levelTreeDepth: maxDepth,
  };
}
