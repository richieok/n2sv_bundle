<script>
	import { browser } from "$app/environment";
	import { goto } from "$app/navigation";

	let { form, data } = $props();

	if ( browser && form?.success){
		console.log(form.message)
		localStorage.setItem("user", JSON.stringify(form.user))
		goto("/dashboard")
	}

	async function handleSubmit(evt) {
		evt.preventDefault(); // Prevent the default form submission
		const formData = new FormData(form);

		const response = await fetch('/api/login', {
			method: 'POST',
			body: formData
		});
		if (response.ok) {
			const data = await response.json();
			console.log('Login successful:', data);
			localStorage.setItem('token', data.token);
			localStorage.setItem('user', JSON.stringify(data.user));
			// Redirect or perform further actions
			window.location.href = '/dashboard'; // Redirect to index.html
		} else {
			const errorData = await response.json();
			console.error('Login failed:', errorData.message);
			message.textContent = errorData.message;
			// alert('Login failed: ' + errorData.message);
		}
	}
</script>

{#if !(form?.success)}
	<div id="message" class="banner-message">{form?.message}</div>
{/if}
<form id="form" method="post" action="?/login">
	<h1>Login</h1>
	<label for="username">Username / Email: </label>
	<input type="text" id="username" name="username" placeholder="Username / Email" value="{form?.username ?? ''}" />
	<br />
	<label for="password" type="password">Password: </label>
	<input type="password" id="password" name="password" placeholder="Password" />
	<br />
	<button type="submit" id="login">Login</button>
</form>
