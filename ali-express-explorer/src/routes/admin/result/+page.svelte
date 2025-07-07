<script lang="ts">
    import Header from "$lib/components/Header.svelte";
    import Search from "$lib/components/Search.svelte";
    import Footer from "$lib/components/Footer.svelte";
    import InfinitScrollContainer from "$lib/components/InfinitScrollContainer.svelte";
    import ProductCard from "$lib/components/ProductCard.svelte";
	import type { Product } from "$lib/types";
    import { Drawer } from "flowbite-svelte";
    import FiltersPanel from "$lib/components/FiltersPanel.svelte";
    import type { PageProps } from './$types';

    let { data }: PageProps = $props();

    let products = $state(data.products);
    let keywords = $state(data.q);

    let openFilterPanal = $state(data.isAdvancedSearch)
    let min_sale_price = $state(data.min_sale_price);
    let max_sale_price = $state(data.max_sale_price);
    let sort = $state(data.sortByType);
    let page_no = $state(1);

    /*async function loadProducts(params: {
        page_size: number;
        page: number;
    }): Promise<Product[]> {
        console.log("Loading products with params:", params);
        const response = await fetch(
            `/api/products?page_size=${params.page_size}&page=${params.page}`,
        );

        if (!response.ok) {
            console.error("Failed to load products:", response.statusText);
            return [];
        }

        const data = await response.json();
        if (!data) {
            console.error("Invalid data format:", data);
            return [];
        }

        console.log("Loaded products:", data);

        return data || [];
    }*/
</script>

<Header />
<div class="flex flex-col lg:flex-row mt-15">
    <form
        class="w-full lg:w-md lg:h-screen p-2 lg:border-r-2 border-gray-500 flex flex-col items-center overflow-x-hidden"
        action="?/search"
        method="POST"
    >
        <Search {keywords} />
        <FiltersPanel {openFilterPanal} {max_sale_price} {min_sale_price} {sort} />
    </form>

    <article class=" h-screen overflow-y-scroll p-2">
        <h1
            class="text-2xl font-bold text-gray-900 dark:text-white border-l-4 border-primary-500 p-3 mb-2"
        >
            Search Result
        </h1>
        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {#each products as product}
                <ProductCard {product} />
            {/each}
        </div>

        <Footer />
    </article>
</div>
