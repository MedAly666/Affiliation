<!-- login page -->
<script lang="ts">
    import { GoogleSolid } from "flowbite-svelte-icons";
    import { goto } from "$app/navigation";
    import { Button, Card } from "flowbite-svelte";
</script>

<Card
    class="flex flex-col place-content-center place-self-center p-4 m-auto text-center"
>
    <h1
        class="text-center text-4xl font-bold mb-4 text-gray-900 dark:text-white"
    >
        Deals Hunter
    </h1>
    <p class="text-center text-gray-600/80 mb-10">
        Discover amazing deals updated daily
    </p>

    <h5 class="font-bold mb-6 text-gray-900 dark:text-white">
        Login to Your Account
    </h5>
    <form action="?/login" method="POST" class="flex flex-col gap-4 w-full">
        <Button
            class="flex items-center gap-3 px-6 py-3 rounded-lg font-semibold text-md shadow transition"
            color="light"
            type="submit"
        >
            <GoogleSolid class="w-6 h-6" />
            Continue with Google
        </Button>
    </form>
</Card>
