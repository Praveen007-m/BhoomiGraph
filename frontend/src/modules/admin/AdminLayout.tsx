import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import {
    Users, LayoutDashboard, Tractor, Activity,
    MapPin, ShoppingCart, Wallet, BookOpen,
    Leaf, Menu, X, LogOut, ChevronLeft, ChevronRight
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import AdminHeader from './components/AdminHeader';

import { authService } from '@/services/auth';
import { Navigate } from 'react-router-dom';

const AdminLayout = () => {
    const user = authService.getCurrentUser();
    if (!user?.role) return <Navigate to="/auth" replace />;

    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();

    const navItems = [
        { label: 'Overview', path: '/admin', icon: LayoutDashboard },
        { label: 'Users', path: '/admin/users', icon: Users },
        { label: 'Farms', path: '/admin/farms', icon: Tractor },
        { label: 'Sensors', path: '/admin/sensors', icon: Activity },
        { label: 'Pilot Registry', path: '/admin/pilots', icon: MapPin },
        { label: 'Service Bookings', path: '/admin/bookings', icon: ShoppingCart },
        { label: 'Transactions', path: '/admin/transactions', icon: Wallet },
        { label: 'Crop Library', path: '/admin/crops', icon: Leaf },
        { label: 'Content Hub', path: '/admin/content', icon: BookOpen },
    ];

    const toggleSidebar = () => setCollapsed(!collapsed);
    const toggleMobile = () => setMobileOpen(!mobileOpen);
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/auth");
    };

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar Desktop */}
            <aside
                className={cn(
                    "hidden md:flex flex-col bg-white border-r transition-all duration-300 ease-in-out",
                    collapsed ? "w-20" : "w-64"
                )}
            >
                <div className="p-6 flex items-center justify-between">
                    {!collapsed && (
                        <Link to="/admin" className="flex items-center gap-2 group cursor-pointer">
                            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-md shadow-primary/20">
                                <Leaf className="w-5 h-5 text-primary-foreground" />
                            </div>
                            <span className="text-xl font-display font-bold">
                                Bhoomi<span className="text-primary">Graph</span>
                            </span>
                        </Link>
                    )}
                    <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                    </Button>
                </div>

                <nav className="flex-1 px-4 space-y-1 overflow-y-auto mt-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/admin'}
                            className={({ isActive }) => cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                                isActive
                                    ? "bg-primary text-white shadow-md shadow-primary/20"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-primary"
                            )}
                        >
                            <item.icon size={20} className={cn(!collapsed && "shrink-0")} />
                            {!collapsed && <span className="font-medium">{item.label}</span>}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t">
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50",
                            collapsed && "px-2"
                        )}
                        onClick={handleLogout}
                    >
                        <LogOut size={20} />
                        {!collapsed && <span className="ml-3 font-medium">Logout</span>}
                    </Button>
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 md:hidden"
                    onClick={toggleMobile}
                />
            )}

            {/* Mobile Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out md:hidden",
                    mobileOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="p-6 flex items-center justify-between border-b">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-md shadow-primary/20">
                            <Leaf className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-display font-bold">
                            Bhoomi<span className="text-primary">Graph</span>
                        </span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={toggleMobile}>
                        <X size={20} />
                    </Button>
                </div>
                <nav className="p-4 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/admin'}
                            onClick={toggleMobile}
                            className={({ isActive }) => cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                                isActive
                                    ? "bg-primary text-white"
                                    : "text-gray-600 hover:bg-gray-100"
                            )}
                        >
                            <item.icon size={20} />
                            <span className="font-medium">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <AdminHeader toggleMobile={toggleMobile} />
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
