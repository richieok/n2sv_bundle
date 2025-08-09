<script>
    let { logout } = $props()
</script>

<div>
    <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/dashboard">Dashboard</a></li>
        <li><a href="/logout" data-sveltekit-preload-data="tap">logout</a></li>
    </ul>
</div>

<style>
    div {
        color: white;
        display: inline-block;
        padding: 0.5rem 1rem;
        background-color: #333;
    }
    ul {
        padding-inline-start: 0;
        display: flex;
        /* justify-content: space-between; */
        list-style-type: none;
    }
    a {
        color: white;
        text-decoration: none;
        padding: 0.5rem 1rem;
    }
    li {
        text-transform: capitalize;
    }
</style>