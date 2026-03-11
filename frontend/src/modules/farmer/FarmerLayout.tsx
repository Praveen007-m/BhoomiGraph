import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { authService } from "@/services/auth";
import {
    LayoutDashboard,
    Map as MapIcon,
    Calendar,
    Wallet,
    Bell,
    LogOut,
    Menu,
    X,
    User,
    ChevronRight,
    Sprout,
    CloudSun,
    LineChart,
    FileText,
    Activity
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const farmerNavigation = [
    { name: 'Overview', href: '/farmer', icon: LayoutDashboard },
    { name: 'My Farms', href: '/farmer/farms', icon: MapIcon },
    { name: 'NDVI & Insights', href: '/farmer/ndvi', icon: LineChart },
    { name: 'Weather Insights', href: '/farmer/weather', icon: CloudSun },
    { name: 'IoT & Sensors', href: '/farmer/iot', icon: Activity },
    { name: 'Drone Reports', href: '/farmer/reports', icon: FileText },
    { name: 'Services', href: '/farmer/services', icon: Calendar },
    { name: 'Wallet & Payments', href: '/farmer/payments', icon: Wallet },
];

const FarmerLayout = () => {
    const user = authService.getCurrentUser();
    if (!user?.role) return <Navigate to="/auth" replace />;

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/auth');
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="h-full flex flex-col">
                    {/* Sidebar Header */}
                    <div className="p-6 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-200">
                                <Sprout size={24} />
                            </div>
                            <div>
                                <h2 className="font-bold text-slate-900 tracking-tight">LOEMS</h2>
                                <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider">Farmer Panel</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
                        {farmerNavigation.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group",
                                        isActive
                                            ? "bg-green-50 text-green-700 shadow-sm"
                                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                    )}
                                    onClick={() => setIsSidebarOpen(false)}
                                >
                                    <item.icon size={20} className={cn(
                                        "transition-colors",
                                        isActive ? "text-green-600" : "text-slate-400 group-hover:text-slate-600"
                                    )} />
                                    {item.name}
                                    {isActive && <ChevronRight size={14} className="ml-auto opacity-50" />}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Sidebar Footer */}
                    <div className="p-4 border-t border-slate-100">
                        <div className="bg-slate-50 rounded-2xl p-4 mb-4">
                            <div className="flex items-center gap-3 mb-1">
                                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700">
                                    <User size={16} />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-xs font-bold text-slate-900 truncate">
                                        {JSON.parse(localStorage.getItem('user') || '{}').name || 'Farmer'}
                                    </p>
                                    <p className="text-[10px] text-slate-500 font-medium truncate">Premium Farmer</p>
                                </div>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-3 rounded-xl text-slate-600 hover:text-red-600 hover:bg-red-50"
                            onClick={handleLogout}
                        >
                            <LogOut size={18} />
                            Sign Out
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30">
                    <button
                        className="p-2 -ml-2 text-slate-600 lg:hidden hover:bg-slate-100 rounded-lg transition-colors"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <Menu size={24} />
                    </button>

                    <div className="flex-1 max-w-xl mx-4 hidden sm:block font-medium text-slate-500 text-sm">
                        Welcome back, <span className="text-slate-900 font-bold">
                            {JSON.parse(localStorage.getItem('user') || '{}').name?.split(' ')[0] || 'Farmer'}!
                        </span> 🌱
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            to="/farmer/alerts"
                            className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
                        >
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
                        </Link>
                        <Link to="/farmer/profile" className="flex items-center gap-3 pl-2 group">
                            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-xs ring-2 ring-slate-100 group-hover:ring-slate-200 transition-all">
                                PK
                            </div>
                        </Link>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6 lg:p-10">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default FarmerLayout;
