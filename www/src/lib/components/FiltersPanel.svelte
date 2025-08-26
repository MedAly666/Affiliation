<script lang="ts">
	import { Card, Range, Select, Toggle } from "flowbite-svelte";
	import { AdjustmentsVerticalOutline } from "flowbite-svelte-icons";

	let { openFilterPanal, min_sale_price, max_sale_price, sort } = $props();
</script>

<Card class="max-w-full w-sm md:w-xl p-2 rounded-lg shadow-sm border my-5">
	<div class="flex gap-5 items-center justify-start">
		<AdjustmentsVerticalOutline class="w-5 h-5 mr-2 text-gray-900 dark:text-white" />
		<h2 class="font-bold text-xl text-gray-900 dark:text-white">
			خيارات التصفية المتقدمة
		</h2>
		<Toggle
			name="advancedFilterToggle"
			class="mr-auto"
			bind:checked={openFilterPanal}
		></Toggle>
	</div>

	{#if openFilterPanal}
		<div class="mb-4">
			<label
				id="price-range-label"
				for="min-price-range"
				class="block text-sm font-medium mb-2 text-gray-900 dark:text-white"
			>
				نطاق السعر (€)
			</label>

			<div class="w-full p-2 grid grid-cols-5 grid-rows-2 gap-3">
				<span class="text-gray-900 dark:text-white row-span-2">
					{min_sale_price} €
				</span>
				<Range
					id="min-price-range"
					class="col-span-3"
					min="0"
					max={max_sale_price}
					bind:value={min_sale_price}
					aria-labelledby="price-range-label"
					name="min_sale_price"
				/>
				<Range
					id="max-price-range"
					class="col-span-3 col-start-2 row-start-2"
					min={min_sale_price}
					max="500"
					bind:value={max_sale_price}
					aria-labelledby="price-range-label"
					name="max_sale_price"
				/>
				<span class="text-gray-900 dark:text-white row-span-2 col-start-5 row-start-1">
					{max_sale_price} €
				</span>
			</div>

			<div class="mb-4">
				<label
					id="sort-label"
					for="sort"
					class="block text-sm font-medium mb-2 text-gray-900 dark:text-white"
				>
					ترتيب حسب
				</label>

				<Select
					items={[
						{ value: "SALE_PRICE_ASC", name: "السعر: من الأرخص للأغلى" },
						{ value: "SALE_PRICE_DESC", name: "السعر: من الأغلى للأرخص" },
						{ value: "LAST_VOLUME_ASC", name: "المبيعات: من الأقل للأكثر" },
						{ value: "LAST_VOLUME_DESC", name: "المبيعات: من الأكثر للأقل" },
					]}
					bind:value={sort}
					name="sortByType"
				></Select>
			</div>
		</div>
	{/if}
</Card>
