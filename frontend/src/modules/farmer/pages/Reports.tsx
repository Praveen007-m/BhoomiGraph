import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    FileText,
    Download,
    Eye,
    FileImage,
    Search,
    Calendar,
    ChevronRight,
    SearchX
} from 'lucide-react';
import { useFarmerDroneProjects } from '../hooks/useFarmer';
import { Skeleton } from "@/components/ui/skeleton";
import { format } from 'date-fns';

const Reports = () => {
    const { data: projects, isLoading } = useFarmerDroneProjects();

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Farm Reports</h1>
                    <p className="text-slate-500 font-medium">Download and review your precision analysis results.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Find a report..."
                            className="h-10 pl-10 pr-4 rounded-xl border border-slate-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500/20 w-64"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isLoading ? (
                    [1, 2, 3, 4].map(i => <Skeleton key={i} className="h-40 rounded-3xl" />)
                ) : projects?.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300 shadow-sm">
                            <SearchX size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-700">No reports generated yet</h3>
                        <p className="text-sm text-slate-400 font-medium px-4">Reports will appear here once your service missions are processed.</p>
                    </div>
                ) : (
                    projects?.map((project: any) => (
                        <Card key={project.id} className="border-none shadow-sm hover:shadow-xl transition-all duration-500 rounded-3xl group overflow-hidden">
                            <CardContent className="p-0 flex h-44">
                                {/* Report Type Icon/Visual */}
                                <div className="w-32 bg-slate-50 flex flex-col items-center justify-center border-r border-slate-100 group-hover:bg-green-50 transition-colors">
                                    <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-400 group-hover:text-green-600 transition-colors mb-2">
                                        {project.type === 'NDVI' ? <FileImage size={28} /> : <FileText size={28} />}
                                    </div>
                                    <Badge className="bg-white text-[10px] font-black uppercase text-slate-400 border-slate-200">
                                        {project.type || 'Survey'}
                                    </Badge>
                                </div>

                                {/* Content */}
                                <div className="flex-1 p-6 flex flex-col justify-between">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="min-w-0">
                                            <h3 className="text-lg font-black text-slate-900 truncate group-hover:text-green-700 transition-colors">
                                                {project.name}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Calendar size={12} className="text-slate-400" />
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                                                    Generated: {format(new Date(project.updatedAt), 'dd MMM yyyy')}
                                                </p>
                                            </div>
                                        </div>
                                        <ChevronRight size={20} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                                    </div>

                                    <div className="flex items-center gap-2 pt-4">
                                        <Button className="flex-1 h-10 rounded-xl bg-green-600 hover:bg-green-700 font-bold gap-2 text-xs">
                                            <Download size={14} />
                                            Download PDF
                                        </Button>
                                        <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-slate-200 hover:bg-slate-50 text-slate-500">
                                            <Eye size={16} />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Quick Tips Section */}
            <Card className="border-none bg-slate-900 rounded-3xl overflow-hidden mt-12">
                <CardContent className="p-8 flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-1 text-center md:text-left">
                        <h3 className="text-xl font-black text-white mb-2">Scientific Analysis Reports</h3>
                        <p className="text-slate-400 text-sm font-medium leading-relaxed">
                            Our reports include multi-spectral analysis, soil nutrition maps, and topography data verified by certified agronomists.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center min-w-[120px]">
                            <p className="text-2xl font-black text-green-400 mb-1">99%</p>
                            <p className="text-[10px] font-black text-slate-500 uppercase">Accuracy</p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center min-w-[120px]">
                            <p className="text-2xl font-black text-blue-400 mb-1">PDF</p>
                            <p className="text-[10px] font-black text-slate-500 uppercase">Pro Format</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Reports;
