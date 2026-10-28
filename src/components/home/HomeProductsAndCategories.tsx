import categoriesApiServices from "@/services/categoriesService";
import productsApiServices from "@/services/productsService";
import { CategorySection, FeaturedProducts } from "./CatalogSections";

export default async function HomeProductsAndCategories() {

    
      const {data : featuredProducts} =  await productsApiServices.getProducts();
      const {data : categorySection} = await categoriesApiServices.getCategories();
    
      const category = categorySection.slice(0, 4);
      const product = featuredProducts.slice(0, 4);
    

  return (
    <>
    <CategorySection categories={category} />
    <FeaturedProducts products={product} />
    </>
  )
}
