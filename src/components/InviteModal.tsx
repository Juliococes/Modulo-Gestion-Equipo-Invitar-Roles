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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { AlertCircle } from 'lucide-react';
import { PlanKey } from '@/src/types';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (data: { email: string; role: string; message?: string }) => Promise<void>;
  planKey: PlanKey;
}

export default function InviteModal({ isOpen, onClose, onInvite, planKey }: InviteModalProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('doctor');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !role) return;
    
    setIsLoading(true);
    try {
      await onInvite({ email, role, message });
      setEmail('');
      setRole('doctor');
      setMessage('');
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const isSedeManagerDisabled = planKey === 'lite' || planKey === 'pro';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#0A0A0A] border-white/10 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Invitar usuario</DialogTitle>
          <DialogDescription className="text-text-secondary">
            Envía una invitación para que alguien se una a tu equipo.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">Email</label>
            <Input 
              type="email" 
              placeholder="ejemplo@clinica.cl" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white/5 border-white/10 focus:border-primary focus:ring-primary h-11"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">Rol</label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="bg-white/5 border-white/10 h-11">
                <SelectValue placeholder="Selecciona un rol" />
              </SelectTrigger>
              <SelectContent className="bg-[#121212] border-white/10 text-white">
                <SelectItem value="owner" disabled className="opacity-50">Owner (Solo 1 por tenant)</SelectItem>
                <SelectItem value="admin">Admin — Gestión operativa completa</SelectItem>
                <SelectItem value="doctor">Doctor — Atiende pacientes, edita fichas</SelectItem>
                <SelectItem value="asistente">Asistente — Recepción, chat, agenda</SelectItem>
                <SelectItem value="sede_manager" disabled={isSedeManagerDisabled}>
                  Sede Manager {isSedeManagerDisabled && '(Solo Plan Plus)'}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">Mensaje personalizado (opcional)</label>
            <textarea 
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, 500))}
              className="w-full min-h-[100px] bg-white/5 border border-white/10 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
              placeholder="Escribe un mensaje para incluir en el correo..."
            />
            <p className="text-[10px] text-right text-text-secondary">{message.length}/500</p>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex gap-3">
            <AlertCircle className="h-5 w-5 text-primary shrink-0" />
            <p className="text-xs text-primary leading-relaxed">
              Al invitar, enviamos un magic link al email. El usuario establece su password al activarlo.
            </p>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="ghost" onClick={onClose} className="text-text-secondary hover:text-white">
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary-hover text-white px-8">
              {isLoading ? 'Enviando...' : 'Enviar invitación'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
