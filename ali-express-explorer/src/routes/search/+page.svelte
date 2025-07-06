<script lang="ts">
    import Search from "$lib/components/Search.svelte";
    import InfinitScrollContainer from "$lib/components/InfinitScrollContainer.svelte";
    import logo from "$lib/assets/logo.png";
    import FiltersPanel from "$lib/components/FiltersPanel.svelte";
    import ProductCard from "$lib/components/ProductCard.svelte";
	import type { Product } from "$lib/types";

    let products: Product[] = $state([]);
    let searchQuery = $state("")
    let openFilterPanal = $state(false);
    let minPrice = $state(0);
    let maxPrice = $state(500);
    let sortbyValue = $state("");
    let pageNumber = $state(1);

    async function loadProducts(params: {
        limit: number;
        page: number;
    }): Promise<Product[]> {
        console.log("Loading products with params:", params);
        const response = await fetch(
            `/api/hot-products?limit=${params.limit}&page=${params.page}`,
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
    }
</script>




<form
    class="w-screen mt-15 flex flex-col items-center justify-center gap-5 m-auto p-5"
    action="?/search"
    method="POST"
>
    <img
        src={logo}
        class="h-25 w-25 rounded-full mr-2"
        alt="Deals Hunter Logo"
    />
    <h1 class="text-gray-900 dark:text-white text-3xl font-bold">
        Deals Hunter
    </h1>
    <Search bind:searchQuery/>
    <FiltersPanel {minPrice} {maxPrice} {sortbyValue} {openFilterPanal} />
</form>

<div class="w-screen mt-2 m-auto p-2">
    <h1
        class="text-2xl font-bold text-gray-900 dark:text-white border-l-4 border-primary-500 pl-4 py-2 my-5"
    >
        Hot Products
    </h1>
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <InfinitScrollContainer
            onScroll={async () => {
                let newProducts = await loadProducts({
                    limit: 25,
                    page: pageNumber,
                });
                if (newProducts.length > 0) {
                    products = [...products, ...newProducts];
                    pageNumber += 1;
                } else {
                    console.log("No more products to load");
                }
            }}
        >
            {#snippet content()}
                {#each products as product}
                    <ProductCard {product} />
                {/each}
            {/snippet}
        </InfinitScrollContainer>
    </div>
</div>