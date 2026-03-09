import React from 'react';
import { useAdvisoryHistory } from '../hooks/useAgronomist';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { FileText, Calendar, Sprout, Search } from 'lucide-react';

const AdvisoryHistory = () => {
    const { data: advisories, isLoading } = useAdvisoryHistory();

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-black text-emerald-950 tracking-tight">Advisory History</h1>
                <p className="text-slate-500 font-medium italic">Complete log of all scientific intelligence distributed.</p>
            </div>

            <div className="space-y-6">
                {isLoading ? (
                    <div className="text-center p-20 text-slate-400">Archiving records...</div>
                ) : advisories?.length === 0 ? (
                    <Card className="border-none shadow-sm p-20 text-center">
                        <FileText size={64} className="text-emerald-100 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-emerald-950">No Records Found</h3>
                        <p className="text-slate-500">You haven't issued any advisories yet.</p>
                    </Card>
                ) : (
                    advisories?.map((adv: any) => (
                        <Card key={adv.id} className="border-none shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                            <CardHeader className="bg-emerald-50/30 border-b border-emerald-50 flex flex-row items-center justify-between pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-white border border-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                                        <Sprout size={20} />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg font-black text-emerald-950">{adv.farm?.name}</CardTitle>
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-1">
                                            <Calendar size={10} /> {format(new Date(adv.createdAt), 'dd MMMM yyyy • HH:mm')}
                                        </p>
                                    </div>
                                </div>
                                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 font-bold uppercase tracking-tighter text-[10px]">SCIENTIFIC GRADE</Badge>
                            </CardHeader>
                            <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">Issue Analysis</h4>
                                    <p className="text-sm font-medium text-slate-600 leading-relaxed italic border-l-2 border-emerald-100 pl-4">{adv.issue_analysis}</p>
                                </div>
                                <div className="space-y-3 p-6 rounded-2xl bg-emerald-50/50">
                                    <h4 className="text-xs font-black text-emerald-700 uppercase tracking-widest">Recommendations</h4>
                                    <p className="text-sm font-bold text-emerald-900 leading-relaxed">{adv.recommendations}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdvisoryHistory;
