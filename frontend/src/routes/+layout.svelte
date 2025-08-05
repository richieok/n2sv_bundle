<script>
    import "../app.css"
    import Nav from "./Nav.svelte";
    import AuthWidget from "./AuthWidget.svelte";
    let { children } = $props();
</script>

<header>
    <Nav/>
    <AuthWidget/>
</header>
<main>{@render children()}</main>

<style>
    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background-color: #333;
        color: white;
    }
    main {
        padding: 1rem;
    }
</style>