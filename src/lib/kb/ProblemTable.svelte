<script lang="ts">
  import { exportRows, mergedInto, problemsOf, repeatedRows, type Problem } from '#lib/kb/problems';

  // `tickets`: where each problem is tracked. `engineering`: what engineering said about it, in words.
  let {
    ticket,
    tickets = {},
    engineering = {},
  }: { ticket: number; tickets?: Partial<Record<Problem, string>>; engineering?: Partial<Record<Problem, string>> } = $props();

  const merged = $derived(mergedInto(ticket));
  const groups = $derived(problemsOf(ticket));
  const issue = (href: string) => `#${href.split('/').pop()}`;
</script>

<p class="sum">
  <strong>{merged.length}</strong> reports merged into #{ticket} ·
  <strong>{groups.length}</strong>
  {groups.length === 1 ? 'problem' : 'problems'}
</p>

<table>
  <thead>
    <tr><th>problem</th><th>reports</th><th>tenants</th><th>seen</th><th>intake tagged otherwise</th><th>engineering</th><th>ticket</th></tr>
  </thead>
  <tbody>
    {#each groups as g (g.problem)}
      {@const href = tickets[g.problem]}
      <tr class:untracked={!href}>
        <td><code>{g.problem}</code></td>
        <td>{g.reports.length}</td>
        <td title={g.tenants.join(', ')}>{g.tenants.length}</td>
        <td class="seen">{g.firstSeen} → {g.lastSeen}</td>
        <td>{g.taggedOtherwise}</td>
        <td>{engineering[g.problem] ?? '—'}</td>
        <td>{#if href}<a {href}>{issue(href)}</a>{:else}no ticket{/if}</td>
      </tr>
    {/each}
  </tbody>
</table>

<p class="note">
  The export holds {exportRows} rows; {repeatedRows} repeat a report already counted, because its pages
  overlap. Each report counts once, in one problem.
</p>

<style>
  .sum { font-size: 1.1rem; }
  .note { color: var(--muted); font-size: 0.85em; }
  .seen { white-space: nowrap; }
  .untracked td { background: var(--warn-bg); }
  .untracked td:last-child { color: var(--warn); font-weight: 600; }
</style>
