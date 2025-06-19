// Bun venit în versiunea extinsă a Momentum!
// Acest prototip folosește React Hooks (useState) pentru a gestiona starea aplicației,
// făcând-o interactivă. Puteți adăuga tranzacții și obiective noi.

import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Home, Wallet, ShoppingCart, BarChart2, Settings, Bell, ChevronDown, TrendingUp, Target, CreditCard, Utensils, Car, Plane, Gift, PlusCircle, X } from 'lucide-react';

// --- DATE INIȚIALE SIMULATE --- //
// Acum acestea vor fi încărcate în starea aplicației (state).

const initialTransactions = [
    { id: 1, icon: <ShoppingCart />, description: "Supermarket LaDoiPași", category: "Cumpărături", amount: -124.50, date: "18 Iun" },
    { id: 2, icon: <Utensils />, description: "Restaurant Trattoria", category: "Mâncare", amount: -85.00, date: "17 Iun" },
    { id: 3, icon: <CreditCard />, description: "Plată factură electricitate", category: "Facturi", amount: -250.70, date: "16 Iun" },
    { id: 4, icon: <Plane />, description: "Bilete avion vacanță", category: "Călătorii", amount: -1200.00, date: "15 Iun" },
    { id: 5, icon: <TrendingUp />, description: "Salariu", category: "Venit", amount: 4500.00, date: "15 Iun" },
];

const initialGoals = [
    { id: 1, name: "Vacanță în Grecia", current: 1850, target: 3000 },
    { id: 2, name: "Laptop Nou", current: 450, target: 1500 },
];

const expenseCategories = ['Facturi', 'Mâncare', 'Transport', 'Cumpărături', 'Divertisment', 'Călătorii', 'Altele'];
const incomeCategories = ['Venit', 'Bonus', 'Cadouri'];


// --- COMPONENTE REUTILIZABILE --- //

const StatCard = ({ title, amount, icon, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-md flex items-center justify-between">
        <div>
            <p className="text-slate-500 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-slate-800">{amount}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
            {icon}
        </div>
    </div>
);

const GoalProgress = ({ goal }) => {
    const progress = Math.min((goal.current / goal.target) * 100, 100);
    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="font-bold text-lg text-slate-800 mb-4">{goal.name}</h3>
            <div className="flex justify-between items-center mb-2 text-sm text-slate-600">
                <span>Economisit: <span className="font-bold text-green-600">{goal.current.toFixed(2)} RON</span></span>
                <span>Țintă: <span className="font-bold">{goal.target.toFixed(2)} RON</span></span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-4">
                <div className="bg-green-500 h-4 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="text-right text-sm mt-1 text-slate-500">{Math.round(progress)}% atins</p>
        </div>
    );
};

// --- COMPONENTE PAGINI --- //

const DashboardPage = ({ transactions, goals }) => {
    // Calculăm datele pentru grafice pe baza tranzacțiilor curente
    const expenseData = useMemo(() => {
        const categories = {};
        transactions.filter(t => t.amount < 0).forEach(t => {
            categories[t.category] = (categories[t.category] || 0) + Math.abs(t.amount);
        });
        const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF6666', '#66CCCC'];
        return Object.entries(categories).map(([name, value], index) => ({
            name,
            value: parseFloat(value.toFixed(2)),
            color: colors[index % colors.length]
        }));
    }, [transactions]);
    
    // Date simulate pentru trend, într-o aplicație reală s-ar calcula
    const savingsData = [
      { name: 'Ian', economii: 400 }, { name: 'Feb', economii: 300 },
      { name: 'Mar', economii: 600 }, { name: 'Apr', economii: 800 },
      { name: 'Mai', economii: 700 }, { name: 'Iun', economii: 950 },
    ];
    
    const totalIncome = transactions.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + t.amount, 0);
    const currentBalance = totalIncome + totalExpenses;


    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <StatCard title="Sold Curent" amount={`${currentBalance.toFixed(2)} RON`} icon={<Wallet className="h-6 w-6 text-white"/>} color="bg-blue-500"/>
                <StatCard title="Venituri Luna Curentă" amount={`${totalIncome.toFixed(2)} RON`} icon={<TrendingUp className="h-6 w-6 text-white"/>} color="bg-green-500"/>
                <StatCard title="Cheltuieli Luna Curentă" amount={`${Math.abs(totalExpenses).toFixed(2)} RON`} icon={<ShoppingCart className="h-6 w-6 text-white"/>} color="bg-red-500"/>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="font-bold text-lg text-slate-800 mb-4">Cheltuieli pe Categorii</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie data={expenseData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" labelLine={false}>
                                    {expenseData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                </Pie>
                                <Tooltip formatter={(value) => `${value.toFixed(2)} RON`}/>
                                <Legend/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md">
                   <h3 className="font-bold text-lg text-slate-800 mb-4">Evoluția Economiilor</h3>
                   <div style={{ width: '100%', height: 300 }}>
                      <ResponsiveContainer>
                          <LineChart data={savingsData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip formatter={(value) => `${value.toFixed(2)} RON`}/>
                              <Legend />
                              <Line type="monotone" dataKey="economii" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} />
                          </LineChart>
                      </ResponsiveContainer>
                   </div>
               </div>
            </div>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {goals.slice(0, 2).map(goal => <GoalProgress key={goal.id} goal={goal} />)}
            </div>
        </>
    );
};

const TransactionsPage = ({ transactions, setTransactions }) => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('Altele');
    const [type, setType] = useState('expense');

    const handleAddTransaction = (e) => {
        e.preventDefault();
        if (!description || !amount) return;
        const newTransaction = {
            id: Date.now(),
            icon: <ShoppingCart />,
            description,
            category,
            amount: type === 'expense' ? -parseFloat(amount) : parseFloat(amount),
            date: new Date().toLocaleDateString('ro-RO', { day: 'numeric', month: 'short' })
        };
        setTransactions(prev => [newTransaction, ...prev]);
        setDescription('');
        setAmount('');
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
                <h3 className="font-bold text-lg text-slate-800 mb-4">Toate Tranzacțiile</h3>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    {transactions.map(tx => (
                        <div key={tx.id} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg border-b">
                            <div className="flex items-center">
                                <div className="p-3 bg-slate-100 rounded-full mr-4">{tx.icon}</div>
                                <div>
                                    <p className="font-semibold text-slate-700">{tx.description}</p>
                                    <p className="text-sm text-slate-500">{tx.category}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={`font-bold ${tx.amount > 0 ? 'text-green-600' : 'text-slate-800'}`}>
                                    {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)} RON
                                </p>
                                <p className="text-sm text-slate-500">{tx.date}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="font-bold text-lg text-slate-800 mb-4">Adaugă Tranzacție</h3>
                <form onSubmit={handleAddTransaction}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-600 mb-1">Tip Tranzacție</label>
                        <select value={type} onChange={e => setType(e.target.value)} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                            <option value="expense">Cheltuială</option>
                            <option value="income">Venit</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-600 mb-1">Descriere</label>
                        <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Ex: Cafea" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-600 mb-1">Sumă (RON)</label>
                        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                    </div>
                     <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-600 mb-1">Categorie</label>
                        <select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                            {(type === 'expense' ? expenseCategories : incomeCategories).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <button type="submit" className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 flex items-center justify-center">
                        <PlusCircle className="mr-2" /> Adaugă
                    </button>
                </form>
            </div>
        </div>
    );
};

const GoalsPage = ({ goals, setGoals }) => {
    const [name, setName] = useState('');
    const [target, setTarget] = useState('');

    const handleAddGoal = (e) => {
        e.preventDefault();
        if (!name || !target) return;
        const newGoal = {
            id: Date.now(),
            name,
            current: 0,
            target: parseFloat(target)
        };
        setGoals(prev => [...prev, newGoal]);
        setName('');
        setTarget('');
    };

    return (
        <div>
             <div className="bg-white p-6 rounded-xl shadow-md mb-6">
                <h3 className="font-bold text-lg text-slate-800 mb-4">Adaugă Obiectiv Nou</h3>
                <form onSubmit={handleAddGoal} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-slate-600 mb-1">Nume Obiectiv</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Fond de urgență" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">Suma Țintă (RON)</label>
                        <input type="number" value={target} onChange={e => setTarget(e.target.value)} placeholder="5000" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <button type="submit" className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 flex items-center justify-center">
                        <PlusCircle className="mr-2" /> Setează Obiectiv
                    </button>
                </form>
            </div>
            
            <h3 className="font-bold text-xl text-slate-800 mb-4">Obiectivele Mele</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {goals.map(goal => <GoalProgress key={goal.id} goal={goal} />)}
            </div>
        </div>
    );
};

// --- COMPONENTE STRUCTURALE --- //

const Sidebar = ({ activePage, setActivePage }) => {
    const navItems = [
        { name: 'Dashboard', icon: <Home /> },
        { name: 'Tranzacții', icon: <ShoppingCart /> },
        { name: 'Obiective', icon: <Target /> },
        { name: 'Rapoarte', icon: <BarChart2 /> }
    ];
    return (
        <div className="bg-slate-800 text-slate-300 w-64 p-4 flex flex-col min-h-screen">
            <h1 className="text-white text-2xl font-bold mb-10 flex items-center">
                <Wallet className="mr-2"/> Momentum
            </h1>
            <nav className="flex-grow">
                <ul>
                    {navItems.map(item => (
                         <li key={item.name} className="mb-4">
                            <a href="#" onClick={() => setActivePage(item.name)} className={`flex items-center p-2 rounded-lg ${activePage === item.name ? 'bg-slate-700 text-white' : 'hover:bg-slate-700'}`}>
                                {React.cloneElement(item.icon, {className: 'mr-3'})} {item.name}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
            <div>
                <a href="#" className="flex items-center p-2 rounded-lg hover:bg-slate-700"><Settings className="mr-3"/> Setări</a>
            </div>
        </div>
    );
};

const Header = () => (
    <header className="bg-white p-4 flex justify-between items-center shadow-sm sticky top-0 z-10">
        <div>
            <h2 className="text-2xl font-bold text-slate-800">Bună, Alex!</h2>
            <p className="text-slate-500">Iată o privire de ansamblu asupra finanțelor tale.</p>
        </div>
        <div className="flex items-center space-x-4">
            <Bell className="text-slate-500 hover:text-slate-800 cursor-pointer"/>
            <div className="flex items-center space-x-2">
                <img src="https://placehold.co/40x40/E2E8F0/475569?text=A" alt="Avatar utilizator" className="rounded-full"/>
                <span className="font-semibold text-slate-700">Alex Popescu</span>
                <ChevronDown className="text-slate-500"/>
            </div>
        </div>
    </header>
);


// --- COMPONENTA PRINCIPALĂ A APLICAȚIEI --- //

export default function App() {
    // Starea aplicației (state)
    const [activePage, setActivePage] = useState('Dashboard');
    const [transactions, setTransactions] = useState(initialTransactions);
    const [goals, setGoals] = useState(initialGoals);

    // Funcție pentru a randa pagina activă
    const renderPage = () => {
        switch (activePage) {
            case 'Dashboard':
                return <DashboardPage transactions={transactions} goals={goals} />;
            case 'Tranzacții':
                return <TransactionsPage transactions={transactions} setTransactions={setTransactions} />;
            case 'Obiective':
                return <GoalsPage goals={goals} setGoals={setGoals} />;
            case 'Rapoarte':
                return <div className="text-center p-10 bg-white rounded-xl shadow-md">Funcționalitatea de Rapoarte va fi disponibilă în curând!</div>;
            default:
                return <DashboardPage transactions={transactions} goals={goals} />;
        }
    };
    
    return (
        <div className="flex bg-slate-50 font-sans">
            <div className="hidden md:flex">
                <Sidebar activePage={activePage} setActivePage={setActivePage} />
            </div>
            
            <div className="flex-1 min-h-screen">
                <Header />
                <main className="p-6">
                    {renderPage()}
                </main>
            </div>
        </div>
    );
}
