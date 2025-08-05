<script>
	let { requests = [], name = '', onClick } = $props();
</script>

<h3>{name}</h3>
<ul>
	{#each requests as request}
		<li>
			{request.recipient.username}
			<button onclick={() => onClick(request._id)}>Cancel</button>
		</li>
	{/each}
</ul>

<style>
	ul {
		/* padding-inline-start: 1em; */
		list-style-type: none;
	}
</style>
