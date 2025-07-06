<script lang="ts">
    import { Spinner } from "flowbite-svelte";

    let { content, onScroll } = $props();

    let loadMoreTrigger: HTMLDivElement | null = $state(null);
    let isLoadingMore = $state(false);

    // Function to load more products
    /*async function loadMoreProducts() {
        if (isLoadingMore || !loadMoreTrigger) return;

        isLoadingMore = true;
        // Simulate loading delay
        setTimeout(() => {
            isLoadingMore = false;
        }, 500);
    }*/

    $effect(() => {
        if (!loadMoreTrigger) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (entry.isIntersecting && !isLoadingMore) {
                    console.log("Loading...");
                    isLoadingMore = true;
                    onScroll?.();
                    setTimeout(() => {
                        isLoadingMore = false;
                    }, 1500);
                }
            },
            { rootMargin: "200px" },
        );

        observer.observe(loadMoreTrigger);

        return () => {
            if (loadMoreTrigger) observer.unobserve(loadMoreTrigger);
        };
    });
</script>

{@render content()}

<div
    bind:this={loadMoreTrigger}
    class="col-span-full flex justify-center py-8 {isLoadingMore
        ? 'opacity-100'
        : 'opacity-0'}"
>
    {#if isLoadingMore}
        <Spinner size="8" />
        <span class="ml-3 text-gray-900 dark:text-white"
            >Loading more products...</span
        >
    {/if}
</div>
