import React, { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import axiosInstance from "../utils/axiosConfig";
import Navbar from "../components/NavbarComponent";
import LazyImage from "../components/LazyImage";
import ProductDetailModal from "../components/ProductDetailModal";

interface Product {
  id: number;
  title: string;
  sku: string;
  image_url: string;
  price: number;
  description: string | null;
}

interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const fetchProducts = async ({ pageParam }: { pageParam: number }) => {
  const response = await axiosInstance.get<ProductsResponse>(
    `/products?page=${pageParam}&pageSize=8`
  );
  return response.data;
};

const ProductListPage: React.FC = () => {
  const { ref, inView } = useInView();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
  });

  React.useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto p-4 px-6">
        <h1 className="text-2xl font-bold mb-4">Products</h1>
        {status === "pending" ? (
          <p>Loading...</p>
        ) : status === "error" ? (
          <p>
            Error:{" "}
            {error instanceof Error ? error.message : "An error occurred"}
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {data?.pages.map((page) =>
                page.products.map((product) => (
                  <div
                    key={product.id}
                    className="rounded-lg flex flex-col transition-transform duration-300 ease-in-out transform hover:scale-105 hover:cursor-pointer bg-white shadow-md"
                    onClick={() => handleProductClick(product)}
                  >
                    <LazyImage
                      src={product.image_url}
                      alt={product.title}
                      className="w-full h-48 object-contain mb-2 bg-[#f4f7f6] rounded-lg"
                    />
                    <div className="px-4 py-2">
                      <h2 className="text-lg font-semibold">{product.title}</h2>
                      <p className="text-green-600 font-bold mt-2">
                        ${product.price}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div ref={ref} className="mt-4 text-center">
              {isFetchingNextPage
                ? "Loading more..."
                : hasNextPage
                ? "Load More"
                : "No more products"}
            </div>
          </>
        )}
      </main>
      <ProductDetailModal
        product={selectedProduct}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default ProductListPage;
