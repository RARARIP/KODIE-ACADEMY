/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type VisitorProfile = 
  | 'Estudante' 
  | 'Profissional naval' 
  | 'Pesquisador' 
  | 'Público geral' 
  | 'Imprensa' 
  | 'Parceiro comercial';

export interface Booking {
  id: string; // Dynamic unique protocol, e.g. WS-48291048
  fullName: string;
  email: string;
  whatsapp: string;
  documentType: 'CPF' | 'Passaporte';
  documentValue: string;
  profile: VisitorProfile;
  institutionOrCompany?: string;
  groupType: 'individual' | 'grupo';
  groupSize: number; // exact or estimated number
  notes?: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. '08:00', '09:00'
  safetyAccepted: boolean;
  status: 'confirmado' | 'pendente_aprovacao'; // groups above 10 people require manual approval
  createdAt: string;
}

export interface TimeSlotOption {
  time: string; // "08h", "09h", "10h", "11h", "13h", "14h", "15h", "16h"
  available: boolean;
}

export interface FormStepState {
  currentStep: number; // 1: Personal info & Profile, 2: Date & Time selector, 3: Safety & Disclaimer
}
