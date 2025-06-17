import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Button } from '@heroui/button';
import { useNavigate } from 'react-router-dom';
import api from '../api/config';

interface OrderItem {
  productId: string;
  quantity: number;
}

interface CreateOrderDto {
  customerName: string;
  items: OrderItem[];
}

export function Checkout() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [customerName, setCustomerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const orderData: CreateOrderDto = {
        customerName,
        items: cart.items.map(item => ({
          productId: item.product.id.toString(),
          quantity: item.quantity
        }))
      };

      await api.post('/order', orderData);
      clearCart();
      navigate('/');
    } catch (err) {
      setError('Erro ao processar o pedido. Tente novamente.');
      console.error('Order error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Seu carrinho está vazio</h1>
          <Button
            onPress={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Voltar para produtos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Resumo do Pedido</h2>
          <div className="space-y-4">
            {cart.items.map((item) => (
              <div key={item.product.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <h3 className="font-medium">{item.product.name}</h3>
                  <p className="text-sm text-gray-600">Quantidade: {item.quantity}</p>
                </div>
                <span className="font-semibold">
                  ${(Number(item.product.price) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center font-bold text-lg">
                <span>Total</span>
                <span>${Number(cart.total).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Informações do Cliente</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
                Nome
              </label>
              <input
                type="text"
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
                className="w-full border rounded px-3 py-2"
                placeholder="Digite seu nome"
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {isSubmitting ? 'Processando...' : 'Finalizar Pedido'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
} 