import React, { useEffect, useState } from "react";
import { useProductStore } from "../stores/productStore";
import axiosInstance from "../utils/axiosConfig";

interface Product {
  id: number;
  title: string;
  sku: string;
  image_url: string;
  price: number;
  description: string | null;
}

interface ProductFormProps {
  product: Product | null;
  onClose: (updatedProduct?: Product) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onClose }) => {
  const [title, setTitle] = useState(product?.title || "");
  const [sku, setSku] = useState(product?.sku || "");
  const [price, setPrice] = useState(product?.price.toString() || "");
  const [description, setDescription] = useState(product?.description || "");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    product?.image_url || null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { updateProduct, addProduct } = useProductStore();

  useEffect(() => {
    // Reset form when product prop changes
    if (product) {
      setTitle(product.title);
      setSku(product.sku);
      setPrice(product.price.toString());
      setDescription(product.description || "");
      setImagePreview(product.image_url);
    } else {
      setTitle("");
      setSku("");
      setPrice("");
      setDescription("");
      setImagePreview(null);
    }
    setImage(null);
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("sku", sku);
    formData.append("price", price);
    if (description) formData.append("description", description);
    if (image) formData.append("image", image);

    try {
      let response;
      if (product) {
        response = await axiosInstance.put(
          `/products/${product.id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        updateProduct(response.data);
      } else {
        response = await axiosInstance.post("/products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        addProduct(response.data);
      }
      onClose(response.data);
    } catch (error) {
      console.error("Error saving product:", error);
      // Handle error (e.g., show error message to user)
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row">
      <div className="md:w-1/2 mb-4 md:mb-0 flex flex-col items-center">
        {imagePreview ? (
          <img
            src={imagePreview}
            alt={title || "Product image"}
            className="w-full h-64 object-contain bg-[#f4f7f6] rounded-lg mb-4"
          />
        ) : (
          <div className="w-full h-64 bg-[#f4f7f6] rounded-lg mb-4 flex items-center justify-center text-gray-400">
            No image selected
          </div>
        )}
        <input
          type="file"
          id="image"
          onChange={handleImageChange}
          accept="image/jpeg,image/png,image/jpg"
          className="w-full max-w-xs"
        />
      </div>
      <div className="md:w-1/2 md:pl-6 space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label
            htmlFor="sku"
            className="block text-sm font-medium text-gray-700"
          >
            SKU
          </label>
          <input
            type="text"
            id="sku"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700"
          >
            Price
          </label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div className="flex justify-end space-x-2 pt-4">
          <button
            type="button"
            onClick={() => onClose()}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : product ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ProductForm;
