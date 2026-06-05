/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Booking } from '../types';
import { WilsonSonsLogo } from './WilsonSonsLogo';
import { 
  Search, 
  Trash2, 
  AlertTriangle, 
  CheckCircle, 
  MapPin, 
  Calendar, 
  Clock, 
  ChevronRight,
  ShieldAlert,
  Sliders,
  History
} from 'lucide-react';

interface ConsultaAgendamentoProps {
  bookings: Booking[];
  onCancelBooking: (protocol: string) => void;
}

export default function ConsultaAgendamento({
  bookings,
  onCancelBooking
}: ConsultaAgendamentoProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedBooking, setSearchedBooking] = useState<Booking | null>(null);
  const [errorText, setErrorText] = useState('');

  // Handle Search function
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');
    const query = searchQuery.trim().toUpperCase();
    
    if (!query) {
      setErrorText('Por favor, informe um número de protocolo válido.');
      setSearchedBooking(null);
      return;
    }

    const found = bookings.find(b => b.id === query);
    if (found) {
      setSearchedBooking(found);
    } else {
      setErrorText(`Protocolo "${query}" não encontrado na nossa base de dados.`);
      setSearchedBooking(null);
    }
  };

  // Quick select booking from database logs link
  const handleSelectQuickBooking = (booking: Booking) => {
    setSearchQuery(booking.id);
    setSearchedBooking(booking);
    setErrorText('');
  };

  // Format date presentation helper
  const formatDateVisual = (dateStr: string): string => {
    return dateStr.split('-').reverse().join('/');
  };

  return (
    <div className="bg-white border border-slate-150 rounded-3xl shadow-xs overflow-hidden">
      
      {/* Header bar */}
      <div className="p-5 bg-gradient-to-r from-[#0A2647] to-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-[#1E90FF]" />
          <h4 className="font-display font-bold text-lg">
            Consultar e Gerenciar Agendamento
          </h4>
        </div>
        <span className="text-xs font-mono text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-md">
          {bookings.length} cadastrados
        </span>
      </div>

      <div className="p-6 space-y-6">
        
        {/* Search bar form */}
        <form onSubmit={handleSearch} className="space-y-2">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Código do Protocolo (Ex: WS-XXXXXXXX)
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Informe o número do protocolo"
                className="w-full text-sm py-2.5 pl-10 pr-4 border border-slate-200 focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF]/30 rounded-xl bg-slate-50/50 font-mono tracking-wider placeholder:text-slate-400 uppercase"
              />
            </div>
            <button
              type="submit"
              className="py-2.5 px-6 bg-[#0A2647] hover:bg-[#1E90FF] text-white text-sm font-semibold rounded-xl transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              Consultar
            </button>
          </div>

          {errorText && (
            <p className="text-xs text-rose-500 font-medium pt-1">
              ⚠️ {errorText}
            </p>
          )}
        </form>

        {/* Selected Booking Info */}
        {searchedBooking ? (
          <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5 space-y-5 animate-fade-in">
            
            {/* Title / status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-3 gap-3">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-white border border-slate-150 rounded-lg shadow-2xs flex items-center justify-center shrink-0">
                  <WilsonSonsLogo size="xs" colorTheme="dark" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block">ID DO AGENDAMENTO</span>
                  <span className="text-base font-mono font-bold text-[#0A2647]">{searchedBooking.id}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">Situação:</span>
                {searchedBooking.status === 'pendente_aprovacao' ? (
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-150 text-amber-800 border border-amber-250 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                    Análise Manual requerida
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-250 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Confirmado
                  </span>
                )}
              </div>
            </div>

            {/* Core facts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-600">
              
              <div>
                <span className="text-xs font-sans text-slate-400 block font-light">Visitante Líder</span>
                <span className="font-semibold text-slate-800 block">{searchedBooking.fullName}</span>
                <span className="text-xs text-slate-500">Perfil: {searchedBooking.profile}</span>
              </div>

              <div>
                <span className="text-xs font-sans text-slate-400 block font-light">Data e Horário</span>
                <span className="font-semibold text-slate-800 block flex items-center gap-1 text-sm">
                  {formatDateVisual(searchedBooking.date)} às {searchedBooking.timeSlot}h
                </span>
                <span className="text-xs text-slate-500">Tolerância para atrasos: 15 minutos</span>
              </div>

              <div>
                <span className="text-xs font-sans text-slate-400 block font-light">E-mail de Contato</span>
                <span className="font-medium text-slate-800 block break-all">{searchedBooking.email}</span>
              </div>

              <div>
                <span className="text-xs font-sans text-slate-400 block font-light">Telefone WhatsApp</span>
                <span className="font-mono text-slate-800 block">{searchedBooking.whatsapp}</span>
              </div>

              <div>
                <span className="text-xs font-sans text-slate-400 block font-light">Quantidade de integrantes</span>
                <span className="font-medium text-slate-800 block">
                  {searchedBooking.groupType === 'individual' ? 'Visita Solo' : `${searchedBooking.groupSize} integrantes`}
                </span>
              </div>

              <div>
                <span className="text-xs font-sans text-slate-400 block font-light">Documento ({searchedBooking.documentType})</span>
                <span className="font-mono text-slate-800 block">{searchedBooking.documentValue}</span>
              </div>

            </div>

            {searchedBooking.notes && searchedBooking.notes.trim().length > 0 ? (
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl flex gap-3 text-orange-950 shadow-xs animate-fade-in">
                <ShieldAlert className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong className="block font-semibold uppercase text-orange-850 tracking-wider text-xs mb-1 font-display">
                    ⚠️ INFORMAÇÃO IMPORTANTE — Necessidades Especiais / Acessibilidade
                  </strong>
                  <p className="text-slate-800 font-medium leading-relaxed bg-white/70 px-3 py-2 rounded-lg border border-orange-100/40">
                    "{searchedBooking.notes}"
                  </p>
                  <p className="text-xs text-slate-700 mt-2 leading-relaxed">
                    Para garantir a segurança e a melhor experiência possível, precisaremos de uma análise técnica prévia para verificar a acessibilidade das áreas que serão visitadas e, se necessário, planejar rotas alternativas ou adaptações.
                  </p>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed italic border-t border-orange-100 pt-2">
                    Essa informação será adicionada à sua solicitação, e nossa equipe técnica entrará em contato para discutir os detalhes e garantir que tudo seja preparado adequadamente.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-white border border-slate-150 rounded-xl">
                <span className="text-xs uppercase font-mono tracking-wider text-slate-400 block mb-0.5">Observações ou Necessidades Especiais:</span>
                <p className="text-sm font-sans text-slate-700 leading-snug">
                  Nenhuma observação declarada.
                </p>
              </div>
            )}

            {/* Cancel Action */}
            <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Deseja realmente cancelar o agendamento ${searchedBooking.id}? Esta ação é irreversível.`)) {
                    onCancelBooking(searchedBooking.id);
                    setSearchedBooking(null);
                    setSearchQuery('');
                  }
                }}
                className="py-2.5 px-4 bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 hover:text-rose-700 hover:border-rose-300 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Excluir e Cancelar Agendamento definitivamente
              </button>
            </div>

          </div>
        ) : (
          <div className="border border-dashed border-slate-200 rounded-2xl p-6 text-center text-slate-400">
            <span className="block text-sm font-medium mb-1">Resultado de pesquisa</span>
            <p className="text-xs max-w-sm mx-auto leading-relaxed">
              Os dados de agendamento serão carregados aqui após pesquisar um protocolo ativo.
            </p>
          </div>
        )}

        {/* Database log summary */}
        {bookings.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest block">
                Agendamentos Ativos cadastrados localmente (Demo)
              </span>
              <span className="text-[10px] text-slate-400 font-mono italic">Clique rápido para testar</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {bookings.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => handleSelectQuickBooking(b)}
                  className={`p-3 text-left border rounded-xl hover:border-[#1E90FF]/40 transition-all text-xs flex justify-between items-center bg-[#0a2647]/5 hover:bg-[#0a2647]/10 ${
                    searchedBooking?.id === b.id ? 'border-[#1E90FF] ring-1 ring-[#1E90FF]/30' : 'border-slate-150'
                  }`}
                >
                  <div className="space-y-0.5 truncate pr-2">
                    <span className="font-mono font-bold text-slate-700 block">{b.id}</span>
                    <span className="text-[10px] text-slate-500 block truncate font-medium">{b.fullName}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-semibold text-slate-700 block">{formatDateVisual(b.date)}</span>
                    <span className="text-[10px] text-slate-500 font-mono block">{b.timeSlot}h</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
