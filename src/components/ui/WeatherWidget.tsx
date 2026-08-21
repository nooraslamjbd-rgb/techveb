"use client";

import { useEffect, useState } from "react";
import { getWeatherIcon } from "@/lib/live-data";

interface WeatherData {
  city: string;
  temp: number;
  feelsLike: number;
  humidity: number;
  description: string;
  icon: string;
  windSpeed: number;
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const res = await fetch("/api/live/weather?city=Karachi");
        const json = await res.json();
        if (json.success) setWeather(json.data);
      } catch {
        // silent fail
      } finally {
        setLoading(false);
      }
    }
    fetchWeather();
    const interval = setInterval(fetchWeather, 600000); // 10 min
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-surface p-4 animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-3" />
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16" />
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-xs font-medium">Weather</p>
            <p className="text-white font-bold text-sm">{weather.city}</p>
          </div>
          <span className="text-3xl">{getWeatherIcon(weather.icon)}</span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-baseline gap-1 mb-1">
          <span className="text-3xl font-bold text-foreground">{weather.temp}°</span>
          <span className="text-sm text-muted-foreground">C</span>
        </div>
        <p className="text-xs text-muted-foreground capitalize mb-3">{weather.description}</p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-lg bg-muted px-2.5 py-1.5">
            <span className="text-muted-foreground">Feels</span>
            <span className="ml-1 font-medium text-foreground">{weather.feelsLike}°C</span>
          </div>
          <div className="rounded-lg bg-muted px-2.5 py-1.5">
            <span className="text-muted-foreground">Humidity</span>
            <span className="ml-1 font-medium text-foreground">{weather.humidity}%</span>
          </div>
          <div className="rounded-lg bg-muted px-2.5 py-1.5">
            <span className="text-muted-foreground">Wind</span>
            <span className="ml-1 font-medium text-foreground">{weather.windSpeed} km/h</span>
          </div>
        </div>
      </div>
    </div>
  );
}
