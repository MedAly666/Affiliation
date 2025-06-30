<script lang="ts">
  import { Input } from "flowbite-svelte";
  import { SearchOutline } from "flowbite-svelte-icons";
    import { on } from "svelte/events";
  /*export let searchQuery: string;
  export let onSearch: (value: string) => void;*/

  let { searchQuery, onSearch } = $props();

  $effect(() => {
    onSearch(searchQuery);
  });
  
</script>

<header class="bg-gradient-to-r from-purple-600 to-blue-500 text-white py-8 px-4 shadow-md">
  <div class="container mx-auto">
    <h1 class="text-4xl font-bold mb-2 text-center">Deals Hunter</h1>
    <p class="text-center text-white/80 mb-6">Discover amazing deals updated daily</p>
    <div class="relative max-w-xl mx-auto">
      <Input
        class="pl-10"
        size="lg"
        placeholder="Search for products..."
        bind:value={searchQuery}
        oninput={(e) => onSearch((e.target && (e.target as HTMLInputElement).value) ?? "")}
      />
      <SearchOutline class="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
    </div>
  </div>
</header>
