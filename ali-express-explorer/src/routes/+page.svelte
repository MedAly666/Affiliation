<script lang="ts">
  import Header from '$lib/components/Header.svelte';
  import Filters from '$lib/components/Filters.svelte';
  import ProductGrid from '$lib/components/ProductGrid.svelte';
  import ProductModal from '$lib/components/ProductModal.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { onMount } from 'svelte';
  import type { PageProps } from "./$types";
  import type { Product } from '$lib/index.js';

  let { data }: PageProps = $props();
  let products: Product[] = data.products || [];
  let error: string | null = data.error || null;

  let loading = false;

  // Calculate discount percentage
  const getDiscountPercentage = (
    originalPrice: number,
    currentPrice: number,
  ) => {
    if (!originalPrice || originalPrice <= currentPrice) return 0;
    return Math.round(
      ((originalPrice - currentPrice) / originalPrice) * 100,
    );
  };

  // Filter and sorting functionality
  let searchQuery = $state("");
  let minPrice = $state(0);
  let maxPrice = $state(100);
  let sortOption = $state("discount"); // discount, price-low, price-high, newest
  let favoriteProducts: string[] = $state([]);

  // Handle favorites
  function toggleFavorite(urlHash: string) {
    if (favoriteProducts.includes(urlHash)) {
      favoriteProducts = favoriteProducts.filter(id => id !== urlHash);
    } else {
      favoriteProducts = [...favoriteProducts, urlHash];
    }
    // Store in localStorage for persistence
    localStorage.setItem('favorites', JSON.stringify(favoriteProducts));
  }

  // Load favorites from localStorage on mount
  onMount(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      favoriteProducts = JSON.parse(storedFavorites);
    }
  });

  // Computed property for filtered products using the $derived rune instead of $: reactive statement
  let filteredProducts = $derived(products.filter(product => {
    // Search filter
    if (searchQuery && !product.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Price filter
    if (product.price < minPrice || product.price > maxPrice) {
      return false;
    }
    
    
    return true;
  }).sort((a, b) => {
    // Sorting
    switch (sortOption) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "newest":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case "discount":
      default:
        return getDiscountPercentage(b.original_price, b.price) - getDiscountPercentage(a.original_price, a.price);
    }
  }));

  // Pagination for infinite scroll
  let itemsPerPage = $state(20);
  let visibleItems = $derived(filteredProducts.slice(0, itemsPerPage));
  let isLoadingMore = $state(false);

  // Function to load more products
  function loadMoreProducts() {
    if (isLoadingMore || itemsPerPage >= filteredProducts.length) return;
    
    isLoadingMore = true;
    // Simulate loading delay
    setTimeout(() => {
      itemsPerPage += 12;
      isLoadingMore = false;
    }, 500);
  }

  // Modal and product details functionality
  let showProductModal = $state(false);
  let selectedProduct = $state<Product | null>(null);
  let productImages = $state<{image_url: string, image_alt: string}[]>([]);
  let productReviews = $state<{rating: number, content: string}[]>([]);
  
  // Function to open product modal
  async function openProductDetails(product: Product) {
    selectedProduct = product;
    showProductModal = true;
    
    try {
      // Use fetch to get data through our API routes instead of direct Supabase client
      // This way we avoid environment variable issues
      const imagesResponse = await fetch(`./api/product-images?productId=${product.product_id}`);
      if (imagesResponse.ok) {
        const images = await imagesResponse.json();
        productImages = images || [];
      } else {
        console.error('Error fetching product images');
        productImages = [{ image_url: product.image, image_alt: product.title }];
      }
      
      // If no images found, use the main product image
      if (productImages.length === 0) {
        productImages = [{ image_url: product.image, image_alt: product.title }];
      }
      
      // Get reviews through API as well
      const reviewsResponse = await fetch(`./api/product-reviews?productId=${product.product_id}`);
      if (reviewsResponse.ok) {
        const reviews = await reviewsResponse.json();
        productReviews = reviews || [];
      } else {
        console.error('Error fetching product reviews');
        productReviews = [];
      }
    } catch (error) {
      console.error('Error loading product details:', error);
      // Fallback with at least the main image
      productImages = [{ image_url: product.image, image_alt: product.title }];
    }
  }
  
  // Function to close product modal
  function closeProductModal() {
    showProductModal = false;
    // Clear the product details after a short delay to avoid UI flicker
    setTimeout(() => {
      selectedProduct = null;
      productImages = [];
      productReviews = [];
    }, 300);
  }
  

  // Set up intersection observer for infinite scroll
  let loadMoreTrigger: HTMLDivElement | null = $state(null);
  
  $effect(() => {
    if (!loadMoreTrigger) return;
    
    const observer = new IntersectionObserver(entries => {
      const [entry] = entries;
      if (entry.isIntersecting && !isLoadingMore && visibleItems.length < filteredProducts.length) {
        loadMoreProducts();
      }
    }, { rootMargin: '200px' });
    
    observer.observe(loadMoreTrigger);
    
    return () => {
      if (loadMoreTrigger) observer.unobserve(loadMoreTrigger);
    };
  });
</script>



<Header {searchQuery} onSearch={(v: string) => searchQuery = v} />

<main class="container mx-auto px-4 py-8">
  <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
    <div class="lg:col-span-1">
      <Filters
        {minPrice}
        {maxPrice}
        {sortOption}
        filteredCount={filteredProducts.length}
        onMinPrice={(v: number) => minPrice = v}
        onMaxPrice={(v: number) => maxPrice = v}
        onSort={(v: string) => sortOption = v}
      />
    </div>
    <div class="lg:col-span-3">
      {#if loading}
        <div class="flex justify-center items-center h-64">
          <span>Loading products...</span>
        </div>
      {:else if error}
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>Error: {error}</p>
          <p>Please try refreshing the page.</p>
        </div>
      {:else if filteredProducts.length === 0}
        <div class="text-center py-12 bg-gray-50 rounded-lg">
          <img src="/empty-state.svg" alt="No products found" class="w-32 h-32 mx-auto mb-4 opacity-50" />
          <p class="text-xl mb-2">No products found</p>
          <p class="text-gray-500">Try adjusting your search or filters</p>
        </div>
      {:else}
        <ProductGrid
          {visibleItems}
          {favoriteProducts}
          onToggleFavorite={toggleFavorite}
          onView={openProductDetails}
          {getDiscountPercentage}
          {loadMoreTrigger}
          {isLoadingMore}
          {loadMoreProducts}
          {filteredProducts}
        />
      {/if}
    </div>
  </div>
</main>

<ProductModal
  show={showProductModal}
  product={selectedProduct}
  images={productImages}
  reviews={productReviews}
  onClose={closeProductModal}
  {getDiscountPercentage}
/>

<Footer />

<style>
  /* Modal and carousel styles */
  :global(.carousel-container) {
    height: 100%;
  }
  
  :global(.carousel-item) {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  :global(.carousel img) {
    max-height: 100%;
    max-width: 100%;
    object-fit: contain;
  }
  
  :global(.carousel-indicators) {
    bottom: 0.5rem;
  }
  
  :global(.carousel-control-prev),
  :global(.carousel-control-next) {
    width: 3rem;
    height: 3rem;
    top: 50%;
    transform: translateY(-50%);
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 50%;
    opacity: 0.8;
  }
  
  :global(.carousel-control-prev:hover),
  :global(.carousel-control-next:hover) {
    opacity: 1;
    background-color: rgba(255, 255, 255, 0.8);
  }
</style>
