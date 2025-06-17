<script lang="ts">
    import { Card, Button, Spinner, Badge, Tabs, TabItem, Input, Range, Modal, Carousel, Controls, Indicators, Thumbnails } from "flowbite-svelte";
    import { ShoppingBagOutline, SearchOutline, HeartOutline, HeartSolid, StarSolid, AdjustmentsVerticalOutline, EyeOutline } from "flowbite-svelte-icons";
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

    // Modal and product details functionality
    let showProductModal = $state(false);
    let selectedProduct = $state<Product | null>(null);
    let productImages = $state<{image_url: string, image_alt: string}[]>([]);
    let productReviews = $state<{rating: number, content: string}[]>([]);
    
    // Function to open product modal
    async function openProductDetails(product: Product) {
        selectedProduct = product;
        showProductModal = true;
        
        try {
            // Use fetch to get data through our API routes instead of direct Supabase client
            // This way we avoid environment variable issues
            const imagesResponse = await fetch(`./api/product-images?productId=${product.product_id}`);
            if (imagesResponse.ok) {
                const images = await imagesResponse.json();
                productImages = images || [];
            } else {
                console.error('Error fetching product images');
                productImages = [{ image_url: product.image, image_alt: product.title }];
            }
            
            // If no images found, use the main product image
            if (productImages.length === 0) {
                productImages = [{ image_url: product.image, image_alt: product.title }];
            }
            
            // Get reviews through API as well
            const reviewsResponse = await fetch(`./api/product-reviews?productId=${product.product_id}`);
            if (reviewsResponse.ok) {
                const reviews = await reviewsResponse.json();
                productReviews = reviews || [];
            } else {
                console.error('Error fetching product reviews');
                productReviews = [];
            }
        } catch (error) {
            console.error('Error loading product details:', error);
            // Fallback with at least the main image
            productImages = [{ image_url: product.image, image_alt: product.title }];
        }
    }
    
    // Function to close product modal
    function closeProductModal() {
        showProductModal = false;
        // Clear the product details after a short delay to avoid UI flicker
        setTimeout(() => {
            selectedProduct = null;
            productImages = [];
            productReviews = [];
        }, 300);
    }
    
    // Helper function to generate star rating display
    function getStarRating(rating: number) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        return { fullStars, hasHalfStar, emptyStars };
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

<main class="container mx-auto px-4 py-8" >
    
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div class="lg:col-span-1 bg-white p-4 rounded-lg shadow-sm border">
            <h2 class="font-bold text-lg mb-4 flex items-center">
                <AdjustmentsVerticalOutline class="w-5 h-5 mr-2" />
                Filters
            </h2>
            
            <div class="mb-4">
                <label id="price-range-label" for="min-price-range" class="block text-sm font-medium mb-2">Price Range (€)</label>
                <div class="flex items-center mb-2">
                    <span class="w-12 text-sm">{minPrice}€</span>
                    <Range id="min-price-range" class="mx-2" min="0" max="100" bind:value={minPrice} aria-labelledby="price-range-label" />
                    <span class="w-12 text-sm">{maxPrice}€</span>
                </div>
                <Range id="max-price-range" class="mb-4" min="0" max="100" bind:value={maxPrice} aria-labelledby="price-range-label" />
            </div>
            
            <div class="mb-4">
                <fieldset>
                    <legend class="block text-sm font-medium mb-2">Sort By</legend>
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
                </fieldset>
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
                                        <Badge color="red" size="large" class="rounded-r-full rounded-l-none pl-2 pr-3 py-1.5 font-bold">
                                            -{getDiscountPercentage(product.original_price, product.price)}%
                                        </Badge>
                                    </div>
                                {/if}
                            </div>

                            <div class="flex-grow p-4">
                                <h5 dir="rtl" class="text-lg font-semibold line-clamp-3 mb-3 group-hover:text-purple-700 transition-colors ">
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
                                    class="w-full"
                                    color="purple"
                                    onclick={() => openProductDetails(product)}
                                >
                                    <EyeOutline class="mr-2 h-5 w-5" />
                                    View Product
                                </Button>
                                <div class="mt-2">
                                    <Button
                                        href={product.url}
                                        target="_blank"
                                        class="w-full"
                                        color="light"
                                        size="sm"
                                    >
                                        <ShoppingBagOutline class="mr-2 h-4 w-4" />
                                        Buy on AliExpress
                                    </Button>
                                </div>
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
                        <Button color="light" onclick={loadMoreProducts}>
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

<!-- Product Details Modal -->
<Modal 
    bind:open={showProductModal} 
    size="xl" 
    autoclose={false}
    onclose={closeProductModal}
>
    {#if selectedProduct}
        <div class="relative">
            
            <!-- Product title -->
            <h3 dir="rtl" class="text-xl md:text-2xl font-bold text-gray-900 mb-4 pr-10 ">
                {selectedProduct.title}
            </h3>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Left column: Images carousel -->
                <div class="bg-white rounded-lg overflow-hidden">
                    {#if productImages.length > 0}
                        <Carousel
                            class="rounded-lg h-[300px] md:h-[400px]"
                            imgClass="object-contain h-full w-fit rounded-xs"
                            images={productImages.map(img => ({
                                src: img.image_url.replace('jpg_220x220q75.jpg','jpg_960x960q75.jpg'),
                                alt: img.image_alt || selectedProduct?.title
                            }))}
                            duration={0}
                        >
                            <Controls class="bg-gray-100 text-gray-500" />
                            {#if productImages.length > 1}
                                <Indicators />
                            {/if}
                            {#if productImages.length > 1}
                                <Thumbnails 
                                    index={0}
                                    images={productImages.map(img => ({
                                        src: img.image_url.replace('jpg_960x960q75.jpg','jpg_220x220q75.jpg'),
                                        alt: img.image_alt || selectedProduct?.title
                                    }))}

                                />                                
                            {/if}
                        </Carousel>
                    {:else}
                        <div class="h-[300px] md:h-[400px] flex items-center justify-center bg-gray-100">
                            <Spinner size="10" />
                            <p class="ml-3">Loading images...</p>
                        </div>
                    {/if}
                    
                    <!-- Price information -->
                    <div class="p-4 border-t flex items-baseline justify-between">
                        <div>
                            <span class="text-2xl font-bold text-purple-700">
                                €{selectedProduct.price.toFixed(2)}
                            </span>
                            {#if selectedProduct.original_price > selectedProduct.price}
                                <span class="ml-2 text-sm line-through text-gray-500">
                                    €{selectedProduct.original_price.toFixed(2)}
                                </span>
                                <Badge color="red" class="ml-2">
                                    -{getDiscountPercentage(selectedProduct.original_price, selectedProduct.price)}%
                                </Badge>
                            {/if}
                        </div>
                        <Button
                            href={selectedProduct.url}
                            target="_blank"
                            color="purple"
                            size="sm"
                        >
                            <ShoppingBagOutline class="mr-2 h-4 w-4" />
                            Buy Now
                        </Button>
                    </div>
                </div>
                
                <!-- Right column: Reviews -->
                <div class="bg-white rounded-lg p-4 border">
                    <h4 class="font-bold text-lg mb-4">Customer Reviews</h4>
                    
                    {#if productReviews.length === 0}
                        <div class="py-8 text-center text-gray-500">
                            <p>No reviews available for this product yet.</p>
                        </div>
                    {:else}
                        <div class="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                            {#each productReviews as review}
                                <div class="border-b pb-4">
                                    <div class="flex items-center mb-2">
                                        {#each Array(5) as _, i}
                                            <StarSolid class="w-4 h-4 {i < review.rating ? 'text-amber-400' : 'text-gray-300'}" />
                                        {/each}
                                        <span class="ml-2 text-sm font-medium">{review.rating}/5</span>
                                    </div>
                                    <p class="text-gray-700">{review.content}</p>
                                </div>
                            {/each}
                        </div>
                    {/if}
                </div>
            </div>
        </div>
    {:else}
        <div class="p-8 text-center">
            <Spinner size="10" />
            <p class="mt-4">Loading product details...</p>
        </div>
    {/if}
</Modal>

<footer class="bg-gray-800 text-white py-8 mt-12">
    <div class="container mx-auto px-4 text-center">
        <p>© {new Date().getFullYear()} Deals Hunter. Not affiliated with AliExpress or Alibaba Group.</p>
        <p class="text-gray-400 text-sm mt-2">Products and prices are updated daily. All deals are subject to availability.</p>
    </div>
</footer>

<style>    
    /* Modal and carousel styles */
    :global(.carousel-container) {
        height: 100%;
    }
    
    :global(.carousel-item) {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    :global(.carousel img) {
        max-height: 100%;
        max-width: 100%;
        object-fit: contain;
    }
    
    :global(.carousel-indicators) {
        bottom: 0.5rem;
    }
    
    :global(.carousel-control-prev),
    :global(.carousel-control-next) {
        width: 3rem;
        height: 3rem;
        top: 50%;
        transform: translateY(-50%);
        background-color: rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        opacity: 0.8;
    }
    
    :global(.carousel-control-prev:hover),
    :global(.carousel-control-next:hover) {
        opacity: 1;
        background-color: rgba(255, 255, 255, 0.8);
    }
</style>
