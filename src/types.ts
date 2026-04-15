/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Role = 'owner' | 'admin' | 'doctor' | 'asistente' | 'sede_manager';
export type UserStatus = 'active' | 'invited' | 'suspended';
export type PlanKey = 'lite' | 'pro' | 'plus' | 'business';

export interface TeamMember {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: Role;
  status: UserStatus;
  lastActivityAt?: string; // ISO
  createdAt: string;
  branchId?: string; // solo sede_manager
  isCurrentUser?: boolean;
}

export interface PlanLimits {
  planKey: PlanKey;
  maxTeamUsers: number;
  currentUsers: number;
  invitedPending: number;
}

export interface TeamManagementProps {
  members: TeamMember[];
  limits: PlanLimits;
  currentUserRole: 'owner' | 'admin';
  onInvite: (data: { email: string; role: string; message?: string }) => Promise<void>;
  onEditRole: (userId: string, newRole: string) => Promise<void>;
  onSuspend: (userId: string) => Promise<void>;
  onReactivate: (userId: string) => Promise<void>;
  onDelete: (userId: string) => Promise<void>;
  onResendInvite: (userId: string) => Promise<void>;
}
