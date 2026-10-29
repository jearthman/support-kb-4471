<script lang="ts">
  import { problemsOf, type Problem } from '#lib/kb/problems';

  // A count inside a sentence, computed like the table: <ProblemCount ticket={4471} problem="hint" />
  let { ticket, problem }: { ticket: number; problem: Problem } = $props();

  const n = $derived(problemsOf(ticket).find((g) => g.problem === problem)?.reports.length ?? 0);
</script>

<strong>{n}</strong>
