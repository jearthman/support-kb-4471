// One ticket per problem, not per cause tag. causes.ts tells parser from hint by tenant and channel.
// A report the desk read as a one-day move (desk-notes.json) is a problem of its own, but the desk
// counts it where it is filed, under its tenant's cause: it is in both groups, and footnoted there.
import reports from '#lib/data/reports-4471.json';
import notes from '#lib/data/desk-notes.json';
import { causeOf, uniqueById, type Cause, type Report } from '#lib/kb/causes';
import { tenantOf } from '#lib/kb/locales';

export type Problem = Cause | 'one-day' | 'unplaced';

export type ProblemGroup = {
  problem: Problem;
  reports: Report[];
  tenants: string[];
  firstSeen: string;
  lastSeen: string;
  // How many of these intake tagged as something else.
  taggedOtherwise: number;
  // How many of these the desk read as a one-day move. Only on cause groups.
  oneDay: number;
};

export function mergedInto(ticket: number): Report[] {
  return uniqueById(reports as Report[]).filter((r) => r.mergedInto === ticket);
}

function group(problem: Problem, rs: Report[], oneDayMove: readonly string[]): ProblemGroup {
  const days = rs.map((r) => r.receivedAt.slice(0, 10)).sort();
  return {
    problem,
    reports: rs,
    tenants: [...new Set(rs.map((r) => r.tenant))].sort(),
    firstSeen: days[0],
    lastSeen: days[days.length - 1],
    taggedOtherwise: rs.filter((r) => r.meta.intakeTag !== problem).length,
    oneDay: problem === 'one-day' ? 0 : rs.filter((r) => oneDayMove.includes(r.id)).length,
  };
}

export function groupByProblem(rs: Report[], oneDayMove: readonly string[] = notes.oneDayMove): ProblemGroup[] {
  const byCause = new Map<Problem, Report[]>();
  for (const r of rs) {
    const cause = causeOf(r, tenantOf(r)) ?? 'unplaced';
    byCause.set(cause, [...(byCause.get(cause) ?? []), r]);
  }
  const causes = [...byCause.entries()]
    .map(([cause, group_]) => group(cause, group_, oneDayMove))
    .sort((a, b) => b.reports.length - a.reports.length);
  const moved = rs.filter((r) => oneDayMove.includes(r.id));
  return moved.length ? [...causes, group('one-day', moved, oneDayMove)] : causes;
}

export function problemsOf(ticket: number): ProblemGroup[] {
  return groupByProblem(mergedInto(ticket));
}
