// Helper function to get product image URL
// API returns 'images' as an array, but some components expect 'image' as a string
export const getProductImage = (product) => {
  if (!product) return null;
  
  // Handle 'images' array from API
  if (product.images && Array.isArray(product.images) && product.images.length > 0) {
    const imageUrl = product.images[0];
    // Encode Vietnamese characters in URL
    return encodeImageUrl(imageUrl);
  }
  
  // Handle single 'image' field
  if (product.image) {
    return encodeImageUrl(product.image);
  }
  
  return null;
};

// Get all product images
export const getProductImages = (product) => {
  if (!product) return [];
  
  if (product.images && Array.isArray(product.images)) {
    return product.images.map(url => encodeImageUrl(url));
  }
  
  if (product.image) {
    return [encodeImageUrl(product.image)];
  }
  
  return [];
};

// Encode special characters in image URL (Vietnamese, spaces, etc.)
export const encodeImageUrl = (url) => {
  if (!url) return null;
  
  // Split URL into path segments and encode each part
  try {
    // Extract the path part if it's a full URL
    const parts = url.split('/');
    const encodedParts = parts.map((part, index) => {
      // Skip empty parts and protocol parts
      if (!part || part === '' || part === 'images') return part;
      // Encode the filename/folder name
      return encodeURIComponent(part);
    });
    return encodedParts.join('/');
  } catch (error) {
    console.error('Error encoding image URL:', error);
    return url;
  }
};

// Get product stock quantity
export const getProductStock = (product) => {
  if (!product) return 0;
  return product.stock || product.stock_quantity || product.stockQuantity || 0;
};

// Get product category name
export const getProductCategoryName = (product) => {
  if (!product) return '';
  
  // API returns category_id as populated object
  if (product.category_id && typeof product.category_id === 'object') {
    return product.category_id.name || '';
  }
  
  // Some endpoints may return category
  if (product.category && typeof product.category === 'object') {
    return product.category.name || '';
  }
  
  return '';
};

export default {
  getProductImage,
  getProductImages,
  encodeImageUrl,
  getProductStock,
  getProductCategoryName
};
