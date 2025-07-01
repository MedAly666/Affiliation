<script lang="ts">
	import "../app.css";

	let { children } = $props();
</script>

<svelte:head>
	<title>Deals Hunter</title>
	<meta
		name="description"
		content="Discover the best deals from AliExpress"
	/>
</svelte:head>
<main>
	{@render children()}
</main>
