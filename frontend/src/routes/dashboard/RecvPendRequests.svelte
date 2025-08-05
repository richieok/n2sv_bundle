<script>
	let { requests = [], acceptReq, rejectReq } = $props();
</script>

<ul>
	{#each requests as request}
		<li>
			{request.requester.username}
			<button onclick={() => acceptReq(request._id)}>Accept</button>
			<button onclick={() => rejectReq(request._id)}>Reject</button>
		</li>
	{/each}
</ul>

<style>
	ul {
		/* padding-inline-start: 0; */
		list-style-type: none;
		padding: 1em;
        width: 200px;
        border-radius: 1em;
		background: #86959e;
	}
</style>