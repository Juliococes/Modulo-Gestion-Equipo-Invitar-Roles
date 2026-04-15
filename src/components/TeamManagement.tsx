/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Mail, 
  BarChart3, 
  MoreVertical, 
  UserPlus, 
  MailQuestion, 
  UserMinus, 
  UserCheck, 
  Trash2,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

import { 
  TeamMember, 
  PlanLimits, 
  Role, 
  UserStatus 
} from '@/src/types';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import InviteModal from './InviteModal';
import EditRoleModal from './EditRoleModal';
import DeleteUserModal from './DeleteUserModal';
import PermissionMatrix from './PermissionMatrix';

const ROLE_CONFIG: Record<Role, { label: string; variant: string; description: string }> = {
  owner: { label: 'Owner', variant: 'bg-primary text-white border-transparent', description: 'Acceso total al tenant y facturación.' },
  admin: { label: 'Admin', variant: 'border-primary text-primary bg-transparent', description: 'Gestión operativa completa.' },
  doctor: { label: 'Doctor', variant: 'border-blue-400 text-blue-400 bg-transparent', description: 'Atiende pacientes, edita fichas clínicas.' },
  asistente: { label: 'Asistente', variant: 'border-gray-400 text-gray-400 bg-transparent', description: 'Recepción, chat, agenda compartida.' },
  sede_manager: { label: 'Sede Manager', variant: 'border-purple-400 text-purple-400 bg-transparent', description: 'Gestión específica de una sucursal.' },
};

const STATUS_CONFIG: Record<UserStatus, { label: string; color: string }> = {
  active: { label: 'Activo', color: 'bg-success' },
  invited: { label: 'Invitado', color: 'bg-amber-500' },
  suspended: { label: 'Suspendido', color: 'bg-gray-500' },
};

export default function TeamManagement() {
  const [activeTab, setActiveTab] = useState<'usuarios' | 'permisos'>('usuarios');
  const [members, setMembers] = useState<TeamMember[]>([
    { id: '1', email: 'julio@surgira.com', fullName: 'Julio Briceño', role: 'owner', status: 'active', lastActivityAt: new Date().toISOString(), createdAt: '2026-04-10T10:00:00Z', isCurrentUser: true },
    { id: '2', email: 'maria.gonzalez@clinica.cl', fullName: 'Maria Gonzalez', role: 'doctor', status: 'active', lastActivityAt: '2026-04-14T15:30:00Z', createdAt: '2026-04-12T10:00:00Z' },
    { id: '3', email: 'dra.perez@clinica.cl', fullName: 'Dra. Ana Perez', role: 'doctor', status: 'active', lastActivityAt: '2026-04-14T09:15:00Z', createdAt: '2026-04-13T10:00:00Z' },
    { id: '4', email: 'recepcion@clinica.cl', fullName: 'Carolina Soto', role: 'asistente', status: 'active', lastActivityAt: '2026-04-15T08:00:00Z', createdAt: '2026-04-14T10:00:00Z' },
    { id: '5', email: 'nuevo@clinica.cl', fullName: 'Pendiente', role: 'asistente', status: 'invited', createdAt: '2026-04-15T11:00:00Z' },
  ]);

  const limits: PlanLimits = {
    planKey: 'pro',
    maxTeamUsers: 5,
    currentUsers: members.filter(m => m.status !== 'suspended').length,
    invitedPending: members.filter(m => m.status === 'invited').length,
  };

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<TeamMember | null>(null);
  const [deletingUser, setDeletingUser] = useState<TeamMember | null>(null);

  const handleInvite = async (data: { email: string; role: string; message?: string }) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const newMember: TeamMember = {
      id: Math.random().toString(36).substr(2, 9),
      email: data.email,
      fullName: 'Nuevo Usuario',
      role: data.role as Role,
      status: 'invited',
      createdAt: new Date().toISOString(),
    };
    setMembers([newMember, ...members]);
    toast.success('Invitación enviada con éxito', {
      description: `Se ha enviado un magic link a ${data.email}`,
      className: 'bg-primary/10 border-primary/20 text-white',
    });
  };

  const handleEditRole = async (userId: string, newRole: string) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    setMembers(members.map(m => m.id === userId ? { ...m, role: newRole as Role } : m));
    toast.success('Rol actualizado', {
      className: 'bg-primary/10 border-primary/20 text-white',
    });
  };

  const handleSuspend = async (userId: string) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    setMembers(members.map(m => m.id === userId ? { ...m, status: 'suspended' } : m));
    toast.success('Usuario suspendido', {
      className: 'bg-primary/10 border-primary/20 text-white',
    });
  };

  const handleReactivate = async (userId: string) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    setMembers(members.map(m => m.id === userId ? { ...m, status: 'active' } : m));
    toast.success('Usuario reactivado', {
      className: 'bg-primary/10 border-primary/20 text-white',
    });
  };

  const handleDelete = async (userId: string) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    setMembers(members.filter(m => m.id !== userId));
    toast.success('Usuario eliminado', {
      className: 'bg-primary/10 border-primary/20 text-white',
    });
  };

  const handleResendInvite = async (userId: string) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    toast.success('Invitación reenviada', {
      className: 'bg-primary/10 border-primary/20 text-white',
    });
  };

  const isAtLimit = limits.currentUsers >= limits.maxTeamUsers;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-[32px] font-bold tracking-tight">Equipo</h2>
          <p className="text-text-secondary text-base">Gestiona quién accede a tu panel</p>
        </div>
        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-secondary">Plan Pro</span>
            <Badge className={`px-2 py-0.5 rounded-full text-[13px] font-semibold ${isAtLimit ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-success/10 text-success border-success/20'}`}>
              {limits.currentUsers}/{limits.maxTeamUsers} usuarios
            </Badge>
          </div>
          <Button 
            onClick={() => setIsInviteModalOpen(true)}
            disabled={isAtLimit}
            className="bg-primary hover:bg-primary-hover text-white rounded-lg px-5 py-2.5 font-semibold"
          >
            <UserPlus className="mr-2 h-[18px] w-[18px]" />
            Invitar usuario
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-white/10">
        <button
          onClick={() => setActiveTab('usuarios')}
          className={`pb-3 text-sm font-semibold transition-colors relative ${activeTab === 'usuarios' ? 'text-white' : 'text-text-secondary hover:text-white'}`}
        >
          Usuarios
          {activeTab === 'usuarios' && (
            <motion.div layoutId="activeTab" className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('permisos')}
          className={`pb-3 text-sm font-semibold transition-colors relative ${activeTab === 'permisos' ? 'text-white' : 'text-text-secondary hover:text-white'}`}
        >
          Permisos
          {activeTab === 'permisos' && (
            <motion.div layoutId="activeTab" className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
      </div>

      {activeTab === 'usuarios' ? (
        <>
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Card className="card-surgira">
              <div className="stat-label-density">
                <Users className="h-3.5 w-3.5" />
                Usuarios activos
              </div>
              <div className="stat-value-density">{members.filter(m => m.status === 'active').length}</div>
            </Card>
            <Card className="card-surgira">
              <div className="stat-label-density">
                <Mail className="h-3.5 w-3.5" />
                Invitados pendientes
              </div>
              <div className="stat-value-density">{limits.invitedPending}</div>
            </Card>
            <Card className="card-surgira">
              <div className="stat-label-density">
                <BarChart3 className="h-3.5 w-3.5" />
                Límite del plan
              </div>
              <div className="stat-value-density">{limits.currentUsers} / {limits.maxTeamUsers}</div>
            </Card>
          </div>

          {/* User List */}
          <Card className="card-surgira p-0 overflow-hidden border border-white/10 bg-white/[0.02] rounded-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-white/[0.01]">
                    <th className="table-header-density">Colaborador</th>
                    <th className="table-header-density">Email</th>
                    <th className="table-header-density">Rol</th>
                    <th className="table-header-density">Estado</th>
                    <th className="table-header-density">Última actividad</th>
                    <th className="table-header-density text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <AnimatePresence mode="popLayout">
                    {members.map((member) => (
                      <motion.tr
                        key={member.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="table-row-hover"
                      >
                        <td className="table-cell-density">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 border border-white/10">
                              <AvatarImage src={member.avatarUrl} />
                              <AvatarFallback className="bg-primary text-white font-bold text-xs">
                                {member.fullName.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white">{member.fullName}</span>
                              {member.isCurrentUser && (
                                <span className="text-[10px] bg-white/10 px-1 rounded text-text-secondary">tu</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="table-cell-density text-text-secondary">{member.email}</td>
                        <td className="table-cell-density">
                          <Badge className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${ROLE_CONFIG[member.role].variant}`}>
                            {ROLE_CONFIG[member.role].label.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="table-cell-density">
                          <div className="flex items-center gap-2">
                            <div className={`h-2 w-2 rounded-full ${member.status === 'invited' ? 'bg-amber-500' : member.status === 'suspended' ? 'bg-gray-500' : 'bg-success'}`} />
                            <span className="text-sm">{STATUS_CONFIG[member.status].label}</span>
                          </div>
                        </td>
                        <td className="table-cell-density text-text-secondary">
                          {member.lastActivityAt ? (
                            formatDistanceToNow(new Date(member.lastActivityAt), { addSuffix: true, locale: es })
                          ) : (
                            '--'
                          )}
                        </td>
                        <td className="table-cell-density text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-text-secondary hover:text-white">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-[#121212] border-white/10 text-white min-w-[160px]">
                              <DropdownMenuItem 
                                onClick={() => setEditingUser(member)}
                                className="focus:bg-white/5 focus:text-white cursor-pointer"
                              >
                                <ShieldCheck className="mr-2 h-4 w-4" />
                                Editar rol
                              </DropdownMenuItem>
                              
                              {member.status === 'invited' && (
                                <DropdownMenuItem 
                                  onClick={() => handleResendInvite(member.id)}
                                  className="focus:bg-white/5 focus:text-white cursor-pointer"
                                >
                                  <MailQuestion className="mr-2 h-4 w-4" />
                                  Reenviar invitación
                                </DropdownMenuItem>
                              )}

                              {member.status === 'suspended' ? (
                                <DropdownMenuItem 
                                  onClick={() => handleReactivate(member.id)}
                                  className="focus:bg-white/5 focus:text-emerald-500 cursor-pointer"
                                >
                                  <UserCheck className="mr-2 h-4 w-4" />
                                  Reactivar
                                </DropdownMenuItem>
                              ) : (
                                !member.isCurrentUser && (
                                  <DropdownMenuItem 
                                    onClick={() => handleSuspend(member.id)}
                                    className="focus:bg-white/5 focus:text-amber-500 cursor-pointer"
                                  >
                                    <UserMinus className="mr-2 h-4 w-4" />
                                    Suspender
                                  </DropdownMenuItem>
                                )
                              )}

                              {!member.isCurrentUser && (
                                <DropdownMenuItem 
                                  onClick={() => setDeletingUser(member)}
                                  className="focus:bg-red-500/10 focus:text-red-500 cursor-pointer"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Eliminar
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
              {members.length === 0 && (
                <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="p-6 rounded-full bg-primary/5">
                    <Users className="h-12 w-12 text-primary/40" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Aún no invitaste a nadie</h3>
                    <p className="text-text-secondary max-w-xs mx-auto">Comienza a construir tu equipo invitando a tu primer colaborador.</p>
                  </div>
                  <Button onClick={() => setIsInviteModalOpen(true)} className="bg-primary hover:bg-primary-hover">
                    Invitar primer usuario
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </>
      ) : (
        <PermissionMatrix />
      )}

      {/* Modals */}
      <InviteModal 
        isOpen={isInviteModalOpen} 
        onClose={() => setIsInviteModalOpen(false)} 
        onInvite={handleInvite}
        planKey={limits.planKey}
      />
      
      {editingUser && (
        <EditRoleModal 
          isOpen={!!editingUser} 
          onClose={() => setEditingUser(null)} 
          user={editingUser}
          onSave={handleEditRole}
        />
      )}

      {deletingUser && (
        <DeleteUserModal 
          isOpen={!!deletingUser} 
          onClose={() => setDeletingUser(null)} 
          user={deletingUser}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
