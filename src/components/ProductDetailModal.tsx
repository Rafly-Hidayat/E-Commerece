import React, { useState } from "react";
import LazyImage from "./LazyImage";
import ProductForm from "./ProductForm";
import ConfirmationModal from "./ConfirmationModal";
import { useProductStore } from "../stores/productStore";
import axiosInstance from "../utils/axiosConfig";
import toast from "react-hot-toast";
import closeIcon from "../assets/closeicon.svg";

interface Product {
  id: number;
  title: string;
  sku: string;
  image_url: string;
  price: number;
  description: string | null;
}

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product: initialProduct,
  onClose,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(initialProduct);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const { updateProduct, deleteProduct } = useProductStore();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleFormClose = (updatedProduct?: Product) => {
    if (updatedProduct) {
      updateProduct(updatedProduct);
      setCurrentProduct(updatedProduct);
    }
    setIsEditing(false);
  };

  const handleDeleteClick = () => {
    setIsDeleteConfirmationOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    toast
      .promise(
        axiosInstance.delete(`/products/${currentProduct.id}`),
        {
          loading: "Deleting product...",
          success: () => {
            deleteProduct(currentProduct.id);
            onClose();
            return "Product deleted successfully";
          },
          error: (error) => {
            console.error("Error deleting product:", error);
            return "Failed to delete product. Please try again";
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
      )
      .finally(() => {
        setIsDeleting(false);
      });
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
        <div className="bg-white rounded-lg max-w-3xl w-full overflow-auto max-h-[90%] shadow-xl">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-semibold">
              {isEditing ? "Edit Product" : "Product Details"}
            </h2>
            <div
              className="hover:cursor-pointer"
              onClick={onClose}
            >
              <img
                src={closeIcon}
                className="h-4 w-4"
              />
            </div>
          </div>
          <div className="p-6">
            {isEditing ? (
              <ProductForm product={currentProduct} onClose={handleFormClose} />
            ) : (
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2 mb-4 md:mb-0 flex justify-center">
                  <LazyImage
                    src={currentProduct.image_url}
                    alt={currentProduct.title}
                    className="w-full h-64 object-contain bg-[#f4f7f6] rounded-lg"
                  />
                </div>
                <div className="md:w-1/2 md:pl-6">
                  <p className="text-gray-600 mb-2 text-2xl font-semibold">
                    {currentProduct.title}
                  </p>
                  <p className="text-xl font-bold text-green-600 mb-2">
                    ${currentProduct.price}
                  </p>
                  <p className="text-gray-700 mb-2">
                    SKU: {currentProduct.sku}
                  </p>
                  <p className="text-gray-700">{currentProduct.description}</p>
                </div>
              </div>
            )}
          </div>
          {!isEditing && (
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Edit Product
              </button>
              <button
                type="button"
                onClick={handleDeleteClick}
                disabled={isDeleting}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Delete Product
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={isDeleting}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
      <ConfirmationModal
        isOpen={isDeleteConfirmationOpen}
        onClose={() => setIsDeleteConfirmationOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Product"
        message={`Are you sure you want to delete "${currentProduct.title}"? This action cannot be undone.`}
      />
    </>
  );
};

export default ProductDetailModal;
