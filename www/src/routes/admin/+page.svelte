<script>
    import { Avatar, Button, Card, P } from "flowbite-svelte";
    import { GoogleSolid } from "flowbite-svelte-icons";
    import logo from "$lib/assets/logo.png";
</script>

<Card
    class="flex flex-col items-center gap-4 border shadow-2xl place-self-center p-4 m-auto mt-20"
>
    <Avatar src={logo} />
    <h2 class="text-2xl font-bold text-center text-gray-600 dark:text-gray-400">
        Sign in to admin account
    </h2>

    <form method="POST" action="?/login" class="w-full">
        <Button outline color="primary"  class="w-full" type="submit">
            <GoogleSolid class="w-6 h-6 mr-2" />
            Sign in with Google
        </Button>
    </form>
    <P>*Other methodes to sign in will be added soon.</P>
</Card>
;l;
