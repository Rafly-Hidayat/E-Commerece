import { create } from 'zustand';
import axiosInstance from '../utils/axiosConfig';

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

interface ProductStore {
    products: Product[];
    currentPage: number;
    totalPages: number;
    isLoading: boolean;
    error: string | null;
    fetchProducts: (page: number) => Promise<void>;
    updateProduct: (updatedProduct: Product) => void;
    addProduct: (newProduct: Product) => void;
    deleteProduct: (productId: number) => void;
    importProducts: () => Promise<void>;
}

export const useProductStore = create<ProductStore>((set) => ({
    products: [],
    currentPage: 1,
    totalPages: 1,
    isLoading: false,
    error: null,
    fetchProducts: async (page: number) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get<ProductsResponse>(`/products?page=${page}&pageSize=8`);
            const { products, totalPages } = response.data;
            set((state) => ({
                products: page === 1 ? products : [...state.products, ...products],
                currentPage: page,
                totalPages,
                isLoading: false,
            }));
        } catch (error) {
            set({ error: 'Failed to fetch products', isLoading: false });
            console.log(error)
        }
    },
    updateProduct: (updatedProduct: Product) => {
        set((state) => ({
            products: state.products.map((product) =>
                product.id === updatedProduct.id ? { ...product, ...updatedProduct } : product
            ),
        }));
    },
    addProduct: (newProduct: Product) => {
        set((state) => ({
            products: [newProduct, ...state.products],
        }));
    },
    deleteProduct: (productId: number) => {
        set((state) => ({
            products: state.products.filter((product) => product.id !== productId),
        }));
    },
    importProducts: async () => {
        set({ isLoading: true, error: null });
        try {
            await axiosInstance.post('/products/import');
            set(() => ({
                isLoading: false,
            }));
        } catch (error) {
            set({ error: 'Failed to import products', isLoading: false });
            console.log(error);
        }
    },
}));