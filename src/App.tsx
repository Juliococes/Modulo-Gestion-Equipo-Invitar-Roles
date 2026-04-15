/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import TeamManagement from './components/TeamManagement';
import { Toaster } from '@/components/ui/sonner';
import { Badge } from '@/components/ui/badge';

export default function App() {
  return (
    <div className="min-h-screen">
      {/* App Header */}
      <header className="border-b border-white/10 bg-background/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-white font-black text-xl leading-none">S</span>
              </div>
              <span className="text-xl font-bold tracking-tight">SurGira</span>
            </div>
            <div className="h-4 w-px bg-white/10 mx-2 hidden md:block" />
            <Badge variant="outline" className="hidden md:flex border-primary/30 text-primary bg-primary/5 px-2 py-0.5">
              Plan Pro
            </Badge>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end hidden sm:flex">
              <span className="text-xs font-medium text-white">Clínica Dental Central</span>
              <span className="text-[10px] text-text-secondary">Sede Providencia</span>
            </div>
            <div className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-primary">
              JB
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1000px] mx-auto px-10 py-10">
        <TeamManagement />
      </main>

      {/* Toaster for notifications */}
      <Toaster position="bottom-right" />
    </div>
  );
}
