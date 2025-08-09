<script>
	let { friends = [], selectFriend } = $props();
</script>

<ul onpointerdown="{selectFriend}">
	{#each friends as friend}
		<li><button data-btn-name={friend.username}>{friend.username}</button></li>
	{/each}
</ul>

<style>
	ul {
		display: flex;
		flex-direction: column;
		padding-inline-start: 1em;
		list-style-type: none;
		padding: 1em;
        width: 200px;
        border-radius: .3em;
		background: #86959e;
		background: linear-gradient(
			90deg,
			rgba(134, 149, 158, 1) 0%,
			rgba(223, 223, 242, 1) 0%,
			rgba(189, 204, 240, 1) 100%
		);
	}
	button {
		width: 100%;
		text-align: left;
	}
</style>
