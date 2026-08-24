/**
 * Vietnamese slug generator and URL helpers for Products and Articles
 */

/**
 * Convert any string (including Vietnamese with diacritics) into a clean URL-friendly slug
 */
export function createSlug(text: string): string {
  if (!text) return "";

  let str = text.trim().toLowerCase();

  // Normalize Unicode
  str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Replace Vietnamese specific letters
  str = str
    .replace(/[đĐ]/g, "d")
    .replace(/[áàảãạăắằẳẵặâấầẩẫậ]/g, "a")
    .replace(/[éèẻẽẹêếềểễệ]/g, "e")
    .replace(/[íìỉĩị]/g, "i")
    .replace(/[óòỏõọôốồổỗộơớờởỡợ]/g, "o")
    .replace(/[úùủũụưứừửữự]/g, "u")
    .replace(/[ýỳỷỹỵ]/g, "y");

  // Remove special characters, keep only alphanumeric and spaces/hyphens
  str = str.replace(/[^a-z0-9\s-]/g, "");

  // Replace multiple spaces or hyphens with a single hyphen
  str = str.replace(/[\s-]+/g, "-");

  // Trim hyphens from beginning and end
  str = str.replace(/^-+|-+$/g, "");

  return str;
}

/**
 * Generate Product URL Slug (format: mã-tên-sản-phẩm or custom slug)
 */
export function getProductSlug(product?: { sku?: string; name?: string; slug?: string; id?: string }): string {
  if (!product) return "san-pham";
  if (product.slug && product.slug.trim() !== "") {
    return createSlug(product.slug);
  }
  const skuPart = product.sku ? createSlug(product.sku) : "";
  const namePart = product.name ? createSlug(product.name) : "";
  if (skuPart && namePart) {
    return `${skuPart}-${namePart}`;
  }
  return namePart || skuPart || (product.id ? createSlug(product.id) : "san-pham");
}

/**
 * Full relative path for Product
 */
export function getProductUrl(product?: { sku?: string; name?: string; slug?: string; id?: string }): string {
  return `/san-pham/${getProductSlug(product)}`;
}

/**
 * Generate Article URL Slug (format: tên-tiêu-đề-bài-viết or custom slug)
 */
export function getArticleSlug(article: { title: string; slug?: string }): string {
  if (article.slug && article.slug.trim() !== "") {
    return createSlug(article.slug);
  }
  return createSlug(article.title) || "bai-viet";
}

/**
 * Full relative path for Article
 */
export function getArticleUrl(article: { title: string; slug?: string; id?: string }): string {
  return `/bai-viet/${getArticleSlug(article)}`;
}
