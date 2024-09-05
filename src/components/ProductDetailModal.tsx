import React from "react";
import LazyImage from "./LazyImage";

interface Product {
  id: number;
  title: string;
  sku: string;
  image_url: string;
  price: number;
  description: string | null;
}

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
}) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full overflow-hidden shadow-xl">
        <div className="flex justify-between items-start p-4 border-b">
          <h2 className="text-xl font-semibold">Detail Product</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="p-6">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 mb-4 md:mb-0 flex justify-center">
              <LazyImage
                src={product.image_url}
                alt={product.title}
                className="w-full h-64 object-contain bg-[#f4f7f6] rounded-lg"
              />
            </div>
            <div className="md:w-1/2 md:pl-6">
              <p className="text-gray-600 mb-2 text-2xl font-semibold">{product.title}</p>
              <p className="text-2xl font-bold text-green-600 mb-4">
                ${product.price}
              </p>
              <p className="text-gray-700">{product.description}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Edit Product
          </button>
          <button
            type="button"
            onClick={onClose}
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
