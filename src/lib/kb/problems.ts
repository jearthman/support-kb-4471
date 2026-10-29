// One ticket per problem, not per cause tag. causes.ts tells parser from hint by tenant and channel;
// a report the desk read as a one-day move (desk-notes.json) is neither, so it gets its own group
// instead of a footnote under its tenant's cause.
import reports from '#lib/data/reports-4471.json';
import notes from '#lib/data/desk-notes.json';
import { causeOf, uniqueById, type Cause, type Report } from '#lib/kb/causes';
import { tenantOf } from '#lib/kb/locales';

export type Problem = Cause | 'one-day' | 'unplaced';

export function problemOf(r: Report, oneDayMove: readonly string[] = notes.oneDayMove): Problem {
  if (oneDayMove.includes(r.id)) return 'one-day';
  return causeOf(r, tenantOf(r)) ?? 'unplaced';
}

export type ProblemGroup = {
  problem: Problem;
  reports: Report[];
  tenants: string[];
  firstSeen: string;
  lastSeen: string;
  // How many of these intake tagged as something else.
  taggedOtherwise: number;
};

export function mergedInto(ticket: number): Report[] {
  return uniqueById(reports as Report[]).filter((r) => r.mergedInto === ticket);
}

export function groupByProblem(rs: Report[]): ProblemGroup[] {
  const by = new Map<Problem, Report[]>();
  for (const r of rs) {
    const p = problemOf(r);
    by.set(p, [...(by.get(p) ?? []), r]);
  }
  return [...by.entries()]
    .map(([problem, group]) => {
      const days = group.map((r) => r.receivedAt.slice(0, 10)).sort();
      return {
        problem,
        reports: group,
        tenants: [...new Set(group.map((r) => r.tenant))].sort(),
        firstSeen: days[0],
        lastSeen: days[days.length - 1],
        taggedOtherwise: group.filter((r) => r.meta.intakeTag !== problem).length,
      };
    })
    .sort((a, b) => b.reports.length - a.reports.length);
}

export function problemsOf(ticket: number): ProblemGroup[] {
  return groupByProblem(mergedInto(ticket));
}
