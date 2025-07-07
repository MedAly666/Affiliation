<script lang="ts">
    import type { Product } from "$lib/types";
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

    let {
        show,
        product,
        onClose,
    }: { show: boolean; product: Product; onClose: any } = $props();

    let toastStatus: boolean = $state(false);
    let toastMessage: string = $state("تمت المشاركة بنجاح");
    let carouselIndex = $state(0);

    async function shareToFacebookPage(product_id: number) {
        let res = await fetch("/api/share/facebook", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ product_id }),
        });

        const data = await res.json();
        if (data.success) {
            toastStatus = true;
            toastMessage = "تمت مشاركة المنتج بنجاح على فيسبوك";
            setTimeout(() => {
                toastStatus = false;
            }, 3000);
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

        const data = await res.json();
        if (data.success) {
            toastMessage = "تمت مشاركة المنتج بنجاح على تيليجرام";
            toastStatus = true;
            setTimeout(() => {
                toastStatus = false;
            }, 3000);
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
                <div
                    class="lg:sticky lg:top-0 flex-1 min-w-[320px] p-6 flex flex-col justify-center"
                    dir="ltr"
                >
                    {#if product.images.length > 0}
                        <Carousel
                            class="rounded-xl shadow-lg"
                            images={product.images.map((img: string) => ({
                                src: img,
                                alt: "",
                            }))}
                            duration={0}
                        >
                            <Controls />
                            {#if product.images.length > 1}
                                <Thumbnails
                                    class="gap-3 bg-transparent my-2"
                                    index={carouselIndex}
                                    images={product.images.map(
                                        (img: string) => ({
                                            src: img,
                                            alt: "",
                                        }),
                                    )}
                                >
                                    {#snippet children({
                                        image,
                                        selected,
                                        Thumbnail,
                                    })}
                                        <Thumbnail
                                            {selected}
                                            {...image}
                                            class="hover:outline-primary-500 rounded-md shadow-xl hover:outline {selected
                                                ? 'outline-primary-400 outline-4'
                                                : ''}"
                                        />
                                    {/snippet}
                                </Thumbnails>
                            {/if}
                        </Carousel>
                    {:else}
                        <div
                            class="h-[320px] md:h-[420px] flex items-center justify-center rounded-xl"
                        >
                            <Spinner size="10" />
                            <p class="ml-3">جاري تحميل الصور...</p>
                        </div>
                    {/if}

                    <div class="flex flex-col gap-2 mt-2">
                        <h4 class="text-lg font-semibold">
                            مشاركة/نسخ رابط المنتج
                        </h4>
                        <div class="flex flex-wrap gap-3 items-center">
                            <!--Button
                                class="flex items-center gap-2 px-3 py-2 rounded-lg transition text-sm shadow"
                                onclick={async () =>
                                    await shareToFacebookPage(
                                        product.product_id,
                                    )}
                                aria-label="مشاركة على فيسبوك"
                            >
                                <FacebookSolid />
                            </Button>
                            <Button
                                class="flex items-center gap-2 px-3 py-2 rounded-lg transition text-sm shadow"
                                onclick={async () =>
                                    await shareToTelegramChannel(
                                        product.product_id,
                                    )}
                                aria-label="مشاركة على تيليجرام"
                            >
                                <PaperPlaneOutline />
                            </Button-->

                            <ButtonGroup>
                                <Input
                                class="w-sm"
                                    value={product.affiliate_link}
                                    readonly
                                    disabled
                                ></Input>
                                <Clipboard
                                    class="p-2"
                                    value={product.affiliate_link}
                                    embedded
                                >
                                    {#snippet children(success)}
                                        <Tooltip isOpen={success}
                                            >{success
                                                ? "تم النسخ"
                                                : "انسخ إلى الحافظة"}</Tooltip
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
                </div>

                <div class="flex-1 flex flex-col align-center p-6">
                    <div class="flex flex-col">
                        <h3
                            dir="rtl"
                            class="text-2xl md:text-xl font-extrabold text-gray-900 dark:text-white mb-4 pr-5 leading-tight"
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
                                <Badge class="ml-1"
                                    >-{product.discount_percentage}%</Badge
                                >
                            {/if}
                            <Button
                                href={product.affiliate_link}
                                target="_blank"
                                class="w-50 mr-auto font-semibold text-lg"
                            >
                                <ShoppingBagOutline class="h-5 w-5" /> اشتري الآن
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    {:else}
        <div class="p-12 text-center bg-white rounded-2xl shadow-xl">
            <Spinner size="10" />
            <p class="mt-4 text-lg text-gray-600">
                جاري تحميل تفاصيل المنتج...
            </p>
        </div>
    {/if}
</Modal>
