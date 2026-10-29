<script lang="ts">
  import { mergedInto, problemsOf, type Problem } from '#lib/kb/problems';

  // A number inside a sentence: the reports merged into a ticket, or one problem's; `of="tenants"`
  // counts the tenants they came from instead.
  let { ticket, problem, of = 'reports' }: { ticket: number; problem?: Problem; of?: 'reports' | 'tenants' } = $props();

  const rs = $derived(problem ? (problemsOf(ticket).find((g) => g.problem === problem)?.reports ?? []) : mergedInto(ticket));
  const n = $derived(of === 'tenants' ? new Set(rs.map((r) => r.tenant)).size : rs.length);
</script>

<b>{n}</b>
