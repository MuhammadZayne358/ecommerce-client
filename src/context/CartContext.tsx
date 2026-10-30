import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Cart } from "../types/cart";
import { useAuth } from "./AuthContext";
import { 
    getCart,
    addToCart as addToCartApi,
    removeCartItem as removeCartItemApi,
    updateCartItem as updateCartItemApi,
} from "../api/cartApi";

interface CartContextType {
    cart : Cart | null;
    loading : boolean;

    refreshCart :  () => Promise<void>;

    addToCart: (
        productId : number,
        quantity : number,
    ) => Promise<void>;
     
    updateCartItem : (
        itemId : number,
        quantity : number,
    ) => Promise<void>;

    removeCartItem : (
        itemId : number,
    ) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps{
    children : ReactNode;
}

export function CartProvider({
    children,
}: CartProviderProps) {
    const { user } = useAuth();

    const [cart, setCart] = useState<Cart | null>(null);
    const [loading, setLoading] = useState(false);

    const refreshCart = async () => {
        if(!user) {
            setCart(null);
            return;
        }
        try{
            setLoading(true);
            const data = await getCart();
            setCart(data);
        } catch (error){
            console.error("Failed to load Cart:", error);

            setCart(null);
        } finally{
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshCart();
    }, [user]);

    const addToCart = async (
        productId : number,
        quantity : number
    ) => {
        await addToCartApi({
            productId,
            quantity,
        });
        await refreshCart();
    };
    
    const updateCartItem = async (
        itemId : number,
        quantity : number,
    ) => {
        await updateCartItemApi(itemId,{
            quantity,
        });
        await refreshCart();
    };

     const removeCartItem = async (
        itemId : number
     ) => {
        await removeCartItemApi(itemId);

        await refreshCart();
     };

     return (
        <CartContext.Provider
        value={{
            cart,
            loading,
            refreshCart,
            addToCart,
            updateCartItem,
            removeCartItem,
        }}
        >
            {children}
        </CartContext.Provider>
     );
}

export function useCart(){
    const context = useContext(CartContext);

    if(!context){
        throw new Error (
            "useCart must be used inside CartProvider"
        );
    }
    return context;
}



       