<script lang="ts">
	import Header from "$lib/components/Header.svelte";
	import FiltersPanel from "$lib/components/FiltersPanel.svelte";
	import ProductCard from "$lib/components/ProductCard.svelte";
	import Footer from "$lib/components/Footer.svelte";
	import { onMount } from "svelte";
	import type { Product } from "$lib/types";
	import { Card, Spinner } from "flowbite-svelte";
	import type { PageProps } from "./$types";
	import Search from "$lib/components/Search.svelte";
    import InfinitScrollContainer from "$lib/components/InfinitScrollContainer.svelte";

	let { data }: PageProps = $props();

	console.log(data);

	let products: Product[] = [];
	// Filter and sorting functionality
	let keywords = $state("");
	let min_sale_price = $state(0);
	let max_sale_price = $state(100);
	let sort = $state("discount"); // discount, price-low, price-high, newest
	let openFilterPanal = $state(false);
</script>

<Header />

<div class="flex flex-col lg:flex-row mt-15 min-h-screen" dir="rtl">
	<aside
		class="w-full lg:w-sm lg:h-screen p-4 lg:border-r-2 border-gray-200 dark:border-gray-700 flex flex-col bg-gray-50 dark:bg-gray-900"
	>
		<form
			class="flex flex-col items-center overflow-x-hidden"
			action="?/search"
			method="POST"
		>
			<Search {keywords} />
			<FiltersPanel
				{openFilterPanal}
				{max_sale_price}
				{min_sale_price}
				{sort}
			/>
		</form>
	</aside>

	<main class="flex-1 h-screen overflow-y-auto p-4">
		<header class="mb-6 border-r-4 border-primary-500 px-4">
			<h1 class="text-2xl font-bold text-gray-900 dark:text-white">
				نتائج البحث
			</h1>
			{#if products.length > 0}
				<span class="font-normal text-gray-600 dark:text-gray-400">
					تم العثور على {products.length} منتج
				</span>
			{/if}
		</header>

		{#if products.length > 0}
			<div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
				<InfinitScrollContainer onScroll={handleInfiniteScroll}>
					{#snippet content()}
						{#each products as product}
							<ProductCard {product} />
						{/each}
					{/snippet}
				</InfinitScrollContainer>
			</div>
		{:else}
			<div class="text-center py-12">
				<div class="text-gray-400 text-6xl mb-4">🔍</div>
				<h2
					class="text-xl font-semibold text-gray-900 dark:text-white mb-2"
				>
					لم يتم العثور على أي منتج
				</h2>
				<p class="text-gray-600 dark:text-gray-400 mb-6">
					حاول تعديل كلمات البحث أو استخدام فلاتر أخرى
				</p>
				<button
					type="button"
					class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
					onclick={() => {
						keywords = "";
					}}
				>
					تصفح المنتجات الرائجة 🔥
				</button>
			</div>
		{/if}
	</main>
</div>
<Footer />
