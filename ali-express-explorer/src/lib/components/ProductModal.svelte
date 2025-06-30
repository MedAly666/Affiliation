<script lang="ts">
    import {
        Modal,
        Carousel,
        Controls,
        Thumbnails,
        Spinner,
        Badge,
        Button,
        Rating} from "flowbite-svelte";
    import {
        ShoppingBagOutline,
        StarOutline,
        StarSolid
    } from "flowbite-svelte-icons";
    import type { Product } from "$lib/index.js";
    export let show: boolean;
    export let product: Product | null;
    export let images: { image_url: string; image_alt: string }[];
    export let reviews: { rating: number; content: string }[];
    export let onClose: () => void;
    export let getDiscountPercentage: (
        original: number,
        current: number,
    ) => number;
</script>

<Modal bind:open={show} size="xl" autoclose={false} onclose={onClose}>
    {#if product}
        <div class="relative">
            <h3
                dir="rtl"
                class="text-xl md:text-2xl font-bold text-gray-900 mb-4 pr-10"
            >
                {product.title}
            </h3>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="bg-white rounded-lg overflow-hidden">
                    {#if images.length > 0}
                        <Carousel
                            class="rounded-lg h-[300px] md:h-[400px]"
                            imgClass="object-contain h-full w-fit rounded-xs"
                            images={images.map((img) => ({
                                src: img.image_url.replace(
                                    "jpg_220x220q75.jpg",
                                    "jpg_960x960q75.jpg",
                                ),
                                alt: img.image_alt || product?.title,
                            }))}
                            duration={0}
                        >
                            <Controls class="bg-gray-100 text-gray-500" />
                            {#if images.length > 1}
                                <Thumbnails
                                    index={0}
                                    images={images.map((img) => ({
                                        src: img.image_url.replace(
                                            "jpg_960x960q75.jpg",
                                            "jpg_220x220q75.jpg",
                                        ),
                                        alt: img.image_alt || product?.title,
                                    }))}
                                />
                            {/if}
                        </Carousel>
                    {:else}
                        <div
                            class="h-[300px] md:h-[400px] flex items-center justify-center bg-gray-100"
                        >
                            <Spinner size="10" />
                            <p class="ml-3">Loading images...</p>
                        </div>
                    {/if}
                    <div
                        class="p-4 border-t flex items-baseline justify-between"
                    >
                        <div>
                            <span class="text-2xl font-bold text-purple-700"
                                >€{product.price.toFixed(2)}</span
                            >
                            {#if product.original_price > product.price}
                                <span
                                    class="ml-2 text-sm line-through text-gray-500"
                                    >€{product.original_price.toFixed(2)}</span
                                >
                                <Badge color="red" class="ml-2"
                                    >-{getDiscountPercentage(
                                        product.original_price,
                                        product.price,
                                    )}%</Badge
                                >
                            {/if}
                        </div>
                        <Button
                            href={product.url}
                            target="_blank"
                            color="purple"
                            size="sm"
                        >
                            <ShoppingBagOutline class="mr-2 h-4 w-4" />Buy Now
                        </Button>
                    </div>
                </div>
                <div class="bg-white rounded-lg p-4 border">
                    <h4 class="font-bold text-lg mb-4">Customer Reviews</h4>
                    {#if reviews.length === 0}
                        <div class="py-8 text-center text-gray-500">
                            <p>No reviews available for this product yet.</p>
                        </div>
                    {:else}
                        <div class="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                            {#each reviews as review, idx}
                                <div class="border-b pb-4">
                                    <div class="flex items-center mb-2">
                                        <Rating id={`review-rating-${idx}`} total={5} rating={review.rating} size={16}>
                                            {#snippet text()}
                                                <span class="ml-2 text-sm font-medium">{review.rating}/5</span>
                                            {/snippet}
                                        </Rating>
                                    </div>
                                    <p class="text-gray-700">{review.content}</p>
                                </div>
                            {/each}
                        </div>
                    {/if}
                </div>
            </div>
        </div>
    {:else}
        <div class="p-8 text-center">
            <Spinner size="10" />
            <p class="mt-4">Loading product details...</p>
        </div>
    {/if}
</Modal>
