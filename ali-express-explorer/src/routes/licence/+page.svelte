<script lang="ts">
  import { Card } from "flowbite-svelte";
  import Header from "$lib/components/Header.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import { FileOutline } from "flowbite-svelte-icons";
</script>

<Header />
<section class="min-h-[80vh] flex flex-col items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 mt-15">
  <Card class="max-w-3xl w-full mx-auto p-8 md:p-12 shadow-lg">
    <div class="flex items-center gap-3 mb-6">
      <FileOutline class="w-8 h-8 text-primary-500" />
      <h1 class="text-3xl font-bold text-primary-500 dark:text-primary-100">License</h1>
    </div>
    <p class="mb-6 text-gray-600 dark:text-gray-300">
      <span class="font-semibold">Deals Hunter</span> is an open-source project designed to help users discover trending products and the best deals on AliExpress. Please read the license terms below before using, modifying, or distributing this software.
    </p>
    <h2 class="text-xl font-semibold mb-2 text-primary-500 dark:text-primary-100">MIT License</h2>
    <pre class="bg-gray-100 dark:bg-gray-800 rounded p-4 text-xs overflow-x-auto mb-6 text-gray-700 dark:text-gray-200">
Copyright (c) {new Date().getFullYear()} Deals Hunter

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without page_sizeation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT page_sizeED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
    </pre>
    <h2 class="text-xl font-semibold mb-2 text-primary-500 dark:text-primary-100">Third-Party Libraries</h2>
    <p class="mb-4 text-gray-700 dark:text-gray-300">
      This project uses open-source libraries such as Svelte, Flowbite-Svelte, and others. Please refer to their respective licenses for usage details.
    </p>
    <h2 class="text-xl font-semibold mb-2 text-primary-500 dark:text-primary-100">Contact</h2>
    <p class="text-gray-700 dark:text-gray-300">
      For questions about licensing or commercial use, please contact us at
      <a href="mailto:support@dealshunter.com" class="text-blue-600 underline font-semibold">support@dealshunter.com</a>.
    </p>
  </Card>
</section>
<Footer />