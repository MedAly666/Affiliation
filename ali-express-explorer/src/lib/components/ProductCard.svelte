<script lang="ts">
    import { Card, Button, Badge, Rating } from "flowbite-svelte";
    import {
        HeartOutline,
        HeartSolid,
        EyeOutline,
        CartOutline,
    } from "flowbite-svelte-icons";
    import ProductModal from "./ProductModal.svelte";

    let { product } = $props();

    let showProductModal = $state(false);

    // Handle favorites
	function toggleFavorite(urlHash: string) {
        let favoriteProducts: string[] = JSON.parse(
            localStorage.getItem("favorites") || "[]",
        );
		if (favoriteProducts.includes(urlHash)) {
			favoriteProducts = favoriteProducts.filter((id) => id !== urlHash);
		} else {
			favoriteProducts = [...favoriteProducts, urlHash];
		}
		// Store in localStorage for persistence
		localStorage.setItem("favorites", JSON.stringify(favoriteProducts));
	}


</script>

<Card
    class="h-full flex flex-col hover:shadow-lg transition-shadow overflow-hidden group"
>
    <div class=" relative overflow-hidden">
        <img
            src={product.image.replace("_220x220", "_960x960")}
            alt={product.title}
            class="w-full h-48 object-cover p-2 group-hover:scale-105 transition-transform"
        />
        
        {#if product.discount_percentage > 0}
            <div class="absolute left-0 top-3">
                <Badge
                    size="large"
                    class="rounded-r-full rounded-l-none pl-2 pr-3 py-1.5 font-bold"
                >
                    -{product.discount_percentage}%
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
                >€{product.sale_price.toFixed(2)}</span
            >
            {#if product.original_price > product.sale_price}
                <span class="ml-2 text-sm line-through text-gray-500"
                    >€{product.original_price.toFixed(2)}</span
                >
            {/if}
        </div>
        
    </div>
    <div class="flex gap-2 p-2 pt-0">
        <Button class="flex-2" color="blue" onclick={() => showProductModal = true}>
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
<ProductModal
  show={showProductModal}
  product={product}
  onClose={() => showProductModal = false}
/>
