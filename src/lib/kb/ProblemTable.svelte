<script lang="ts">
  import { mergedInto, problemsOf, type Problem } from '#lib/kb/problems';

  // issues: where each problem is tracked now. A problem with no entry shows as untracked.
  let { ticket, issues = {} }: { ticket: number; issues?: Partial<Record<Problem, string>> } = $props();

  const merged = $derived(mergedInto(ticket));
  const groups = $derived(problemsOf(ticket));
  const issueLabel = (url: string) => url.replace(/^https:\/\/github\.com\//, '').replace('/issues/', '#');
</script>

<p class="sum">
  <strong>{merged.length}</strong> reports merged into #{ticket} ·
  <strong>{groups.length}</strong>
  {groups.length === 1 ? 'problem' : 'problems'}
</p>

<table>
  <thead>
    <tr><th>problem</th><th>reports</th><th>tenants</th><th>seen</th><th>intake tagged otherwise</th><th>ticket</th></tr>
  </thead>
  <tbody>
    {#each groups as g (g.problem)}
      <tr class:untracked={!issues[g.problem]}>
        <td><code>{g.problem}</code></td>
        <td>{g.reports.length}</td>
        <td>{g.tenants.length <= 4 ? g.tenants.join(', ') : g.tenants.length}</td>
        <td>{g.firstSeen} → {g.lastSeen}</td>
        <td>{g.taggedOtherwise}</td>
        <td>
          {#if issues[g.problem]}<a href={issues[g.problem]}>{issueLabel(issues[g.problem]!)}</a>{:else}no ticket yet{/if}
        </td>
      </tr>
    {/each}
  </tbody>
</table>

{#each groups as g (g.problem)}
  {#if g.oneDay}
    <p class="note">
      {g.oneDay} of the <code>{g.problem}</code> reports read as a one-day move: counted under
      <code>{g.problem}</code> by tenant, the way the desk counts them, and tracked on their own as <code>one-day</code>.
    </p>
  {/if}
{/each}

<style>
  .note { color: var(--muted); font-size: 0.85em; }
  .sum { font-size: 1.1rem; }
  .untracked td { background: var(--warn-bg); }
  .untracked td:last-child { color: var(--warn); font-weight: 600; }
</style>
