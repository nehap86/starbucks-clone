import React, { useState, useEffect, createContext, useContext, useReducer, useMemo } from 'react';
import {
    Coffee, MapPin, ShoppingBag, User, Menu as MenuIcon, X, ChevronRight,
    ChevronDown, Search, Heart, Star, CreditCard, Gift, Loader2, CheckCircle,
    Minus, Plus, ArrowLeft, Info
} from 'lucide-react';

// --- MOCK DATA ---

const USER_DATA = {
    id: 'u1',
    firstName: 'Neha',
    lastName: 'Pawar',
    email: 'neha@example.com',
    stars: 125,
    favorites: ['28498'] // ID of Iced Vanilla Protein Latte
};

const MENU_CATEGORIES = [
    { id: 'drinks', name: 'Drinks', subcategories: ['Hot Coffees', 'Cold Coffees', 'Starbucks Refreshers Beverages', 'Frappuccino Blended Beverages', 'Iced Tea & Lemonade', 'Hot Teas', 'Milk, Juice & More', 'Bottled Beverages'] },
    { id: 'food', name: 'Food', subcategories: ['Hot Breakfast', 'Oatmeal & Yogurt', 'Bakery', 'Lunch', 'Snacks & Sweets'] },
    { id: 'athome', name: 'At Home Coffee', subcategories: ['Whole Bean', 'Ground', 'VIA Instant', 'K-Cup Pods'] },
    { id: 'merch', name: 'Merchandise', subcategories: ['Cold Cups', 'Tumblers', 'Mugs', 'Water Bottles'] },
];

const MENU_ITEMS = [
    {
        id: '28498',
        name: 'Iced Vanilla Protein Latte',
        category: 'Cold Coffees',
        image: 'https://globalassets.starbucks.com/digitalassets/products/bev/SBX20220607_IcedVanillaLatte.jpg?impolicy=1by1_wide_topright_630', // Placeholder
        calories: 270,
        price: 6.75,
        description: 'Starbucks Reserve® espresso shots, vanilla syrup and milk, served over ice.',
        customizations: {
            size: ['Tall', 'Grande', 'Venti'],
            milk: ['2% Milk', 'Whole Milk', 'Nonfat Milk', 'Oatmilk', 'Almondmilk', 'Soymilk'],
            shots: 2,
            pumps: 4
        }
    },
    {
        id: '1',
        name: 'Caffè Latte',
        category: 'Hot Coffees',
        image: 'https://globalassets.starbucks.com/digitalassets/products/bev/SBX20190617_CaffeLatte.jpg?impolicy=1by1_wide_topright_630',
        calories: 190,
        price: 4.95,
        description: 'Dark, rich espresso balanced with steamed milk and a light layer of foam.',
        properties: ['Hot']
    },
    {
        id: '2',
        name: 'Pistachio Latte',
        category: 'Hot Coffees',
        image: 'https://globalassets.starbucks.com/digitalassets/products/bev/SBX20211217_PistachioLatte.jpg?impolicy=1by1_wide_topright_630',
        calories: 320,
        price: 5.75,
        description: 'Cozy flavors of sweet pistachio and rich brown butter paired with espresso and steamed milk.',
        properties: ['Seasonal', 'Hot']
    },
    {
        id: '3',
        name: 'Caramel Macchiato',
        category: 'Hot Coffees',
        image: 'https://globalassets.starbucks.com/digitalassets/products/bev/SBX20190617_CaramelMacchiato.jpg?impolicy=1by1_wide_topright_630',
        calories: 250,
        price: 5.45,
        description: 'Freshly steamed milk with vanilla-flavored syrup marked with espresso and topped with a caramel drizzle.',
        properties: ['Hot']
    },
    {
        id: '4',
        name: 'Iced Brown Sugar Oatmilk Shaken Espresso',
        category: 'Cold Coffees',
        image: 'https://globalassets.starbucks.com/digitalassets/products/bev/SBX20210217_IcedBrownSugarOatmilkShakenEspresso.jpg?impolicy=1by1_wide_topright_630',
        calories: 120,
        price: 5.95,
        description: 'First we shake Starbucks® Blonde espresso, brown sugar and cinnamon together, and then we top it off with oatmilk and ice.',
        properties: ['Cold', 'Vegan']
    },
    {
        id: '5',
        name: 'Pink Drink Starbucks Refreshers® Beverage',
        category: 'Starbucks Refreshers Beverages',
        image: 'https://globalassets.starbucks.com/digitalassets/products/bev/SBX20190617_PinkDrink.jpg?impolicy=1by1_wide_topright_630',
        calories: 140,
        price: 5.25,
        description: 'Our crisp, Strawberry Açaí Refreshers® Beverage, with its accents of passion fruit, is combined with creamy coconutmilk.',
        properties: ['Cold']
    },
    {
        id: '6',
        name: 'Bacon, Gouda & Egg Sandwich',
        category: 'Hot Breakfast',
        image: 'https://globalassets.starbucks.com/digitalassets/products/food/SBX20190617_BaconGoudaEggSandwich.jpg?impolicy=1by1_wide_topright_630',
        calories: 360,
        price: 5.95,
        description: 'Sizzling applewood-smoked bacon, parmesan-style frittata and aged gouda on an artisan roll.',
        properties: []
    }
];

const STORES = [
    { id: 's1', name: 'Lincoln Hwy and Merrillville R', address: '725 W 81st Ave, Merrillville', distance: '1.1 mi', status: 'Open until 9:00 PM' },
    { id: 's2', name: 'Merrillville-Rte 30 & Mississipp', address: '1613 Southlake Mall, Merrillville', distance: '1.3 mi', status: 'Open until 9:00 PM' },
];

// --- CONTEXTS ---

const AuthContext = createContext();
const CartContext = createContext();
const OrderContext = createContext();

// --- PROVIDERS ---

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate initial auth check
        setTimeout(() => {
            // Auto-login for demo mostly, or start logged out
            // setUser(USER_DATA); 
            setLoading(false);
        }, 500);
    }, []);

    const login = (email, password) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                setUser(USER_DATA);
                resolve(USER_DATA);
            }, 800);
        });
    };

    const logout = () => setUser(null);

    const value = { user, login, logout, isAuthenticated: !!user, loading };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [pickupStore, setPickupStore] = useState(STORES[0]);

    const addToCart = (item, quantity, customizations) => {
        const newItem = {
            cartId: Date.now().toString(),
            item,
            quantity,
            customizations
        };
        setCartItems(prev => [...prev, newItem]);
        setIsCartOpen(true);
    };

    const removeFromCart = (cartId) => {
        setCartItems(prev => prev.filter(item => item.cartId !== cartId));
    };

    const updateQuantity = (cartId, delta) => {
        setCartItems(prev => prev.map(item => {
            if (item.cartId === cartId) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const clearCart = () => setCartItems([]);

    const cartTotal = cartItems.reduce((sum, cartItem) => {
        let price = cartItem.item.price;
        // Simple logic for customizations price
        if (cartItem.customizations.size === 'Venti') price += 0.80;
        if (cartItem.customizations.size === 'Grande') price += 0.50;
        if (cartItem.customizations.extraShots > 0) price += (cartItem.customizations.extraShots * 1.00);
        return sum + (price * cartItem.quantity);
    }, 0);

    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const value = {
        cartItems, addToCart, removeFromCart, updateQuantity, clearCart,
        isCartOpen, setIsCartOpen, pickupStore, setPickupStore,
        cartTotal, itemCount
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

const OrderProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);
    const [activeOrder, setActiveOrder] = useState(null);

    const placeOrder = (cartItems, total, store) => {
        const newOrder = {
            id: Math.floor(Math.random() * 1000000).toString(),
            items: cartItems,
            total,
            store,
            status: 'Placed',
            timestamp: new Date().toISOString(),
            estimatedTime: new Date(Date.now() + 15 * 60000).toISOString() // 15 mins later
        };
        setOrders(prev => [newOrder, ...prev]);
        setActiveOrder(newOrder);
        return newOrder;
    };

    return <OrderContext.Provider value={{ orders, activeOrder, placeOrder }}>{children}</OrderContext.Provider>;
};

// Create a UI Context to pass setPage easily to CartDrawer without prop drilling through Layout
const UIContext = createContext();

// --- COMPONENTS ---

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
    const baseStyle = "rounded-full font-semibold transition-all duration-200 px-4 py-2 text-sm sm:text-base";
    const variants = {
        primary: "bg-starbucks-green text-white hover:bg-starbucks-dark shadow-md",
        secondary: "bg-black text-white hover:bg-gray-800",
        outline: "border border-starbucks-green text-starbucks-green hover:bg-starbucks-light/20",
        ghost: "text-gray-700 hover:bg-gray-100",
        link: "text-starbucks-green underline hover:no-underline p-0"
    };

    return (
        <button className={`${baseStyle} ${variants[variant]} ${className} disabled:opacity-50 disabled:cursor-not-allowed`} {...props}>
            {children}
        </button>
    );
};

const Header = ({ setPage }) => {
    const { user, logout } = useContext(AuthContext);
    const { itemCount, setIsCartOpen } = useContext(CartContext);

    return (
        <header className="sticky top-0 z-50 bg-white shadow-sm font-sans">
            <div className="max-w-7xl mx-auto px-4 lg:px-6 h-[80px] flex items-center justify-between">
                <div className="flex items-center gap-8 h-full">
                    {/* Logo */}
                    <button onClick={() => setPage('home')} className="flex-shrink-0">
                        <img
                            src="https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Starbucks_Corporation_Logo_2011.svg/1200px-Starbucks_Corporation_Logo_2011.svg.png"
                            alt="Starbucks"
                            className="h-10 w-10 md:h-12 md:w-12"
                        />
                    </button>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-6 h-full font-bold text-sm tracking-wide uppercase text-gray-800">
                        <button onClick={() => setPage('menu')} className="hover:text-starbucks-green h-full border-b-4 border-transparent hover:border-starbucks-green flex items-center">Menu</button>
                        <button className="hover:text-starbucks-green h-full border-b-4 border-transparent hover:border-starbucks-green flex items-center">Rewards</button>
                        <button className="hover:text-starbucks-green h-full border-b-4 border-transparent hover:border-starbucks-green flex items-center">Gift Cards</button>
                    </nav>
                </div>

                <div className="flex items-center gap-2 md:gap-4">
                    <div className="hidden md:flex items-center gap-2 mr-2 text-sm font-semibold hover:text-starbucks-green cursor-pointer">
                        <MapPin size={20} />
                        <span>Find a store</span>
                    </div>

                    {!user ? (
                        <div className="flex items-center gap-2">
                            <Button variant="outline" onClick={() => setPage('signin')} className="hidden sm:block">Sign in</Button>
                            <Button variant="secondary" onClick={() => setPage('signup')} className="hidden sm:block">Join now</Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <span className="hidden sm:block font-semibold">Hello, {user.firstName}</span>
                            <Button variant="ghost" onClick={logout} size="sm">Log out</Button>
                        </div>
                    )}

                    <button onClick={() => setIsCartOpen(true)} className="relative p-2 text-gray-700 hover:text-starbucks-green transition-colors">
                        <ShoppingBag size={24} fill={itemCount > 0 ? "currentColor" : "none"} />
                        {itemCount > 0 && (
                            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                                {itemCount}
                            </span>
                        )}
                    </button>

                    <button className="md:hidden p-2 text-gray-700">
                        <MenuIcon size={24} />
                    </button>
                </div>
            </div>
        </header>
    );
};

// --- PAGES ---

const HomePage = ({ setPage }) => {
    return (
        <div className="animate-fade-in">
            {/* Hero 1 - Rewards */}
            <section className="bg-starbucks-light min-h-[400px] flex flex-col md:flex-row items-center">
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center items-start text-left">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 text-starbucks-dark">
                        FREE COFFEE IS A TAP AWAY
                    </h2>
                    <p className="text-xl mb-8 text-gray-700">Join now to start earning Rewards.</p>
                    <Button variant="primary" onClick={() => setPage('signup')}>Join now</Button>
                </div>
                <div className="w-full md:w-1/2 h-full min-h-[300px] bg-cover bg-center" style={{ backgroundImage: 'url("https://content-prod-live.cert.starbucks.com/binary/v2/asset/137-81151.jpg")' }}></div>
            </section>

            {/* Hero 2 - Promo */}
            <section className="bg-starbucks-green text-white min-h-[400px] flex flex-col md:flex-row-reverse items-center">
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center items-start text-left">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Caramel protein is here
                    </h1>
                    <p className="text-xl mb-8">
                        Power up with a new Caramel Protein Latte or Matcha, with Protein-boosted Milk for up to 31g of protein per grande.
                    </p>
                    <Button variant="outline" className="text-white border-white hover:bg-white/10" onClick={() => setPage('menu')}>Order now</Button>
                </div>
                <div className="w-full md:w-1/2 h-[400px] bg-cover bg-center overflow-hidden">
                    <img src="https://content-prod-live.cert.starbucks.com/binary/v2/asset/137-97594.jpg" className="object-cover w-full h-full" alt="Promo" />
                </div>
            </section>

            {/* Hero 3 - Pistachio */}
            <section className="bg-starbucks-bg min-h-[400px] flex flex-col md:flex-row items-center">
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center items-start text-left">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 text-[#1e3932]">
                        Hello, pistachio
                    </h2>
                    <p className="text-xl mb-8 text-gray-700">
                        A beloved flavor is back with the delicious new Pistachio Cortado, Pistachio Cream Cold Brew and favorite Pistachio Latte.
                    </p>
                    <Button variant="outline" className="border-starbucks-dark text-starbucks-dark hover:bg-black/5" onClick={() => setPage('menu')}>Try it now</Button>
                </div>
                <div className="w-full md:w-1/2 h-full min-h-[300px] ">
                    <img src="https://content-prod-live.cert.starbucks.com/binary/v2/asset/137-88229.jpg" className="w-full h-full object-cover" />
                </div>
            </section>
        </div>
    );
};

const MenuPage = ({ setPage, setSelectedProduct }) => {
    const [activeCategory, setActiveCategory] = useState('Cold Coffees');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredItems = useMemo(() => {
        return MENU_ITEMS.filter(item =>
            (activeCategory ? item.category === activeCategory : true) &&
            (searchTerm ? item.name.toLowerCase().includes(searchTerm.toLowerCase()) : true)
        );
    }, [activeCategory, searchTerm]);

    return (
        <div className="max-w-7xl mx-auto py-8">

            {/* Quick Nav / Subheader */}
            <div className="px-4 mb-8">
                <h1 className="text-3xl font-bold mb-6">Menu</h1>
                <div className="border-b border-gray-200">
                    <div className="flex gap-8 pb-3 text-sm font-semibold text-gray-500">
                        <button className="text-black border-b-2 border-black pb-3 -mb-3.5">Menu</button>
                        <button className="hover:text-black">Featured</button>
                        <button className="hover:text-black">Previous</button>
                        <button className="hover:text-black">Favorites</button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 px-4">

                {/* Sidebar */}
                <aside className="w-full md:w-64 flex-shrink-0">
                    <div className="space-y-6">
                        {MENU_CATEGORIES.map(cat => (
                            <div key={cat.id}>
                                <h3 className="text-xl font-bold mb-3">{cat.name}</h3>
                                <ul className="space-y-3 text-gray-600">
                                    {cat.subcategories.map(sub => (
                                        <li key={sub}>
                                            <button
                                                onClick={() => setActiveCategory(sub)}
                                                className={`text-left hover:text-starbucks-green transition-colors w-full ${activeCategory === sub ? 'font-bold text-starbucks-green' : ''}`}
                                            >
                                                {sub}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </aside>

                {/* Main Grid */}
                <main className="flex-1">
                    <h2 className="text-2xl font-bold mb-6 border-b pb-4 text-gray-800">{activeCategory}</h2>

                    <div className="grid grid-cols-2 lg:grid-cols-2 gap-x-8 gap-y-12">
                        {filteredItems.map(item => (
                            <div key={item.id} className="flex gap-4 items-center cursor-pointer group" onClick={() => { setSelectedProduct(item); setPage('product'); }}>
                                <div className="w-24 h-24 md:w-36 md:h-36 rounded-full overflow-hidden flex-shrink-0">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg md:text-xl font-bold mb-1 text-gray-800 group-hover:text-starbucks-green">{item.name}</h3>
                                    <p className="text-sm text-gray-500 font-medium">{item.calories} calories</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredItems.length === 0 && (
                        <div className="py-20 text-center text-gray-500">
                            No items found in this category.
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

const ProductDetailPage = ({ product, setPage }) => {
    const { addToCart } = useContext(CartContext);
    const [size, setSize] = useState('Grande');
    const [shots, setShots] = useState(2);
    const [added, setAdded] = useState(false);

    if (!product) return <div>Loading...</div>;

    const handleAddToCart = () => {
        addToCart(product, 1, { size, extraShots: shots - 2 });
        setAdded(true);
        setTimeout(() => {
            setAdded(false);
            setPage('menu');
        }, 1500);
    };

    const currentPrice = (product.price + (size === 'Venti' ? 0.8 : size === 'Grande' ? 0.5 : 0)).toFixed(2);

    return (
        <div className="animate-fade-in pb-20">
            <div className="bg-starbucks-dark text-white pt-8 pb-8 px-4 md:px-12 mb-8">
                <div className="max-w-7xl mx-auto breadcrumbs text-sm text-gray-300 mb-6 cursor-pointer" onClick={() => setPage('menu')}>
                    &lt; Back to menu
                </div>
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8">
                    <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-3xl md:text-5xl font-bold mb-2">{product.name}</h1>
                        <div className="text-xl md:text-2xl font-medium text-gray-300">
                            {product.calories} calories <Info size={16} className="inline ml-1 opacity-60" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div>
                        <h3 className="text-xl font-bold mb-4 border-b pb-2 border-starbucks-gold">Size options</h3>
                        <div className="flex justify-between gap-4 mb-8">
                            {['Tall', 'Grande', 'Venti'].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setSize(s)}
                                    className={`flex-1 flex flex-col items-center p-4 rounded-lg border-2 transition-all ${size === s ? 'border-starbucks-green bg-green-50' : 'border-gray-200 hover:border-green-200'}`}
                                >
                                    <div className={`rounded-full bg-gray-200 mb-2 ${s === 'Tall' ? 'w-8 h-10' : s === 'Grande' ? 'w-10 h-14' : 'w-12 h-16'}`}></div>
                                    <span className="font-bold text-gray-800">{s}</span>
                                    <span className="text-xs text-gray-500">{s === 'Tall' ? '12' : s === 'Grande' ? '16' : '20'} fl oz</span>
                                </button>
                            ))}
                        </div>

                        <h3 className="text-xl font-bold mb-4 border-b pb-2 border-starbucks-gold">What's included</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                <div>
                                    <p className="font-bold text-gray-800">Shots</p>
                                    <p className="text-sm text-gray-500">Signature Espresso Roast</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button className="w-8 h-8 rounded-full border border-starbucks-green text-starbucks-green flex items-center justify-center hover:bg-green-50" onClick={() => setShots(Math.max(1, shots - 1))}><Minus size={16} /></button>
                                    <span className="font-bold w-4 text-center">{shots}</span>
                                    <button className="w-8 h-8 rounded-full bg-starbucks-green text-white flex items-center justify-center hover:bg-starbucks-dark" onClick={() => setShots(shots + 1)}><Plus size={16} /></button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col justify-end">
                        <div className="sticky bottom-4 bg-starbucks-dark p-6 rounded-xl shadow-xl text-white">
                            <div className="flex justify-between items-end mb-4">
                                <div>
                                    <p className="text-sm opacity-80 mb-1">Total</p>
                                    <p className="text-3xl font-bold">${currentPrice}</p>
                                </div>
                                <Star fill="#CBA258" stroke="#CBA258" size={32} />
                            </div>
                            <Button variant="primary" className="w-full bg-white text-starbucks-dark hover:bg-gray-100 h-12 text-lg" onClick={handleAddToCart}>
                                {added ? 'Added to order!' : 'Add to order'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CartDrawer = () => {
    const { isCartOpen, setIsCartOpen, cartItems, cartTotal, pickupStore, removeFromCart } = useContext(CartContext);
    const { setPage } = useContext(UIContext); // We'll assume UIContext is passed or we just pass setPage down

    if (!isCartOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>

            {/* Drawer */}
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in-right">
                <div className="bg-starbucks-dark text-white p-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold">Review Order ({cartItems.length})</h2>
                    <button onClick={() => setIsCartOpen(false)}><X /></button>
                </div>

                <div className="p-4 bg-gray-50 border-b">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-gray-500 font-bold uppercase mb-1">Pickup at</p>
                            <p className="font-bold text-gray-800">{pickupStore.name}</p>
                            <p className="text-sm text-gray-600">{pickupStore.address}</p>
                        </div>
                        <Button variant="link" className="text-xs">Change</Button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {cartItems.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <ShoppingBag size={48} className="mx-auto mb-4 opacity-20" />
                            <p>Your bag is empty.</p>
                        </div>
                    ) : (
                        cartItems.map(item => (
                            <div key={item.cartId} className="flex gap-4">
                                <img src={item.item.image} className="w-16 h-16 rounded-full object-cover bg-gray-100" />
                                <div className="flex-1">
                                    <div className="flex justify-between">
                                        <h4 className="font-bold text-gray-800">{item.item.name}</h4>
                                        <p className="font-medium">${(item.item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                    <p className="text-sm text-gray-500">{item.customizations.size}</p>
                                    <div className="flex gap-3 mt-2 text-sm text-gray-500">
                                        <button className="underline hover:text-black">Edit</button>
                                        <button className="underline hover:text-black" onClick={() => removeFromCart(item.cartId)}>Remove</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className="p-6 border-t bg-gray-50">
                        <div className="flex justify-between mb-4 text-xl font-bold text-gray-800">
                            <span>Total</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <Button className="w-full py-4 text-lg" onClick={() => { setIsCartOpen(false); setPage('checkout'); }}>
                            Checkout
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

const CheckoutPage = ({ setPage }) => {
    const { cartItems, cartTotal, pickupStore } = useContext(CartContext);
    const { placeOrder } = useContext(OrderContext);
    const [loading, setLoading] = useState(false);

    const handleCheckout = () => {
        setLoading(true);
        setTimeout(() => {
            placeOrder(cartItems, cartTotal, pickupStore);
            setLoading(false);
            setPage('confirmation');
        }, 2000);
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>

            <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 space-y-6">
                    {/* Pickup details */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><MapPin size={20} /> Pickup store</h2>
                        <div className="pl-7">
                            <p className="font-bold text-lg">{pickupStore.name}</p>
                            <p className="text-gray-600 mb-2">{pickupStore.address}</p>
                            <div className="inline-block bg-green-100 text-starbucks-green px-3 py-1 rounded text-sm font-bold">
                                Ready in 4-7 mins
                            </div>
                        </div>
                    </div>

                    {/* Payment */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><CreditCard size={20} /> Payment method</h2>
                        <div className="pl-7 space-y-3">
                            <div className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer border-starbucks-green bg-green-50">
                                <div className="w-10 h-6 bg-gray-800 rounded"></div>
                                <div className="flex-1 font-medium">Starbucks Card (**** 1234)</div>
                                <CheckCircle size={20} className="text-starbucks-green" />
                            </div>
                            <div className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                <div className="w-10 h-6 bg-blue-600 rounded"></div>
                                <div className="flex-1 font-medium">Visa (**** 4242)</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-80">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 sticky top-24">
                        <h3 className="font-bold text-gray-500 mb-4 uppercase text-sm">Order Summary</h3>
                        <div className="space-y-2 mb-4">
                            {cartItems.map(item => (
                                <div key={item.cartId} className="flex justify-between text-sm">
                                    <span>{item.quantity}x {item.item.name}</span>
                                    <span>${(item.item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="border-t pt-4 flex justify-between font-bold text-xl mb-6">
                            <span>Total</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <Button className="w-full h-12 flex items-center justify-center gap-2" onClick={handleCheckout} disabled={loading}>
                            {loading ? <Loader2 className="animate-spin" /> : 'Place Order'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ConfirmationPage = ({ setPage }) => {
    return (
        <div className="max-w-md mx-auto py-12 px-4 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} className="text-starbucks-green" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Order placed!</h1>
            <p className="text-gray-600 mb-8">See you in a few minutes.</p>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-left mb-8">
                <div className="flex justify-between mb-4">
                    <span className="text-gray-500">Order #</span>
                    <span className="font-bold">42829221</span>
                </div>
                <div className="flex justify-between mb-4">
                    <span className="text-gray-500">Pick up at</span>
                    <span className="font-bold text-right w-1/2">Lincoln Hwy and Merrillville R</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">Estimated time</span>
                    <span className="font-bold text-starbucks-green">11:52 AM</span>
                </div>
            </div>

            <Button variant="outline" onClick={() => setPage('home')}>Back to Home</Button>
        </div>
    );
}

// --- MAIN APP ---

function App() {
    const [page, setPage] = useState('home');
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Router dispatcher
    const renderPage = () => {
        switch (page) {
            case 'home': return <HomePage setPage={setPage} />;
            case 'menu': return <MenuPage setPage={setPage} setSelectedProduct={setSelectedProduct} />;
            case 'product': return <ProductDetailPage product={selectedProduct} setPage={setPage} />;
            case 'checkout': return <CheckoutPage setPage={setPage} />;
            case 'confirmation': return <ConfirmationPage setPage={setPage} />;
            case 'signin': return <div className="p-20 text-center">Sign In Page Mockup <br /><br /><Button onClick={() => setPage('home')}>Back</Button></div>;
            case 'signup': return <div className="p-20 text-center">Sign Up Page Mockup <br /><br /><Button onClick={() => setPage('home')}>Back</Button></div>;
            default: return <HomePage setPage={setPage} />;
        }
    };

    return (
        <AuthProvider>
            <CartProvider>
                <OrderProvider>
                    <UIContext.Provider value={{ setPage }}>
                        <div className="min-h-screen font-sans text-gray-900 bg-white selection:bg-green-100">
                            <Header setPage={setPage} />
                            <main>
                                {renderPage()}
                            </main>
                            <CartDrawer />
                        </div>
                    </UIContext.Provider>
                </OrderProvider>
            </CartProvider>
        </AuthProvider>
    );
}

export default App;
