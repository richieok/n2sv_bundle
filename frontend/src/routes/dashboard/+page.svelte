<script>
	import { io } from 'socket.io-client';
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import RecvPending from './RecvPendRequests.svelte';
	import SentPendRequests from './SentPendRequests.svelte';
	import Friends from './Friends.svelte';
	import Test from './Test.svelte';
	import MessageUI from './MessageUI.svelte';

	let { data } = $props();

	if (browser) {
		console.log('browser app env');
		console.log(data.user);
		sessionStorage.setItem('tokenX', data.tokenX);
		localStorage.setItem('user', JSON.stringify(data?.user));
	}

	let username = $state('');
	let selectedFriend;
	let friendUname;
	let ioMessage;

	let socket;
	let chatMessages = $state([]);

	let friends = $state([]);
	let pendingRequests = $state([]);
	let pendingSentRequests = $state([]);

	async function loadDashboard(token) {
		{
			//Received Pending Friend Requests
			const response = await fetch(`/api/pending-friend-requests`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`
				}
			});
			let data = await response.json();
			if (!response.ok) {
				if (response.status.toString()[0] === '4') {
					throw new Error(`${data.error}`);
				} else if (response.status.toString()[0] === '5') {
					console.error('Server error:', data.error);
					return;
				}
			}
			// console.log(data);
			data.requests.forEach((request) => {
				pendingRequests.push(request);
			});
		}
		{
			const response = await fetch(`api/pending-friend-requests?type=sent`, {
				headers: {
					Authorization: `Bearer ${token}`
				}
			});
			let data = await response.json();
			if (!response.ok) {
				if (response.status.toString()[0] === '4') {
					throw new Error(`${data.error}`);
				} else if (response.status.toString()[0] === '5') {
					console.error('Server error:', data.error);
					return;
				}
			}
			data.requests.forEach((request) => {
				pendingSentRequests.push(request);
			});
		}
		await getFriends(token);
	}

	onMount(async () => {
		// socket = io({
		// 	path: '/api/socketio//',
		// 	autoConnect: false
		// });
		console.log('onMount ---< ');
		// console.log(data.user)
		// console.log(data.tokenX)

		// let t = sessionStorage.getItem("tokenX")
		try {
			await loadDashboard(data.tokenX);
			socket = io({
				path: '/api/socketio/'
			});
			socket.on("disconnect", ()=>{
				console.log("Diconnected!")
			})
			// socket.auth = { username: data.user.username };
			// socket.connect();
			// socket.on('connect_error', (err) => {
			// 	if (err.message === 'invalid username') {
			// 		console.log(err.message);
			// 		return () => {
			// 			socket.off('connect_error');
			// 		};
			// 	}
			// });
			// socket.on('user connected', (user) => {
			// 	console.log(user);
			// });
			// socket.on('chat message', (msg) => {
			// 	chatMessages.push(msg);
			// });
		} catch (error) {
			if (error.message === 'Invalid token') {
				// window.location.href = '/';
				return;
			}
			console.log(error);
		}

		// try {
		// 	const user = JSON.parse(localStorage.getItem('user'));
		// 	username = user.username;

		// } catch (error) {
		// 	console.error(error);
		// 	if (error.message === 'Invalid token') {
		// 		localStorage.clear();
		// 		// window.location.href = '/';
		// 		return;
		// 	}
		// }
	});

	async function getFriends(token) {
		const response = await fetch(`/api/friends`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});
		const data = await response.json();
		if (!response.ok) {
			if (response.status.toString()[0] === '4') {
				throw new Error(`${data.error}`);
			} else if (response.status.toString()[0] === '5') {
				console.error('Server error:', data.error);
				return;
			}
		}
		// console.log(data.friends);
		data.friends.forEach((friend) => {
			friends.push(friend);
		});
	}

	async function sendFriendRequest() {
		console.log(friendUname.value);
		if (!friendUname) {
			return;
		}
		try {
			const response = await fetch(`/api/send-friend-request?friendUsername=${friendUname.value}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`
				}
			});
			if (response.ok) {
				const data = await response.json();
				console.log(data.message);
				friendUname.value = '';
				// Optionally, you can update the UI or state to reflect the new friend request
			} else {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Error sending friend request');
			}
		} catch (error) {
			if (error.message === 'Friend request already sent') {
				console.error(error.message);
				friendUname.value = '';
			} else {
				console.error(error.message);
			}
		}
	}

	function acceptRequest(id) {
		console.log('Accepting request with ID:', id);
		fetch(`/api/accept-friend-request/?friendshipId=${id}`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`,
				'Content-Type': 'application/json'
			}
		})
			.then((response) => response.json())
			.then((data) => {
				console.log('Request accepted:', data);
				pendingRequests = pendingRequests.filter((request) => request._id !== id);
			})
			.catch((error) => {
				if (error.message === 'Error accepting friend request') {
					console.error(error.message);
				} else {
					console.error('Unexpected error:', error);
				}
			});
	}

	function rejectRequest(id) {
		console.log('Rejecting request with ID:', id);
	}

	function cancelRequest(id) {
		console.log('Cancel request with ID: ', id);
	}

	function testClick(evt) {
		console.log(evt.target.dataset.action);
	}

	function ioSubmit(evt) {
		evt.preventDefault();
		if (ioMessage.value === "") return;
		socket.emit('chat message', ioMessage.value);
		// if (!selectedFriend) return;
		// socket.emit('private message', {
		// 	content: ioMessage.value,
		// 	to: 'd'
		// });
		ioMessage.value = '';
	}

	function selectFriend(evt) {
		console.log(evt.target.dataset.btnName);
		if (!evt.target.dataset.btnName) return;
		selectedFriend = evt.target.dataset.btnName;
	}
</script>

<h1>{data?.user.username}</h1>
<div>
	<form
		onsubmit={(evt) => {
			sendFriendRequest();
			evt.preventDefault();
		}}
	>
		<p><b>Add a friend</b></p>
		<label for="friendUsername">Friend's Username:</label>
		<input type="text" bind:this={friendUname} name="friendUsername" required />
		<button type="submit">Add Friend</button>
	</form>
</div>
<div>
	<h3>Pending Received Friend Requests</h3>
	<RecvPending acceptReq={acceptRequest} rejectReq={rejectRequest} requests={pendingRequests} />
	<h3>Pending Sent Friend Requests</h3>
	<SentPendRequests onClick={cancelRequest} requests={pendingSentRequests} />
	<Test action="pewpew" onClick={testClick}></Test>
</div>
<MessageUI>
	<div>
		<h3>Friends</h3>
		<Friends {friends} {selectFriend} />
	</div>
	<div>
		{#if chatMessages.length}
			<ul>
				{#each chatMessages as msg}
					<li>{msg}</li>
				{/each}
			</ul>
		{/if}
	</div>
</MessageUI>
<form onsubmit={ioSubmit}>
	<input type="text" bind:this={ioMessage} />
	<button type="submit">Send</button>
</form>

<style>
	h1 {
		text-transform: capitalize;
	}
	ul {
		padding-inline-start: 1em;
		list-style-type: none;
	}
</style>
