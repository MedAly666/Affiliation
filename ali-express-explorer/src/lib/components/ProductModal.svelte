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

	import type { Product } from "$lib/types";

    let { show, product, onClose } = $props();

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
        class="fixed top-2 left-1/2 -translate-x-1/2 z-20"
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
                    {#if product.images.length > 0}
                        <Carousel
                            class="rounded-xl h-[320px] md:h-[420px] shadow-lg"
                            imgClass="object-cover h-full w-full rounded-xl"
                            images={product.images.map((img: string) => ({
                                src: img,
                                alt: "",
                            }))}
                            duration={0}
                        >
                            <Controls />
                            {#if product.images.length > 1}
                                <Thumbnails
                                    index={0}
                                    images={product.images.map(
                                        (img: string) => ({
                                            src: img,
                                            alt: "",
                                        }),
                                    )}
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
                                €{product.sale_price.toFixed(2)}
                            </span>
                            {#if product.original_price > product.sale_price}
                                <span
                                    class="text-lg line-through text-gray-500"
                                >
                                    €{product.original_price.toFixed(2)}
                                </span>
                                <Badge class="ml-1">
                                    -{product.discount_percentage}%
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
