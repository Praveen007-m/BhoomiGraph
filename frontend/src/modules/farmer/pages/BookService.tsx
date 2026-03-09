import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Calendar, MapPin, CreditCard, CheckCircle2 } from 'lucide-react';
import { useFarmerFarms } from '../hooks/useFarmer';
import { toast } from 'sonner';
import api from '@/services/api';

const BookService = () => {
    const navigate = useNavigate();
    const { data: farms } = useFarmerFarms();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        farm_id: '',
        service_type: '',
        booking_date: '',
        notes: ''
    });

    const services = [
        { id: 'drone_mapping', name: 'Drone Mapping', price: 1500, description: 'High-resolution NDVI and field mapping.' },
        { id: 'soil_testing', name: 'Soil Testing', price: 800, description: 'Comprehensive soil pH and nutrient analysis.' },
        { id: 'crop_advisory', name: 'Crop Advisory', price: 500, description: 'Personalized expert consultation for crop health.' },
    ];

    const handleBooking = async () => {
        try {
            const selectedService = services.find(s => s.id === formData.service_type);
            await api.post('/farmer/bookings', {
                ...formData,
                amount: selectedService?.price || 0
            });
            setStep(3);
            toast.success("Booking created successfully!");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Booking failed");
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/farmer/bookings')} className="rounded-full">
                    <ChevronLeft size={20} />
                </Button>
                <div>
                    <h1 className="text-2xl font-black text-slate-900">Book a Service</h1>
                    <p className="text-slate-500 text-sm font-medium">Select a farm and professional service.</p>
                </div>
            </div>

            {/* Stepper */}
            <div className="flex items-center justify-between px-6">
                {[1, 2, 3].map((s) => (
                    <div key={s} className="flex items-center gap-2">
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
                            step >= s ? "bg-green-600 text-white shadow-lg shadow-green-100" : "bg-slate-100 text-slate-400"
                        )}>
                            {step > s ? <CheckCircle2 size={16} /> : s}
                        </div>
                        {s < 3 && <div className={cn("w-12 h-1 rounded-full", step > s ? "bg-green-600" : "bg-slate-100")}></div>}
                    </div>
                ))}
            </div>

            {step === 1 && (
                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold">Step 1: Mission Details</CardTitle>
                        <CardDescription>Select your farm and the service you need.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label>Select Farm</Label>
                            <Select value={formData.farm_id} onValueChange={(v) => setFormData({ ...formData, farm_id: v })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose a farm plot" />
                                </SelectTrigger>
                                <SelectContent>
                                    {farms?.map((f: any) => (
                                        <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Select Service</Label>
                            <div className="grid grid-cols-1 gap-3">
                                {services.map((s) => (
                                    <div
                                        key={s.id}
                                        onClick={() => setFormData({ ...formData, service_type: s.id })}
                                        className={cn(
                                            "p-4 rounded-2xl border-2 transition-all cursor-pointer",
                                            formData.service_type === s.id ? "border-green-600 bg-green-50" : "border-slate-100 hover:border-slate-200"
                                        )}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <p className="font-bold text-slate-900">{s.name}</p>
                                            <p className="font-black text-green-600">₹{s.price}</p>
                                        </div>
                                        <p className="text-xs text-slate-500 font-medium">{s.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Button
                            className="w-full rounded-xl font-bold bg-green-600 h-12"
                            disabled={!formData.farm_id || !formData.service_type}
                            onClick={() => setStep(2)}
                        >
                            Continue to Schedule
                        </Button>
                    </CardContent>
                </Card>
            )}

            {step === 2 && (
                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold">Step 2: Schedule & Pay</CardTitle>
                        <CardDescription>Pick a date and complete the booking.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label>Mission Date</Label>
                            <Input
                                type="date"
                                value={formData.booking_date}
                                onChange={(e) => setFormData({ ...formData, booking_date: e.target.value })}
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Additional Notes</Label>
                            <Input
                                placeholder="Any specific instructions for the pilot/team?"
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            />
                        </div>

                        <div className="p-4 bg-slate-50 rounded-2xl space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500 font-medium">Service Total</span>
                                <span className="text-slate-900 font-black">₹{services.find(s => s.id === formData.service_type)?.price}</span>
                            </div>
                            <div className="border-t border-slate-200 pt-3 flex justify-between">
                                <span className="text-slate-900 font-bold">Grand Total</span>
                                <span className="text-green-600 font-black text-lg">₹{services.find(s => s.id === formData.service_type)?.price}</span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button variant="outline" className="flex-1 rounded-xl font-bold" onClick={() => setStep(1)}>Back</Button>
                            <Button className="flex-[2] rounded-xl font-bold bg-green-600 h-12 gap-2" onClick={handleBooking}>
                                <CreditCard size={18} />
                                Pay & Confirm
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {step === 3 && (
                <Card className="border-none shadow-sm text-center py-12">
                    <CardContent className="space-y-6">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-50 mb-4">
                            <CheckCircle2 size={48} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900">Booking Confirmed!</h2>
                            <p className="text-slate-500 font-medium mt-2 max-w-xs mx-auto">
                                Our team will contact you shortly to coordinate the mission details.
                            </p>
                        </div>
                        <Button className="rounded-xl font-bold bg-slate-900 px-8" onClick={() => navigate('/farmer/bookings')}>
                            View My Bookings
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

export default BookService;
