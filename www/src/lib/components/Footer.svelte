<script lang="ts">
    import { Footer, FooterCopyright, FooterLinkGroup, FooterLink } from "flowbite-svelte";

</script>
<Footer class="py-8 mt-5 flex items-center">
  <FooterCopyright href="/" by="Deals Hunter" year={2025} />
  <FooterLinkGroup class="mt-3 flex flex-wrap items-center text-sm text-gray-500 sm:mt-0 dark:text-gray-400">
    <FooterLink href="/about">About</FooterLink>
    <FooterLink href="/privacy">Privacy Policy</FooterLink>
    <FooterLink href="/licence">Licensing</FooterLink>
    <FooterLink href="/contact">Contact</FooterLink>
  </FooterLinkGroup>
</Footer>
