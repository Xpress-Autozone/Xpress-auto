import { useState, useEffect } from "react";
import { getProductsByCategory, getAllProducts, getProductById } from "../lib/productService";

export function useProductsByCategory(category, options = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log(`[useProductsByCategory] 🚀 Fetching products for: ${category}`);
        const data = await getProductsByCategory(category, options);
        
        if (data.success) {
          console.log(`[useProductsByCategory] ✅ Success - ${data.data.length} products`);
          setProducts(data.data);
          setPagination(data.pagination);
        } else {
          throw new Error(data.message || "Failed to fetch products");
        }
      } catch (err) {
        console.error(`[useProductsByCategory] ❌ Error:`, err.message);
        setError(err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      fetchProducts();
    }
  }, [category, options.page, options.limit]);

  return { products, loading, error, pagination };
}

export function useAllProducts(options = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log(`[useAllProducts] 🚀 Fetching all products`);
        const data = await getAllProducts(options);
        
        if (data.success) {
          console.log(`[useAllProducts] ✅ Success - ${data.data.length} products`);
          setProducts(data.data);
          setPagination(data.pagination);
        } else {
          throw new Error(data.message || "Failed to fetch products");
        }
      } catch (err) {
        console.error(`[useAllProducts] ❌ Error:`, err.message);
        setError(err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [options.page, options.limit, options.sortBy]);

  return { products, loading, error, pagination };
}

export function useProduct(productId) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log(`[useProduct] 🚀 Fetching product: ${productId}`);
        const data = await getProductById(productId);
        
        console.log(`[useProduct] ✅ Success - ${data.itemName}`);
        setProduct(data);
      } catch (err) {
        console.error(`[useProduct] ❌ Error:`, err.message);
        setError(err.message);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  return { product, loading, error };
}
