import { Button } from '@heroui/button';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export function Cart() {
  const { cart, removeFromCart, updateQuantity } = useCart();

  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="mb-8">Add some products to your cart to see them here.</p>
        <Link to="/">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded">
            Continue Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      <div className="space-y-4">
        {cart.items.map((item) => (
          <div
            key={item.product.id}
            className="flex items-center justify-between border-b pb-4"
          >
            <div className="flex items-center space-x-4">
              <img
                src={item.product.image[0]}
                alt={item.product.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div>
                <h3 className="font-semibold">{item.product.name}</h3>
                <p className="text-gray-600">${item.product.price}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                  className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                >
                  -
                </Button>
                <span className="w-8 text-center">{item.quantity}</span>
                <Button
                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                  className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                >
                  +
                </Button>
              </div>
              <Button
                onClick={() => removeFromCart(item.product.id)}
                className="text-red-600 hover:text-red-700"
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-between items-center">
        <div className="text-2xl font-bold">
          Total: ${cart.total.toFixed(2)}
        </div>
        <div className="space-x-4">
          <Link to="/">
            <Button className="bg-gray-200 hover:bg-gray-300 px-6 py-2 rounded">
              Continue Shopping
            </Button>
          </Link>
          <Link to="/checkout">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded">
              Proceed to Checkout
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 