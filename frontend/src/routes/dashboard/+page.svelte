<script>
	import { onMount } from 'svelte';

    

	onMount(async () => {
		// Additional setup can be done here if needed
		console.log('Dashboard component mounted');
		let token = localStorage.getItem('token');
		if (!token) {
			console.log('No token found, redirecting to login page.');
			localStorage.clear();
			window.location.href = '/';
			return;
		}
		try {
			const user = JSON.parse(localStorage.getItem('user'));
            
		} catch (error) {
			console.error(error);
			// window.location.href = '/';
		}
	});
</script>

<h1>Dashboard</h1>