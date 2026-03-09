import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus, BookOpen, Search, Edit2, Trash2, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ContentPage = () => {
    // Mock for now as we don't have a backend list endpoint yet for articles
    const articles = [
        { id: 1, title: 'Optimizing Paddy Yield with NDVI', author: 'Dr. Ramesh', category: 'Wheat', tags: ['NDVI', 'Yield'], status: 'published' },
        { id: 2, title: 'Managing Pest in Cotton Farms', author: 'Agronomy Team', category: 'Cotton', tags: ['Pest Control'], status: 'draft' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Content Hub</h1>
                    <p className="text-gray-500 text-sm">Manage educational articles and farming tips.</p>
                </div>
                <Button className="gap-2">
                    <Plus size={18} />
                    Create Article
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                    <Card key={article.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start mb-2">
                                <Badge variant={article.status === 'published' ? 'default' : 'secondary'} className="rounded-full">
                                    {article.status}
                                </Badge>
                                <div className="flex gap-1">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600"><Edit2 size={14} /></Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500"><Trash2 size={14} /></Button>
                                </div>
                            </div>
                            <CardTitle className="text-lg font-bold leading-tight hover:text-primary cursor-pointer">
                                {article.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pb-4">
                            <p className="text-sm text-gray-500 mb-4 line-clamp-2">Learn how satellite imagery is transforming traditional paddy farming practices...</p>
                            <div className="flex flex-wrap gap-1">
                                {article.tags.map(tag => (
                                    <span key={tag} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded">#{tag}</span>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter className="pt-0 border-t mt-4 flex justify-between items-center text-xs text-gray-400">
                            <span>By {article.author}</span>
                            <span className="flex items-center gap-1">Read More <ExternalLink size={10} /></span>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ContentPage;
