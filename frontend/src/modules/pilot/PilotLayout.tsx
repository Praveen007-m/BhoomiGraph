import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    LogOut,
    Menu,
    X,
    User,
    ClipboardList,
    Leaf,
    Settings
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { authService } from "@/services/auth";
import { Navigate } from 'react-router-dom';

const pilotNavigation = [
    { name: 'Dashboard', href: '/pilot', icon: LayoutDashboard },
    { name: 'My Bookings', href: '/pilot/jobs', icon: ClipboardList },
];

const PilotLayout = () => {
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
        <div className="min-h-screen bg-gray-50 flex text-slate-900 font-sans">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="h-full flex flex-col">
                    <div className="p-6">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                                <Leaf className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold">
                                Bhoomi<span className="text-primary">Graph</span>
                            </span>
                        </div>
                    </div>

                    <nav className="flex-1 px-4 mt-4 space-y-1">
                        {pilotNavigation.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
                                        isActive
                                            ? "bg-primary/10 text-primary shadow-sm"
                                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                    )}
                                    onClick={() => setIsSidebarOpen(false)}
                                >
                                    <item.icon size={20} className={cn(
                                        "transition-colors",
                                        isActive ? "text-primary" : "text-slate-400 group-hover:text-slate-600"
                                    )} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t border-slate-100">
                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-3 h-11 px-4 rounded-xl text-slate-600 hover:text-red-600 hover:bg-red-50"
                            onClick={handleLogout}
                        >
                            <LogOut size={18} />
                            Log Out
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30">
                    <button
                        className="p-2 text-slate-600 lg:hidden rounded-lg hover:bg-slate-100 transition-colors"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <Menu size={24} />
                    </button>

                    <div className="flex-1 px-4 lg:px-0">
                        <span className="text-sm font-medium text-slate-500 hidden md:block">
                            Role: <span className="text-slate-900 font-bold">Drone Pilot</span>
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-bold text-slate-900 uppercase">{user?.name}</p>
                            <p className="text-[10px] text-slate-500 font-medium">Standard License</p>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center font-bold text-sm text-primary border border-primary/20">
                            {user?.name?.slice(0, 2).toUpperCase() || 'P'}
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6 lg:p-10">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default PilotLayout;
