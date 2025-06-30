<script lang="ts">
    import { onMount } from "svelte";
    import { Card, Button, Badge, Rating } from "flowbite-svelte";
    import {
        HeartOutline,
        HeartSolid,
        EyeOutline,
        ShoppingBagOutline,
    } from "flowbite-svelte-icons";
    import type { Product, Review } from "$lib/index.js";
    import { on } from "svelte/events";


    let { product, isFavorite, onToggleFavorite, onView, getDiscountPercentage } = $props();
    

    let reviews: Review[] = $state([]);
    let avgRating: number = $state(0);

    onMount(async () => {

        const res = await fetch("/api/product-reviews?productId=" + product.product_id);
        reviews = await res.json();

        avgRating = reviews.reduce((sum: number, review: Review) => sum + review.rating, 0) / (reviews.length || 1);
    });
    //let avgRating: number = $derived.by(() => reviews.reduce((sum: number, review: Review) => sum + review.rating, 0) / (reviews.length || 1));

    
</script>

<Card
    class="h-full flex flex-col p-0 hover:shadow-lg transition-shadow overflow-hidden group"
>
    <div class="relative overflow-hidden">
        <img
            src={product.image}
            alt={product.title}
            class="w-full h-48 object-contain p-2 group-hover:scale-105 transition-transform"
        />
        <button
            class="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
            onclick={() => onToggleFavorite(product.url_hash)}
            aria-label={isFavorite
                ? "Remove from favorites"
                : "Add to favorites"}
        >
            {#if isFavorite}
                <HeartSolid class="w-5 h-5 text-red-500" />
            {:else}
                <HeartOutline class="w-5 h-5 text-gray-700" />
            {/if}
        </button>
        {#if getDiscountPercentage(product.original_price, product.price) > 0}
            <div class="absolute left-0 top-3">
                <Badge
                    color="red"
                    size="large"
                    class="rounded-r-full rounded-l-none pl-2 pr-3 py-1.5 font-bold"
                >
                    -{getDiscountPercentage(
                        product.original_price,
                        product.price,
                    )}%
                </Badge>
            </div>
        {/if}
    </div>
    <div class="flex-grow p-4">
        <h5
            dir="rtl"
            class="text-lg font-semibold line-clamp-3 mb-3 group-hover:text-purple-700 transition-colors"
        >
            {product.title}
        </h5>
        <div class="flex items-baseline">
            <span class="text-2xl font-bold text-purple-700"
                >€{product.price.toFixed(2)}</span
            >
            {#if product.original_price > product.price}
                <span class="ml-2 text-sm line-through text-gray-500"
                    >€{product.original_price.toFixed(2)}</span
                >
            {/if}
        </div>
        <div class="mt-2 flex items-center">
            <Rating id={`product-rating-${product.product_id}`} total={5} rating={product.avg_rating} size={20}>
                {#snippet text()}
                    <span class="ml-2 text-sm text-gray-600">{product.avg_rating.toFixed(1)} ({product.nb_reviews} reviews)</span>
                {/snippet}
            </Rating>
        </div>
    </div>
    <div class="p-4 pt-0">
        <Button class="w-full" color="purple" onclick={() => onView(product)}>
            <EyeOutline class="mr-2 h-5 w-5" />View Product
        </Button>
        <div class="mt-2">
            <Button
                href={product.affiliation_link || product.url }
                target="_blank"
                class="w-full"
                color="light"
                size="sm"
            >
                <ShoppingBagOutline class="mr-2 h-4 w-4" />Buy on AliExpress
            </Button>
        </div>
    </div>
</Card>
