import React, { useState } from 'react';
import { useFarmerFarms } from '../../farmer/hooks/useFarmer';
import { useCreateAdvisory } from '../hooks/useAgronomist';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    MessageSquarePlus,
    Send,
    AlertTriangle,
    CheckCircle,
    Info,
    Sprout,
    Search
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const AdvisoryEditor = () => {
    const navigate = useNavigate();
    const { data: farms } = useFarmerFarms();
    const createAdvisory = useCreateAdvisory();

    const [formData, setFormData] = useState({
        farm_id: '',
        crop_id: '',
        issue_analysis: '',
        recommendations: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.farm_id || !formData.issue_analysis || !formData.recommendations) {
            return toast.error("Please fill in all required fields.");
        }

        createAdvisory.mutate(formData, {
            onSuccess: () => {
                toast.success("Advisory published to farmer successfully.");
                navigate('/agronomist/history');
            },
            onError: (err: any) => toast.error(err.message || "Failed to publish advisory")
        });
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10">
            <div>
                <h1 className="text-3xl font-black text-emerald-950 tracking-tight">Technical Advisory</h1>
                <p className="text-slate-500 font-medium italic">Compose scientific recommendations for field improvement.</p>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <Info className="text-emerald-500" size={20} />
                                Observation Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Select Target Farm</label>
                                <select
                                    className="w-full px-4 py-3 rounded-xl border border-emerald-100 bg-emerald-50/10 focus:ring-2 focus:ring-emerald-500/20 outline-none font-medium appearance-none"
                                    value={formData.farm_id}
                                    onChange={(e) => setFormData({ ...formData, farm_id: e.target.value })}
                                >
                                    <option value="">-- Choose Farm --</option>
                                    {farms?.map((f: any) => (
                                        <option key={f.id} value={f.id}>{f.name} ({f.location || 'Unknown'})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Scientific Analysis</label>
                                <textarea
                                    className="w-full min-h-[140px] px-4 py-3 rounded-xl border border-emerald-100 bg-emerald-50/10 focus:ring-2 focus:ring-emerald-500/20 outline-none font-medium"
                                    placeholder="Describe observed issues, diseases or irrigation deficiencies..."
                                    value={formData.issue_analysis}
                                    onChange={(e) => setFormData({ ...formData, issue_analysis: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Recommendations</label>
                                <textarea
                                    className="w-full min-h-[140px] px-4 py-3 rounded-xl border border-emerald-100 bg-emerald-50/10 focus:ring-2 focus:ring-emerald-500/20 outline-none font-medium text-emerald-900"
                                    placeholder="Provide step-by-step actions for the farmer to take..."
                                    value={formData.recommendations}
                                    onChange={(e) => setFormData({ ...formData, recommendations: e.target.value })}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="border-none shadow-sm bg-emerald-50">
                        <CardHeader>
                            <CardTitle className="text-base font-bold text-emerald-900">Publish Impact</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-3 text-sm text-emerald-800 font-medium">
                                <AlertTriangle size={18} className="shrink-0 text-emerald-600" />
                                <p>Publishing will trigger an instant notification to the farmer.</p>
                            </div>
                            <div className="flex gap-3 text-sm text-emerald-800 font-medium">
                                <CheckCircle size={18} className="shrink-0 text-emerald-600" />
                                <p>Record will be permanently stored in farm audit history.</p>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-14 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black uppercase tracking-widest shadow-xl shadow-emerald-900/10 gap-3 mt-4"
                                disabled={createAdvisory.isPending}
                            >
                                <Send size={20} />
                                {createAdvisory.isPending ? 'Publishing...' : 'Push Advisory'}
                            </Button>
                        </CardContent>
                    </Card>

                    <Button variant="ghost" className="w-full rounded-xl text-slate-500 font-bold hover:bg-white" onClick={() => navigate(-1)}>
                        Cancel Draft
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default AdvisoryEditor;
