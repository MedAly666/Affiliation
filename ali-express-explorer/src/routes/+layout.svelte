<script lang="ts">
    import Footer from "$lib/components/Footer.svelte";
    import Header from "$lib/components/Header.svelte";
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
<Header />
<main class="w-screen">
	{@render children()}
</main>
<Footer />
