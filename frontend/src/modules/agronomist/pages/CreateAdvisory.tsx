import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCreateAdvisory, useFarmDetails } from '../hooks/useAdvisories';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    AlertTriangle,
    Send,
    ArrowLeft,
    ShieldCheck,
    AlertCircle,
    ClipboardList
} from 'lucide-react';
import { toast } from 'sonner';

const CreateAdvisory = () => {
    const { farmId } = useParams();
    const navigate = useNavigate();
    const { data: farm } = useFarmDetails(farmId!);
    const createMutation = useCreateAdvisory();

    const [formData, setFormData] = useState({
        title: '',
        category: 'general',
        severity: 'low',
        issue_analysis: '',
        recommendations: '',
        status: 'published'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createMutation.mutateAsync({
                ...formData,
                farm_id: farmId
            });
            toast.success("Advisory successfully published and sent to farmer.");
            navigate('/agronomist/advisories');
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-gray-900 shadow-sm"
                >
                    <ArrowLeft size={18} />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Create Advisory</h1>
                    <p className="text-gray-500 font-medium text-sm">Target: <span className="text-primary">{farm?.name || 'Loading...'}</span></p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card className="bg-white border-gray-200 shadow-sm rounded-2xl overflow-hidden">
                    <CardHeader className="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
                        <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <ClipboardList className="text-primary" size={20} />
                            Advisory Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider ml-1">Advisory Title</label>
                                <Input
                                    required
                                    placeholder="e.g. Nitrogen Deficiency Detected"
                                    className="h-11 rounded-xl bg-white border-gray-200 text-gray-900 focus:ring-primary/20 shadow-none font-medium"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider ml-1">Category</label>
                                    <Select onValueChange={(val: any) => setFormData({ ...formData, category: val })} defaultValue={formData.category}>
                                        <SelectTrigger className="h-11 rounded-xl bg-white border-gray-200 text-gray-900 focus:ring-primary/20 shadow-none font-medium capitalize">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white border-gray-200 rounded-xl shadow-xl">
                                            <SelectItem value="pest">Pest Control</SelectItem>
                                            <SelectItem value="irrigation">Irrigation</SelectItem>
                                            <SelectItem value="nutrition">Nutrition</SelectItem>
                                            <SelectItem value="disease">Disease</SelectItem>
                                            <SelectItem value="general">General</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider ml-1">Severity</label>
                                    <Select onValueChange={(val: any) => setFormData({ ...formData, severity: val })} defaultValue={formData.severity}>
                                        <SelectTrigger className="h-11 rounded-xl bg-white border-gray-200 text-gray-900 focus:ring-primary/20 shadow-none font-medium capitalize">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white border-gray-200 rounded-xl shadow-xl">
                                            <SelectItem value="low">Low</SelectItem>
                                            <SelectItem value="medium" className="text-amber-600">Medium</SelectItem>
                                            <SelectItem value="high" className="text-orange-600">High</SelectItem>
                                            <SelectItem value="critical" className="text-red-600 font-bold">Critical</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider ml-1">Issue Analysis</label>
                            <Textarea
                                required
                                placeholder="Explain the reasoning behind this advisory based on telemetry data..."
                                className="min-h-[120px] rounded-xl bg-white border-gray-200 text-gray-900 focus:ring-primary/20 shadow-none text-sm font-medium leading-relaxed"
                                value={formData.issue_analysis}
                                onChange={(e) => setFormData({ ...formData, issue_analysis: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider ml-1">Actionable Recommendations</label>
                            <Textarea
                                required
                                placeholder="Provide clear, step-by-step instructions for the farmer..."
                                className="min-h-[120px] rounded-xl bg-white border-gray-200 text-primary focus:ring-primary/20 shadow-none text-sm font-semibold leading-relaxed"
                                value={formData.recommendations}
                                onChange={(e) => setFormData({ ...formData, recommendations: e.target.value })}
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="flex-1 p-5 bg-blue-50 border border-blue-100 rounded-2xl flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                            <ShieldCheck size={24} />
                        </div>
                        <p className="text-[11px] font-medium text-gray-500 leading-normal">
                            By publishing, you confirm this advisory is based on validated <span className="text-primary font-bold">BhoomiGraph Telemetry</span> and current scientific standards.
                        </p>
                    </div>

                    <Button
                        type="submit"
                        disabled={createMutation.isPending}
                        className="w-full md:w-auto h-14 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-base gap-3 shadow-md transition-all active:scale-[0.98]"
                    >
                        {createMutation.isPending ? 'Publishing...' : 'Publish Advisory'}
                        <Send size={20} />
                    </Button>
                </div>
            </form>

            {formData.severity === 'critical' && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 animate-pulse">
                    <AlertCircle className="text-red-600" size={20} />
                    <p className="text-xs font-bold text-red-600 uppercase tracking-tight">Immediate high-priority alert will be sent to the farmer.</p>
                </div>
            )}
        </div>
    );
};

export default CreateAdvisory;
