<script lang="ts">
  import { problemsOf, type Problem } from '#lib/kb/problems';

  // Every report of one problem, as it was written. For the small groups.
  let { ticket, problem }: { ticket: number; problem: Problem } = $props();

  const rs = $derived(problemsOf(ticket).find((g) => g.problem === problem)?.reports ?? []);
</script>

<table>
  <thead>
    <tr><th>report</th><th>received</th><th>tenant</th><th>channel</th><th>what they wrote</th></tr>
  </thead>
  <tbody>
    {#each rs as r (r.id)}
      <tr>
        <td><code>{r.id}</code></td>
        <td>{r.receivedAt.slice(0, 10)}</td>
        <td>{r.tenant}</td>
        <td>{r.channel}</td>
        <td>{r.body}</td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  td:nth-child(-n + 2) { white-space: nowrap; }
</style>
