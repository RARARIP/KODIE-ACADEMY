/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Booking } from '../types';
import { WilsonSonsLogo, WilsonSonsFullLogo } from './WilsonSonsLogo';
import { 
  CheckCircle,
  FileText,
  Mail,
  MessageSquare,
  AlertTriangle,
  MapPin,
  Clock,
  Calendar,
  Users,
  Building,
  AtSign,
  Phone,
  ShieldAlert,
  CornerDownRight,
  ClipboardCheck,
  Code,
  RotateCcw,
  BookOpen
} from 'lucide-react';

interface BookingConfirmationProps {
  booking: Booking;
  onReset: () => void;
  onCancelBooking: (protocol: string) => void;
}

export default function BookingConfirmation({
  booking,
  onReset,
  onCancelBooking
}: BookingConfirmationProps) {
  const [activeConsoleTab, setActiveConsoleTab] = useState<'email' | 'whatsapp' | 'api_payload'>('email');
  const isPendingApproval = booking.status === 'pendente_aprovacao';

  // Format date for visual printing
  const formatDateVisual = (dateStr: string): string => {
    return dateStr.split('-').reverse().join('/');
  };

  // Safe mock link simulation
  const cancellationLink = `${window.location.origin}/?cancel=${booking.id}`;

  return (
    <div className="space-y-6">
      
      {/* Visual Success Card */}
      <div className="bg-white border border-slate-150 rounded-3xl shadow-xs overflow-hidden">
        {/* Banner with header info */}
        <div className={`p-6 text-white ${
          isPendingApproval 
            ? 'bg-gradient-to-r from-amber-600 to-amber-800 border-b border-amber-900/10' 
            : 'bg-gradient-to-r from-[#0A2647] to-[#1E90FF] border-b border-[#0A2647]/15'
        }`}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 bg-white rounded-2xl shadow-inner text-[#0A2647] flex items-center justify-center shrink-0">
                <WilsonSonsLogo size="sm" colorTheme="dark" />
              </div>
              <div className="text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                  <span className="text-xs font-mono tracking-widest text-sky-200 uppercase/80">Estaleiro Wilson Sons</span>
                  {isPendingApproval ? (
                    <span className="bg-amber-500/25 text-amber-200 text-[10px] font-mono uppercase font-semibold px-2 py-0.5 rounded border border-amber-400/20">Aguardando Avaliação</span>
                  ) : (
                    <span className="bg-emerald-500/25 text-emerald-200 text-[10px] font-mono uppercase font-semibold px-2 py-0.5 rounded border border-emerald-400/20">Confirmado</span>
                  )}
                </div>
                <h3 className="text-xl md:text-2xl font-display font-light">
                  {isPendingApproval ? 'Agendamento Recebido para Análise' : 'Protocolo de Entrada Confirmado'}
                </h3>
              </div>
            </div>
            
            {/* Protocol Badge */}
            <div className="bg-white/10 rounded-2xl border border-white/20 p-3 text-center">
              <span className="text-[10px] uppercase font-mono tracking-widest text-sky-150 block">PROTOCÓLO DA VISITA</span>
              <span className="text-base font-mono font-bold tracking-wider">{booking.id}</span>
            </div>
          </div>
        </div>

        {/* Core details table */}
        <div className="p-6">
          {isPendingApproval && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex gap-3 text-amber-800">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-sm">
                <strong className="block font-semibold">Grupo de grande porte ({booking.groupSize} pessoas)</strong>
                Sua solicitação de visita exige autorização manual por parte da equipe de coordenação portuária da Wilson Sons. O status do protocolo permanecerá como <strong className="font-semibold text-amber-700">Pendente de Aprovação</strong> até a análise final. Uma confirmação definitiva será enviada nas próximas 24h.
              </div>
            </div>
          )}

          {booking.notes && booking.notes.trim().length > 0 && (
            <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-2xl flex gap-3 text-orange-950 shadow-xs animate-fade-in">
              <ShieldAlert className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
              <div className="text-sm">
                <strong className="block font-semibold uppercase text-orange-850 tracking-wider text-xs mb-1 font-display">
                  ⚠️ INFORMAÇÃO IMPORTANTE — Necessidades Especiais / Acessibilidade
                </strong>
                <p className="text-slate-800 font-medium leading-relaxed bg-white/70 px-3 py-2 rounded-lg border border-orange-100/40">
                  "{booking.notes}"
                </p>
                <p className="text-xs text-slate-700 mt-2 leading-relaxed">
                  Para garantir a segurança e a melhor experiência possível, precisaremos de uma análise técnica prévia para verificar a acessibilidade das áreas que serão visitadas e, se necessário, planejar rotas alternativas ou adaptações.
                </p>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed italic border-t border-orange-100 pt-2">
                  Essa informação será adicionada à sua solicitação, e nossa equipe técnica entrará em contato para discutir os detalhes e garantir que tudo seja preparado adequadamente.
                </p>
              </div>
            </div>
          )}

          <h4 className="font-display font-bold text-[#0A2647] text-lg mb-4 border-b border-slate-100 pb-2">
            Resumo dos Dados Selecionados
          </h4>

          {/* Grid fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            
            <div className="flex items-start gap-2.5">
              <Users className="w-4 h-4 text-slate-400 mt-1" />
              <div>
                <span className="text-xs uppercase font-mono tracking-wider text-slate-400 block font-light">Visitante Líder</span>
                <span className="text-sm font-semibold text-slate-800">{booking.fullName}</span>
                <span className="text-xs text-slate-500 block">Perfil: {booking.profile}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Calendar className="w-4 h-4 text-slate-400 mt-1" />
              <div>
                <span className="text-xs uppercase font-mono tracking-wider text-slate-400 block font-light">Data Agendada</span>
                <span className="text-sm font-semibold text-slate-800">{formatDateVisual(booking.date)}</span>
                <span className="text-xs text-slate-500 block">Dia de semana</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-slate-400 mt-1" />
              <div>
                <span className="text-xs uppercase font-mono tracking-wider text-slate-400 block font-light">Horário de Entrada</span>
                <span className="text-sm font-semibold text-emerald-600 font-mono italic">{booking.timeSlot}h</span>
                <span className="text-xs text-slate-500 block">Tolerância: 15 min</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <AtSign className="w-4 h-4 text-slate-400 mt-1" />
              <div>
                <span className="text-xs uppercase font-mono tracking-wider text-slate-400 block font-light">E-mail Cadastrado</span>
                <span className="text-sm font-semibold text-slate-800 break-all">{booking.email}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Phone className="w-4 h-4 text-slate-400 mt-1" />
              <div>
                <span className="text-xs uppercase font-mono tracking-wider text-slate-400 block font-light">WhatsApp Informado</span>
                <span className="text-sm font-mono text-slate-800">{booking.whatsapp}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <FileText className="w-4 h-4 text-slate-400 mt-1" />
              <div>
                <span className="text-xs uppercase font-mono tracking-wider text-slate-400 block font-light">Documento ({booking.documentType})</span>
                <span className="text-sm font-mono text-slate-800">{booking.documentValue}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Building className="w-4 h-4 text-slate-400 mt-1" />
              <div>
                <span className="text-xs uppercase font-mono tracking-wider text-slate-400 block font-light">Organização / Instituição</span>
                <span className="text-sm font-semibold text-slate-800">
                  {booking.institutionOrCompany || 'Nenhuma informada - Pessoa Física'}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-slate-400 mt-1" />
              <div>
                <span className="text-xs uppercase font-mono tracking-wider text-slate-400 block font-light">Portaria de Acesso</span>
                <span className="text-sm font-semibold text-[#0A2647]">Estaleiro Wilson Sons (Niterói/RJ)</span>
                <span className="text-xs text-slate-500 block">Rua Dr. Paulo Frumêncio, 28 - Ponta d'Areia</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Users className="w-4 h-4 text-slate-400 mt-1" />
              <div>
                <span className="text-xs uppercase font-mono tracking-wider text-slate-400 block font-light">Integrante(s)</span>
                <span className="text-sm font-semibold text-slate-800">
                  {booking.groupType === 'individual' ? 'Visita Individual' : `Grupo de ${booking.groupSize} integrantes`}
                </span>
              </div>
            </div>

          </div>

          {/* Core dispatch receipt badges */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Mail className="w-3.5 h-3.5" />
                Confirmação Enviada por E-mail
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-550/10 text-[#1E90FF] border border-blue-550/20">
                <MessageSquare className="w-3.5 h-3.5 animate-pulse" />
                WhatsApp Disparado
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onCancelBooking(booking.id)}
                className="px-4 py-2 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-medium transition-all active:scale-95"
              >
                Cancelar este Agendamento
              </button>
              <button
                type="button"
                onClick={onReset}
                className="px-5 py-2 bg-[#0A2647] hover:bg-[#1E90FF] text-white rounded-xl text-xs font-semibold transition-all active:scale-95 flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Novo Agendamento
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Simulated Integration Engine Logs - Extremely High Quality Sandbox */}
      <div className="bg-slate-900 text-slate-100 rounded-3xl overflow-hidden border border-slate-800 shadow-xl">
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
            <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">
              Motor de Integração e Log de Envio (API)
            </span>
          </div>

          {/* Navigation inside debugger consoles */}
          <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 gap-1">
            <button
              type="button"
              onClick={() => setActiveConsoleTab('email')}
              className={`px-3 py-1.5 text-[11px] font-mono rounded-lg transition-all ${
                activeConsoleTab === 'email' 
                  ? 'bg-slate-800 text-white font-bold' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Simulador E-mail (SMTP)
            </button>
            <button
              type="button"
              onClick={() => setActiveConsoleTab('whatsapp')}
              className={`px-3 py-1.5 text-[11px] font-mono rounded-lg transition-all ${
                activeConsoleTab === 'whatsapp' 
                  ? 'bg-slate-800 text-white font-bold' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Whatsapp Log (Twilio)
            </button>
            <button
              type="button"
              onClick={() => setActiveConsoleTab('api_payload')}
              className={`px-3 py-1.5 text-[11px] font-mono rounded-lg transition-all ${
                activeConsoleTab === 'api_payload' 
                  ? 'bg-slate-800 text-white font-bold' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Raw Webhook JSON
            </button>
          </div>
        </div>

        {/* Tab contents */}
        <div className="p-5 font-mono text-xs overflow-x-auto select-text">
          
          {activeConsoleTab === 'email' && (
            <div className="space-y-4">
              <div className="text-slate-400 text-[11px] border-b border-slate-800 pb-2">
                <p><strong>De:</strong> automatico-sistema@wilsonsons.com.br</p>
                <p><strong>Para:</strong> {booking.email}</p>
                <p><strong>Assunto:</strong> Confirmação de Agendamento - Estaleiro Wilson Sons - {booking.id}</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/60 max-w-2xl mx-auto text-slate-300 font-sans space-y-4">
                <div className="text-center border-b border-slate-800 pb-3">
                  <span className="text-xs uppercase font-mono tracking-widest text-[#1E90FF] font-semibold">Wilson Sons Estaleiros</span>
                  <h4 className="text-white text-base font-bold mt-1">Seu Agendamento de Visitas</h4>
                </div>

                <div className="space-y-2 text-sm">
                  <p>Prezado(a) <strong>{booking.fullName}</strong>,</p>
                  <p>Seu agendamento foi registrado com sucesso nas nossas bases portuárias.</p>
                </div>

                <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 text-xs text-slate-300 space-y-2">
                  <p><strong>Identificação do Protocolo:</strong> <span className="font-mono text-[#1E90FF] bg-slate-950 px-1.5 py-0.5 rounded">{booking.id}</span></p>
                  <p><strong>Data:</strong> {formatDateVisual(booking.date)} às <strong>{booking.timeSlot}h</strong></p>
                  <p><strong>Endereço:</strong> Dr. Paulo Frumêncio, 28 - Ponta d'Areia, Niterói - RJ</p>
                  <p><strong>Status:</strong> <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                    isPendingApproval ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>{booking.status.toUpperCase().replace('_', ' ')}</span></p>
                </div>

                <div className="space-y-1 text-xs">
                  <p className="text-rose-455 font-semibold mb-1 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    ATENÇÃO ÀS NORMAS DE SEGURANÇA MANDATÓRIAS:
                  </p>
                  <ul className="list-disc pl-5 text-slate-400 space-y-1">
                    <li>PROIBIDO comparecer de chinelos, sandálias ou qualquer sapato aberto.</li>
                    <li>PROIBIDO shorts, saias ou regatas nos locais industriais.</li>
                    <li>Forneceremos Capacete, Colete e Botas gratuitamente no local.</li>
                  </ul>
                </div>

                <div className="text-xs text-slate-400 border-t border-slate-800 pt-3 space-y-2">
                  <p>Deseja gerenciar ou programar mudanças para esta visita? Utilize o link abaixo:</p>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Deseja realmente simular o cancelamento deste agendamento agora?')) {
                        onCancelBooking(booking.id);
                      }
                    }}
                    className="inline-flex items-center gap-1.5 border border-rose-800/80 hover:border-rose-600 bg-rose-950/25 hover:bg-rose-900/10 text-rose-400 px-3 py-1.5 rounded-lg font-mono transition-all cursor-pointer"
                  >
                    Simular Cancelamento da Visita
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeConsoleTab === 'whatsapp' && (
            <div className="space-y-4">
              <div className="text-slate-400 text-[11px] border-b border-slate-800 pb-2">
                <p><strong>API Target URL:</strong> https://api.twilio.com/2010-04-01/Accounts/AC_MOCK_WILSONSONS/Messages.json</p>
                <p><strong>To WhatsApp ID:</strong> +55 {booking.whatsapp.replace(/\D/g, '')}</p>
              </div>

              <div className="bg-[#0b141a]/95 border border-[#1e2e34] max-w-sm mx-auto rounded-2xl p-4 text-emerald-100 font-sans shadow-lg relative">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#00a884] rounded-t-2xl"></div>
                <div className="flex items-center justify-between border-b border-[#222e35] pb-2 mb-3 mt-1.5">
                  <span className="text-[11px] tracking-wide text-emerald-400 font-mono">SUPORTE WILSON SONS PORTOS</span>
                  <span className="text-[9px] text-slate-400 font-mono">HOJE</span>
                </div>

                <div className="bg-[#202c33] rounded-xl p-3 text-sm text-slate-200 border border-[#2b3a42] relative">
                  <p className="leading-relaxed">
                    ⚓ *Wilson Sons Estaleiros* ⚓
                    
                    Olá *{booking.fullName}*, seu agendamento de visita foi cadastrado com sucesso!
                    
                    • *Protocolo:* {booking.id}
                    • *Data:* {formatDateVisual(booking.date)}
                    • *Horário:* {booking.timeSlot}h
                    • *Status:* {isPendingApproval ? '🟡 Sob análise manual' : '🟢 Confirmado'}
                    
                    ⚠️ *Vestimenta Obrigatoria:* Calça comprida, camisa com manga e calçado totalmente fechado. EPIs fornecidos na entrada gratuitamente.
                    
                    Consulte os detalhes ou cancele sua ida em: 
                    _http://wilsonsons.com.br/visit/track/{booking.id}_
                  </p>
                  <span className="text-[9px] text-[#8696a0] absolute bottom-1 right-2">Entregue</span>
                </div>
              </div>
            </div>
          )}

          {activeConsoleTab === 'api_payload' && (
            <div className="space-y-3">
              <span className="text-slate-400 text-[11px] block">HTTP POST Payload enviado para o Webhook de Integração (Z-API/MOCK):</span>
              <pre className="bg-slate-950 text-emerald-400 p-4 rounded-xl overflow-x-auto border border-slate-800/80 leading-normal text-xs font-mono">
{JSON.stringify({
  event: "booking.confirmed",
  timestamp: new Date().toISOString(),
  data: {
    protocol: booking.id,
    leader: booking.fullName,
    identity: {
      type: booking.documentType,
      value: booking.documentValue
    },
    contact: {
      email: booking.email,
      whatsapp: booking.whatsapp
    },
    meta: {
      profile: booking.profile,
      company: booking.institutionOrCompany || null,
      visitor_type: booking.groupType,
      group_size: booking.groupSize
    },
    schedule: {
      location: "Estaleiro Wilson Sons Niterói (Ponta d'Areia)",
      date: booking.date,
      time: booking.timeSlot,
      status: booking.status
    },
    dispatched_notifications: {
      smtp_relay: true,
      whatsapp_broker: "twilio_gateway_active"
    }
  }
}, null, 2)}
              </pre>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
