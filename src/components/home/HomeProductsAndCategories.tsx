import { getCategories } from "@/services/categoriesService";
import { getProducts } from "@/services/productsService";
import { CategorySection, FeaturedProducts } from "./CatalogSections";

export default async function HomeProductsAndCategories() {
  const { data: featuredProducts } = await getProducts();
  const { data: categorySection } = await getCategories();

  const category = categorySection.slice(0, 4);
  const product = featuredProducts.slice(0, 4);

  return (
    <>
      <CategorySection categories={category} />
      <FeaturedProducts products={product} />
    </>
  );
}
