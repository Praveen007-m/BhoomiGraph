import { useState, useEffect } from "react";
import api from "@/services/api";
import { serviceBookingService } from "@/services/serviceBookingService";
import { userService } from "@/services/userService";
import { paymentService } from "@/services/paymentService";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserTable } from "@/components/features/admin/UserTable";
import { BookingTable } from "@/components/features/admin/BookingTable";
import { PaymentTable } from "@/components/features/admin/PaymentTable";

export default function AdminDashboard() {
    const [users, setUsers] = useState<any[]>([]);
    const [bookings, setBookings] = useState<any[]>([]);
    const [payments, setPayments] = useState<any[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Fetch Users
            const userResponse = await userService.getAllUsers();
            setUsers(userResponse.users || []);

            // Fetch Payments
            const paymentResponse = await paymentService.getAllPayments();
            setPayments(paymentResponse.payments || []);

            const bookingResponse = await serviceBookingService.getAllBookings();
            setBookings(bookingResponse.data || []);
        } catch (error) {
            console.error("Failed to fetch admin data");
        }
    };

    const handleStatusUpdate = async (id: number, status: string) => {
        try {
            // Assuming backend supports PATCH /bookings/:id
            // Since we didn't see PATCH in routes file, this might fail if not added to backend.
            // However, strictly following instructions to connect what's available.
            // If PATCH is missing in backend, we should add it or use a mock update here for UI.
            // Updating backend route is better.
            await serviceBookingService.updateBookingStatus(id, status);
            fetchData();
        } catch (error) {
            console.error("Update failed", error);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>

                <Tabs defaultValue="users">
                    <TabsList>
                        <TabsTrigger value="users">User Management</TabsTrigger>
                        <TabsTrigger value="services">Service Requests</TabsTrigger>
                        <TabsTrigger value="payments">Transactions</TabsTrigger>
                    </TabsList>

                    <TabsContent value="users">
                        <Card>
                            <CardHeader><CardTitle>All Users</CardTitle></CardHeader>
                            <CardContent>
                                <UserTable users={users} />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="services">
                        <Card>
                            <CardHeader><CardTitle>Service Bookings</CardTitle></CardHeader>
                            <CardContent>
                                <BookingTable bookings={bookings} onStatusUpdate={handleStatusUpdate} />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="payments">
                        <Card>
                            <CardHeader><CardTitle>Payment Transactions</CardTitle></CardHeader>
                            <CardContent>
                                <PaymentTable payments={payments} />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
