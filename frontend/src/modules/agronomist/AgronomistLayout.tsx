import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Search,
    FileText,
    LogOut,
    Menu,
    X,
    User,
    Bell,
    Leaf
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { authService } from "@/services/auth";
import { Navigate } from 'react-router-dom';

const agronomistNavigation = [
    { name: 'Dashboard', href: '/agronomist', icon: LayoutDashboard },
    { name: 'Farm Registry', href: '/agronomist/farms', icon: Search },
    { name: 'Advisories', href: '/agronomist/advisories', icon: FileText },
];

const AgronomistLayout = () => {
    const user = authService.getCurrentUser();
    if (!user?.role) return <Navigate to="/auth" replace />;

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        authService.logout();
        navigate('/auth');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
                isSidebarOpen ? "translate-x-0 shadow-xl" : "-translate-x-full"
            )}>
                <div className="h-full flex flex-col p-6">
                    {/* Brand Logo */}
                    <div className="flex items-center gap-2 mb-10 px-2">
                        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                            <Leaf className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold">
                            Bhoomi<span className="text-primary">Graph</span>
                        </span>
                    </div>

                    <nav className="flex-1 space-y-1">
                        {agronomistNavigation.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                                        isActive
                                            ? "bg-primary/10 text-primary"
                                            : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                                    )}
                                    onClick={() => setIsSidebarOpen(false)}
                                >
                                    <item.icon size={20} />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="mt-auto pt-6 border-t border-gray-100">
                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-3 h-12 rounded-xl text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all font-medium"
                            onClick={handleLogout}
                        >
                            <LogOut size={20} />
                            Logout
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 lg:px-8 sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <button
                            className="p-2 text-gray-500 lg:hidden rounded-lg hover:bg-gray-100"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu size={24} />
                        </button>
                        <h1 className="text-lg font-semibold text-gray-900 lg:hidden">Agronomist</h1>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                        </button>

                        <div className="h-8 w-[1px] bg-gray-200" />

                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-semibold text-gray-900 leading-none">{user?.name || 'Agronomist'}</p>
                                <p className="text-[11px] text-primary font-medium uppercase tracking-wider mt-1">Agronomist</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                {user?.name?.substring(0, 2).toUpperCase() || 'AG'}
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AgronomistLayout;
