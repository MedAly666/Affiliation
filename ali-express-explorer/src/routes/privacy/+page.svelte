<script lang="ts">
  import Header from "$lib/components/Header.svelte";
import { Card, Alert } from "flowbite-svelte";
  import { ShieldCheckSolid } from "flowbite-svelte-icons";
</script>

<Header/>
<section
  class="min-h-[80vh] flex flex-col items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 mt-15"
>
  <Card class="max-w-3xl w-full mx-auto p-6 md:p-10 shadow-lg">
    <div class="flex items-center gap-3 mb-6">
      <ShieldCheckSolid class="w-8 h-8 text-primary-900" size="xl"/>
      <h1 class="text-4xl font-bold text-primary-900">Privacy Policy</h1>
    </div>
    <p class="mb-4 text-sm text-gray-500">
      Last updated: <span class="font-semibold text-gray-700 dark:text-gray-200"
        >July 2, 2025</span
      >
    </p>
    <Alert color="blue" class="mb-6">
      <span class="font-semibold">Your privacy is important to us.</span> This Privacy
      Policy explains how we collect, use, and protect your information when you
      use Deals Hunter (the "Service").
    </Alert>
    <h2 class="text-xl font-semibold mt-8 mb-2 text-primary-500 dark:text-primary-100">Information We Collect</h2>
    <ul class="list-disc ml-6 mb-4 text-gray-700 dark:text-gray-300">
      <li>
        Account information (such as your email address and name) when you sign
        up or log in.
      </li>
      <li>Product and review data you interact with on the Service.</li>
      <li>
        Usage data (such as pages visited, actions taken, and device/browser
        information).
      </li>
    </ul>
    <h2 class="text-xl font-semibold mt-8 mb-2 text-primary-500 dark:text-primary-100">How We Use Your Information</h2>
    <ul class="list-disc ml-6 mb-4 text-gray-700 dark:text-gray-300">
      <li>To provide and improve the Service.</li>
      <li>To personalize your experience.</li>
      <li>To communicate with you about updates or support.</li>
      <li>To analyze usage and trends to improve our features.</li>
    </ul>
    <h2 class="text-xl font-semibold mt-8 mb-2 text-primary-500 dark:text-primary-100">
      How We Protect Your Information
    </h2>
    <p class="mb-4 text-gray-700 dark:text-gray-300">
      We use industry-standard security measures to protect your data. Access to
      your information is page_sizeed to authorized personnel only.
    </p>
    <h2 class="text-xl font-semibold mt-8 mb-2 text-primary-500 dark:text-primary-100">Third-Party Services</h2>
    <p class="mb-4 text-gray-700 dark:text-gray-300">
      We may use third-party services (such as Supabase, Google, Facebook,
      Telegram) to provide authentication and sharing features. These services
      have their own privacy policies.
    </p>
    <h2 class="text-xl font-semibold mt-8 mb-2 text-primary-500 dark:text-primary-100">Your Choices</h2>
    <ul class="list-disc ml-6 mb-4 text-gray-700 dark:text-gray-300">
      <li>
        You can access, update, or delete your account information at any time.
      </li>
      <li>You may opt out of marketing communications.</li>
    </ul>
    <h2 class="text-xl font-semibold mt-8 mb-2 text-primary-500 dark:text-primary-100">Data Deletion</h2>
    <Alert color="yellow" class="mb-4">
      <span class="font-semibold"
        >You have the right to request deletion of your personal data at any
        time.</span
      >
      To delete your account and all associated data, please contact us at
      <a href="mailto:support@dealshunter.com" class="text-blue-600 underline"
        >support@dealshunter.com</a
      >. Upon receiving your request, we will promptly remove your information
      from our systems, except where retention is required by law.
    </Alert>
    <h2 class="text-xl font-semibold mt-8 mb-2 text-primary-500 dark:text-primary-100">Contact Us</h2>
    <p class="mb-2 text-gray-700 dark:text-gray-300">
      If you have any questions about this Privacy Policy, please contact us at
      <a
        href="mailto:support@dealshunter.com"
        class="text-blue-600 underline font-semibold">support@dealshunter.com</a
      >.
    </p>
  </Card>
</section>
