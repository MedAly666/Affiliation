<script lang="ts">
    import {
        Modal,
        Carousel,
        Controls,
        Thumbnails,
        Spinner,
        Badge,
        Button,
        Rating,
    } from "flowbite-svelte";
    import { ShoppingBagOutline } from "flowbite-svelte-icons";
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

    // Helper for random avatar color
    function getAvatarColor(idx: number) {
        const colors = [
            "bg-purple-500",
            "bg-pink-500",
            "bg-blue-500",
            "bg-green-500",
            "bg-yellow-500",
            "bg-red-500",
        ];
        return colors[idx % colors.length];
    }
</script>

<Modal
    bind:open={show}
    size="2xl"
    autoclose={false}
    onclose={onClose}
    class="!p-0"
>
    {#if product}
        <div
            class="relative bg-gradient-to-br from-white via-purple-50 to-purple-100 rounded-2xl shadow-2xl overflow-hidden"
        >
            <div class="flex flex-col lg:flex-row gap-0 lg:gap-8">
                <!-- Image Carousel -->
                <div
                    class="lg:sticky lg:top-0 flex-1 min-w-[320px] bg-white/70 p-6 flex flex-col justify-center"
                >
                    {#if images.length > 0}
                        <Carousel
                            class="rounded-xl h-[320px] md:h-[420px] shadow-lg"
                            imgClass="object-contain h-full w-full rounded-xl"
                            images={images.map((img) => ({
                                src: img.image_url.replace(
                                    "jpg_220x220q75.jpg",
                                    "jpg_960x960q75.jpg",
                                ),
                                alt: img.image_alt || product?.title,
                            }))}
                            duration={0}
                        >
                            <Controls class="bg-white/80 text-purple-500" />
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
                            class="h-[320px] md:h-[420px] flex items-center justify-center bg-gray-100 rounded-xl"
                        >
                            <Spinner size="10" />
                            <p class="ml-3">Loading images...</p>
                        </div>
                    {/if}

                    <!-- Share & Copy Section -->
                    <div class="flex flex-col gap-2 mt-2">
                        <div class="flex flex-wrap gap-3 items-center">
                            <button
                                class="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition text-sm shadow"
                                onclick={() =>
                                    window.open(
                                        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(product.affiliation_link || product.url)}`,
                                        "_blank",
                                    )}
                                aria-label="Share on Facebook"
                            >
                                <svg
                                    class="w-4 h-4"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    ><path
                                        d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"
                                    /></svg
                                >
                            </button>
                            <button
                                class="flex items-center gap-2 px-3 py-2 rounded-lg bg-cyan-500 text-white hover:bg-cyan-600 transition text-sm shadow"
                                onclick={() =>
                                    window.open(
                                        `https://t.me/share/url?url=${encodeURIComponent(product.affiliation_link || product.url)}`,
                                        "_blank",
                                    )}
                                aria-label="Share on Telegram"
                            >
                                <svg
                                    class="w-4 h-4"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    ><path
                                        d="M9.993 15.674l-.396 4.01c.568 0 .814-.244 1.11-.537l2.664-2.53 5.522 4.03c1.012.557 1.73.264 1.98-.937l3.594-16.84c.327-1.513-.547-2.104-1.527-1.75L2.16 9.36c-1.48.572-1.463 1.38-.253 1.75l4.59 1.434 10.66-6.72c.5-.32.96-.143.583.177"
                                    /></svg
                                >
                            </button>
                            <div
                                class="flex items-center gap-2 bg-gray-100 rounded px-3 py-2 text-xs text-gray-700 select-all overflow-x-auto ml-auto"
                            >
                                <span
                                    class="truncate"
                                    title={product.affiliation_link ||
                                        product.url}
                                    >{product.affiliation_link ||
                                        product.url}</span
                                >
                            </div>
                            <button
                                class="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition text-sm shadow"
                                onclick={async () => {
                                    await navigator.clipboard.writeText(
                                        product.affiliation_link || product.url,
                                    );
                                    alert("Link copied to clipboard!");
                                }}
                                aria-label="Copy Link"
                            >
                                <svg
                                    class="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    viewBox="0 0 24 24"
                                    ><rect
                                        x="9"
                                        y="9"
                                        width="13"
                                        height="13"
                                        rx="2"
                                    ></rect><path
                                        d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
                                    ></path></svg
                                >
                            </button>
                        </div>
                    </div>
                    <!-- closes share/copy section -->
                </div>
                <!-- Product Info & Reviews -->
                <div class="flex-1 flex flex-col justify-between p-6">
                    <!-- Product Info -->
                    <div>
                        <h3
                            dir="rtl"
                            class="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2 pr-10 leading-tight"
                        >
                            {product.title}
                        </h3>
                        <div class="flex items-center gap-3 mb-4 flex-wrap">
                            <span class="text-3xl font-bold text-purple-700">
                                €{product.price.toFixed(2)}
                            </span>
                            {#if product.original_price > product.price}
                                <span
                                    class="text-lg line-through text-gray-400"
                                >
                                    €{product.original_price.toFixed(2)}
                                </span>
                                <Badge color="red" class="ml-1 animate-bounce">
                                    -{getDiscountPercentage(
                                        product.original_price,
                                        product.price,
                                    )}%
                                </Badge>
                            {/if}
                        </div>

                        <Button
                            href={product.affiliation_link || product.url}
                            target="_blank"
                            color="purple"
                            size="lg"
                            class="w-full py-3 font-semibold text-lg mb-4"
                        >
                            <ShoppingBagOutline class="mr-2 h-5 w-5" />Buy Now
                        </Button>
                    </div>
                    <!-- closes product info -->
                    <!-- Reviews -->
                    <div
                        class="mt-8 bg-white/80 rounded-xl p-5 border shadow-sm"
                    >
                        <h4
                            class="font-bold text-xl mb-4 text-purple-700 flex items-center gap-2"
                        >
                            <svg
                                class="w-6 h-6 text-yellow-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                ><path
                                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z"
                                /></svg
                            >
                            Customer Reviews
                        </h4>
                        {#if reviews.length === 0}
                            <div class="py-8 text-center text-gray-400">
                                <p>
                                    No reviews available for this product yet.
                                </p>
                            </div>
                        {:else}
                            <div
                                class="space-y-5 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar"
                            >
                                {#each reviews as review, idx}
                                    <div
                                        class="flex gap-3 items-start border-b pb-4 last:border-b-0"
                                    >
                                        <div
                                            class={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg ${getAvatarColor(idx)}`}
                                        >
                                            {review.content
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>
                                        <div class="flex-1">
                                            <div
                                                class="flex items-center mb-1 gap-2"
                                            >
                                                <Rating
                                                    id={`review-rating-${idx}`}
                                                    total={5}
                                                    rating={review.rating}
                                                    size={18}
                                                />
                                                <span
                                                    class="text-sm font-medium text-gray-600"
                                                    >{review.rating}/5</span
                                                >
                                            </div>
                                            <p class="text-gray-700 text-base">
                                                {review.content}
                                            </p>
                                        </div>
                                    </div>
                                {/each}
                            </div>
                        {/if}
                    </div>
                </div>
            </div>
        </div>
    {:else}
        <div class="p-12 text-center bg-white rounded-2xl shadow-xl">
            <Spinner size="10" />
            <p class="mt-4 text-lg text-gray-600">Loading product details...</p>
        </div>
    {/if}
</Modal>

<style>
    /* Custom scrollbar for reviews */
    .custom-scrollbar::-webkit-scrollbar {
        width: 8px;
        background: #ede9fe;
        border-radius: 8px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #a78bfa;
        border-radius: 8px;
    }
</style>
