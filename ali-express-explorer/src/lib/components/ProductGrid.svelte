<script lang="ts">
  import ProductCard from './ProductCard.svelte';
  import { Spinner, Button } from 'flowbite-svelte';
  import type { Product } from '$lib/index.js';
  export let favoriteProducts: string[];
  export let onToggleFavorite: (urlHash: string) => void;
  export let onView: (product: Product) => void;
  export let getDiscountPercentage: (original: number, current: number) => number;
  export let loadMoreTrigger: HTMLDivElement | null;
  export let isLoadingMore: boolean;
  export let visibleItems: Product[];
  export let loadMoreProducts: () => void;
  export let filteredProducts: Product[];
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
  {#each visibleItems as product}
    <ProductCard
      {product}
      isFavorite={favoriteProducts.includes(product.url_hash)}
      onToggleFavorite={onToggleFavorite}
      onView={onView}
      {getDiscountPercentage}
    />
  {/each}
  <div bind:this={loadMoreTrigger} class="col-span-full flex justify-center py-8 {isLoadingMore ? 'opacity-100' : 'opacity-0'}">
    {#if isLoadingMore}
      <Spinner size="8" />
      <span class="ml-3">Loading more products...</span>
    {/if}
  </div>
</div>
{#if !isLoadingMore && visibleItems.length < filteredProducts.length}
  <div class="text-center mt-8">
    <Button color="light" onclick={loadMoreProducts}>Load More Products</Button>
    <p class="text-sm text-gray-500 mt-2">Showing {visibleItems.length} of {filteredProducts.length} products</p>
  </div>
{/if}
