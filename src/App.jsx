import React, { useState, useEffect, createContext, useContext, useMemo, useCallback } from 'react';
import {
    MapPin, ShoppingBag, User, Menu as MenuIcon, X, ChevronRight,
    ChevronDown, ChevronUp, Search, Heart, Star, CreditCard, Gift, Loader2, CheckCircle,
    Minus, Plus, ArrowLeft, Info, Eye, EyeOff, Clock, Phone, Mail, Coffee
} from 'lucide-react';

// ═══════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════

const USER_DATA = {
    id: 'u1', firstName: 'Neha', lastName: 'Pawar',
    email: 'neha@example.com', stars: 125, favorites: ['28498'], recentOrders: []
};

const STORES = [
    { id: 's1', name: 'Lincoln Hwy and Merrillville R', address: '725 W 81st Ave, Merrillville, IN 46410', distance: '1.1 mi', status: 'Open until 9:00 PM' },
    { id: 's2', name: 'Merrillville-Rte 30 & Mississippi', address: '1613 Southlake Mall, Merrillville, IN 46410', distance: '1.3 mi', status: 'Open until 9:00 PM' },
];

const MENU_CATEGORIES = [
    {
        id: 'favorites', name: 'Fan Favorites', subcategories: [
            { name: 'Trending', image: 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=200&q=80' }
        ]
    },
    {
        id: 'drinks', name: 'Drinks', subcategories: [
            { name: 'Protein Beverages', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=200&q=80' },
            { name: 'Hot Coffee', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&q=80' },
            { name: 'Cold Coffee', image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=200&q=80' },
            { name: 'Hot Tea', image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=200&q=80' },
            { name: 'Cold Tea', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=200&q=80' },
            { name: 'Refreshers', image: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?w=200&q=80' },
            { name: 'Frappuccino Blended Beverage', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=200&q=80' },
            { name: 'Hot Chocolate, Lemonade & More', image: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=200&q=80' },
            { name: 'Bottled Beverages', image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=200&q=80' },
        ]
    },
    {
        id: 'food', name: 'Food', subcategories: [
            { name: 'Breakfast', image: 'https://images.unsplash.com/photo-1550507992-eb63ffee0847?w=200&q=80' },
            { name: 'Bakery', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=200&q=80' },
            { name: 'Treats', image: 'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=200&q=80' },
            { name: 'Lunch', image: 'https://images.unsplash.com/photo-1539252554453-80ab65ce3586?w=200&q=80' },
            { name: 'Lite Bites', image: 'https://images.unsplash.com/photo-1482049016530-d79f696d2147?w=200&q=80' },
        ]
    },
    {
        id: 'athome', name: 'At Home Coffee', subcategories: [
            { name: 'Whole Bean', image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=200&q=80' },
            { name: 'Starbucks VIA Instant', image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200&q=80' },
        ]
    },
    {
        id: 'merch', name: 'Merchandise', subcategories: [
            { name: 'Shopping Bag', image: 'https://images.unsplash.com/photo-1613487246147-a05a7daefb2d?w=200&q=80' },
        ]
    },
];

const MENU_ITEMS = [
    { id: '28498', name: 'Iced Vanilla Protein Latte', category: 'Protein Beverages', image: 'https://www.starbucks.com/weblx/images/rewards/item-image-1.jpg', calories: 270, price: 6.75, description: 'Starbucks Blonde espresso, vanilla syrup, protein milk blend and ice.', featured: true },
    { id: '28499', name: 'Caramel Protein Latte', category: 'Protein Beverages', image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=300&q=80', calories: 280, price: 6.75, description: 'Starbucks Blonde espresso, caramel syrup, protein milk blend.' },
    { id: '1', name: 'Caffè Latte', category: 'Hot Coffee', image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=300&q=80', calories: 190, price: 4.95, description: 'Dark, rich espresso balanced with steamed milk and a light layer of foam.' },
    { id: '2', name: 'Pistachio Latte', category: 'Hot Coffee', image: 'https://images.unsplash.com/photo-1534687941688-651ccaafbff8?w=300&q=80', calories: 320, price: 5.75, description: 'Sweet pistachio and rich brown butter paired with espresso and steamed milk.', featured: true },
    { id: '3', name: 'Caramel Macchiato', category: 'Hot Coffee', image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=300&q=80', calories: 250, price: 5.45, description: 'Freshly steamed milk with vanilla-flavored syrup marked with espresso and topped with a caramel drizzle.' },
    { id: '7', name: 'Cappuccino', category: 'Hot Coffee', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=300&q=80', calories: 140, price: 4.45, description: 'Dark, rich espresso lies in wait under a smoothed and stretched layer of thick milk foam.' },
    { id: '8', name: 'Caffè Americano', category: 'Hot Coffee', image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300&q=80', calories: 15, price: 3.75, description: 'Espresso shots topped with hot water create a light layer of crema.' },
    { id: '9', name: 'Flat White', category: 'Hot Coffee', image: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=300&q=80', calories: 170, price: 5.25, description: 'Smooth ristretto shots of espresso get the perfect amount of steamed whole milk.' },
    { id: '10', name: 'White Chocolate Mocha', category: 'Hot Coffee', image: 'https://images.unsplash.com/photo-1579992357154-faf4bde95b3d?w=300&q=80', calories: 430, price: 5.75, description: 'Espresso with white chocolate flavored sauce and steamed milk, topped with whipped cream.' },
    { id: '11', name: 'Caffè Mocha', category: 'Hot Coffee', image: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=300&q=80', calories: 360, price: 5.25, description: 'Rich, full-bodied espresso combined with bittersweet mocha sauce and steamed milk.' },
    { id: '4', name: 'Iced Brown Sugar Oatmilk Shaken Espresso', category: 'Cold Coffee', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300&q=80', calories: 120, price: 5.95, description: 'Blonde espresso, brown sugar and cinnamon shaken together then topped with oatmilk and ice.', featured: true },
    { id: '12', name: 'Iced Caffè Latte', category: 'Cold Coffee', image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=300&q=80', calories: 130, price: 4.95, description: 'Espresso combined with milk and served over ice.' },
    { id: '13', name: 'Cold Brew', category: 'Cold Coffee', image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=300&q=80', calories: 5, price: 4.45, description: 'Slow-steeped, small-batch cold brew.' },
    { id: '14', name: 'Vanilla Sweet Cream Cold Brew', category: 'Cold Coffee', image: 'https://images.unsplash.com/photo-1592663527359-cf6642f54cff?w=300&q=80', calories: 110, price: 5.45, description: 'Cold brew sweetened with vanilla syrup, topped with vanilla sweet cream.' },
    { id: '15', name: 'Iced Caramel Macchiato', category: 'Cold Coffee', image: 'https://images.unsplash.com/photo-1553909489-ec5f08f03874?w=300&q=80', calories: 250, price: 5.75, description: 'Milk marked with espresso and topped with a caramel drizzle.' },
    { id: '5', name: 'Pink Drink', category: 'Refreshers', image: 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=300&q=80', calories: 140, price: 5.25, description: 'Strawberry Acai Refreshers Beverage combined with creamy coconutmilk.', featured: true },
    { id: '16', name: 'Dragon Drink', category: 'Refreshers', image: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?w=300&q=80', calories: 130, price: 5.25, description: 'Mango Dragonfruit Refreshers Beverage combined with creamy coconutmilk.' },
    { id: '17', name: 'Strawberry Acai Refresher', category: 'Refreshers', image: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=300&q=80', calories: 100, price: 4.45, description: 'Sweet strawberry flavors with passion fruit and acai notes.' },
    { id: '18', name: 'Caramel Frappuccino', category: 'Frappuccino Blended Beverage', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=300&q=80', calories: 380, price: 5.95, description: 'Caramel syrup blended with coffee, milk and ice, topped with whipped cream.', featured: true },
    { id: '19', name: 'Mocha Frappuccino', category: 'Frappuccino Blended Beverage', image: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=300&q=80', calories: 370, price: 5.95, description: 'Mocha sauce, coffee, milk and ice blended and topped with whipped cream.' },
    { id: '20', name: 'Java Chip Frappuccino', category: 'Frappuccino Blended Beverage', image: 'https://images.unsplash.com/photo-1579888071069-4f5275c11c24?w=300&q=80', calories: 440, price: 5.95, description: 'Chips of chocolate, mocha sauce, coffee and milk blended with ice.' },
    { id: '21', name: 'Chai Tea Latte', category: 'Hot Tea', image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=300&q=80', calories: 240, price: 4.95, description: 'Black tea infused with cinnamon, clove and other spices with steamed milk.' },
    { id: '22', name: 'Matcha Tea Latte', category: 'Hot Tea', image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=300&q=80', calories: 190, price: 5.25, description: 'Smooth and creamy matcha sweetened just right with steamed milk.' },
    { id: '23', name: 'Iced Passion Tango Tea', category: 'Cold Tea', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&q=80', calories: 45, price: 3.45, description: 'Bold tropical flavors of hibiscus, lemongrass and apple.' },
    { id: '24', name: 'Iced Matcha Tea Latte', category: 'Cold Tea', image: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=300&q=80', calories: 200, price: 5.25, description: 'Smooth and creamy matcha served with milk over ice.' },
    { id: '6', name: 'Bacon, Gouda & Egg Sandwich', category: 'Breakfast', image: 'https://images.unsplash.com/photo-1550507992-eb63ffee0847?w=300&q=80', calories: 360, price: 5.95, description: 'Applewood-smoked bacon, a fried egg, and aged Gouda on an artisan roll.' },
    { id: '25', name: 'Sausage, Cheddar & Egg Sandwich', category: 'Breakfast', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=300&q=80', calories: 480, price: 5.75, description: 'A savory sausage patty, aged Cheddar and egg on an English muffin.' },
    { id: '26', name: 'Spinach, Feta & Egg White Wrap', category: 'Breakfast', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&q=80', calories: 290, price: 4.95, description: 'Cage-free egg whites with spinach, feta cheese and tomatoes.' },
    { id: '27', name: 'Butter Croissant', category: 'Bakery', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=300&q=80', calories: 260, price: 3.75, description: 'A classic butter croissant with a golden, flaky exterior.' },
    { id: '28', name: 'Chocolate Croissant', category: 'Bakery', image: 'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?w=300&q=80', calories: 340, price: 3.95, description: 'Buttery, flaky croissant with two chocolate batons.' },
    { id: '29', name: 'Blueberry Muffin', category: 'Bakery', image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=300&q=80', calories: 360, price: 3.45, description: 'Moist and flavorful with real blueberries, topped with streusel.' },
    { id: '30', name: 'Birthday Cake Pop', category: 'Treats', image: 'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=300&q=80', calories: 160, price: 3.25, description: 'Vanilla cake and icing, dipped in a white chocolaty coating.' },
    { id: '31', name: 'Chocolate Cake Pop', category: 'Treats', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=300&q=80', calories: 160, price: 3.25, description: 'Chocolate cake and icing, dipped in a chocolaty coating.' },
];

const SIZES = [
    { name: 'Tall', oz: 12, modifier: 0 },
    { name: 'Grande', oz: 16, modifier: 0.50 },
    { name: 'Venti', oz: 24, modifier: 0.80 },
];

const ESPRESSO_TYPES = ['Signature Espresso', 'Blonde Espresso', 'Decaf Espresso'];

// ═══════════════════════════════════════════════════════
// CONTEXTS
// ═══════════════════════════════════════════════════════

const AuthContext = createContext();
const CartContext = createContext();
const OrderContext = createContext();
const UIContext = createContext();

// ═══════════════════════════════════════════════════════
// PROVIDERS
// ═══════════════════════════════════════════════════════

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => { setTimeout(() => setLoading(false), 300); }, []);
    const login = (email, password) => new Promise(r => setTimeout(() => { setUser(USER_DATA); r(USER_DATA); }, 800));
    const logout = () => setUser(null);
    const register = (data) => new Promise(r => setTimeout(() => { const u = { ...USER_DATA, ...data, stars: 0 }; setUser(u); r(u); }, 800));
    return <AuthContext.Provider value={{ user, login, logout, register, isAuthenticated: !!user, loading }}>{children}</AuthContext.Provider>;
};

const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [pickupStore, setPickupStore] = useState(STORES[0]);
    const addToCart = (item, quantity, customizations) => {
        setCartItems(prev => [...prev, { cartId: Date.now().toString(), item, quantity, customizations }]);
        setIsCartOpen(true);
    };
    const removeFromCart = (cartId) => setCartItems(prev => prev.filter(i => i.cartId !== cartId));
    const updateQuantity = (cartId, delta) => setCartItems(prev => prev.map(i => i.cartId === cartId ? { ...i, quantity: Math.max(1, Math.min(10, i.quantity + delta)) } : i));
    const clearCart = () => setCartItems([]);
    const cartTotal = cartItems.reduce((sum, ci) => {
        let price = ci.item.price;
        const sd = SIZES.find(s => s.name === ci.customizations?.size);
        if (sd) price += sd.modifier;
        if (ci.customizations?.extraShots > 0) price += ci.customizations.extraShots * 1.00;
        return sum + (price * ci.quantity);
    }, 0);
    const itemCount = cartItems.reduce((s, i) => s + i.quantity, 0);
    return <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, isCartOpen, setIsCartOpen, pickupStore, setPickupStore, cartTotal, itemCount }}>{children}</CartContext.Provider>;
};

const OrderProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);
    const [activeOrder, setActiveOrder] = useState(null);
    const placeOrder = (cartItems, total, store, tip = 0) => {
        const order = {
            id: Math.floor(Math.random() * 1000000).toString(),
            orderNumber: Math.floor(10000 + Math.random() * 90000).toString(),
            items: cartItems, total: total + tip, subtotal: total,
            tax: +(total * 0.08).toFixed(2), tip, store,
            status: 'placed', placedAt: new Date().toISOString(),
            estimatedReadyTime: new Date(Date.now() + 8 * 60000).toISOString(),
            starsEarned: Math.floor(total * 2)
        };
        setOrders(prev => [order, ...prev]); setActiveOrder(order);
        return order;
    };
    return <OrderContext.Provider value={{ orders, activeOrder, setActiveOrder, placeOrder }}>{children}</OrderContext.Provider>;
};

// ═══════════════════════════════════════════════════════
// HEADER - matches original Starbucks nav
// ═══════════════════════════════════════════════════════

const Header = ({ setPage, currentPage }) => {
    const { user, logout } = useContext(AuthContext);
    const { itemCount, setIsCartOpen } = useContext(CartContext);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [acctOpen, setAcctOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 bg-white shadow-sm">
            <div className="max-w-[1440px] mx-auto px-4 lg:px-8 h-[84px] flex items-center justify-between">
                <div className="flex items-center gap-8 h-full">
                    <button onClick={() => setPage('home')} className="flex-shrink-0">
                        <img src="https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Starbucks_Corporation_Logo_2011.svg/1200px-Starbucks_Corporation_Logo_2011.svg.png" alt="Starbucks" className="h-[50px] w-[50px]" />
                    </button>
                    <nav className="hidden lg:flex items-center gap-6 h-full">
                        {[{ l: 'MENU', p: 'menu' }, { l: 'REWARDS', p: 'rewards' }, { l: 'GIFT CARDS', p: 'giftcards' }].map(n => (
                            <button key={n.p} onClick={() => setPage(n.p)}
                                className={`h-full flex items-center text-[14px] font-bold tracking-[1.5px] border-b-[3px] transition-colors ${currentPage === n.p ? 'border-starbucks-green text-starbucks-green' : 'border-transparent text-gray-800 hover:text-starbucks-green'}`}>{n.l}</button>
                        ))}
                    </nav>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => setPage('stores')} className="hidden lg:flex items-center gap-2 text-sm font-semibold text-gray-800 hover:text-starbucks-green">
                        <MapPin size={18} /><span>Find a store</span>
                    </button>
                    {!user ? (
                        <div className="hidden sm:flex items-center gap-3 ml-4">
                            <button onClick={() => setPage('signin')} className="rounded-full border border-black text-black text-[13px] font-semibold px-4 py-[7px] hover:bg-gray-100 transition-colors">Sign in</button>
                            <button onClick={() => setPage('signup')} className="rounded-full bg-black text-white text-[13px] font-semibold px-4 py-[7px] hover:bg-gray-800 transition-colors">Join now</button>
                        </div>
                    ) : (
                        <div className="relative ml-4">
                            <button onClick={() => setAcctOpen(!acctOpen)} className="hidden sm:flex items-center gap-2 text-sm font-semibold text-gray-800 hover:text-starbucks-green">
                                <User size={18} /><span>Account</span><ChevronDown size={14} />
                            </button>
                            {acctOpen && (
                                <div className="absolute right-0 top-full mt-2 bg-white shadow-xl rounded-lg border py-2 w-56 z-50">
                                    <div className="px-4 py-3 border-b"><p className="font-bold">{user.firstName} {user.lastName}</p><p className="text-sm text-gray-500">{user.stars} Stars</p></div>
                                    <button onClick={() => { logout(); setAcctOpen(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-red-600">Sign out</button>
                                </div>
                            )}
                        </div>
                    )}
                    <button onClick={() => setIsCartOpen(true)} className="relative p-2 text-gray-700 hover:text-starbucks-green transition-colors ml-2">
                        <ShoppingBag size={22} />
                        {itemCount > 0 && <span className="absolute -top-1 -right-1 bg-starbucks-green text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center font-bold">{itemCount}</span>}
                    </button>
                    <button className="lg:hidden p-2 text-gray-700" onClick={() => setMobileOpen(!mobileOpen)}>
                        {mobileOpen ? <X size={24} /> : <MenuIcon size={24} />}
                    </button>
                </div>
            </div>
            {mobileOpen && (
                <div className="lg:hidden bg-white border-t shadow-lg">
                    <nav className="flex flex-col p-4 gap-1">
                        {[['Menu', 'menu'], ['Rewards', 'rewards'], ['Gift Cards', 'giftcards'], ['Find a Store', 'stores']].map(([l, p]) => (
                            <button key={p} onClick={() => { setPage(p); setMobileOpen(false); }} className="text-left py-3 px-4 text-sm font-bold tracking-wider text-gray-800 hover:bg-gray-50 rounded">{l}</button>
                        ))}
                        <hr className="my-2" />
                        {!user ? (
                            <>
                                <button onClick={() => { setPage('signin'); setMobileOpen(false); }} className="text-left py-3 px-4 text-sm font-semibold">Sign in</button>
                                <button onClick={() => { setPage('signup'); setMobileOpen(false); }} className="text-left py-3 px-4 text-sm font-semibold">Join now</button>
                            </>
                        ) : <button onClick={() => { logout(); setMobileOpen(false); }} className="text-left py-3 px-4 text-sm font-semibold text-red-600">Sign out</button>}
                    </nav>
                </div>
            )}
        </header>
    );
};

// ═══════════════════════════════════════════════════════
// FOOTER
// ═══════════════════════════════════════════════════════

const Footer = () => (
    <footer className="bg-starbucks-bg border-t mt-16">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-12">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
                {[
                    { t: 'About Us', l: ['Our Company', 'Our Coffee', 'Stories and News', 'Investor Relations'] },
                    { t: 'Careers', l: ['Culture and Values', 'Inclusion, Diversity, and Equity', 'College Achievement Plan'] },
                    { t: 'Social Impact', l: ['People', 'Planet', 'Environmental and Social Impact Reporting'] },
                    { t: 'For Business Partners', l: ['Landlord Support Center', 'Suppliers', 'Corporate Gift Cards'] },
                    { t: 'Order and Pickup', l: ['Order on the App', 'Order on the Web', 'Delivery', 'Order and Pickup Options'] },
                ].map(c => (
                    <div key={c.t}>
                        <h4 className="font-bold text-gray-800 mb-4 text-sm">{c.t}</h4>
                        <ul className="space-y-3">{c.l.map(link => <li key={link}><span className="text-sm text-gray-600 hover:text-starbucks-green cursor-pointer">{link}</span></li>)}</ul>
                    </div>
                ))}
            </div>
            <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex gap-6 text-sm text-gray-600">
                    {['Privacy Notice', 'Terms of Use', 'Cookie Preferences'].map(l => <span key={l} className="hover:text-black cursor-pointer">{l}</span>)}
                </div>
                <p className="text-sm text-gray-500">&copy; 2025 Starbucks Coffee Company. All rights reserved.</p>
            </div>
        </div>
    </footer>
);

// ═══════════════════════════════════════════════════════
// HOME PAGE - Polished with working images
// ═══════════════════════════════════════════════════════

const HomePage = ({ setPage }) => {
    const { user } = useContext(AuthContext);
    return (
        <div>
            {/* Hero 1: Welcome / Join Rewards */}
            <section className="bg-starbucks-light flex flex-col md:flex-row">
                <div className="w-full md:w-1/2 p-8 md:p-16 lg:p-20 flex flex-col justify-center items-center text-center">
                    <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-starbucks-dark leading-tight">{user ? `Welcome back, ${user.firstName}!` : 'FREE COFFEE IS A TAP AWAY'}</h2>
                    <p className="text-lg mb-8 text-gray-700">{user ? 'Your favorites are waiting.' : 'Join now to start earning Rewards.'}</p>
                    {user ? <button onClick={() => setPage('menu')} className="rounded-full bg-starbucks-green text-white font-semibold px-6 py-3 text-sm hover:bg-starbucks-accent transition-colors">Order now</button>
                        : <button onClick={() => setPage('signup')} className="rounded-full bg-starbucks-green text-white font-semibold px-6 py-3 text-sm hover:bg-starbucks-accent transition-colors">Join now</button>}
                </div>
                <div className="w-full md:w-1/2 min-h-[340px] bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80")' }} />
            </section>

            {/* Hero 2: Caramel Protein */}
            <section className="bg-starbucks-green text-white flex flex-col md:flex-row-reverse">
                <div className="w-full md:w-1/2 p-8 md:p-16 lg:p-20 flex flex-col justify-center items-center text-center">
                    <h1 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">Caramel protein is here</h1>
                    <p className="text-lg mb-8 opacity-90">Power up with a new Caramel Protein Latte or Matcha, with Protein-boosted Milk.</p>
                    <button onClick={() => setPage('menu')} className="rounded-full border border-white text-white font-semibold px-6 py-3 text-sm hover:bg-white/10 transition-colors">Order now</button>
                </div>
                <div className="w-full md:w-1/2 min-h-[340px] overflow-hidden bg-starbucks-dark flex items-center justify-center">
                    <img src="https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&q=80" className="object-cover w-full h-full" alt="Caramel Latte" />
                </div>
            </section>

            {/* Hero 3: Pistachio */}
            <section className="bg-starbucks-bg flex flex-col md:flex-row">
                <div className="w-full md:w-1/2 p-8 md:p-16 lg:p-20 flex flex-col justify-center items-center text-center">
                    <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-starbucks-dark leading-tight">Hello, pistachio</h2>
                    <p className="text-lg mb-8 text-gray-700">A beloved flavor is back with the Pistachio Cortado, Pistachio Cream Cold Brew and Pistachio Latte.</p>
                    <button onClick={() => setPage('menu')} className="rounded-full border border-black text-black font-semibold px-6 py-3 text-sm hover:bg-black/5 transition-colors">Try it now</button>
                </div>
                <div className="w-full md:w-1/2 min-h-[340px] overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=800&q=80" className="w-full h-full object-cover" alt="Pistachio Latte" />
                </div>
            </section>

            {/* Hero 4: Free Drink Rewards */}
            <section className="bg-[#d4e9e2] flex flex-col md:flex-row-reverse">
                <div className="w-full md:w-1/2 p-8 md:p-16 lg:p-20 flex flex-col justify-center items-center text-center">
                    <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-starbucks-dark leading-tight">Free drink? It's yours.</h2>
                    <p className="text-lg mb-8 text-gray-700">Join Starbucks® Rewards to earn Stars for free drinks, food and more.</p>
                    <button onClick={() => setPage('signup')} className="rounded-full border border-black text-black font-semibold px-6 py-3 text-sm hover:bg-black/5 transition-colors">Join for free</button>
                </div>
                <div className="w-full md:w-1/2 min-h-[340px] overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80" className="w-full h-full object-cover" alt="Coffee Rewards" />
                </div>
            </section>

            {/* Hero 5: Free Refills */}
            <section className="bg-white flex flex-col md:flex-row">
                <div className="w-full md:w-1/2 p-8 md:p-16 lg:p-20 flex flex-col justify-center items-center text-center">
                    <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-starbucks-dark leading-tight">Grab a seat. Get free refills.</h2>
                    <p className="text-lg mb-8 text-gray-700">Stay and enjoy free refills of brewed coffee and tea when you're a Starbucks® Rewards member.</p>
                    <button onClick={() => setPage('rewards')} className="rounded-full border border-black text-black font-semibold px-6 py-3 text-sm hover:bg-black/5 transition-colors">Learn more</button>
                </div>
                <div className="w-full md:w-1/2 min-h-[340px] overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=800&q=80" className="w-full h-full object-cover" alt="Coffee Shop" />
                </div>
            </section>

            {/* Hero 6: Nondairy */}
            <section className="bg-[#1e3932] text-white flex flex-col md:flex-row-reverse">
                <div className="w-full md:w-1/2 p-8 md:p-16 lg:p-20 flex flex-col justify-center items-center text-center">
                    <h2 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight">Nondairy choices. No extra charge.</h2>
                    <p className="text-lg mb-8 opacity-90">Customize your drink with oatmilk, almondmilk, coconutmilk or soymilk at no additional cost.</p>
                    <button onClick={() => setPage('menu')} className="rounded-full border border-white text-white font-semibold px-6 py-3 text-sm hover:bg-white/10 transition-colors">Explore the menu</button>
                </div>
                <div className="w-full md:w-1/2 min-h-[340px] overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1541167760496-1628856ab772?w=800&q=80" className="w-full h-full object-cover" alt="Nondairy Options" />
                </div>
            </section>
        </div>
    );
};

// ═══════════════════════════════════════════════════════
// SIGN IN PAGE - exact match to reference screenshot
// ═══════════════════════════════════════════════════════

const SignInPage = ({ setPage }) => {
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [keepIn, setKeepIn] = useState(true);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) { setError('Please fill in all fields.'); return; }
        setError(''); setLoading(true);
        await login(email, password);
        setLoading(false);
        setPage('home');
    };

    return (
        <div className="min-h-[80vh] bg-gray-50 flex items-start justify-center pt-12 px-4 pb-20">
            <div className="w-full max-w-[480px]">
                <h1 className="text-[28px] font-bold text-center mb-8">Sign in or create an account</h1>

                {/* Sign in card */}
                <div className="bg-white rounded-lg shadow-sm border p-8 mb-10">
                    <p className="text-sm text-gray-500 mb-6"><span className="text-red-500">*</span> indicates required field</p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">{error}</div>}

                        <div>
                            <label className="block text-sm text-gray-600 mb-1"><span className="text-red-500">* </span>Username or email address</label>
                            <input type="text" value={email} onChange={e => setEmail(e.target.value)}
                                className="w-full border-b-2 border-gray-300 py-2 text-sm focus:outline-none focus:border-starbucks-green transition-colors bg-transparent" />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-600 mb-1"><span className="text-red-500">* </span>Password</label>
                            <div className="relative">
                                <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                                    className="w-full border-b-2 border-gray-300 py-2 text-sm pr-10 focus:outline-none focus:border-starbucks-green transition-colors bg-transparent" />
                                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <label className="flex items-center gap-3 cursor-pointer py-2">
                            <input type="checkbox" checked={keepIn} onChange={e => setKeepIn(e.target.checked)}
                                className="w-5 h-5 rounded border-gray-300 text-starbucks-green focus:ring-starbucks-green" />
                            <span className="text-sm text-gray-700">Keep me signed in. <button type="button" className="underline font-semibold">Details</button></span>
                        </label>

                        <div className="space-y-1">
                            <button type="button" className="text-sm text-starbucks-green hover:text-starbucks-accent underline font-semibold block">Forgot your username?</button>
                            <button type="button" className="text-sm text-starbucks-green hover:text-starbucks-accent underline font-semibold block">Forgot your password?</button>
                        </div>

                        <div className="flex justify-end pt-2">
                            <button type="submit" disabled={loading} className="rounded-full bg-starbucks-green text-white font-semibold px-8 py-3 text-sm hover:bg-starbucks-accent transition-colors disabled:opacity-50">
                                {loading ? <Loader2 className="animate-spin" size={18} /> : 'Sign in'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Join section */}
                <div className="text-center">
                    <h2 className="text-sm font-bold tracking-wider uppercase text-starbucks-dark mb-3">JOIN STARBUCKS' REWARDS</h2>
                    <p className="text-sm text-gray-600 mb-6 max-w-sm mx-auto">
                        As a member, start earning free food and drinks, unlock our best offers and celebrate your birthday with a treat from us. Best of all, it's free to join.
                    </p>
                    <button onClick={() => setPage('signup')} className="rounded-full border border-black text-black font-semibold px-6 py-2 text-sm hover:bg-gray-100 transition-colors">Join now</button>
                </div>
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════
// SIGN UP PAGE
// ═══════════════════════════════════════════════════════

const SignUpPage = ({ setPage }) => {
    const { register } = useContext(AuthContext);
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', birthdayMonth: '', birthdayDay: '', emailOffers: true, agreeTerms: false });
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const u = (k, v) => setForm(p => ({ ...p, [k]: v }));
    const pc = { len: form.password.length >= 8 && form.password.length <= 25, num: /\d/.test(form.password), up: /[A-Z]/.test(form.password), sp: /[!@#$%^&*(),.?":{}|<>]/.test(form.password) };
    const pwValid = Object.values(pc).every(Boolean);
    const s1Valid = form.firstName && form.lastName && form.email && pwValid;

    const handleCreate = async () => {
        if (!form.agreeTerms) return;
        setLoading(true);
        await register({ firstName: form.firstName, lastName: form.lastName, email: form.email });
        setLoading(false); setPage('home');
    };

    return (
        <div className="min-h-[80vh] bg-white flex items-start justify-center pt-12 px-4 pb-20">
            <div className="w-full max-w-[500px]">
                <h1 className="text-2xl font-bold mb-2">Create an account</h1>
                <div className="flex items-center gap-2 mt-6 mb-2">
                    <div className={`h-1 flex-1 rounded ${step >= 1 ? 'bg-starbucks-green' : 'bg-gray-200'}`} />
                    <div className={`h-1 flex-1 rounded ${step >= 2 ? 'bg-starbucks-green' : 'bg-gray-200'}`} />
                </div>
                <p className="text-sm text-gray-500 mb-8">Step {step} of 2</p>

                {step === 1 && (
                    <div className="space-y-5">
                        <p className="text-sm text-gray-500"><span className="text-red-500">*</span> indicates required field</p>
                        {[{ l: 'First name', k: 'firstName' }, { l: 'Last name', k: 'lastName' }, { l: 'Email address', k: 'email', t: 'email' }].map(f => (
                            <div key={f.k}>
                                <label className="block text-sm text-gray-600 mb-1"><span className="text-red-500">* </span>{f.l}</label>
                                <input type={f.t || 'text'} value={form[f.k]} onChange={e => u(f.k, e.target.value)}
                                    className="w-full border border-gray-300 rounded px-4 py-3 text-sm focus:outline-none focus:border-starbucks-green focus:ring-1 focus:ring-starbucks-green" />
                            </div>
                        ))}
                        <div>
                            <label className="block text-sm text-gray-600 mb-1"><span className="text-red-500">* </span>Password</label>
                            <div className="relative">
                                <input type={showPw ? 'text' : 'password'} value={form.password} onChange={e => u('password', e.target.value)}
                                    className="w-full border border-gray-300 rounded px-4 py-3 text-sm pr-12 focus:outline-none focus:border-starbucks-green focus:ring-1 focus:ring-starbucks-green" />
                                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"><Eye size={18} /></button>
                            </div>
                            <div className="mt-3 space-y-1">
                                {[['8-25 characters', pc.len], ['At least one number', pc.num], ['At least one uppercase letter', pc.up], ['At least one special character', pc.sp]].map(([label, ok]) => (
                                    <p key={label} className={`text-xs flex items-center gap-2 ${ok ? 'text-starbucks-green' : 'text-gray-400'}`}><CheckCircle size={12} />{label}</p>
                                ))}
                            </div>
                        </div>
                        <button disabled={!s1Valid} onClick={() => setStep(2)} className="w-full rounded-full bg-starbucks-green text-white font-semibold py-4 text-sm hover:bg-starbucks-accent transition-colors disabled:opacity-50">Continue</button>
                    </div>
                )}
                {step === 2 && (
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Birthday (optional)</label>
                            <p className="text-xs text-gray-500 mb-3">We'll use this to send you a special treat!</p>
                            <div className="flex gap-4">
                                <select value={form.birthdayMonth} onChange={e => u('birthdayMonth', e.target.value)} className="flex-1 border border-gray-300 rounded px-4 py-3 text-sm focus:outline-none focus:border-starbucks-green">
                                    <option value="">Month</option>
                                    {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
                                </select>
                                <input type="number" placeholder="Day" min="1" max="31" value={form.birthdayDay} onChange={e => u('birthdayDay', e.target.value)} className="w-24 border border-gray-300 rounded px-4 py-3 text-sm focus:outline-none focus:border-starbucks-green" />
                            </div>
                        </div>
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input type="checkbox" checked={form.emailOffers} onChange={e => u('emailOffers', e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-starbucks-green focus:ring-starbucks-green mt-0.5" />
                            <span className="text-sm text-gray-700">Yes, I'd like email from Starbucks about products, offers and more.</span>
                        </label>
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input type="checkbox" checked={form.agreeTerms} onChange={e => u('agreeTerms', e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-starbucks-green focus:ring-starbucks-green mt-0.5" />
                            <span className="text-sm text-gray-700">I agree to the <span className="text-starbucks-green underline cursor-pointer">Starbucks Rewards Terms</span>, <span className="text-starbucks-green underline cursor-pointer">Terms of Use</span>, and <span className="text-starbucks-green underline cursor-pointer">Privacy Notice</span>.</span>
                        </label>
                        <div className="flex gap-4 mt-6">
                            <button onClick={() => setStep(1)} className="rounded-full border border-black text-black font-semibold px-6 py-3 text-sm hover:bg-gray-100 transition-colors">Back</button>
                            <button disabled={!form.agreeTerms || loading} onClick={handleCreate} className="flex-1 rounded-full bg-starbucks-green text-white font-semibold py-4 text-sm hover:bg-starbucks-accent transition-colors disabled:opacity-50 flex items-center justify-center">
                                {loading ? <Loader2 className="animate-spin" size={18} /> : 'Create account'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════
// MENU PAGE - exact match: sidebar + category overview with circular images
// ═══════════════════════════════════════════════════════

const MenuPage = ({ setPage, setSelectedProduct }) => {
    const [activeCat, setActiveCat] = useState(null);

    const filteredItems = useMemo(() => {
        if (!activeCat) return [];
        if (activeCat === 'Trending') return MENU_ITEMS.filter(i => i.featured);
        return MENU_ITEMS.filter(i => i.category === activeCat);
    }, [activeCat]);

    return (
        <div className="max-w-[1440px] mx-auto py-8">
            <div className="px-4 lg:px-8 mb-8">
                <h1 className="text-3xl font-bold mb-6">Menu</h1>
                <div className="border-b border-gray-200">
                    <div className="flex gap-8 text-sm font-semibold text-gray-400">
                        <button onClick={() => setActiveCat(null)} className={`pb-3 border-b-2 ${!activeCat ? 'text-starbucks-dark border-starbucks-dark' : 'border-transparent hover:text-gray-600'}`}>Menu</button>
                        <button className="pb-3 border-b-2 border-transparent hover:text-gray-600">Featured</button>
                        <button className="pb-3 border-b-2 border-transparent hover:text-gray-600">Previous</button>
                        <button className="pb-3 border-b-2 border-transparent hover:text-gray-600">Favorites</button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 px-4 lg:px-8">
                {/* Sidebar */}
                <aside className="w-full lg:w-56 flex-shrink-0">
                    <nav className="space-y-6 lg:sticky lg:top-[100px]">
                        {MENU_CATEGORIES.map(cat => (
                            <div key={cat.id}>
                                <h3 className="text-[15px] font-bold mb-2 text-gray-900">{cat.name}</h3>
                                <ul className="space-y-2">
                                    {cat.subcategories.map(sub => (
                                        <li key={sub.name}>
                                            <button onClick={() => setActiveCat(sub.name)}
                                                className={`text-sm transition-colors block leading-snug ${activeCat === sub.name ? 'font-semibold text-starbucks-green' : 'text-gray-500 hover:text-starbucks-green'}`}>{sub.name}</button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </nav>
                </aside>

                {/* Main */}
                <main className="flex-1 min-w-0">
                    {!activeCat ? (
                        <div>
                            {MENU_CATEGORIES.map(cat => (
                                <div key={cat.id} className="mb-12">
                                    <h2 className="text-xl font-bold mb-6 text-gray-900 border-b pb-3">{cat.name}</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                                        {cat.subcategories.map(sub => (
                                            <button key={sub.name} onClick={() => setActiveCat(sub.name)} className="flex items-center gap-5 group text-left py-1">
                                                <div className="w-[90px] h-[90px] rounded-full overflow-hidden flex-shrink-0 ring-2 ring-transparent group-hover:ring-starbucks-green transition-all">
                                                    <img src={sub.image} alt={sub.name} className="w-full h-full object-cover" loading="lazy" />
                                                </div>
                                                <span className="text-[15px] font-semibold text-gray-800 group-hover:text-starbucks-green transition-colors">{sub.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div>
                            <div className="flex items-center justify-between mb-6 border-b pb-4">
                                <h2 className="text-xl font-bold text-gray-900">{activeCat}</h2>
                                <button onClick={() => setActiveCat(null)} className="text-sm text-starbucks-green hover:text-starbucks-accent font-semibold flex items-center gap-1"><ArrowLeft size={14} /> All categories</button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8">
                                {filteredItems.map(item => (
                                    <button key={item.id} onClick={() => { setSelectedProduct(item); setPage('product'); }} className="flex items-center gap-5 group text-left">
                                        <div className="w-[120px] h-[120px] rounded-full overflow-hidden flex-shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold text-gray-800 group-hover:text-starbucks-green transition-colors">{item.name}</h3>
                                            <p className="text-sm text-gray-500 mt-1">{item.calories} calories</p>
                                        </div>
                                    </button>
                                ))}
                                {filteredItems.length === 0 && <div className="col-span-2 py-16 text-center text-gray-400">No items found in this category.</div>}
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════
// PRODUCT DETAIL - matches reference: dark green header, size options, what's included
// ═══════════════════════════════════════════════════════

const ProductDetailPage = ({ product, setPage }) => {
    const { addToCart } = useContext(CartContext);
    const { isAuthenticated } = useContext(AuthContext);
    const [size, setSize] = useState('Grande');
    const [shots, setShots] = useState(2);
    const [syrupPumps, setSyrupPumps] = useState(4);
    const [espType, setEspType] = useState('Signature Espresso');
    const [added, setAdded] = useState(false);
    const [isFav, setIsFav] = useState(false);

    if (!product) return <div className="p-20 text-center text-gray-400">Select a product from the menu.</div>;

    const sizeData = SIZES.find(s => s.name === size);
    const currentPrice = (product.price + (sizeData?.modifier || 0)).toFixed(2);
    const isFood = ['Breakfast', 'Bakery', 'Treats', 'Lunch', 'Lite Bites'].includes(product.category);

    const handleAdd = () => {
        if (!isAuthenticated) { setPage('signin'); return; }
        addToCart(product, 1, { size, extraShots: Math.max(0, shots - 2), espressoType: espType, syrupPumps });
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
    };

    return (
        <div className="pb-24">
            {/* Breadcrumb */}
            <div className="bg-starbucks-dark text-white">
                <div className="max-w-[1440px] mx-auto px-4 lg:px-8 pt-4 pb-12">
                    <button onClick={() => setPage('menu')} className="text-sm text-gray-300 hover:text-white mb-6 block">
                        Menu / {product.category} / {product.name}
                    </button>
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden flex-shrink-0 border-4 border-white/20 shadow-xl">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="text-center md:text-left flex-1">
                            <h1 className="text-3xl md:text-4xl font-bold mb-2">{product.name}</h1>
                            <p className="text-lg text-gray-300">{product.calories} calories <Info size={14} className="inline ml-1 opacity-60" /></p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Customization area */}
            <div className="max-w-[1000px] mx-auto px-4 lg:px-8 py-10">
                <div className="flex flex-col md:flex-row gap-12">
                    {/* Left column */}
                    <div className="flex-1">
                        {!isFood && (
                            <>
                                <h3 className="text-lg font-bold mb-4 border-b pb-2">Size options</h3>
                                <div className="flex gap-6 mb-10">
                                    {SIZES.map(s => (
                                        <button key={s.name} onClick={() => setSize(s.name)}
                                            className={`flex flex-col items-center transition-all ${size === s.name ? 'text-starbucks-green' : 'text-gray-500'}`}>
                                            <div className={`rounded-full border-2 p-2 mb-2 ${size === s.name ? 'border-starbucks-green bg-green-50' : 'border-gray-200'}`}>
                                                <div className={`rounded bg-starbucks-dark/10 ${s.name === 'Tall' ? 'w-6 h-8' : s.name === 'Grande' ? 'w-7 h-11' : 'w-8 h-14'}`} />
                                            </div>
                                            <span className="font-bold text-sm">{s.name}</span>
                                            <span className="text-xs text-gray-400">{s.oz} fl oz</span>
                                        </button>
                                    ))}
                                </div>

                                <h3 className="text-lg font-bold mb-4 border-b pb-2">What's included</h3>
                                <div className="border rounded-lg divide-y">
                                    {/* Flavors */}
                                    <div className="flex justify-between items-center p-4">
                                        <div>
                                            <p className="text-xs text-gray-400 mb-0.5">Flavors</p>
                                            <p className="font-semibold text-sm">Vanilla Syrup pumps</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => setSyrupPumps(Math.max(0, syrupPumps - 1))} className="w-7 h-7 rounded-full border border-starbucks-green text-starbucks-green flex items-center justify-center hover:bg-green-50"><Minus size={14} /></button>
                                            <span className="font-bold text-sm w-4 text-center">{syrupPumps}</span>
                                            <button onClick={() => setSyrupPumps(syrupPumps + 1)} className="w-7 h-7 rounded-full bg-starbucks-green text-white flex items-center justify-center hover:bg-starbucks-accent"><Plus size={14} /></button>
                                        </div>
                                    </div>
                                    {/* Shots */}
                                    <div className="flex justify-between items-center p-4">
                                        <div>
                                            <p className="text-xs text-gray-400 mb-0.5">Espresso & Shot Options</p>
                                            <p className="font-semibold text-sm">Shots</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => setShots(Math.max(1, shots - 1))} className="w-7 h-7 rounded-full border border-starbucks-green text-starbucks-green flex items-center justify-center hover:bg-green-50"><Minus size={14} /></button>
                                            <span className="font-bold text-sm w-4 text-center">{shots}</span>
                                            <button onClick={() => setShots(shots + 1)} className="w-7 h-7 rounded-full bg-starbucks-green text-white flex items-center justify-center hover:bg-starbucks-accent"><Plus size={14} /></button>
                                        </div>
                                    </div>
                                    {/* Espresso type */}
                                    <div className="flex justify-between items-center p-4">
                                        <div>
                                            <p className="text-xs text-gray-400 mb-0.5">Espresso & Shot Options</p>
                                            <p className="font-semibold text-sm">{espType}</p>
                                        </div>
                                        <select value={espType} onChange={e => setEspType(e.target.value)} className="border rounded px-2 py-1 text-sm focus:outline-none focus:border-starbucks-green">
                                            {ESPRESSO_TYPES.map(t => <option key={t}>{t}</option>)}
                                        </select>
                                    </div>
                                    {/* Add-ins */}
                                    <div className="flex justify-between items-center p-4">
                                        <div>
                                            <p className="text-xs text-gray-400 mb-0.5">Add-ins</p>
                                            <p className="font-semibold text-sm">Ice</p>
                                        </div>
                                        <ChevronDown size={16} className="text-gray-400" />
                                    </div>
                                </div>

                                <p className="text-sm text-gray-400 mt-6 flex items-center gap-2"><MapPin size={14} /> Select a store to view availability</p>
                            </>
                        )}

                        {isFood && (
                            <div>
                                <p className="text-gray-600 mb-6">{product.description}</p>
                                <p className="text-sm text-gray-400 flex items-center gap-2"><MapPin size={14} /> Select a store to view availability</p>
                            </div>
                        )}
                    </div>

                    {/* Right column - Add to order */}
                    <div className="w-full md:w-[280px] flex-shrink-0">
                        <div className="md:sticky md:top-[100px]">
                            <div className="flex justify-end mb-4">
                                <button onClick={() => setIsFav(!isFav)} className="text-gray-400 hover:text-red-500 transition-colors">
                                    <Heart size={24} fill={isFav ? 'currentColor' : 'none'} className={isFav ? 'text-red-500' : ''} />
                                </button>
                            </div>
                            <button onClick={handleAdd} disabled={added}
                                className={`w-full rounded-full font-semibold py-4 text-sm transition-all flex items-center justify-center gap-2 ${added ? 'bg-starbucks-dark text-white' : 'bg-starbucks-green text-white hover:bg-starbucks-accent'}`}>
                                {added ? <><CheckCircle size={18} /> Added!</> : `Add to Order`}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════
// CART DRAWER
// ═══════════════════════════════════════════════════════

const CartDrawer = () => {
    const { isCartOpen, setIsCartOpen, cartItems, cartTotal, pickupStore, removeFromCart, updateQuantity } = useContext(CartContext);
    const { setPage } = useContext(UIContext);
    if (!isCartOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            <div className="absolute inset-0 bg-black/50" onClick={() => setIsCartOpen(false)} />
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col" style={{ animation: 'slideIn .25s ease-out' }}>
                <div className="p-5 flex justify-between items-center border-b">
                    <h2 className="text-xl font-bold">Your Order ({cartItems.length})</h2>
                    <button onClick={() => setIsCartOpen(false)} className="text-gray-500 hover:text-gray-800"><X size={24} /></button>
                </div>
                <div className="p-4 bg-gray-50 border-b">
                    <p className="text-xs text-gray-500 font-bold uppercase mb-1">Pickup at</p>
                    <p className="font-bold text-sm">{pickupStore.name}</p>
                    <p className="text-sm text-gray-500">{pickupStore.address}</p>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {cartItems.length === 0 ? (
                        <div className="text-center py-16 text-gray-400">
                            <ShoppingBag size={48} className="mx-auto mb-4 opacity-30" />
                            <p className="font-semibold mb-4">Your cart is empty</p>
                            <button onClick={() => { setIsCartOpen(false); setPage('menu'); }} className="rounded-full border border-starbucks-green text-starbucks-green font-semibold px-6 py-2 text-sm hover:bg-starbucks-light/30 transition-colors">Start an order</button>
                        </div>
                    ) : cartItems.map(ci => (
                        <div key={ci.cartId} className="flex gap-4 py-3 border-b last:border-0">
                            <img src={ci.item.image} alt={ci.item.name} className="w-14 h-14 rounded-full object-cover flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between"><h4 className="font-bold text-sm truncate pr-2">{ci.item.name}</h4><span className="font-semibold text-sm">${(ci.item.price * ci.quantity).toFixed(2)}</span></div>
                                <p className="text-xs text-gray-500 mt-0.5">{ci.customizations?.size || 'Grande'}</p>
                                <div className="flex items-center gap-4 mt-2">
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => updateQuantity(ci.cartId, -1)} className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-starbucks-green hover:text-starbucks-green"><Minus size={12} /></button>
                                        <span className="text-sm font-semibold w-4 text-center">{ci.quantity}</span>
                                        <button onClick={() => updateQuantity(ci.cartId, 1)} className="w-6 h-6 rounded-full bg-starbucks-green text-white flex items-center justify-center hover:bg-starbucks-accent"><Plus size={12} /></button>
                                    </div>
                                    <button className="text-xs text-gray-500 underline hover:text-red-600" onClick={() => removeFromCart(ci.cartId)}>Remove</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {cartItems.length > 0 && (
                    <div className="p-5 border-t bg-gray-50">
                        <div className="flex justify-between mb-4 font-bold text-lg"><span>Subtotal</span><span>${cartTotal.toFixed(2)}</span></div>
                        <button onClick={() => { setIsCartOpen(false); setPage('checkout'); }} className="w-full rounded-full bg-starbucks-green text-white font-semibold py-4 text-sm hover:bg-starbucks-accent transition-colors">Checkout - ${cartTotal.toFixed(2)}</button>
                    </div>
                )}
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════
// CHECKOUT PAGE
// ═══════════════════════════════════════════════════════

const CheckoutPage = ({ setPage }) => {
    const { cartItems, cartTotal, pickupStore, clearCart } = useContext(CartContext);
    const { placeOrder } = useContext(OrderContext);
    const { isAuthenticated } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [tip, setTip] = useState(0);
    const [pm, setPm] = useState('sb');

    if (!isAuthenticated) { setPage('signin'); return null; }
    if (cartItems.length === 0) { setPage('menu'); return null; }

    const tax = +(cartTotal * 0.08).toFixed(2);
    const total = cartTotal + tax + tip;

    const handlePlace = () => {
        setLoading(true);
        setTimeout(() => { placeOrder(cartItems, cartTotal, pickupStore, tip); clearCart(); setLoading(false); setPage('confirmation'); }, 2000);
    };

    return (
        <div className="max-w-[1100px] mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1 space-y-6">
                    <div className="bg-white p-6 rounded-lg border">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><MapPin size={18} /> Pickup store</h2>
                        <p className="font-bold">{pickupStore.name}</p>
                        <p className="text-sm text-gray-500">{pickupStore.address}</p>
                        <div className="mt-3 inline-block bg-green-50 text-starbucks-green px-3 py-1 rounded text-sm font-semibold">Ready in 4-7 mins</div>
                    </div>
                    <div className="bg-white p-6 rounded-lg border">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><CreditCard size={18} /> Payment method</h2>
                        <div className="space-y-3">
                            {[{ id: 'sb', label: 'Starbucks Card (****1234)', c: 'bg-starbucks-green' }, { id: 'visa', label: 'Visa (****4242)', c: 'bg-blue-600' }].map(p => (
                                <button key={p.id} onClick={() => setPm(p.id)} className={`w-full flex items-center gap-3 p-4 border rounded-lg text-left transition-all ${pm === p.id ? 'border-starbucks-green bg-green-50' : 'hover:bg-gray-50'}`}>
                                    <div className={`w-10 h-6 rounded ${p.c}`} /><span className="font-medium text-sm flex-1">{p.label}</span>{pm === p.id && <CheckCircle size={18} className="text-starbucks-green" />}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg border">
                        <h2 className="text-lg font-bold mb-4">Add a tip</h2>
                        <div className="flex gap-3">
                            {[0, 1, 2, 3].map(t => (
                                <button key={t} onClick={() => setTip(t)} className={`flex-1 py-3 rounded-lg border text-sm font-semibold transition-all ${tip === t ? 'border-starbucks-green bg-green-50 text-starbucks-green' : 'border-gray-200 hover:border-gray-300'}`}>{t === 0 ? 'No Tip' : `$${t}.00`}</button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="w-full lg:w-[340px]">
                    <div className="bg-white p-6 rounded-lg border lg:sticky lg:top-[100px]">
                        <h3 className="font-bold text-gray-500 uppercase text-xs mb-4">Order Summary</h3>
                        <div className="space-y-2 mb-4 pb-4 border-b">
                            {cartItems.map(ci => <div key={ci.cartId} className="flex justify-between text-sm"><span className="text-gray-600">{ci.quantity}x {ci.item.name}</span><span>${(ci.item.price * ci.quantity).toFixed(2)}</span></div>)}
                        </div>
                        <div className="space-y-2 text-sm pb-4 border-b mb-4">
                            <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>${cartTotal.toFixed(2)}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Tax</span><span>${tax.toFixed(2)}</span></div>
                            {tip > 0 && <div className="flex justify-between"><span className="text-gray-500">Tip</span><span>${tip.toFixed(2)}</span></div>}
                        </div>
                        <div className="flex justify-between font-bold text-lg mb-6"><span>Total</span><span>${total.toFixed(2)}</span></div>
                        <button disabled={loading} onClick={handlePlace} className="w-full rounded-full bg-starbucks-green text-white font-semibold py-4 text-sm hover:bg-starbucks-accent transition-colors disabled:opacity-50 flex items-center justify-center">
                            {loading ? <Loader2 className="animate-spin" size={18} /> : 'Place Order'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════
// ORDER CONFIRMATION
// ═══════════════════════════════════════════════════════

const ConfirmationPage = ({ setPage }) => {
    const { activeOrder } = useContext(OrderContext);
    const [status, setStatus] = useState('placed');
    useEffect(() => {
        const t1 = setTimeout(() => setStatus('preparing'), 4000);
        const t2 = setTimeout(() => setStatus('ready'), 10000);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, []);

    const steps = ['placed', 'preparing', 'ready'];
    const idx = steps.indexOf(status);
    const labels = { placed: 'Order Placed', preparing: 'Now Preparing', ready: 'Ready for Pickup!' };
    const readyTime = activeOrder ? new Date(activeOrder.estimatedReadyTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

    return (
        <div className="max-w-lg mx-auto py-12 px-4 text-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors ${status === 'ready' ? 'bg-starbucks-green' : 'bg-green-100'}`}>
                {status === 'ready' ? <CheckCircle size={40} className="text-white" /> : status === 'preparing' ? <Coffee size={40} className="text-starbucks-green animate-pulse" /> : <Clock size={40} className="text-starbucks-green" />}
            </div>
            <h1 className="text-2xl font-bold mb-1">{status === 'ready' ? 'Ready for Pickup!' : 'Thanks for your order!'}</h1>
            <p className="text-gray-500 mb-8">{labels[status]}</p>

            <div className="flex items-center gap-0 mb-10 max-w-xs mx-auto">
                {steps.map((s, i) => (
                    <React.Fragment key={s}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i <= idx ? 'bg-starbucks-green text-white' : 'bg-gray-200 text-gray-500'}`}>{i + 1}</div>
                        {i < steps.length - 1 && <div className={`flex-1 h-1 ${i < idx ? 'bg-starbucks-green' : 'bg-gray-200'}`} />}
                    </React.Fragment>
                ))}
            </div>

            <div className="bg-white p-6 rounded-xl border text-left mb-6">
                <div className="flex justify-between mb-3"><span className="text-gray-500 text-sm">Order #</span><span className="font-bold">{activeOrder?.orderNumber}</span></div>
                <div className="flex justify-between mb-3"><span className="text-gray-500 text-sm">Pickup at</span><span className="font-bold text-right text-sm max-w-[200px]">{activeOrder?.store?.name}</span></div>
                <div className="flex justify-between mb-3"><span className="text-gray-500 text-sm">Estimated ready</span><span className="font-bold text-starbucks-green">{readyTime}</span></div>
                <div className="flex justify-between"><span className="text-gray-500 text-sm">Total</span><span className="font-bold">${activeOrder?.total?.toFixed(2)}</span></div>
            </div>

            {activeOrder?.starsEarned > 0 && (
                <div className="bg-starbucks-gold/10 border border-starbucks-gold/30 rounded-lg p-4 mb-6 flex items-center justify-center gap-2">
                    <Star size={18} className="text-starbucks-gold" fill="#CBA258" /><span className="font-semibold text-sm">You earned {activeOrder.starsEarned} Stars!</span>
                </div>
            )}

            <div className="flex flex-col gap-3">
                <button onClick={() => setPage('menu')} className="rounded-full bg-starbucks-green text-white font-semibold px-6 py-3 text-sm hover:bg-starbucks-accent transition-colors">Start new order</button>
                <button onClick={() => setPage('home')} className="rounded-full border border-black text-black font-semibold px-6 py-3 text-sm hover:bg-gray-100 transition-colors">Back to Home</button>
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════
// REWARDS PAGE
// ═══════════════════════════════════════════════════════

const RewardsPage = ({ setPage }) => {
    const { user } = useContext(AuthContext);
    const rewardTiers = [
        { stars: 25, items: ['Customize your drink', 'Extra espresso shot', 'Dairy substitute'] },
        { stars: 100, items: ['Brewed hot or iced coffee or tea', 'Bakery item'] },
        { stars: 200, items: ['Handcrafted drink', 'Hot breakfast', 'Parfait'] },
        { stars: 300, items: ['Salad, sandwich or Protein Box'] },
        { stars: 400, items: ['Select merchandise', 'At-home coffee'] },
    ];

    return (
        <div>
            {/* Hero */}
            <section className="bg-starbucks-green text-white py-16 px-4 text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Starbucks® Rewards</h1>
                <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">Join now to start earning free drinks, food and more.</p>
                {!user && <button onClick={() => setPage('signup')} className="rounded-full bg-white text-starbucks-green font-semibold px-8 py-4 text-sm hover:bg-gray-100 transition-colors">Join for free</button>}
                {user && <p className="text-2xl font-bold flex items-center justify-center gap-2"><Star size={24} fill="#CBA258" className="text-starbucks-gold" /> {user.stars} Stars</p>}
            </section>

            {/* How it works */}
            <section className="max-w-5xl mx-auto py-16 px-4">
                <h2 className="text-3xl font-bold text-center mb-12">Getting started is easy</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { step: '1', title: 'Create an account', desc: 'To get started, join now. You can also join in the app to get access to the full range of benefits.' },
                        { step: '2', title: 'Order and pay how you\'d like', desc: 'Use cash, credit/debit card or save some time and pay right through the app.' },
                        { step: '3', title: 'Earn Stars, get Rewards', desc: 'As you earn Stars, you can redeem them for Rewards—like free food, drinks and more.' },
                    ].map(item => (
                        <div key={item.step} className="text-center">
                            <div className="w-16 h-16 rounded-full bg-starbucks-green text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4">{item.step}</div>
                            <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                            <p className="text-gray-600">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Reward tiers */}
            <section className="bg-starbucks-bg py-16 px-4">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-4">Get your favorites for free</h2>
                    <p className="text-center text-gray-600 mb-12">The more Stars you collect, the more Rewards you unlock.</p>
                    <div className="space-y-6">
                        {rewardTiers.map(tier => (
                            <div key={tier.stars} className="bg-white rounded-xl p-6 flex flex-col md:flex-row md:items-center gap-4 shadow-sm">
                                <div className="flex items-center gap-3 md:w-40 flex-shrink-0">
                                    <Star size={24} fill="#CBA258" className="text-starbucks-gold" />
                                    <span className="text-2xl font-bold text-starbucks-dark">{tier.stars}</span>
                                    <span className="text-gray-500 text-sm">Stars</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-gray-700">{tier.items.join(' • ')}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className="max-w-5xl mx-auto py-16 px-4">
                <h2 className="text-3xl font-bold text-center mb-12">Endless Extras</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { title: 'Fun freebies', desc: 'Not only can you earn free coffee, but we\'ll also throw in a treat for your birthday.' },
                        { title: 'Order & pay ahead', desc: 'Enjoy the convenience of in-store, curbside or drive-thru pickup at select stores.' },
                        { title: 'Get to free faster', desc: 'Earn Stars faster with Double Star Days, bonus Star challenges and more.' },
                        { title: 'Free refills', desc: 'Get free refills of brewed coffee and tea during your store visit.' },
                    ].map(benefit => (
                        <div key={benefit.title} className="bg-starbucks-light rounded-xl p-6">
                            <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                            <p className="text-gray-600 text-sm">{benefit.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            {!user && (
                <section className="bg-starbucks-dark text-white py-16 px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">Join Starbucks® Rewards</h2>
                    <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">Join now to start earning Rewards.</p>
                    <button onClick={() => setPage('signup')} className="rounded-full bg-white text-starbucks-dark font-semibold px-8 py-4 text-sm hover:bg-gray-100 transition-colors">Join now</button>
                </section>
            )}
        </div>
    );
};

// ═══════════════════════════════════════════════════════
// GIFT CARDS PAGE
// ═══════════════════════════════════════════════════════

const GiftCardsPage = ({ setPage }) => {
    const cardDesigns = [
        { id: 1, name: 'Classic Green', image: 'https://images.unsplash.com/photo-1611930022073-84f6e29b3481?w=400&q=80', color: '#00704a' },
        { id: 2, name: 'Birthday Celebration', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', color: '#ff6b6b' },
        { id: 3, name: 'Thank You', image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&q=80', color: '#ffd93d' },
        { id: 4, name: 'Holiday Joy', image: 'https://images.unsplash.com/photo-1512568400610-62da28bc8a13?w=400&q=80', color: '#c41e3a' },
    ];

    return (
        <div>
            {/* Hero */}
            <section className="bg-starbucks-green text-white py-16 px-4 text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Starbucks Gift Cards</h1>
                <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">Give the gift of their favorite coffee</p>
            </section>

            {/* Cards Grid */}
            <section className="max-w-6xl mx-auto py-16 px-4">
                <h2 className="text-2xl font-bold mb-8">Choose a design</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {cardDesigns.map(card => (
                        <div key={card.id} className="group cursor-pointer">
                            <div className="aspect-[1.6/1] rounded-xl overflow-hidden shadow-lg mb-3 transition-transform group-hover:scale-105" style={{ backgroundColor: card.color }}>
                                <img src={card.image} alt={card.name} className="w-full h-full object-cover opacity-90" />
                            </div>
                            <p className="font-semibold text-center">{card.name}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features */}
            <section className="bg-starbucks-bg py-16 px-4">
                <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8 text-center">
                    {[
                        { title: 'Send instantly', desc: 'Email a gift card to anyone, anywhere—it only takes a minute.' },
                        { title: 'Reload anytime', desc: 'Add money to your card whenever you want.' },
                        { title: 'Use anywhere', desc: 'In-store, online, or in the app—your gift card works everywhere Starbucks is.' },
                    ].map(feature => (
                        <div key={feature.title}>
                            <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                            <p className="text-gray-600">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="max-w-4xl mx-auto py-16 px-4 text-center">
                <h2 className="text-3xl font-bold mb-4">Check your card balance</h2>
                <p className="text-gray-600 mb-8">Enter your card number and PIN to see your balance.</p>
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                    <input type="text" placeholder="Card number" className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-starbucks-green" />
                    <button className="rounded-full bg-starbucks-green text-white font-semibold px-8 py-3 text-sm hover:bg-starbucks-accent transition-colors">Check balance</button>
                </div>
            </section>
        </div>
    );
};

// ═══════════════════════════════════════════════════════
// STORE LOCATOR PAGE
// ═══════════════════════════════════════════════════════

const StoreLocatorPage = ({ setPage }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStore, setSelectedStore] = useState(null);
    const [viewMode, setViewMode] = useState('list');

    const stores = [
        { id: 's1', name: 'Lincoln Hwy and Merrillville Rd', address: '725 W 81st Ave, Merrillville, IN 46410', distance: '1.1 mi', hours: 'Open until 9:00 PM', phone: '(219) 555-0101', features: ['Drive-Thru', 'Mobile Order', 'WiFi'] },
        { id: 's2', name: 'Merrillville - Rte 30 & Mississippi', address: '1613 Southlake Mall, Merrillville, IN 46410', distance: '1.3 mi', hours: 'Open until 9:00 PM', phone: '(219) 555-0102', features: ['Mobile Order', 'WiFi', 'Nitro Cold Brew'] },
        { id: 's3', name: 'Hobart - US 30 & Hobart Mall', address: '2400 E 81st Ave, Hobart, IN 46342', distance: '2.4 mi', hours: 'Open until 10:00 PM', phone: '(219) 555-0103', features: ['Drive-Thru', 'Reserve', 'Mobile Order'] },
        { id: 's4', name: 'Schererville - US 41', address: '987 US 41, Schererville, IN 46375', distance: '3.1 mi', hours: 'Open until 9:30 PM', phone: '(219) 555-0104', features: ['Drive-Thru', 'Mobile Order', 'WiFi'] },
        { id: 's5', name: 'Crown Point Square', address: '101 N Main St, Crown Point, IN 46307', distance: '4.2 mi', hours: 'Open until 8:00 PM', phone: '(219) 555-0105', features: ['Mobile Order', 'WiFi', 'Cozy Seating'] },
    ];

    const filteredStores = stores.filter(store =>
        store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.address.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Search Header */}
            <div className="bg-white border-b sticky top-[84px] z-40">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search by city, zip, or address"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-starbucks-green focus:ring-2 focus:ring-starbucks-green/20"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setViewMode('list')}
                                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${viewMode === 'list' ? 'bg-starbucks-green text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            >List</button>
                            <button
                                onClick={() => setViewMode('map')}
                                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${viewMode === 'map' ? 'bg-starbucks-green text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            >Map</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row">
                    {/* Store List */}
                    <div className={`lg:w-[400px] bg-white border-r overflow-y-auto ${viewMode === 'map' ? 'hidden lg:block' : ''}`} style={{ maxHeight: 'calc(100vh - 180px)' }}>
                        <div className="p-4 border-b bg-gray-50">
                            <p className="text-sm text-gray-600">{filteredStores.length} stores nearby</p>
                        </div>
                        {filteredStores.map((store, idx) => (
                            <div
                                key={store.id}
                                onClick={() => setSelectedStore(store)}
                                className={`p-4 border-b cursor-pointer transition-colors hover:bg-gray-50 ${selectedStore?.id === store.id ? 'bg-green-50 border-l-4 border-l-starbucks-green' : ''}`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-gray-900">{store.name}</h3>
                                    <span className="text-sm text-starbucks-green font-semibold">{store.distance}</span>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{store.address}</p>
                                <p className="text-sm text-green-600 mb-3">{store.hours}</p>
                                <div className="flex flex-wrap gap-2">
                                    {store.features.map(feature => (
                                        <span key={feature} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{feature}</span>
                                    ))}
                                </div>
                                {selectedStore?.id === store.id && (
                                    <div className="mt-4 pt-4 border-t flex gap-3">
                                        <button onClick={() => setPage('menu')} className="flex-1 bg-starbucks-green text-white text-sm font-semibold py-2 rounded-full hover:bg-starbucks-accent transition-colors">Order Here</button>
                                        <button className="px-4 py-2 border border-gray-300 text-sm font-semibold rounded-full hover:bg-gray-50 transition-colors"><Phone size={16} /></button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Map Placeholder */}
                    <div className={`flex-1 bg-gray-200 relative ${viewMode === 'list' ? 'hidden lg:block' : ''}`} style={{ minHeight: 'calc(100vh - 180px)' }}>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <MapPin size={64} className="text-starbucks-green mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-700 mb-2">Interactive Map</h3>
                                <p className="text-gray-500 max-w-xs">Select a store from the list to see its location</p>
                            </div>
                        </div>
                        {/* Store markers */}
                        {filteredStores.map((store, idx) => (
                            <div
                                key={store.id}
                                onClick={() => setSelectedStore(store)}
                                className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-full transition-all ${selectedStore?.id === store.id ? 'scale-125 z-10' : 'hover:scale-110'}`}
                                style={{
                                    top: `${20 + (idx * 15)}%`,
                                    left: `${30 + (idx * 12)}%`
                                }}
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${selectedStore?.id === store.id ? 'bg-starbucks-green' : 'bg-white border-2 border-starbucks-green'}`}>
                                    <Coffee size={20} className={selectedStore?.id === store.id ? 'text-white' : 'text-starbucks-green'} />
                                </div>
                                {selectedStore?.id === store.id && (
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white rounded-lg shadow-xl p-3 w-48 z-20">
                                        <p className="font-bold text-sm">{store.name}</p>
                                        <p className="text-xs text-gray-500">{store.distance}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════

function App() {
    const [page, setPage] = useState('home');
    const [selectedProduct, setSelectedProduct] = useState(null);

    const nav = useCallback((p) => { setPage(p); window.scrollTo(0, 0); }, []);

    const renderPage = () => {
        switch (page) {
            case 'home': return <HomePage setPage={nav} />;
            case 'menu': return <MenuPage setPage={nav} setSelectedProduct={setSelectedProduct} />;
            case 'product': return <ProductDetailPage product={selectedProduct} setPage={nav} />;
            case 'signin': return <SignInPage setPage={nav} />;
            case 'signup': return <SignUpPage setPage={nav} />;
            case 'checkout': return <CheckoutPage setPage={nav} />;
            case 'confirmation': return <ConfirmationPage setPage={nav} />;
            case 'rewards': return <RewardsPage setPage={nav} />;
            case 'giftcards': return <GiftCardsPage setPage={nav} />;
            case 'stores': return <StoreLocatorPage setPage={nav} />;
            default: return (
                <div className="max-w-lg mx-auto py-20 px-4 text-center">
                    <h1 className="text-3xl font-bold mb-4">{page.charAt(0).toUpperCase() + page.slice(1)}</h1>
                    <p className="text-gray-500 mb-8">Coming soon.</p>
                    <button onClick={() => nav('home')} className="rounded-full border border-black text-black font-semibold px-6 py-3 text-sm hover:bg-gray-100 transition-colors">Back to Home</button>
                </div>
            );
        }
    };

    return (
        <AuthProvider>
            <CartProvider>
                <OrderProvider>
                    <UIContext.Provider value={{ setPage: nav }}>
                        <div className="min-h-screen font-sans text-gray-900 bg-white">
                            <Header setPage={nav} currentPage={page} />
                            <main>{renderPage()}</main>
                            <CartDrawer />
                            <Footer />
                        </div>
                    </UIContext.Provider>
                </OrderProvider>
            </CartProvider>
        </AuthProvider>
    );
}

export default App;
