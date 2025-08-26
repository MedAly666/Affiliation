<script lang="ts">
    import { ButtonGroup, Input, Button, Toggle, Card } from "flowbite-svelte";
    import { SearchOutline } from "flowbite-svelte-icons";

    let { keywords = $bindable() } = $props();
</script>

<ButtonGroup class="mx-2 max-w-full w-sm md:w-xl">
    <Input
        class="border focus:outline-none"
        placeholder="ابحث عن المنتجات..."
        name="keywords"
        bind:value={keywords}
    />

    <Button type="submit" title="بحث">
        <SearchOutline />
    </Button>
</ButtonGroup>
