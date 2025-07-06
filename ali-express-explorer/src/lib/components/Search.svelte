<script lang="ts">
    import { ButtonGroup, Input, Button, Toggle, Card } from "flowbite-svelte";
    import { SearchOutline } from "flowbite-svelte-icons";

    import { goto } from "$app/navigation";

    let { searchQuery = $bindable()} = $props();


    
</script>

<ButtonGroup class="mx-2 max-w-full w-sm md:w-xl ">
    <Input
        class="border focus:outline-none"
        placeholder="Search for products..."
        name="searchQuery"
        bind:value={searchQuery}
    />

    <Button type="submit">
        <SearchOutline />
    </Button>
</ButtonGroup>