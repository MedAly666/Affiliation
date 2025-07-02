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
        Input,
        Clipboard,
        Tooltip,
        ButtonGroup,
        Listgroup,
        ListgroupItem,
        Avatar,
        Toast,
    } from "flowbite-svelte";
    import {
        FacebookSolid,
        ShoppingBagOutline,
        StarSolid,
        ClipboardCleanSolid,
        CheckOutline,
        PaperPlaneOutline,
        CheckCircleSolid,
    } from "flowbite-svelte-icons";
    import { slide } from "svelte/transition";

    import type { Product, Image } from "$lib/index.js";

    let { show, product, images, reviews, onClose, getDiscountPercentage } =
        $props();

    let toastStatus: boolean = $state(false);
    let toastMessage: string = $state("Successfully shared");

    // Helper for random avatar color
    function getAvatarColor(idx: number) {
        const colors = [
            "bg-blue-500",
            "bg-pink-500",
            "bg-blue-500",
            "bg-green-500",
            "bg-yellow-500",
            "bg-red-500",
        ];
        return colors[idx % colors.length];
    }

    // Share functions
    async function shareToFacebookPage(product_id: number) {
        let res = await fetch("/api/share/facebook", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ product_id }),
        });

        if (!res.ok) {
            console.error("Failed to share on Facebook:", res.statusText);
            return;
        }
        const data = await res.json();
        if (data.error) {
            console.error("Error sharing on Facebook:", data.error);
            return;
        }

        const success = data.success;
        if (success) {
            toastStatus = true;
            toastMessage = "The product is successfully shared on Facebook";
            setTimeout(() => {
                toastStatus = false;
            }, 3000);
            console.log("Successfully shared on Facebook");
        } else {
            console.error("Failed to share on Facebook");
            return;
        }
    }
    async function shareToTelegramChannel(product_id: number) {
        let res = await fetch("/api/share/telegram", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ product_id }),
        });

        if (!res.ok) {
            console.error("Failed to share on Telegram:", res.statusText);
            return;
        }

        const data = await res.json();
        if (data.error) {
            console.error("Error sharing on Telegram:", data.error);
            return;
        }
        const success = data.success;
        if (success) {
            toastMessage = "The product is successfully shared on Telegram";
            toastStatus = true;
            setTimeout(() => {
                toastStatus = false;
            }, 3000);
            console.log("Successfully shared on Telegram");
        } else {
            console.error("Failed to share on Telegram");
            return;
        }
    }
</script>

<Modal
    bind:open={show}
    autoclose={false}
    onclose={onClose}
    transition={slide}
    class="!p-0 max-w-7xl mx-auto"
>
    <Toast
        transition={slide}
        align={false}
        bind:toastStatus
        class="fixed top-2 left-1/2 -translate-x-1/2 z-50"
    >
        {#snippet icon()}
            <CheckCircleSolid class="h-5 w-5" />
        {/snippet}
        <p class="ml-3">{toastMessage}</p>
    </Toast>
    {#if product}
        <div class="relative rounded-2xl overflow-hidden">
            <div class="flex flex-col lg:flex-row gap-0 lg:gap-8">
                <!-- Image Carousel -->
                <div
                    class="lg:sticky lg:top-0 flex-1 min-w-[320px] p-6 flex flex-col justify-center"
                >
                    {#if images.length > 0}
                        <Carousel
                            class="rounded-xl h-[320px] md:h-[420px] shadow-lg"
                            imgClass="object-cover h-full w-full rounded-xl"
                            images={images.map((img: Image) => ({
                                src: img.image_url.replace(
                                    "_220x220",
                                    "_960x960",
                                ),
                                alt: img.image_alt || product?.title,
                            }))}
                            duration={0}
                        >
                            <Controls />
                            {#if images.length > 1}
                                <Thumbnails
                                    index={0}
                                    images={images.map((img: Image) => ({
                                        src: img.image_url,
                                        alt: img.image_alt || product?.title,
                                    }))}
                                />
                            {/if}
                        </Carousel>
                    {:else}
                        <div
                            class="h-[320px] md:h-[420px] flex items-center justify-center rounded-xl"
                        >
                            <Spinner size="10" />
                            <p class="ml-3">Loading images...</p>
                        </div>
                    {/if}

                    <!-- Share & Copy Section -->
                    <div class="flex flex-col gap-2 mt-2">
                        <h4 class="text-lg font-semibold">
                            Share/Copy Product Link
                        </h4>
                        <div class="flex flex-wrap gap-3 items-center">
                            <Button
                                class="flex items-center gap-2 px-3 py-2 rounded-lg transition text-sm shadow"
                                onclick={async () =>
                                    await shareToFacebookPage(
                                        product.product_id,
                                    )}
                                aria-label="Share on Facebook"
                            >
                                <FacebookSolid />
                            </Button>
                            <Button
                                class="flex items-center gap-2 px-3 py-2 rounded-lg transition text-sm shadow"
                                onclick={async () =>
                                    await shareToTelegramChannel(
                                        product.product_id,
                                    )}
                                aria-label="Share on Telegram"
                            >
                                <PaperPlaneOutline />
                            </Button>

                            <ButtonGroup>
                                <Input
                                    value={product.affiliation_link}
                                    readonly
                                    disabled
                                ></Input>
                                <Clipboard
                                    class="p-2"
                                    value={product.affiliation_link}
                                    embedded
                                >
                                    {#snippet children(success)}
                                        <Tooltip isOpen={success}
                                            >{success
                                                ? "Copied"
                                                : "Copy to clipboard"}</Tooltip
                                        >
                                        {#if success}
                                            <CheckOutline />
                                        {:else}
                                            <ClipboardCleanSolid />
                                        {/if}
                                    {/snippet}
                                </Clipboard>
                            </ButtonGroup>
                        </div>
                    </div>
                    <!-- closes share/copy section -->
                </div>
                <!-- Product Info & Reviews -->
                <div class="flex-1 flex flex-col align-center p-2">
                    <!-- Product Info -->
                    <div class="flex flex-col">
                        <h3
                            dir="rtl"
                            class="text-l md:text-xl font-extrabold text-gray-900 dark:text-white mb-4 pr-5 leading-tight"
                        >
                            {product.title}
                        </h3>
                        <div class="flex items-center gap-3 mb-4 flex-wrap">
                            <span
                                class="text-xl font-bold text-gray-900 dark:text-white"
                            >
                                €{product.price.toFixed(2)}
                            </span>
                            {#if product.original_price > product.price}
                                <span
                                    class="text-lg line-through text-gray-500"
                                >
                                    €{product.original_price.toFixed(2)}
                                </span>
                                <Badge class="ml-1">
                                    -{getDiscountPercentage(
                                        product.original_price,
                                        product.price,
                                    )}%
                                </Badge>
                            {/if}
                            <Button
                                href={product.affiliation_link || product.url}
                                target="_blank"
                                class="w-50 py-3 font-semibold text-lg mb-2 ml-auto"
                            >
                                <ShoppingBagOutline class="mr-2 h-5 w-5" />Buy
                                Now
                            </Button>
                        </div>
                    </div>
                    <!-- closes product info -->
                    <!-- Reviews -->
                    <div class="mt-4 rounded-xl p-2">
                        <h4
                            class="font-bold text-xl mb-4 text-gray-900 dark:text-white flex items-center gap-2"
                        >
                            <StarSolid />
                            Customer Reviews
                        </h4>
                        {#if reviews.length === 0}
                            <div class="py-8 text-center text-gray-400">
                                <p>
                                    No reviews available for this product yet.
                                </p>
                            </div>
                        {:else}
                            <Listgroup
                                class="max-h-[300px] overflow-y-auto custom-scrollbar"
                            >
                                {#each reviews as review, idx}
                                    <ListgroupItem class="flex justify-end">
                                        <div class="">
                                            <div
                                                class="flex justify-end items-center mb-1 gap-2"
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
                                            <p
                                                class="text-gray-900 dark:text-white text-base"
                                            >
                                                {review.content}
                                            </p>
                                        </div>
                                        <Avatar
                                            class={`text-white ${getAvatarColor(idx)}`}
                                        >
                                            {review.content
                                                .charAt(0)
                                                .toUpperCase()}
                                        </Avatar>
                                    </ListgroupItem>
                                {/each}
                            </Listgroup>
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
<div class="space-y-5 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
    {#each reviews as review, idx}
        <div class="flex gap-3 items-start border-b pb-4 last:border-b-0">
            <div
                class={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg ${getAvatarColor(idx)}`}
            >
                {review.content.charAt(0).toUpperCase()}
            </div>
            <div class="flex-1">
                <div class="flex items-center mb-1 gap-2">
                    <Rating
                        id={`review-rating-${idx}`}
                        total={5}
                        rating={review.rating}
                        size={18}
                    />
                    <span class="text-sm font-medium text-gray-600"
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
