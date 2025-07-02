<script lang="ts">
    import { onMount } from "svelte";
    import { Card, Button, Badge, Rating } from "flowbite-svelte";
    import {
        HeartOutline,
        HeartSolid,
        EyeOutline,
        CartOutline,
    } from "flowbite-svelte-icons";
    import type { Product, Review } from "$lib/index.js";

    let {
        product,
        isFavorite,
        onToggleFavorite,
        onView,
        getDiscountPercentage,
    } = $props();

    let reviews: Review[] = $state([]);
    let avgRating: number = $state(0);

    onMount(async () => {
        const res = await fetch(
            "/api/product-reviews?productId=" + product.product_id,
        );
        reviews = await res.json();

        avgRating =
            reviews.reduce(
                (sum: number, review: Review) => sum + review.rating,
                0,
            ) / (reviews.length || 1);
    });
</script>

<Card
    class="h-full flex flex-col hover:shadow-lg transition-shadow overflow-hidden group"
>
    <div class="relative overflow-hidden">
        <img
            src={product.image.replace("_220x220", "_960x960")}
            alt={product.title}
            class="w-full h-48 object-cover p-2 group-hover:scale-105 transition-transform"
        />
        <button
            class="absolute top-2 right-2 p-2 rounded-full hover:bg-white transition-colors"
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
            class=" font-semibold line-clamp-3 mb-3 text-gray-900 dark:text-white"
        >
            {product.title}
        </h5>
        <div class="flex items-baseline">
            <span class="text-2xl font-bold text-gray-900 dark:text-white"
                >€{product.price.toFixed(2)}</span
            >
            {#if product.original_price > product.price}
                <span class="ml-2 text-sm line-through text-gray-500"
                    >€{product.original_price.toFixed(2)}</span
                >
            {/if}
        </div>
        <div class="mt-2 flex items-center">
            <Rating
                id={`product-rating-${product.product_id}`}
                total={5}
                rating={product.avg_rating}
                size={20}
            >
                {#snippet text()}
                    <span class="ml-2 text-sm text-gray-500"
                        >{product.avg_rating.toFixed(1)} ({product.nb_reviews} reviews)</span
                    >
                {/snippet}
            </Rating>
        </div>
    </div>
    <div class="flex gap-2 p-2 pt-0">
        <Button class="flex-2" color="blue" onclick={() => onView(product)}>
            <EyeOutline class="h-5 w-5" />View Product
        </Button>
        <Button
            href={product.affiliation_link || product.url}
            target="_blank"
            class="flex-1"
            size="md"
        >
            <CartOutline size="lg" class="h-4 w-4" />
        </Button>
    </div>
</Card>
