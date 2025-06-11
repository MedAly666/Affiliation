<script lang="ts">
    import { Card, Button, Spinner, Badge, Tabs, TabItem, Input, Range } from "flowbite-svelte";
    import { ShoppingBagOutline, SearchOutline, HeartOutline, HeartSolid, StarSolid, AdjustmentsVerticalOutline } from "flowbite-svelte-icons";
    import type { PageProps } from "./$types";
    import type { Product } from '$lib/index.js';

    let { data }: PageProps = $props();
    let products: Product[] = data.products || [];
    let error: string | null = data.error || null;

    let loading = false;
    // Calculate discount percentage
    const getDiscountPercentage = (
        originalPrice: number,
        currentPrice: number,
    ) => {
        if (!originalPrice || originalPrice <= currentPrice) return 0;
        return Math.round(
            ((originalPrice - currentPrice) / originalPrice) * 100,
        );
    };

    // Filter and sorting functionality
    let searchQuery = $state("");
    let minPrice = $state(0);
    let maxPrice = $state(100);
    let sortOption = $state("discount"); // discount, price-low, price-high, newest
    let favoriteProducts: string[] = $state([]);

    // Handle favorites
    function toggleFavorite(urlHash: string) {
        if (favoriteProducts.includes(urlHash)) {
            favoriteProducts = favoriteProducts.filter(id => id !== urlHash);
        } else {
            favoriteProducts = [...favoriteProducts, urlHash];
        }
        // Store in localStorage for persistence
        localStorage.setItem('favorites', JSON.stringify(favoriteProducts));
    }

    // Load favorites from localStorage on mount
    import { onMount } from 'svelte';
    onMount(() => {
        const storedFavorites = localStorage.getItem('favorites');
        if (storedFavorites) {
            favoriteProducts = JSON.parse(storedFavorites);
        }
    });

    // Computed property for filtered products using the $derived rune instead of $: reactive statement
    let filteredProducts = $derived(products.filter(product => {
        // Search filter
        if (searchQuery && !product.title.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }
        
        // Price filter
        if (product.price < minPrice || product.price > maxPrice) {
            return false;
        }
        
        
        return true;
    }).sort((a, b) => {
        // Sorting
        switch (sortOption) {
            case "price-low":
                return a.price - b.price;
            case "price-high":
                return b.price - a.price;
            case "newest":
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            case "discount":
            default:
                return getDiscountPercentage(b.original_price, b.price) - getDiscountPercentage(a.original_price, a.price);
        }
    }));

    // Pagination for infinite scroll
    let itemsPerPage = $state(20);
    let visibleItems = $derived(filteredProducts.slice(0, itemsPerPage));
    let isLoadingMore = $state(false);

    // Function to load more products
    function loadMoreProducts() {
        if (isLoadingMore || itemsPerPage >= filteredProducts.length) return;
        
        isLoadingMore = true;
        // Simulate loading delay
        setTimeout(() => {
            itemsPerPage += 12;
            isLoadingMore = false;
        }, 500);
    }

    // Set up intersection observer for infinite scroll
    let loadMoreTrigger: HTMLDivElement | null = $state(null);
    
    $effect(() => {
        if (!loadMoreTrigger) return;
        
        const observer = new IntersectionObserver(entries => {
            const [entry] = entries;
            if (entry.isIntersecting && !isLoadingMore && visibleItems.length < filteredProducts.length) {
                loadMoreProducts();
            }
        }, { rootMargin: '200px' });
        
        observer.observe(loadMoreTrigger);
        
        return () => {
            if (loadMoreTrigger) observer.unobserve(loadMoreTrigger);
        };
    });
</script>

<svelte:head>
    <title>Deals Hunter</title>
    <meta name="description" content="Discover the best deals from AliExpress" />
</svelte:head>

<header class="bg-gradient-to-r from-purple-600 to-blue-500 text-white py-8 px-4 shadow-md">
    <div class="container mx-auto">
        <h1 class="text-4xl font-bold mb-2 text-center">Deals Hunter</h1>
        <p class="text-center text-white/80 mb-6">Discover amazing deals updated daily</p>
        
        <div class="relative max-w-xl mx-auto">
            <Input
                class="pl-10"
                size="lg"
                placeholder="Search for products..."
                bind:value={searchQuery}
            />
            <SearchOutline class="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
        </div>
    </div>
</header>

<main class="container mx-auto px-4 py-8">
    
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div class="lg:col-span-1 bg-white p-4 rounded-lg shadow-sm border">
            <h2 class="font-bold text-lg mb-4 flex items-center">
                <AdjustmentsVerticalOutline class="w-5 h-5 mr-2" />
                Filters
            </h2>
            
            <div class="mb-4">
                <label class="block text-sm font-medium mb-2">Price Range (€)</label>
                <div class="flex items-center mb-2">
                    <span class="w-12 text-sm">{minPrice}€</span>
                    <Range class="mx-2" min="0" max="100" bind:value={minPrice} />
                    <span class="w-12 text-sm">{maxPrice}€</span>
                </div>
                <Range class="mb-4" min="0" max="100" bind:value={maxPrice} />
            </div>
            
            <div class="mb-4">
                <label class="block text-sm font-medium mb-2">Sort By</label>
                <div class="grid grid-cols-2 gap-2">
                    <Button size="xs" color={sortOption === "discount" ? "purple" : "light"} onclick={() => sortOption = "discount"}>
                        Biggest Discount
                    </Button>
                    <Button size="xs" color={sortOption === "price-low" ? "purple" : "light"} onclick={() => sortOption = "price-low"}>
                        Price: Low to High
                    </Button>
                    <Button size="xs" color={sortOption === "price-high" ? "purple" : "light"} onclick={() => sortOption = "price-high"}>
                        Price: High to Low
                    </Button>
                    <Button size="xs" color={sortOption === "newest" ? "purple" : "light"} onclick={() => sortOption = "newest"}>
                        Newest First
                    </Button>
                </div>
            </div>
            
            <div class="mt-6 text-center text-sm text-gray-500">
                {filteredProducts.length} products found
            </div>
        </div>
        
        <div class="lg:col-span-3">
            {#if loading}
                <div class="flex justify-center items-center h-64">
                    <Spinner size="12" />
                    <p class="ml-4">Loading products...</p>
                </div>
            {:else if error}
                <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    <p>Error: {error}</p>
                    <p>Please try refreshing the page.</p>
                </div>
            {:else if filteredProducts.length === 0}
                <div class="text-center py-12 bg-gray-50 rounded-lg">
                    <img src="/empty-state.svg" alt="No products found" class="w-32 h-32 mx-auto mb-4 opacity-50" />
                    <p class="text-xl mb-2">No products found</p>
                    <p class="text-gray-500">Try adjusting your search or filters</p>
                </div>
            {:else}
                <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {#each visibleItems as product}
                        <Card class="h-full flex flex-col p-0 hover:shadow-lg transition-shadow overflow-hidden group">
                            <div class="relative overflow-hidden">
                                <img
                                    src={product.image}
                                    alt={product.title}
                                    class="w-full h-48 object-contain p-2 group-hover:scale-105 transition-transform"
                                />
                                <button 
                                    class="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                                    onclick={() => toggleFavorite(product.url_hash)}
                                    aria-label={favoriteProducts.includes(product.url_hash) ? "Remove from favorites" : "Add to favorites"}
                                >
                                    {#if favoriteProducts.includes(product.url_hash)}
                                        <HeartSolid class="w-5 h-5 text-red-500" />
                                    {:else}
                                        <HeartOutline class="w-5 h-5 text-gray-700" />
                                    {/if}
                                </button>
                                
                                {#if getDiscountPercentage(product.original_price, product.price) > 0}
                                    <div class="absolute left-0 top-3">
                                        <Badge color="red" size="xl" class="rounded-r-full rounded-l-none pl-2 pr-3 py-1.5 font-bold">
                                            -{getDiscountPercentage(product.original_price, product.price)}%
                                        </Badge>
                                    </div>
                                {/if}
                            </div>

                            <div class="flex-grow p-4">
                                <h5 class="text-lg font-semibold line-clamp-3 mb-3 group-hover:text-purple-700 transition-colors">
                                    {product.title}
                                </h5>

                                <div class="flex items-baseline">
                                    <span class="text-2xl font-bold text-purple-700">€{product.price.toFixed(2)}</span>
                                    {#if product.original_price > product.price}
                                        <span class="ml-2 text-sm line-through text-gray-500">
                                            €{product.original_price.toFixed(2)}
                                        </span>
                                    {/if}
                                </div>
                                
                                <div class="mt-2 flex items-center text-amber-400">
                                    <StarSolid class="w-4 h-4" />
                                    <StarSolid class="w-4 h-4" />
                                    <StarSolid class="w-4 h-4" />
                                    <StarSolid class="w-4 h-4" />
                                    <StarSolid class="w-4 h-4 text-gray-300" />
                                    <span class="text-xs text-gray-500 ml-1">(105)</span>
                                </div>
                            </div>

                            <div class="p-4 pt-0">
                                <Button
                                    href={product.url}
                                    target="_blank"
                                    class="w-full"
                                    color="purple"
                                >
                                    <ShoppingBagOutline class="mr-2 h-5 w-5" />
                                    View Deal
                                </Button>
                            </div>
                        </Card>
                    {/each}
                    
                    <!-- Infinite scroll loading trigger -->
                    <div 
                        bind:this={loadMoreTrigger} 
                        class="col-span-full flex justify-center py-8 {isLoadingMore ? 'opacity-100' : 'opacity-0'}"
                    >
                        {#if isLoadingMore}
                            <Spinner size="8" />
                            <span class="ml-3">Loading more products...</span>
                        {/if}
                    </div>
                </div>
                
                <!-- Show load more button if there are more products to load -->
                {#if !isLoadingMore && visibleItems.length < filteredProducts.length}
                    <div class="text-center mt-8">
                        <Button color="light" on:click={loadMoreProducts}>
                            Load More Products
                        </Button>
                        <p class="text-sm text-gray-500 mt-2">
                            Showing {visibleItems.length} of {filteredProducts.length} products
                        </p>
                    </div>
                {/if}
            {/if}
        </div>
    </div>
</main>

<footer class="bg-gray-800 text-white py-8 mt-12">
    <div class="container mx-auto px-4 text-center">
        <p>© {new Date().getFullYear()} Deals Hunter. Not affiliated with AliExpress or Alibaba Group.</p>
        <p class="text-gray-400 text-sm mt-2">Products and prices are updated daily. All deals are subject to availability.</p>
    </div>
</footer>

<style>
    .line-clamp-2 {
        display: -webkit-box;
        line-clamp: 2;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
</style>
