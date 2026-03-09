import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CloudRain, Sun, Thermometer, Wind, Droplets, CloudLightning, Calendar, AlertTriangle } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

const Weather = () => {
    // Mock weather data for Tamil Nadu region
    const currentStatus = {
        temp: '32°C',
        feelsLike: '36°C',
        condition: 'Partly Cloudy',
        humidity: '65%',
        wind: '12 km/h',
        rainProb: '15%',
        uvIndex: 'High',
    };

    const forecast = [
        { day: 'Friday', temp: '33°/26°', condition: 'Sunny', icon: Sun },
        { day: 'Saturday', temp: '34°/27°', condition: 'Sunny', icon: Sun },
        { day: 'Sunday', temp: '31°/25°', condition: 'Showers', icon: CloudRain },
        { day: 'Monday', temp: '30°/24°', condition: 'Thunderstorms', icon: CloudLightning },
        { day: 'Tuesday', temp: '32°/25°', condition: 'Cloudy', icon: Sun },
        { day: 'Wednesday', temp: '33°/26°', condition: 'Sunny', icon: Sun },
        { day: 'Thursday', temp: '34°/26°', condition: 'Sunny', icon: Sun },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Weather Insights</h1>
                <p className="text-slate-500 font-medium">Auto-detected for your primary farm location.</p>
            </div>

            {/* Alert Banner */}
            <div className="bg-orange-50 border border-orange-200 p-4 rounded-2xl flex items-center gap-4 text-orange-800">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
                    <AlertTriangle size={24} className="text-orange-600" />
                </div>
                <div>
                    <p className="text-sm font-bold">Extreme Heat Alert</p>
                    <p className="text-xs font-medium opacity-80">Temperatures expected to exceed 38°C on Saturday. Ensure adequate irrigation for sensitive crops.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Current Weather */}
                <Card className="lg:col-span-1 border-none shadow-sm bg-gradient-to-br from-blue-600 to-blue-700 text-white">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold">Current Conditions</CardTitle>
                        <CardDescription className="text-blue-100">Trichy, Tamil Nadu</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <span className="text-6xl font-black">{currentStatus.temp}</span>
                            <Sun size={64} className="text-yellow-300" />
                        </div>
                        <p className="text-xl font-bold">{currentStatus.condition}</p>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                            <div className="flex items-center gap-2">
                                <Droplets size={16} className="text-blue-200" />
                                <div className="text-xs">
                                    <p className="text-blue-200">Humidity</p>
                                    <p className="font-bold">{currentStatus.humidity}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Thermometer size={16} className="text-blue-200" />
                                <div className="text-xs">
                                    <p className="text-blue-200">Feels Like</p>
                                    <p className="font-bold">{currentStatus.feelsLike}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Wind size={16} className="text-blue-200" />
                                <div className="text-xs">
                                    <p className="text-blue-200">Wind Speed</p>
                                    <p className="font-bold">{currentStatus.wind}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <CloudRain size={16} className="text-blue-200" />
                                <div className="text-xs">
                                    <p className="text-blue-200">Rain Prob.</p>
                                    <p className="font-bold">{currentStatus.rainProb}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 7-Day Forecast */}
                <Card className="lg:col-span-2 border-none shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg font-bold">7-Day Forecast</CardTitle>
                        <Calendar size={20} className="text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-1">
                            {forecast.map((f, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                                    <div className="w-24 text-sm font-bold text-slate-700">{f.day}</div>
                                    <div className="flex items-center gap-3 w-32">
                                        <f.icon size={20} className={cn(
                                            f.condition === 'Sunny' ? 'text-yellow-500' : 'text-blue-500'
                                        )} />
                                        <span className="text-xs font-medium text-slate-500 uppercase">{f.condition}</span>
                                    </div>
                                    <div className="text-sm font-black text-slate-900">{f.temp}</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

export default Weather;
