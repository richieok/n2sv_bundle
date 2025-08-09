<script>
    let { children } = $props()
</script>

<div>
    {@render children()}
</div>

<style>
    div {
        display: grid;
        grid-template-columns: auto 1fr;
        height: 300px;
    }
</style>