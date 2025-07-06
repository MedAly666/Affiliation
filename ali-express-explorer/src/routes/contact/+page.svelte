<script lang="ts">
    import { Card, Button, Input, Textarea, Alert } from "flowbite-svelte";
    import Header from "$lib/components/Header.svelte";
    import Footer from "$lib/components/Footer.svelte";
    import { MailBoxSolid, FacebookSolid, PaperPlaneSolid } from "flowbite-svelte-icons";
    let name = "";
    let email = "";
    let message = "";
    let submitted = false;
    let error = "";
    function handleSubmit() {
        if (!name || !email || !message) {
            error = "Please fill in all fields.";
            return;
        }
        submitted = true;
        error = "";
        // Here you would send the message to your backend or email service
    }
</script>

<Header />
<section class="min-h-[80vh] flex flex-col items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 mt-15">
    <Card class="max-w-2xl w-full mx-auto p-8 md:p-12 shadow-lg">
        <h1 class="text-3xl font-bold text-center mb-2 text-primary-500 dark:text-primary-100">
            Contact Us
        </h1>
        <p class="text-gray-600 dark:text-gray-300 text-center mb-6">
            Have a question, suggestion, or partnership idea? Fill out the form below or reach us directly.
        </p>
        {#if submitted}
            <Alert color="green" class="mb-6">
                Thank you for reaching out! We’ll get back to you soon.
            </Alert>
        {:else}
            {#if error}
                <Alert color="red" class="mb-4">{error}</Alert>
            {/if}
            <form class="space-y-4" on:submit|preventDefault={handleSubmit}>
                <Input
                    placeholder="Your Name"
                    bind:value={name}
                    required
                />
                <Input
                    type="email"
                    placeholder="you@email.com"
                    bind:value={email}
                    required
                />
                <Textarea
                    placeholder="How can we help you?"
                    rows={4}
                    bind:value={message}
                    required
                />
                <Button type="submit" color="primary" size="lg" class="w-full">
                    Send Message
                </Button>
            </form>
        {/if}
        <div class="mt-8 text-center">
            <h2 class="text-lg font-semibold mb-2 text-primary-500 dark:text-primary-100">Other ways to reach us</h2>
            <div class="flex flex-col items-center gap-2">
                <a href="mailto:support@dealshunter.com" class="flex items-center gap-2 text-blue-600 hover:underline">
                    <MailBoxSolid class="w-5 h-5" /> support@dealshunter.com
                </a>
                <a href="https://facebook.com/dealshunter" target="_blank" class="flex items-center gap-2 text-blue-700 hover:underline">
                    <FacebookSolid class="w-5 h-5" /> Facebook
                </a>
                <a href="https://t.me/dealshunter" target="_blank" class="flex items-center gap-2 text-blue-500 hover:underline">
                    <PaperPlaneSolid class="w-5 h-5" /> Telegram
                </a>
            </div>
        </div>
    </Card>
</section>
<Footer />