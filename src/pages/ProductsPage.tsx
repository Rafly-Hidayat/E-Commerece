import React, { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import Navbar from "../components/NavbarComponent";
import LazyImage from "../components/LazyImage";
import ProductDetailModal from "../components/ProductDetailModal";
import ProductForm from "../components/ProductForm";
import { useProductStore } from "../stores/productStore";
import closeIcon from "../assets/closeicon.svg";
import toast from "react-hot-toast";

interface Product {
  id: number;
  title: string;
  sku: string;
  image_url: string;
  price: number;
  description: string | null;
}

const ProductListPage: React.FC = () => {
  const { ref, inView } = useInView();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const {
    products,
    isLoading,
    error,
    currentPage,
    totalPages,
    fetchProducts,
    importProducts,
  } = useProductStore();

  useEffect(() => {
    fetchProducts(1);
  }, []);

  useEffect(() => {
    if (inView && currentPage < totalPages) {
      fetchProducts(currentPage + 1);
    }
  }, [inView, currentPage, totalPages]);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const handleCreateProduct = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleImportProducts = () => {
    toast.promise(
      importProducts(),
      {
        loading: "Importing products...",
        success: () => {
          fetchProducts(1);
          return "Product imported successfully!";
        },
        error: () => {
          return "Failed to import products. Please try again.";
        },
      },
      {
        style: {
          minWidth: "250px",
        },
        success: {
          duration: 5000,
        },
        error: {
          duration: 5000,
        },
      }
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Products</h1>
          {products.length > 0 && (
            <button
              onClick={handleCreateProduct}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Create New Product
            </button>
          )}
        </div>
        {isLoading && products.length === 0 ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : products.length === 0 ? (
          <div className="flex justify-center items-center space-x-4">
            <p className="text-xl">No products yet, Import them first!</p>
            <button
              onClick={handleImportProducts}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Import Products
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {products.map((product) => (
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
              ))}
            </div>
            <div ref={ref} className="mt-4 text-center">
              {isLoading
                ? "Loading more..."
                : currentPage < totalPages
                ? "Load More"
                : "No more products"}
            </div>
          </>
        )}
      </main>
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={handleCloseModal}
        />
      )}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full overflow-hidden shadow-xl">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold">Create New Product</h2>
              <div
                className="hover:cursor-pointer"
                onClick={handleCloseCreateModal}
              >
                <img src={closeIcon} className="h-4 w-4" />
              </div>
            </div>
            <div className="p-6">
              <ProductForm
                product={null}
                onClose={() => {
                  handleCloseCreateModal();
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductListPage;
