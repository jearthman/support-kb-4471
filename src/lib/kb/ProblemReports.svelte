<script lang="ts">
  import { problemsOf, type Problem } from '#lib/kb/problems';

  // Every report in one problem, in the reporter's words. Meant for the small groups.
  let { ticket, problem }: { ticket: number; problem: Problem } = $props();

  const rows = $derived(
    (problemsOf(ticket).find((g) => g.problem === problem)?.reports ?? []).toSorted((a, b) => a.id.localeCompare(b.id)),
  );
</script>

<table>
  <thead><tr><th>report</th><th>received</th><th>tenant</th><th>channel</th><th>what they wrote</th></tr></thead>
  <tbody>
    {#each rows as r (r.id)}
      <tr>
        <td><code>{r.id}</code></td>
        <td>{r.receivedAt.slice(0, 10)}</td>
        <td>{r.tenant}</td>
        <td>{r.channel}</td>
        <td class="body">{r.body}</td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  .body { font-size: 0.9em; }
</style>
