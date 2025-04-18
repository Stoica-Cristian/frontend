import { useState, useRef, useEffect } from "react";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  CurrencyDollarIcon,
  StarIcon,
  TagIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";
import { Product } from "../../types/product";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  getFilteredProducts: (products: Product[]) => Product[];
}

const ProductGrid = ({ getFilteredProducts }: ProductGridProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(12);
  const [sortOption, setSortOption] = useState("featured");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const gridRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    window.scrollTo({
      top: gridRef.current?.offsetTop ? gridRef.current.offsetTop - 20 : 0,
      behavior: "smooth",
    });
  }, [currentPage]);

  // Create mock products array
  const allProducts: Product[] = Array.from({ length: 27 }, (_, i) => ({
    id: i + 1,
    name: "Monstera Deliciosa",
    price: 49.99,
    image: "https://placehold.co/300x300",
    rating: 4.6,
    reviewCount: 89,
    category: "Indoor Plants",
  }));

  // Sort products
  const sortProducts = (products: Product[]) => {
    return [...products].sort((a, b) => {
      let comparison = 0;
      switch (sortOption) {
        case "price":
          comparison = a.price - b.price;
          break;
        case "rating":
          comparison = a.rating - b.rating;
          break;
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        default:
          return 0;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });
  };

  // Get filtered and sorted products
  const filteredProducts = getFilteredProducts(allProducts);
  const sortedProducts = sortProducts(filteredProducts);

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  const sortOptions = [
    { value: "featured", label: "Featured", icon: FunnelIcon },
    { value: "price", label: "Price", icon: CurrencyDollarIcon },
    { value: "rating", label: "Rating", icon: StarIcon },
    { value: "name", label: "Name", icon: TagIcon },
  ];

  return (
    <div>
      {/* Header */}
      <div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
        ref={gridRef}
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Products</h1>
          <p className="text-sm text-gray-500 mt-1">
            {sortedProducts.length} products found
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto">
          {/* Sort buttons */}
          <div className="flex flex-wrap items-center gap-1 sm:gap-2 w-full sm:w-auto">
            {sortOptions.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => {
                  if (sortOption === value) {
                    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                  } else {
                    setSortOption(value);
                    setSortDirection("asc");
                  }
                }}
                className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  sortOption === value
                    ? "bg-accent text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm">{label}</span>
                {sortOption === value && (
                  <>
                    {sortDirection === "asc" ? (
                      <ArrowUpIcon className="h-3 w-3" />
                    ) : (
                      <ArrowDownIcon className="h-3 w-3" />
                    )}
                  </>
                )}
              </button>
            ))}
          </div>

          {/* Products per page */}
          <div className="flex items-center gap-1 sm:gap-2 relative sm:ml-0">
            <select
              value={productsPerPage}
              onChange={(e) => setProductsPerPage(Number(e.target.value))}
              className="bg-gray-100 text-gray-700 text-xs sm:text-sm font-medium rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 appearance-none cursor-pointer hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="12">12</option>
              <option value="24">24</option>
              <option value="36">36</option>
            </select>
            <span className="text-xs sm:text-sm text-gray-500">per page</span>
          </div>
        </div>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 px-4 sm:px-2 md:px-0">
        {currentProducts.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-2 bg-white rounded-lg shadow px-3 py-2">
            <button
              onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowUpIcon className="h-5 w-5 -rotate-90" />
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`min-w-[2rem] h-8 rounded-md text-sm font-medium transition-colors ${
                      currentPage === page
                        ? "bg-accent text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>
            <button
              onClick={() =>
                setCurrentPage(Math.min(currentPage + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowUpIcon className="h-5 w-5 rotate-90" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
