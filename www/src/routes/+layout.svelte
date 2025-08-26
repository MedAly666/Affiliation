<script lang="ts">
    import Footer from "$lib/components/Footer.svelte";
    import Header from "$lib/components/Header.svelte";
	import "../app.css";

	let { children } = $props();
</script>

<svelte:head>
    <title>Deals Hunter - أفضل عروض AliExpress في الجزائر</title>
    <meta name="description" content="تصفح أفضل العروض والمنتجات الرائجة في الجزائر من AliExpress. قارن الأسعار، وفر الوقت والمال مع Deals Hunter - دليلك الأول للتسوق الذكي.">
    <meta name="keywords" content="AliExpress, الجزائر, عروض, تسوق, منتجات رائجة, تخفيضات, Deals Hunter, ديلز هنتر, عروض, تخفيضات, تسوق الجزائر, منتجات صينية, best deals, e-commerce, import, français, arabic, shopping">
    <link rel="canonical" href="https://dealshunter.vercel.app/">
 
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://dealshunter.vercel.app/">
    <meta property="og:title" content="Deals Hunter - أفضل عروض AliExpress في الجزائر">
    <meta property="og:description" content="تصفح أفضل العروض والمنتجات الرائجة في الجزائر من AliExpress. قارن الأسعار، وفر الوقت والمال مع Deals Hunter - دليلك الأول للتسوق الذكي.">
    <meta property="og:image" content="https://dealshunter.vercel.app/logo.png">

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="https://dealshunter.vercel.app/">
    <meta property="twitter:title" content="Deals Hunter - أفضل عروض AliExpress في الجزائر">
    <meta property="twitter:description" content="تصفح أفضل العروض والمنتجات الرائجة في الجزائر من AliExpress. قارن الأسعار، وفر الوقت والمال مع Deals Hunter - دليلك الأول للتسوق الذكي.">
    <meta property="twitter:image" content="https://dealshunter.vercel.app/logo.png">

    <!-- Structured Data -->
    <script type="application/ld+json">
        {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "url": "https://dealshunter.vercel.app/",
            "name": "Deals Hunter",
            "potentialAction": {
                "@type": "SearchAction",
                "target": "https://dealshunter.vercel.app/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
            }
        }
    </script>
    <script type="application/ld+json">
        {
            "@context": "https://schema.org",
            "@type": "Organization",
            "url": "https://dealshunter.vercel.app/",
            "logo": "https://dealshunter.vercel.app/logo.png",
            "name": "Deals Hunter"
        }
    </script>
</svelte:head>

<Header />
<main class="w-screen">
	{@render children()}
</main>
<Footer />
