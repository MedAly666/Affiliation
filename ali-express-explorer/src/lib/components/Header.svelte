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

</script>

<Navbar
	class="w-full fixed start-0 top-0 z-20 bg-primary-100 dark:bg-primary-700 flex p-0 px-2"
>
		<NavBrand href="/">
			<img
				src={logo}
				class="h-10 rounded-full mr-2"
				alt="Deals Hunter Logo"
			/>
			<span
				class="self-center text-xl font-semibold whitespace-nowrap dark:text-white"
				>Deals Hunter</span
			>
		</NavBrand>
		
		<DarkMode
			class="text-primary-500 dark:text-primary-600 border dark:bg-gray-700 m-2"
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
</Navbar>
