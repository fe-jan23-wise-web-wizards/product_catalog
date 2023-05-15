import { useLocalStorage } from '@/hooks/useLocalStorage';
import { CartItem } from '@/types/CartItem';
import { useCallback, useMemo } from 'react';

export function useCart() {
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>('cart', []);

  const isAddedToCart = useCallback(
    (itemId: string) => {
      return cartItems.some(product => product.id === itemId);
    },
    [cartItems],
  );

  const addToCart = useCallback(
    (cartItem: CartItem) => {
      setCartItems(prev => {
        return isAddedToCart(cartItem.id) ? prev : [...prev, cartItem];
      });
    },
    [isAddedToCart, setCartItems],
  );

  const removeFromCart = useCallback(
    (itemId: string) => {
      setCartItems(prev => {
        return prev.filter(cartItem => cartItem.id !== itemId);
      });
    },
    [setCartItems],
  );

  const increaseQuantity = useCallback(
    (itemId: string) => {
      setCartItems(prev =>
        prev.map(cartItem => {
          return cartItem.id === itemId
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem;
        }),
      );
    },
    [setCartItems],
  );

  const decreaseQuantity = useCallback(
    (itemId: string) => {
      const cartItem = cartItems.find(cartItem => cartItem.id === itemId);

      return cartItem && cartItem.quantity === 1
        ? removeFromCart(itemId)
        : setCartItems(prev =>
            prev.map(cartItem => {
              return cartItem.id === itemId
                ? { ...cartItem, quantity: cartItem.quantity - 1 }
                : cartItem;
            }),
          );
    },
    [setCartItems, cartItems, removeFromCart],
  );

  const totalPrice = useMemo(() => {
    return cartItems.reduce((acc, cartItem) => {
      return acc + cartItem.price * cartItem.quantity;
    }, 0);
  }, [cartItems]);

  const totalQuantity = useMemo(() => {
    return cartItems.reduce((acc, cartItem) => {
      return acc + cartItem.quantity;
    }, 0);
  }, [cartItems]);

  return {
    cartItems,
    isAddedToCart,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    totalPrice,
    totalQuantity,
  } as const;
}
