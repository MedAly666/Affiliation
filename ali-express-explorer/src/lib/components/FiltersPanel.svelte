<script lang="ts">
	import { Card, Range, Select, Toggle } from "flowbite-svelte";
	import { AdjustmentsVerticalOutline } from "flowbite-svelte-icons";

	let { openFilterPanal, minPrice, maxPrice, sortbyValue } = $props();
</script>

<Card class="max-w-full w-sm md:w-xl p-2 rounded-lg shadow-sm border my-5">
	<div class="flex gap-5 items-center justify-start">
		<AdjustmentsVerticalOutline
			class="w-5 h-5 mr-2 text-gray-900 dark:text-white"
		/>

		<h2 class="font-bold text-xl text-gray-900 dark:text-white">
			Advanced Filters
		</h2>
		<Toggle name="advancedFilterToggle" class="ml-auto" bind:checked={openFilterPanal}></Toggle>
	</div>

	{#if openFilterPanal}
		<div class="mb-4">
			<label
				id="price-range-label"
				for="min-price-range"
				class="block text-sm font-medium mb-2 text-gray-900 dark:text-white"
				>Price Range (€)</label
			>
			<div class="w-full p-2 grid grid-cols-5 grid-rows-2 gap-3">
				<span class="text-gray-900 dark:text-white row-span-2">
					{minPrice}€
				</span>
				<Range
					id="min-price-range"
					class="col-span-3"
					min="0"
					max={maxPrice}
					bind:value={minPrice}
					aria-labelledby="price-range-label"
					name="minPrice"
				/>
				<Range
					id="max-price-range"
					class="col-span-3 col-start-2 row-start-2"
					min={minPrice}
					max="500"
					bind:value={maxPrice}
					aria-labelledby="price-range-label"
					name="maxPrice"
				/>
				<span
					class="text-gray-900 dark:text-white row-span-2 col-start-5 row-start-1"
				>
					{maxPrice}€
				</span>
			</div>
			<div class="mb-4">
				<label
					id="price-range-label"
					for="min-price-range"
					class="block text-sm font-medium mb-2 text-gray-900 dark:text-white"
					>Sort by</label
				>
				<Select
					items={[
						{
							value: "SALE_PRICE_ASC",
							name: "Ascendent sale price",
						},
						{
							value: "SALE_PRICE_DESC",
							name: "Descendent sale price",
						},
						{
							value: "LAST_VOLUME_ASC",
							name: "Ascendent last volume",
						},
						{
							value: "LAST_VOLUME_DESC",
							name: "Descendent last volume",
						},
					]}
					bind:value={sortbyValue}
					name="sortByType"
				></Select>
			</div>
		</div>
	{/if}
</Card>
