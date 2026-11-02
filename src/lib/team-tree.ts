export type TeamTreeMember = {
  id: string;
  memberCode: string;
  name: string;
  packageType: "EDU" | "BP" | null;
  isActive: boolean;
  sponsorId: string | null;
};

export type TeamTreeNode = TeamTreeMember & {
  children: TeamTreeNode[];
  directCount: number;
};

export function buildMemberForest(members: TeamTreeMember[]): {
  roots: TeamTreeNode[];
  byId: Map<string, TeamTreeNode>;
} {
  const byId = new Map<string, TeamTreeNode>();

  for (const m of members) {
    byId.set(m.id, { ...m, children: [], directCount: 0 });
  }

  const roots: TeamTreeNode[] = [];
  for (const node of byId.values()) {
    if (node.sponsorId && byId.has(node.sponsorId)) {
      byId.get(node.sponsorId)!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  for (const node of byId.values()) {
    node.directCount = node.children.length;
    node.children.sort((a, b) => a.memberCode.localeCompare(b.memberCode));
  }
  roots.sort((a, b) => a.memberCode.localeCompare(b.memberCode));

  return { roots, byId };
}
