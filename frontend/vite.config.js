import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

// In development, you might want to allow specific hosts
// Uncomment the allowedHosts array and add your domains if needed
// This is useful for local development with custom domains or subdomains
// For production, you can leave it empty or comment it out

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		allowedHosts: [
			'devconzero.com.ng', 
			'www.devconzero.com.ng'
		]
	}
});
