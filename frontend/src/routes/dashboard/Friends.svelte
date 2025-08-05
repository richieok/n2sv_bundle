<script>
	let { friends = [] } = $props();
</script>

<ul>
	{#each friends as friend}
		<li>{friend.username}</li>
	{/each}
</ul>

<style>
	ul {
		padding-inline-start: 1em;
		list-style-type: none;
		padding: 1em;
        width: 200px;
        border-radius: 1em;
		background: #86959e;
		background: linear-gradient(
			90deg,
			rgba(134, 149, 158, 1) 0%,
			rgba(223, 223, 242, 1) 0%,
			rgba(189, 204, 240, 1) 100%
		);
	}
</style>
