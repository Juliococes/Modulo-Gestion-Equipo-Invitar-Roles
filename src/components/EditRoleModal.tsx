/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TeamMember, Role } from '@/src/types';

interface EditRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: TeamMember;
  onSave: (userId: string, newRole: string) => Promise<void>;
}

const PERMISSIONS_DIFF: Record<Role, { loses: string[]; gains: string[] }> = {
  owner: { loses: [], gains: [] },
  admin: { loses: [], gains: ['Gestión de equipo', 'Configuración de facturación'] },
  doctor: { loses: ['Gestión de agenda compartida'], gains: ['Editar ficha clínica', 'Ver métricas propias'] },
  asistente: { loses: ['Editar ficha clínica'], gains: ['Chat de todos los doctores', 'Agenda compartida'] },
  sede_manager: { loses: ['Acceso global'], gains: ['Gestión de sede específica'] },
};

export default function EditRoleModal({ isOpen, onClose, user, onSave }: EditRoleModalProps) {
  const [newRole, setNewRole] = useState<Role>(user.role);
  const [isLoading, setIsLoading] = useState(false);

  const diff = useMemo(() => {
    // Simple logic to show what changes when switching from current role to new role
    // In a real app, this would be a more complex comparison
    return PERMISSIONS_DIFF[newRole];
  }, [newRole]);

  const handleSubmit = async () => {
    if (newRole === user.role) {
      onClose();
      return;
    }
    
    setIsLoading(true);
    try {
      await onSave(user.id, newRole);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#0A0A0A] border-white/10 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Editar rol</DialogTitle>
          <DialogDescription className="text-text-secondary">
            Cambia los permisos de acceso para este usuario.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5">
            <Avatar className="h-12 w-12 border border-white/10">
              <AvatarImage src={user.avatarUrl} />
              <AvatarFallback className="bg-primary/20 text-primary font-bold text-lg">
                {user.fullName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold text-white">{user.fullName}</span>
              <span className="text-sm text-text-secondary">{user.email}</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">Nuevo Rol</label>
            <Select value={newRole} onValueChange={(val) => setNewRole(val as Role)}>
              <SelectTrigger className="bg-white/5 border-white/10 h-11">
                <SelectValue placeholder="Selecciona un rol" />
              </SelectTrigger>
              <SelectContent className="bg-[#121212] border-white/10 text-white">
                <SelectItem value="owner" disabled className="opacity-50">Owner</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="doctor">Doctor</SelectItem>
                <SelectItem value="asistente">Asistente</SelectItem>
                <SelectItem value="sede_manager">Sede Manager</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-widest text-text-secondary">Preview permisos que cambian</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-red-500 uppercase">Pierde</p>
                <ul className="space-y-1">
                  {diff.loses.length > 0 ? diff.loses.map((p, i) => (
                    <li key={i} className="text-xs text-red-500/80 line-through">· {p}</li>
                  )) : <li className="text-xs text-text-secondary italic">Ninguno</li>}
                </ul>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-success uppercase">Gana</p>
                <ul className="space-y-1">
                  {diff.gains.length > 0 ? diff.gains.map((p, i) => (
                    <li key={i} className="text-xs text-success/80">· {p}</li>
                  )) : <li className="text-xs text-text-secondary italic">Ninguno</li>}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={onClose} className="text-text-secondary hover:text-white">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading} className="bg-primary hover:bg-primary-hover text-white px-8">
            {isLoading ? 'Guardando...' : 'Confirmar cambio'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
