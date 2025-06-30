<script lang="ts">
  import { Button, Range } from "flowbite-svelte";
  import { AdjustmentsVerticalOutline } from "flowbite-svelte-icons";

  let { minPrice, maxPrice, sortOption, filteredCount, onMinPrice, onMaxPrice, onSort } = $props();


</script>

<div class="bg-white p-4 rounded-lg shadow-sm border">
  <h2 class="font-bold text-lg mb-4 flex items-center">
    <AdjustmentsVerticalOutline class="w-5 h-5 mr-2" />
    Filters
  </h2>
  <div class="mb-4">
    <label id="price-range-label" for="min-price-range" class="block text-sm font-medium mb-2">Price Range (€)</label>
    <div class="flex items-center mb-2">
      <span class="w-12 text-sm">{minPrice}€</span>
      <Range id="min-price-range" class="mx-2" min="0" max="100" bind:value={minPrice} oninput={(e) => onMinPrice(e.target ? +((e.target as HTMLInputElement).value) : 0)} aria-labelledby="price-range-label" />
      <span class="w-12 text-sm">{maxPrice}€</span>
    </div>
    <Range id="max-price-range" class="mb-4" min="0" max="100" bind:value={maxPrice} oninput={(e) => onMaxPrice(e.target ? +((e.target as HTMLInputElement).value) : 0)} aria-labelledby="price-range-label" />
  </div>
  <div class="mb-4">
    <fieldset>
      <legend class="block text-sm font-medium mb-2">Sort By</legend>
      <div class="grid grid-cols-2 gap-2">
        <Button size="xs" color={sortOption === "discount" ? "purple" : "light"} onclick={() => onSort("discount")}>Biggest Discount</Button>
        <Button size="xs" color={sortOption === "price-low" ? "purple" : "light"} onclick={() => onSort("price-low")}>Price: Low to High</Button>
        <Button size="xs" color={sortOption === "price-high" ? "purple" : "light"} onclick={() => onSort("price-high")}>Price: High to Low</Button>
        <Button size="xs" color={sortOption === "newest" ? "purple" : "light"} onclick={() => onSort("newest")}>Newest First</Button>
      </div>
    </fieldset>
  </div>
  <div class="mt-6 text-center text-sm text-gray-500">
    {filteredCount} products found
  </div>
</div>
