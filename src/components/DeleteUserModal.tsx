/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { TeamMember } from '@/src/types';

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: TeamMember;
  onDelete: (userId: string) => Promise<void>;
}

export default function DeleteUserModal({ isOpen, onClose, user, onDelete }: DeleteUserModalProps) {
  const [confirmText, setConfirmText] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isConfirmed = confirmText === 'ELIMINAR' && isAgreed;

  const handleSubmit = async () => {
    if (!isConfirmed) return;
    
    setIsLoading(true);
    try {
      await onDelete(user.id);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#0A0A0A] border-white/10 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Eliminar usuario</DialogTitle>
          <DialogDescription className="text-text-secondary">
            Esta acción es irreversible y eliminará el acceso del usuario.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
            <p className="text-sm text-white leading-relaxed">
              Esta acción elimina permanentemente el acceso de <span className="font-bold text-white">{user.fullName}</span>. Sus fichas clínicas y mensajes no se eliminan.
            </p>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox 
              id="agree" 
              checked={isAgreed} 
              onCheckedChange={(val) => setIsAgreed(val as boolean)}
              className="mt-1 border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <label 
              htmlFor="agree" 
              className="text-sm text-text-secondary leading-tight cursor-pointer select-none"
            >
              Entiendo que esta acción no se puede deshacer
            </label>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-text-secondary">
              Escribe <span className="text-white">ELIMINAR</span> para confirmar
            </label>
            <Input 
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="ELIMINAR"
              className="bg-white/5 border-white/10 focus:border-red-500 focus:ring-red-500 h-11"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={onClose} className="text-text-secondary hover:text-white">
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!isConfirmed || isLoading} 
            className="bg-transparent border border-red-500/30 text-red-500 hover:bg-red-500/10 px-8"
          >
            {isLoading ? 'Eliminando...' : 'Eliminar permanentemente'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
