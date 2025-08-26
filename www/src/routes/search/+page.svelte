<script lang="ts">
    import Search from "$lib/components/Search.svelte";
    import InfinitScrollContainer from "$lib/components/InfinitScrollContainer.svelte";
    import logo from "$lib/assets/logo.png";
    import FiltersPanel from "$lib/components/FiltersPanel.svelte";
    import ProductCard from "$lib/components/ProductCard.svelte";
    import type { Product, QueryOptions } from "$lib/types";
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();

    // Reactive state
    let products: Product[] = $state(data.streamed.products);
    let hotProducts: Product[] = $state(data.streamed.hotProducts);
    let keywords: string = $state(data.keywords);
    let openFilterPanal: boolean = $state(data.isAdvancedSearch);

    // Add these missing variables that are referenced in your template
    let max_sale_price: number = $state(data.max_sale_price || 1000);
    let min_sale_price: number = $state(data.min_sale_price || 0);
    let sort:
        | "SALE_PRICE_ASC"
        | "SALE_PRICE_DESC"
        | "LAST_VOLUME_DESC"
        | "LAST_VOLUME_ASC" = $state(data.sort || "SALE_PRICE_DESC");
    let page_no: number = $state(2);
    let page_size: number = $state(25);

    // Loading state for infinite scroll
    let isLoadingMore: boolean = $state(false);

    async function loadProducts(options: QueryOptions) {
        try {
            const response = await fetch(
                "/api/products?" + new URLSearchParams(options as Record<string, string>),
            );
            const newProducts = await response.json();
            return newProducts;
        } catch (error) {
            console.error("Error loading products:", error);
            return [];
        }
    }

    async function loadHotProducts(options: QueryOptions) {
        try {
            const response = await fetch(
                "/api/hot-products?" + new URLSearchParams(options as Record<string, string>),
            );
            const newProducts = await response.json();
            return newProducts;
        } catch (error) {
            console.error("Error loading products:", error);
            return [];
        }
    }
    // Handle infinite scroll
    async function handleInfiniteScroll() {
        if (isLoadingMore) return;

        isLoadingMore = true;
        try {
            const newProducts = await loadProducts({
                page_no,
                page_size,
                keywords,
                min_sale_price,
                max_sale_price,
                sort,
            });

            if (newProducts.length > 0) {
                products = [...products, ...newProducts];
                page_no += 1;
            } else {
                console.log("No more products to load");
            }
        } catch (error) {
            console.error("Error in infinite scroll:", error);
        } finally {
            isLoadingMore = false;
        }
    }

    // Handle infinite scroll
    async function handleInfiniteScrollHot() {
        if (isLoadingMore) return;

        isLoadingMore = true;
        try {
            const newProducts = await loadHotProducts({
                page_size,
                page_no,
                keywords: "watch",
            });

            if (newProducts.length > 0) {
                hotProducts = [...hotProducts, ...newProducts];
                page_no += 1;
            } else {
                console.log("No more products to load");
            }
        } catch (error) {
            console.error("Error in infinite scroll:", error);
        } finally {
            isLoadingMore = false;
        }
    }

    // Update reactive state when data changes (for navigation)
    $effect(() => {
        products = data.streamed.products;
        hotProducts = data.streamed.hotProducts;
        keywords = data.keywords;
        openFilterPanal = data.isAdvancedSearch;
    });
</script>

<svelte:head>
    <title>
        {keywords
            ? `البحث: ${keywords} - ديلز هانتر`
            : "ديلز هانتر - عروض رائعة للجزائريين"}
    </title>
    <meta
        name="description"
        content={keywords
            ? `نتائج البحث عن: ${keywords}`
            : "اكتشف المنتجات الرائجة وأفضل العروض للجزائريين"}
    />
</svelte:head>

{#if data.keywords}
    <div class="flex flex-col lg:flex-row mt-15 min-h-screen" dir="rtl">
        <aside
            class="w-full lg:w-sm lg:h-screen p-4 lg:border-r-2 border-gray-200 dark:border-gray-700 flex flex-col bg-gray-50 dark:bg-gray-900"
        >
            <form
                class="flex flex-col items-center overflow-x-hidden"
                action="?/search"
                method="POST"
            >
                <Search {keywords} />
                <FiltersPanel
                    {openFilterPanal}
                    {max_sale_price}
                    {min_sale_price}
                    {sort}
                />
            </form>
        </aside>

        <main class="flex-1 h-screen overflow-y-auto p-4">
            <header class="mb-6 border-r-4 border-primary-500 px-4">
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                    نتائج البحث
                </h1>
                {#if products.length > 0}
                    <span class="font-normal text-gray-600 dark:text-gray-400">
                        تم العثور على {products.length} منتج
                    </span>
                {/if}
            </header>

            {#if products.length > 0}
                <div
                    class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                    <InfinitScrollContainer onScroll={handleInfiniteScroll}>
                        {#snippet content()}
                            {#each products as product}
                                <ProductCard {product} />
                            {/each}
                        {/snippet}
                    </InfinitScrollContainer>
                </div>
            {:else}
                <div class="text-center py-12">
                    <div class="text-gray-400 text-6xl mb-4">🔍</div>
                    <h2
                        class="text-xl font-semibold text-gray-900 dark:text-white mb-2"
                    >
                        لم يتم العثور على أي منتج
                    </h2>
                    <p class="text-gray-600 dark:text-gray-400 mb-6">
                        حاول تعديل كلمات البحث أو استخدام فلاتر أخرى
                    </p>
                    <button
                        type="button"
                        class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                        onclick={() => {
                            keywords = "";
                        }}
                    >
                        تصفح المنتجات الرائجة 🔥
                    </button>
                </div>
            {/if}
        </main>
    </div>
{:else}
    <section
        class="w-screen mt-15 flex flex-col items-center justify-center gap-5 m-auto p-4"
        dir="rtl"
    >
        <img
            src={logo}
            class="h-32 w-32 rounded-full mx-auto mb-4 shadow-lg"
            alt="Deals Hunter Logo"
        />
        <h1
            class="text-center text-gray-900 dark:text-white text-4xl font-bold mb-2"
        >
            ديلز هانتر – بوابتك للتسوق الذكي
        </h1>
        <p
            class="text-center text-gray-600 dark:text-gray-400 text-lg max-w-md"
        >
            اكتشف منتجات عالية الطلب، بأفضل الأسعار على AliExpress. مخصصة
            للمستخدم الجزائري.
        </p>

        <form
            class="w-full max-w-2xl flex flex-col items-center gap-2"
            action="?/search"
            method="POST"
        >
            <Search bind:keywords />
            <FiltersPanel
                {min_sale_price}
                {max_sale_price}
                {sort}
                {openFilterPanal}
            />
        </form>
    </section>

    <section class="w-screen mt-5 m-auto p-6" dir="rtl">
        <header class="mb-4 border-r-4 px-4 border-primary-500">
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                🔥 المنتجات الرائجة في الجزائر
            </h2>
            <p class="text-gray-600 dark:text-gray-400">
                اكتشف المنتجات الأكثر مبيعًا والتي يهتم بها المستخدمون
                الجزائريون الآن
            </p>
        </header>

        <div
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
            <InfinitScrollContainer onScroll={handleInfiniteScrollHot}>
                {#snippet content()}
                    {#each hotProducts as product}
                        <ProductCard {product} />
                    {/each}
                {/snippet}
            </InfinitScrollContainer>
        </div>
    </section>
{/if}
