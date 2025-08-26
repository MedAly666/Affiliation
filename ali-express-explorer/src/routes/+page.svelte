<script lang="ts">
    import logo from "$lib/assets/logo.png";
    import { Button, Card, Accordion, AccordionItem } from "flowbite-svelte";
</script>

<!-- Hero Section -->
<section
    class="relative flex flex-col items-center justify-center min-h-[70vh] bg-gradient-to-br from-primary-100 to-primary-300 dark:from-gray-900 dark:to-gray-800 p-8 mt-14 overflow-hidden"
>
    <div class="absolute inset-0 pointer-events-none">
        <div
            class="w-96 h-96 bg-primary-200/30 rounded-full blur-3xl absolute -top-24 -left-24 animate-pulse"
        ></div>
        <div
            class="w-80 h-80 bg-primary-400/20 rounded-full blur-2xl absolute bottom-0 right-0 animate-pulse"
        ></div>
    </div>
    <img
        src={logo}
        alt="Deals Hunter Logo"
        class="w-28 h-28 rounded-full shadow-lg mb-6 z-10"
    />
    <h1
        class="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 text-center z-10"
        dir="rtl"
    >
        !أفضل العروض من AliExpress بين يديك
    </h1>
    <p
        class="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl text-center z-10"
    >
        تصفح المنتجات الرائجة، قارن الأسعار، واشترِ بالذكاء! وفر الوقت والمال مع
        أدوات بحث متقدمة وتحديثات في الوقت الحقيقي.
    </p>
    <Button
        href="/search"
        size="xl"
        color="primary"
        class="z-10 shadow-lg hover:scale-105 transition-transform"
    >
        إبدأ التسوق الآن
    </Button>
</section>

<!-- Features Section -->
<section class="max-w-6xl mx-auto py-16 px-4 grid md:grid-cols-3 gap-2">
    <Card
        class="flex flex-col items-center text-center shadow-md hover:shadow-xl transition-shadow p-5"
    >
        <div class="bg-primary-100 dark:bg-primary-900 rounded-full p-4 mb-4">
            <svg
                class="w-10 h-10 text-primary-500 dark:text-primary-100"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3 10h4l3 8 4-16 3 8h4"
                />
            </svg>
        </div>
        <h2 class="text-xl font-bold mb-2 text-gray-900 dark:text-white">
            منتجات رائجة في الجزائر
        </h2>
        <p class="text-gray-600 dark:text-gray-400" dir="rtl">
            اكتشف ما يبحث عنه الجزائريون اليوم على AliExpress. التحديثات يومية
            ومباشرة!
        </p>
    </Card>
    <Card
        class="flex flex-col items-center text-center shadow-md hover:shadow-xl transition-shadow p-5"
    >
        <div class="bg-primary-100 dark:bg-primary-900 rounded-full p-4 mb-4">
            <svg
                class="w-10 h-10 text-primary-500 dark:text-primary-100"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
                />
            </svg>
        </div>
        <h2 class="text-xl font-bold mb-2 text-gray-900 dark:text-white">
            فلاتر بحث متقدمة
        </h2>
        <p class="text-gray-600 dark:text-gray-400">
            حدد السعر بالاليورو، نوع المنتج، أو التقييمات لتصل بسرعة لما تحتاجه.
        </p>
    </Card>
    <Card
        class="flex flex-col items-center text-center shadow-md hover:shadow-xl transition-shadow p-5"
    >
        <div class="bg-primary-100 dark:bg-primary-900 rounded-full p-4 mb-4">
            <svg
                class="w-10 h-10 text-primary-500 dark:text-primary-100"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 10c-4.418 0-8-1.79-8-4V6c0-2.21 3.582-4 8-4s8 1.79 8 4v8c0 2.21-3.582 4-8 4z"
                />
            </svg>
        </div>
        <h2 class="text-xl font-bold mb-2 text-gray-900 dark:text-white">
            تجربة سهلة وسلسة
        </h2>
        <p class="text-gray-600 dark:text-gray-400">
            واجهة عربية سهلة الفهم، مصممة لتناسبك سواء على الهاتف أو الكمبيوتر.
        </p>
    </Card>
</section>

<!-- How It Works Section -->
<section class="bg-white dark:bg-gray-900 py-16 px-4" dir="rtl">
    <div class="max-w-4xl mx-auto text-center mb-10">
        <h3 class="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            كيف يعمل الموقع؟
        </h3>
        <p class="text-gray-600 dark:text-gray-300">
            ثلاث خطوات بسيطة لتجد أفضل الصفقات
        </p>
    </div>
    <div class="grid md:grid-cols-3 gap-8 text-center">
        <div class="flex flex-col items-center">
            <div
                class="bg-primary-100 dark:bg-primary-900 rounded-full p-4 mb-4 text-2xl font-bold text-primary-500 dark:text-primary-100"
            >
                1
            </div>
            <h4 class="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                تصفح وابحث
            </h4>
            <p class="text-gray-600 dark:text-gray-400">
                استخدم محرك البحث الذكي أو تصفح أقسام المنتجات الرائجة.
            </p>
        </div>
        <div class="flex flex-col items-center">
            <div
                class="bg-primary-100 dark:bg-primary-900 rounded-full p-4 mb-4 text-2xl font-bold text-primary-500 dark:text-primary-100"
            >
                2
            </div>
            <h4 class="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                قارن واختر
            </h4>
            <p class="text-gray-600 dark:text-gray-400">
                قارن الأسعار والمواصفات بين مختلف المنتجات بسهولة.
            </p>
        </div>
        <div class="flex flex-col items-center">
            <div
                class="bg-primary-100 dark:bg-primary-900 rounded-full p-4 mb-4 text-2xl font-bold text-primary-500 dark:text-primary-100"
            >
                3
            </div>
            <h4 class="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                اشترِ ووفر
            </h4>
            <p class="text-gray-600 dark:text-gray-400">
                انقر على المنتج للشراء من AliExpress مباشرة بأفضل سعر.
            </p>
        </div>
    </div>
</section>

<!-- Testimonials / Trusted By Section -->
<section class="bg-primary-50 dark:bg-gray-800 py-12 px-4" dir="rtl">
    <div class="max-w-4xl mx-auto text-center mb-10">
        <h3 class="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            موثوق من آلاف المتسوقين الجزائريين
        </h3>
        <p class="text-gray-600 dark:text-gray-300">
            انضم إلى آلاف المستخدمين الذين يوفرون وقتهم وأموالهم كل يوم مع Deals
            Hunter.
        </p>
    </div>
    <div
        class="flex flex-col md:flex-row gap-2 justify-center max-w-4xl mx-auto"
    >
        <Card class="w-full md:w-1/3 bg-white dark:bg-gray-800 border-0 p-5">
            <p class="text-gray-700 dark:text-gray-200 italic mb-2">
                "لقيت أفضل الأسعار في ثواني، وفلترة المنتجات سهلت عليّ الشراء
                بزاف!"
            </p>
            <div class="flex items-center gap-2">
                <span class="font-bold text-primary-600">حورية م.</span>
                <span class="text-gray-400 text-sm">الجزائر العاصمة</span>
            </div>
        </Card>
        <Card class="w-full md:w-1/3 bg-white dark:bg-gray-800 border-0 p-5">
            <p class="text-gray-700 dark:text-gray-200 italic mb-2">
                "كل مرة نلقى منتجات جديدة وعروض هايلة. المنصة روعة!"
            </p>
            <div class="flex items-center gap-2">
                <span class="font-bold text-primary-600">عبد الرحمان ت.</span>
                <span class="text-gray-400 text-sm">وهران</span>
            </div>
        </Card>
        <Card class="w-full md:w-1/3 bg-white dark:bg-gray-800 border-0 p-5">
            <p class="text-gray-700 dark:text-gray-200 italic mb-2">
                "التطبيق خفيف وسهل الاستخدام. يخدم حتى مع 4G ضعيفة!"
            </p>
            <div class="flex items-center gap-2">
                <span class="font-bold text-primary-600">ليلى ز.</span>
                <span class="text-gray-400 text-sm">قسنطينة</span>
            </div>
        </Card>
    </div>
</section>

<!-- FAQ Section -->
<section class="max-w-4xl mx-auto py-16 px-4" dir="rtl">
    <div class="text-center mb-10">
        <h3 class="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            أسئلة شائعة
        </h3>
    </div>
    <Accordion class="dark:!border-gray-700">
        <AccordionItem>
            {#snippet header()}
                <span class="text-gray-900 dark:text-white"
                    >هل الموقع آمن للشراء؟</span
                >{/snippet}
            <p class="mb-2 text-gray-500 dark:text-gray-400">
                نعم، Deals Hunter هو محرك بحث للعروض. عند النقر على "شراء"، يتم
                توجيهك إلى صفحة المنتج على موقع AliExpress الرسمي والآمن لإتمام
                عملية الشراء.
            </p>
        </AccordionItem>
        <AccordionItem>
            {#snippet header()}<span class="text-gray-900 dark:text-white"
                    >كيف يتم تحديد المنتجات الرائجة؟</span
                >{/snippet}
            <p class="mb-2 text-gray-500 dark:text-gray-400">
                نقوم بتحليل البيانات من AliExpress لتحديد المنتجات الأكثر بحثاً
                وشراءً من قبل المستخدمين في الجزائر، ويتم تحديثها بشكل دوري.
            </p>
        </AccordionItem>
        <AccordionItem>
            {#snippet header()}
                <span class="text-gray-900 dark:text-white"
                    >هل الأسعار المعروضة هي نفسها على AliExpress؟</span
                >{/snippet}
            <p class="mb-2 text-gray-500 dark:text-gray-400">
                نعم، الأسعار هي نفسها تماماً. نحن نساعدك فقط في إيجاد أفضل
                العروض وتتبعها بسهولة.
            </p>
        </AccordionItem>
    </Accordion>
</section>
