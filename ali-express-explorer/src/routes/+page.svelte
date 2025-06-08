<script lang="ts">
    import { Card, Button, Spinner } from "flowbite-svelte";
    import { ShoppingBagOutline } from "flowbite-svelte-icons";
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
</script>

<svelte:head>
    <title>AliExpress Deals Explorer</title>
</svelte:head>

<main class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8 text-center">AliExpress Best Deals</h1>

    {#if loading}
        <div class="flex justify-center items-center h-64">
            <Spinner size="12" />
            <p class="ml-4">Loading products...</p>
        </div>
    {:else if error}
        <div
            class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6"
        >
            <p>Error: {error}</p>
            <p>Please try refreshing the page.</p>
        </div>
    {:else if products.length === 0}
        <div class="text-center py-12">
            <p class="text-xl">No products found</p>
        </div>
    {:else}
        <div
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
            {#each products as product}
                <Card class="h-full flex flex-col p-sm">
                    <div class="relative">
                        <img
                            src={product.image}
                            alt={product.title}
                            class="w-full h-48 object-contain"
                        />
                        {#if getDiscountPercentage(product.original_price, product.price) > 0}
                            <span
                                class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold"
                            >
                                -{getDiscountPercentage(
                                    product.original_price,
                                    product.price,
                                )}%
                            </span>
                        {/if}
                    </div>

                    <div class="flex-grow p-3">
                        <h5 class="text-lg font-semibold line-clamp-2 mb-2">
                            {product.title}
                        </h5>

                        <div class="flex items-baseline mt-auto">
                            <span class="text-xl font-bold"
                                >€{product.price.toFixed(2)}</span
                            >
                            {#if product.original_price > product.price}
                                <span
                                    class="ml-2 text-sm line-through text-gray-500"
                                    >€{product.original_price.toFixed(2)}</span
                                >
                            {/if}
                        </div>
                    </div>

                    <div class="p-3 pt-0">
                        <Button
                            href={product.url}
                            target="_blank"
                            class="w-full"
                        >
                            <ShoppingBagOutline class="mr-2 h-5 w-5" />
                            View Deal
                        </Button>
                    </div>
                </Card>
            {/each}
        </div>
    {/if}
</main>

<style>
    .line-clamp-2 {
        display: -webkit-box;
        line-clamp: 2;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
</style>
