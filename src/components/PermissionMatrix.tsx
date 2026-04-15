/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Card } from '@/components/ui/card';
import { Check, Minus } from 'lucide-react';

const MODULES = [
  'Dashboard', 
  'Agenda', 
  'Chat', 
  'Contactos', 
  'Ficha clínica', 
  'Catálogo', 
  'Bot config', 
  'Facturación', 
  'Equipo', 
  'Settings'
];

const ROLES = ['Owner', 'Admin', 'Doctor', 'Asistente', 'Sede Mgr'];

// Matrix data: true = full, 'partial' = partial, false = none
const MATRIX_DATA: Record<string, (boolean | 'partial')[]> = {
  'Dashboard': [true, true, true, true, true],
  'Agenda': [true, true, true, true, true],
  'Chat': [true, true, true, true, 'partial'],
  'Contactos': [true, true, true, true, true],
  'Ficha clínica': [true, true, true, false, false],
  'Catálogo': [true, true, true, true, true],
  'Bot config': [true, false, false, false, false],
  'Facturación': [true, true, false, false, false],
  'Equipo': [true, false, false, false, false],
  'Settings': [true, true, false, false, false],
};

export default function PermissionMatrix() {
  return (
    <Card className="card-surgira p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/[0.01]">
              <th className="table-header-density">Módulo</th>
              {ROLES.map(role => (
                <th key={role} className="table-header-density text-center">
                  {role}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {MODULES.map((module) => (
              <tr key={module} className="table-row-hover">
                <td className="table-cell-density font-medium">{module}</td>
                {MATRIX_DATA[module].map((access, i) => (
                  <td key={i} className="table-cell-density">
                    <div className="flex justify-center">
                      {access === true && (
                        <div className="h-6 w-6 rounded-full bg-success/10 flex items-center justify-center">
                          <Check className="h-3.5 w-3.5 text-success" />
                        </div>
                      )}
                      {access === 'partial' && (
                        <div className="h-6 w-6 rounded-full bg-amber-500/10 flex items-center justify-center">
                          <div className="h-2 w-2 rounded-full bg-amber-500" />
                        </div>
                      )}
                      {access === false && (
                        <Minus className="h-4 w-4 text-white/10" />
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-6 border-t border-white/10 bg-white/[0.01] flex gap-8">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-success/10 flex items-center justify-center">
            <Check className="h-2.5 w-2.5 text-success" />
          </div>
          <span className="text-xs text-text-secondary">Acceso completo</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-amber-500/10 flex items-center justify-center">
            <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          </div>
          <span className="text-xs text-text-secondary">Acceso parcial</span>
        </div>
        <div className="flex items-center gap-2">
          <Minus className="h-3 w-3 text-white/10" />
          <span className="text-xs text-text-secondary">Sin acceso</span>
        </div>
      </div>
    </Card>
  );
}
