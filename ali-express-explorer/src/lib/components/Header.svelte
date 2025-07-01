<script lang="ts">
	import {
		Button,
		Navbar,
		Input,
		NavBrand,
		ButtonGroup,
		DarkMode,
		NavHamburger,
	} from "flowbite-svelte";
	import logo from "$lib/assets/logo.png";
	import { SearchOutline } from "flowbite-svelte-icons";
	let { searchQuery, onSearch } = $props();

	$effect(() => {
		onSearch(searchQuery);
	});
</script>

<Navbar
	class="fixed start-0 top-0 z-20 bg-primary-100 dark:bg-primary-700 flex"
>
	{#snippet children({ hidden, toggle, NavContainer })}
		<NavHamburger class="dark:text-white" />
		<NavBrand href="/">
			<img
				src={logo}
				class="h-10 sm:h-9 rounded-2xl mr-2"
				alt="Deals Hunter Logo"
			/>
			<span
				class="self-center text-xl font-semibold whitespace-nowrap dark:text-white"
				>Deals Hunter</span
			>
		</NavBrand>
		{#if !hidden}
		<ButtonGroup>
			<Input
				class="w-96 border focus:outline-none"
				placeholder="Search for products..."
				bind:value={searchQuery}
				oninput={(e) =>
					onSearch(
						(e.target && (e.target as HTMLInputElement).value) ??
							"",
					)}
			/>
			<Button>
				<SearchOutline />
			</Button>
		</ButtonGroup>
		{/if}
		<DarkMode
			class="text-primary-500 dark:text-primary-600 border dark:bg-gray-700"
		/>

		<!--div class="flex items-center md:order-2">
		<Avatar id="avatar-menu" src="/images/profile-picture-3.webp" />
		<NavHamburger />
	</div>
	<Dropdown placement="bottom" triggeredBy="#avatar-menu">
		<DropdownHeader>
			<span class="block text-sm">Bonnie Green</span>
			<span class="block truncate text-sm font-medium"
				>name@Deals Hunter.com</span
			>
		</DropdownHeader>
		<DropdownHeader>Sign out</DropdownHeader>
	</Dropdown-->
	{/snippet}
</Navbar>
