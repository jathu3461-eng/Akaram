import React, { createContext, useContext, useReducer, type ReactNode } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Business {
  id: string;
  name: string;
  category: string;
  location: string;
  rating: number;
  reviews: number;
  image: string;
  phone: string;
  website?: string;
  description?: string;
  address?: string;
  hours?: string;
  email?: string;
}

export interface MarketplaceItem {
  id: string;
  title: string;
  price: number;
  category: string;
  image: string;
  description: string;
  seller: string;
  sellerPhone: string;
  location: string;
  postedDate: string;
  condition?: string;
}

export interface CartItem extends MarketplaceItem {
  quantity: number;
}

export interface Obituary {
  id: string;
  name: string;
  age: string;
  date: string;
  hometown: string;
  image: string;
  notice?: string;
  candles: number;
  condolences: Condolence[];
}

export interface Condolence {
  id: string;
  author: string;
  message: string;
  date: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image: string;
  category: string;
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}

// ─── State ───────────────────────────────────────────────────────────────────

interface AppState {
  cart: CartItem[];
  isAuthenticated: boolean;
  user: User | null;
  savedListings: string[];
  activeAds: string[];
}

const initialState: AppState = {
  cart: [],
  isAuthenticated: false,
  user: null,
  savedListings: [],
  activeAds: [],
};

// ─── Actions ─────────────────────────────────────────────────────────────────

type Action =
  | { type: 'ADD_TO_CART'; payload: MarketplaceItem }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'TOGGLE_SAVED_LISTING'; payload: string }
  | { type: 'ADD_ACTIVE_AD'; payload: string }
  | { type: 'REMOVE_ACTIVE_AD'; payload: string };

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existing = state.cart.find((item) => item.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          cart: state.cart.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        cart: [...state.cart, { ...action.payload, quantity: 1 }],
      };
    }
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.payload),
      };
    case 'UPDATE_CART_QUANTITY':
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          cart: state.cart.filter((item) => item.id !== action.payload.id),
        };
      }
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    case 'LOGIN':
      return { ...state, isAuthenticated: true, user: action.payload };
    case 'LOGOUT':
      return { ...state, isAuthenticated: false, user: null };
    case 'TOGGLE_SAVED_LISTING': {
      const isSaved = state.savedListings.includes(action.payload);
      return {
        ...state,
        savedListings: isSaved
          ? state.savedListings.filter((id) => id !== action.payload)
          : [...state.savedListings, action.payload],
      };
    }
    case 'ADD_ACTIVE_AD':
      return { ...state, activeAds: [...state.activeAds, action.payload] };
    case 'REMOVE_ACTIVE_AD':
      return {
        ...state,
        activeAds: state.activeAds.filter((id) => id !== action.payload),
      };
    default:
      return state;
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  // Convenience helpers
  addToCart: (item: MarketplaceItem) => void;
  removeFromCart: (id: string) => void;
  updateCartQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartItemCount: number;
  cartTotal: number;
  login: (user: User) => void;
  logout: () => void;
  toggleSavedListing: (id: string) => void;
  isListingSaved: (id: string) => boolean;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const addToCart = (item: MarketplaceItem) =>
    dispatch({ type: 'ADD_TO_CART', payload: item });
  const removeFromCart = (id: string) =>
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  const updateCartQuantity = (id: string, quantity: number) =>
    dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { id, quantity } });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });
  const login = (user: User) => dispatch({ type: 'LOGIN', payload: user });
  const logout = () => dispatch({ type: 'LOGOUT' });
  const toggleSavedListing = (id: string) =>
    dispatch({ type: 'TOGGLE_SAVED_LISTING', payload: id });
  const isListingSaved = (id: string) => state.savedListings.includes(id);

  const cartItemCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = state.cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartItemCount,
        cartTotal,
        login,
        logout,
        toggleSavedListing,
        isListingSaved,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppStore must be used within an AppProvider');
  }
  return context;
}
