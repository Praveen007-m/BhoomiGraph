import { useState, useEffect } from "react";
import { paymentService } from "@/services/paymentService";
import { authService } from "@/services/auth"; // Need user details for prefill
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { CreditCard, History } from "lucide-react";

export default function Payments() {
    const [amount, setAmount] = useState("");
    const [history, setHistory] = useState<any[]>([]);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const response = await paymentService.getHistory();
            setHistory(response.data || []);
        } catch (error) {
            console.error("Failed to fetch payment history");
        }
    };

    const handlePayment = async () => {
        if (!amount) return;
        try {
            // 1. Create Order
            const orderRes = await paymentService.createOrder(Number(amount));
            const { id: order_id, currency, key } = orderRes; // Expecting key from backend too if possible, else env

            const user = authService.getCurrentUser();

            // 2. Open Razorpay
            const options = {
                key: key || import.meta.env.VITE_RAZORPAY_KEY_ID || "YOUR_TEST_KEY_ID", // Fallback if backend doesn't send key
                amount: Number(amount) * 100,
                currency: currency,
                name: "BhoomiGraph",
                description: "Wallet Top-up",
                order_id: order_id,
                handler: async function (response: any) {
                    try {
                        // 3. Verify Payment
                        await paymentService.verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });
                        toast.success("Payment Successful!");
                        fetchHistory();
                        setAmount("");
                    } catch (err) {
                        toast.error("Payment Verification Failed");
                    }
                },
                prefill: {
                    name: user?.name,
                    email: user?.email,
                    contact: user?.mobile
                },
                theme: {
                    color: "#3399cc"
                }
            };

            const rzp1 = new (window as any).Razorpay(options);
            rzp1.open();
        } catch (error: any) {
            toast.error("Payment initiation failed");
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                <h1 className="text-3xl font-bold">Payments & Wallet</h1>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><CreditCard /> Add Funds</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-4">
                            <Input
                                type="number"
                                placeholder="Amount (₹)"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                            <Button onClick={handlePayment}>Pay Now</Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><History /> Transaction History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {history.length === 0 ? (
                            <p className="text-gray-500">No transactions yet.</p>
                        ) : (
                            <ul className="space-y-2">
                                {history.map((tx) => (
                                    <li key={tx.id} className="flex justify-between p-2 bg-white rounded shadow-sm">
                                        <span>{tx.description}</span>
                                        <span className={tx.status === 'success' ? 'text-green-600' : 'text-red-600'}>
                                            {tx.status} - ₹{tx.amount}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
