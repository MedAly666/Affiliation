<script lang="ts">
	import Header from "$lib/components/Header.svelte";
	import FiltersPanel from "$lib/components/FiltersPanel.svelte";
	import ProductCard from "$lib/components/ProductCard.svelte";
	import Footer from "$lib/components/Footer.svelte";
	import { onMount } from "svelte";
	import type { Product } from "$lib/types";
	import { Card, Spinner } from "flowbite-svelte";
    import type { PageProps } from "./$types";

	let { data }: PageProps = $props();

	let products: Product[] = data.products || [];
	let error: string | null = data.error || null;
	let loading: boolean = data.loading || false;

	// Filter and sorting functionality
	let searchQuery = $state("");
	let minPrice = $state(0);
	let maxPrice = $state(100);
	let sortbyValue = $state("discount"); // discount, price-low, price-high, newest
	let favoriteProducts: string[] = $state([]);

	// Load favorites from localStorage on mount
	onMount(() => {
		const storedFavorites = localStorage.getItem("favorites");
		if (storedFavorites) {
			favoriteProducts = JSON.parse(storedFavorites);
		}
	});

	// Computed property for filtered products using the $derived rune instead of $: reactive statement
	let filteredProducts = $derived(
		products
			.filter((product) => {
				// Search filter
				if (
					searchQuery &&
					!product.title
						.toLowerCase()
						.includes(searchQuery.toLowerCase())
				) {
					return false;
				}

				// Price filter
				if (
					product.sale_price < minPrice ||
					product.sale_price > maxPrice
				) {
					return false;
				}

				return true;
			})
	);

	// Pagination for infinite scroll
	let itemsPerPage = $state(25);
	let visibleItems = $derived(filteredProducts.slice(0, itemsPerPage));
	let isLoadingMore = $state(false);

	// Function to load more products
	function loadMoreProducts() {
		if (isLoadingMore || itemsPerPage >= filteredProducts.length) return;

		isLoadingMore = true;
		// Simulate loading delay
		setTimeout(() => {
			itemsPerPage += 25;
			isLoadingMore = false;
		}, 500);
	}

	// Set up intersection observer for infinite scroll
	let loadMoreTrigger: HTMLDivElement | null = $state(null);

	$effect(() => {
		if (!loadMoreTrigger) return;

		const observer = new IntersectionObserver(
			(entries) => {
				const [entry] = entries;
				if (
					entry.isIntersecting &&
					!isLoadingMore &&
					visibleItems.length < filteredProducts.length
				) {
					loadMoreProducts();
				}
			},
			{ rootMargin: "200px" },
		);

		observer.observe(loadMoreTrigger);

		return () => {
			if (loadMoreTrigger) observer.unobserve(loadMoreTrigger);
		};
	});
</script>

<Header />

<main class="container mx-auto px-4 py-8 mt-15">
	<div class="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
		<div class="lg:col-span-1">
			<FiltersPanel
				openFilterPanal={true}
				{minPrice}
				{maxPrice}
				{sortbyValue}
			/>
		</div>
		<div class="lg:col-span-3">
			{#if loading}
				<div
					class="flex justify-center items-center h-64 text-gray-900 dark:text-white"
				>
					<span>Loading products...</span>
				</div>
			{:else if error}
				<div
					class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6"
				>
					<p>Error: {error}</p>
					<p>Please try refreshing the page.</p>
				</div>
			{:else if filteredProducts.length === 0}
				<Card
					class="text-center py-12 w-full text-gray-900 dark:text-white"
				>
					<!--img src="/empty-state.svg" alt="No products found" class="w-32 h-32 mx-auto mb-4 opacity-50" /-->
					<p class="text-xl mb-2">No products found</p>
					<p class="text-gray-500">
						Try adjusting your search or filters
					</p>
				</Card>
			{:else}
				<div
					class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
				>
					{#each visibleItems as product}
						<ProductCard {product} />
					{/each}
					<div
						bind:this={loadMoreTrigger}
						class="col-span-full flex justify-center py-8 {isLoadingMore
							? 'opacity-100'
							: 'opacity-0'}"
					>
						{#if isLoadingMore}
							<Spinner size="8" />
							<span class="ml-3">Loading more products...</span>
						{/if}
					</div>
				</div>
			{/if}
		</div>
	</div>
</main>

<Footer />
