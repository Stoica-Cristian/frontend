import { StarIcon } from "@heroicons/react/20/solid";
import {
  HeartIcon,
  ShoppingCartIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { Product } from "../../types/product";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import ToastContainer, { ToastData } from "../ui/ToastContainer";

type ProductCardProps = Product;

const ProductCard = ({
  id,
  name,
  price,
  oldPrice,
  image,
  rating,
  reviewCount,
}: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const showToast = (type: "success" | "error", message: string) => {
    const id = Date.now();
    setToasts((currentToasts) => [...currentToasts, { id, type, message }]);
  };

  const dismissToast = (id: number) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id)
    );
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      id: Number(id),
      name,
      price,
      image,
      alt: name,
    });
    showToast("success", `${name} has been added to cart!`);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();

    const productInWishlist = isInWishlist(Number(id));

    if (!productInWishlist) {
      addToWishlist({
        id: Number(id),
        name,
        price,
        image,
        alt: name,
      });
      showToast("success", `${name} has been added to wishlist!`);
    } else {
      removeFromWishlist(Number(id));
      showToast("success", `${name} has been removed from wishlist!`);
    }
  };

  return (
    <>
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      <div
        className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-square overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
          />
          {/* Overlay with buttons */}
          <div
            className={`absolute inset-0 bg-black/20 flex items-center justify-center gap-4 transition-opacity duration-200 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <button
              className="p-3 bg-white rounded-full shadow-md hover:bg-accent hover:text-white transition duration-200"
              onClick={() => {
                navigate(`/store/product/${id}`);
              }}
            >
              <EyeIcon className="h-5 w-5" />
            </button>
            <button
              className={`p-3 rounded-full shadow-md transition duration-200 ${
                isInWishlist(Number(id))
                  ? "bg-red-500 text-white"
                  : "bg-white hover:bg-red-500 hover:text-white"
              }`}
              onClick={handleWishlistToggle}
            >
              <HeartIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-2">{name}</h3>
          <div className="flex items-center gap-1 mb-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              ({reviewCount} reviews)
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-lg font-bold text-accent">${price}</div>
              {oldPrice && (
                <div className="text-sm text-gray-500 line-through">
                  ${oldPrice}
                </div>
              )}
            </div>
            <button
              className="flex items-center gap-2 px-3 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors duration-200"
              onClick={handleAddToCart}
            >
              <ShoppingCartIcon className="h-5 w-5" />
              <span className="text-sm font-medium">Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
