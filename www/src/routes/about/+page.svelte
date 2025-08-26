<script lang="ts">
    import { Card, Button } from "flowbite-svelte";
    import logo from "$lib/assets/logo.png";
    import Header from "$lib/components/Header.svelte";
    import Footer from "$lib/components/Footer.svelte";
</script>

<Header />
<section
    class="min-h-[80vh] flex flex-col items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 mt-15"
>
    <Card class="max-w-3xl w-full mx-auto p-8 md:p-12 shadow-lg">
        <div class="flex flex-col items-center mb-8">
            <img
                src={logo}
                alt="Deals Hunter Logo"
                class="w-20 h-20 rounded-full shadow mb-4"
            />
            <h1
                class="text-3xl font-bold text-center mb-2 text-primary-500 dark:text-primary-100"
            >
                About Deals Hunter
            </h1>
            <p class="text-gray-600 dark:text-gray-300 text-center max-w-xl">
                Deals Hunter is your smart companion for discovering trending
                products and the best deals on AliExpress. Our mission is to
                make online shopping easier, faster, and more rewarding for
                everyone.
            </p>
        </div>
        <div class="grid md:grid-cols-2 gap-8 my-8">
            <div>
                <h2
                    class="text-xl font-semibold mb-2 text-primary-500 dark:text-primary-100"
                >
                    Why Choose Us?
                </h2>
                <ul class="list-disc ml-6 text-gray-700 dark:text-gray-300">
                    <li>Curated trending products updated daily</li>
                    <li>Advanced filters for price, category, and more</li>
                    <li>Modern, intuitive, and mobile-friendly design</li>
                    <li>Secure authentication and privacy-first approach</li>
                </ul>
            </div>
            <div>
                <h2
                    class="text-xl font-semibold mb-2 text-primary-500 dark:text-primary-100"
                >
                    Our Story
                </h2>
                <p class="text-gray-700 dark:text-gray-300">
                    Founded by passionate tech enthusiasts and deal hunters, our
                    team wanted to solve the problem of information overload and
                    help shoppers save both time and money. We believe everyone
                    deserves a smarter way to shop online.
                </p>
            </div>
        </div>
        <div class="flex flex-col items-center mt-8">
            <h2
                class="text-xl font-semibold mb-2 text-primary-500 dark:text-primary-100"
            >
                Get in Touch
            </h2>
            <p class="text-gray-700 dark:text-gray-300 mb-4 text-center">
                Have questions, feedback, or partnership ideas? We’d love to
                hear from you!
            </p>
            <Button
                href="mailto:support@dealshunter.com"
                color="primary"
                size="lg"
            >
                Contact Us
            </Button>
        </div>
    </Card>
</section>
