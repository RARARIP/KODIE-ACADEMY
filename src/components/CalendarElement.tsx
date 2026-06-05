/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  getDaysInMonth, 
  isWeekend, 
  isPastDate, 
  MONTHS_PT, 
  WEEK_DAYS_PT 
} from '../utils/helpers';
import { Booking } from '../types';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Clock, 
  Users,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  UserCheck,
  ShieldAlert,
  ShieldCheck,
  CalendarCheck2,
  Zap,
  Lock
} from 'lucide-react';

interface CalendarElementProps {
  selectedDate: string; // YYYY-MM-DD
  selectedTime: string; // '08:00', '13:00' etc
  onSelectDate: (dateStr: string) => void;
  onSelectTime: (timeStr: string) => void;
  bookings: Booking[];
  groupSize: number;
}

export default function CalendarElement({
  selectedDate,
  selectedTime,
  onSelectDate,
  onSelectTime,
  bookings,
  groupSize
}: CalendarElementProps) {
  // Navigation states for current calendar view
  const today = new Date();
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth()); // 0-indexed

  // Format a Date object to YYYY-MM-DD safe string
  const formatDateString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Get days in current visible month
  const days = useMemo(() => {
    return getDaysInMonth(currentYear, currentMonth);
  }, [currentYear, currentMonth]);

  // Calendar grid math spacing for leading empty days of first weekday of the month
  const leadEmptyDays = useMemo(() => {
    if (days.length === 0) return 0;
    return days[0].getDay(); // 0 is Sunday, 1 is Monday ... 6 is Saturday
  }, [days]);

  // Navigate back 1 month
  const handlePrevMonth = () => {
    if (currentYear === today.getFullYear() && currentMonth === today.getMonth()) {
      return; // Block backward navigation beyond today's month
    }
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  // Navigate forward 1 month
  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const isTodayMonth = currentYear === today.getFullYear() && currentMonth === today.getMonth();

  // Standard available times list
  const TIME_SLOTS = [
    { value: '08:00', label: '08:00' },
    { value: '09:00', label: '09:00' },
    { value: '10:00', label: '10:00' },
    { value: '11:00', label: '11:00' },
    { value: '13:00', label: '13:00' },
    { value: '14:00', label: '14:00' },
    { value: '15:00', label: '15:00' },
    { value: '16:00', label: '16:00' }
  ];

  /**
   * Deterministic scaling/assignment model mapping week day & hour to operational guides
   * Satisfies: "Ele deve exibir apenas as janelas de tempo previamente liberadas pelos guias operacionais."
   */
  const getGuideForSlot = (dayOfWeek: number, timeSlotValue: string) => {
    // 2 is Tuesday, 3 is Wednesday, 4 is Thursday
    if (dayOfWeek === 2) { // Tuesday
      if (['08:00', '09:00', '10:00', '11:00'].includes(timeSlotValue)) {
        return { name: 'Engª Elaine Rocha', dept: 'Doca de Construção' };
      }
      if (['13:00', '14:00', '15:00', '16:00'].includes(timeSlotValue)) {
        return { name: 'Mestre Marcos Silva', dept: 'Oficinas Técnicas' };
      }
    } else if (dayOfWeek === 3) { // Wednesday
      if (['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'].includes(timeSlotValue)) {
        return { name: 'Engº Rodrigo Souza', dept: 'Dique Seco' };
      }
    } else if (dayOfWeek === 4) { // Thursday
      if (['08:00', '09:00', '10:00', '11:00'].includes(timeSlotValue)) {
        return { name: 'Engª Elaine Rocha', dept: 'Doca de Construção' };
      }
      if (['13:00', '14:00', '15:00', '16:00'].includes(timeSlotValue)) {
        return { name: 'Engº Rodrigo Souza', dept: 'Dique Seco' };
      }
    }
    return null; // Mondays, Fridays and Weekends have no open guide roles
  };

  /**
   * Simulated Calendly-style personal calendar collision (Outlook / Google).
   * "Se ele marcar uma reunião de última hora ou uma operação de emergência na agenda pessoal, aquele horário some automaticamente..."
   */
  const getExternalSyncConflict = (dateStr: string, timeSlotValue: string, guideName: string) => {
    if (guideName.includes('Marcos') && timeSlotValue === '15:00') {
      return { type: 'Outlook', reason: 'Reunião Técnica de Alocação de Oficinas' };
    }
    if (guideName.includes('Rodrigo') && timeSlotValue === '08:00') {
      return { type: 'Google Calendar', reason: 'Inspeção Emergencial de Casco (Navio Graneleiro)' };
    }
    if (guideName.includes('Elaine') && timeSlotValue === '11:00') {
      return { type: 'Outlook', reason: 'Planejamento Semanal de Doga Seca' };
    }
    return null;
  };

  /**
   * Evaluates the 60-minute preparation buffer logic.
   * "Configure uma folga de 30 a 60 minutos antes e depois de cada visita na agenda do guia. Isso garante tempo para se deslocar, buscar EPIs..."
   */
  const getBufferBlockedStatus = (dateStr: string, slotValue: string, guideName: string) => {
    const parseToMin = (tStr: string) => {
      const [h, m] = tStr.split(':').map(Number);
      return h * 60 + m;
    };
    
    const candidateMin = parseToMin(slotValue);
    
    // Find all active bookings on the targeted date
    const dayBookings = bookings.filter(b => b.date === dateStr);
    
    for (const b of dayBookings) {
      if (b.timeSlot === slotValue) continue; // Directly occupied
      
      // Determine which guide was booked for that existing slot
      const d = new Date(dateStr + 'T00:00:00');
      const bGuide = getGuideForSlot(d.getDay(), b.timeSlot);
      
      if (bGuide && bGuide.name === guideName) {
        const bookedMin = parseToMin(b.timeSlot);
        const timeDifference = Math.abs(candidateMin - bookedMin);
        
        // Block consecutive hours within 60 minutes of the booked tour
        if (timeDifference > 0 && timeDifference <= 60) {
          return {
            bookedSlot: b.timeSlot,
            clientName: b.fullName
          };
        }
      }
    }
    return null;
  };

  /**
   * Evaluate if a specific date-time is within 48h limit from now.
   * "Defina que os horários de um determinado dia expiram para agendamento externo com 48 horas de antecedência."
   */
  const isDateWithin48Hours = (date: Date): boolean => {
    const now = new Date();
    // 48 hours limit in ms
    const limit = now.getTime() + 48 * 60 * 60 * 1000;
    
    const targetDate = new Date(date);
    // Align comparison to hour level of the check day, or normalize
    targetDate.setHours(23, 59, 59, 999); // give full benefit of day end or keep it strict
    
    return date.getTime() < limit;
  };

  const isSlotWithin48Hours = (dateStr: string, slotValue: string): boolean => {
    const now = new Date();
    const limit = now.getTime() + 48 * 60 * 60 * 1000;
    
    // Parse targeted slot date-time
    const targetDate = new Date(`${dateStr}T${slotValue}:00`);
    return targetDate.getTime() < limit;
  };

  // Compute status for a date on the calendar grid
  const getDayBookingStatus = (date: Date): 'past' | 'expired_notice' | 'unreleased_day' | 'weekend' | 'fully_booked' | 'available' => {
    if (isPastDate(date)) return 'past';
    
    // Enforce 48h advanced notice warning on dates
    if (isDateWithin48Hours(date)) return 'expired_notice';
    
    if (isWeekend(date)) return 'weekend';
    
    const dayOfWeek = date.getDay();
    // Pre-released windows are only on Tuesday (2), Wednesday (3), Thursday (4)
    if (dayOfWeek !== 2 && dayOfWeek !== 3 && dayOfWeek !== 4) {
      return 'unreleased_day';
    }
    
    // Check if ALL slots on this released day are occupied/blocked
    const dateStr = formatDateString(date);
    let totalSlots = 0;
    let availableSlots = 0;

    for (const slot of TIME_SLOTS) {
      const guide = getGuideForSlot(dayOfWeek, slot.value);
      if (guide) {
        totalSlots++;
        const isOcupado = bookings.some(b => b.date === dateStr && b.timeSlot === slot.value);
        const hasConflict = getExternalSyncConflict(dateStr, slot.value, guide.name);
        const hasBuffer = getBufferBlockedStatus(dateStr, slot.value, guide.name);
        const is48h = isSlotWithin48Hours(dateStr, slot.value);

        if (!isOcupado && !hasConflict && !hasBuffer && !is48h) {
          availableSlots++;
        }
      }
    }

    if (totalSlots > 0 && availableSlots === 0) {
      return 'fully_booked';
    }
    
    return 'available';
  };

  // Calculate detailed info for the slots on the selected date
  const processedSlots = useMemo(() => {
    if (!selectedDate) return [];
    
    const dateObj = new Date(selectedDate + 'T00:00:00');
    const dayOfWeek = dateObj.getDay();

    return TIME_SLOTS.map(slot => {
      const guide = getGuideForSlot(dayOfWeek, slot.value);
      
      if (!guide) {
        return {
          ...slot,
          guide: null,
          isAvailable: false,
          reason: 'Sem escala de guias para este horário'
        };
      }

      // 1. Direct booking check
      const directBooking = bookings.find(b => b.date === selectedDate && b.timeSlot === slot.value);
      
      // 2. Personal Calendar Sync sync conflict check
      const syncConflict = getExternalSyncConflict(selectedDate, slot.value, guide.name);
      
      // 3. Buffer interval security block check
      const bufferBlock = getBufferBlockedStatus(selectedDate, slot.value, guide.name);
      
      // 4. 48 hours minimum warning check
      const expired48h = isSlotWithin48Hours(selectedDate, slot.value);

      const isAvailable = !directBooking && !syncConflict && !bufferBlock && !expired48h;

      return {
        ...slot,
        guide,
        isOccupied: !!directBooking,
        occupiedBy: directBooking ? directBooking.fullName : null,
        syncConflict,
        bufferBlock,
        expired48h,
        isAvailable
      };
    });
  }, [selectedDate, bookings]);

  return (
    <div className="space-y-6">
      
      {/* Dynamic Schedulers Rules Rules Panel - Visual & Fully Transparent! */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50 border border-slate-150 p-4 rounded-2xl select-none text-[#0A2647]">
        
        <div className="bg-white p-3 rounded-xl border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
              <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
            </div>
            <span className="text-[11px] font-bold tracking-wide uppercase text-slate-705">Sincronização Ativa</span>
          </div>
          <p className="text-[11px] font-light text-slate-500 leading-snug">
            Sincronizado em tempo real com as agendas pessoais (Google/Outlook) dos guias. Emergências bloqueiam o horário no site na mesma hora.
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-[10px] font-mono text-emerald-600 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            Conexão Live: Ativa
          </div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="p-1.5 bg-[#1E90FF]/10 text-[#1E90FF] rounded-lg shrink-0">
              <CalendarCheck2 className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-bold tracking-wide uppercase text-slate-705">Janelas Atribuídas</span>
          </div>
          <p className="text-[11px] font-light text-slate-500 leading-snug">
            Em conformidade com a coordenação de segurança operacional, apenas dias com escalas de engenheiros ativos (Ter, Qua, Qui) estão liberados.
          </p>
          <div className="mt-2 flex items-center gap-1 text-[10px] font-mono text-[#1E90FF] font-semibold">
            Escalas abertas: Ter, Qua, Qui
          </div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg shrink-0">
              <Zap className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-bold tracking-wide uppercase text-slate-705">Tempo de Preparação</span>
          </div>
          <p className="text-[11px] font-light text-slate-500 leading-snug">
            Folga de 60 minutos (buffer) aplicada automaticamente antes/depois de cada tour para paramentação e deslocamento do guia pelo terminal.
          </p>
          <div className="mt-2 flex items-center gap-1 text-[10px] font-mono text-amber-600 font-semibold">
            Buffer Ativo: 60 minutos
          </div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="p-1.5 bg-rose-50 text-rose-600 rounded-lg shrink-0">
              <Lock className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-bold tracking-wide uppercase text-slate-705">Aviso Prévio 48h</span>
          </div>
          <p className="text-[11px] font-light text-slate-500 leading-snug">
            A coordenação exige 48 horas de antecedência mínima de agendamento automático. Horários mais próximos expiram automaticamente.
          </p>
          <div className="mt-2 flex items-center gap-1 text-[10px] font-mono text-rose-600 font-semibold">
            Bloqueio de surpresa: Ligado
          </div>
        </div>

      </div>

      <div id="calendar-container" className="flex flex-col lg:flex-row gap-6">
        
        {/* Calendar Area */}
        <div className="flex-1 bg-white border border-slate-150 rounded-2xl shadow-xs p-5 select-none">
          <div className="flex items-center justify-between mb-5">
            <div className="flex flex-col">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">Calendário de Escalas</span>
              <h3 className="text-xl font-display font-bold text-[#0A2647] flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-[#1E90FF]" />
                {MONTHS_PT[currentMonth]} {currentYear}
              </h3>
            </div>
            
            <div className="flex gap-1.5 items-center">
              <button
                type="button"
                onClick={handlePrevMonth}
                disabled={isTodayMonth}
                className={`p-2 rounded-lg border transition-all ${
                  isTodayMonth 
                    ? 'border-slate-100 text-slate-300 cursor-not-allowed bg-slate-50' 
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50 active:scale-95'
                }`}
                title="Mês anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 active:scale-95 transition-all"
                title="Próximo mês"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days Header */}
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {WEEK_DAYS_PT.map((day, idx) => (
              <div 
                key={idx} 
                className={`text-xs font-semibold py-1.5 font-sans tracking-wide ${
                  idx === 0 || idx === 6 ? 'text-rose-400' : 'text-slate-500'
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {/* Pad leading dates of previous month */}
            {Array.from({ length: leadEmptyDays }).map((_, idx) => (
              <div key={`empty-${idx}`} className="aspect-square bg-slate-50/40 rounded-lg border border-slate-50/20"></div>
            ))}

            {/* Render target month's days */}
            {days.map((day) => {
              const dateStr = formatDateString(day);
              const status = getDayBookingStatus(day);
              const isSelected = selectedDate === dateStr;
              const isCurrentToday = today.getDate() === day.getDate() && today.getMonth() === day.getMonth() && today.getFullYear() === day.getFullYear();

              let cursorClass = 'cursor-pointer';
              let bgClass = 'bg-slate-50 hover:bg-slate-100 text-[#0A2647] border-slate-150';
              let statusLabel = '';
              let isDisabled = false;

              if (status === 'past') {
                isDisabled = true;
                cursorClass = 'cursor-not-allowed opacity-35';
                bgClass = 'bg-slate-100 text-slate-400 border-transparent';
              } else if (status === 'expired_notice') {
                isDisabled = true;
                cursorClass = 'cursor-not-allowed opacity-50';
                bgClass = 'bg-rose-50/25 text-rose-550 border-rose-100/30';
                statusLabel = 'Expirado';
              } else if (status === 'weekend') {
                isDisabled = true;
                cursorClass = 'cursor-not-allowed text-slate-350 bg-slate-150/40';
                bgClass = 'bg-slate-50 text-slate-300 border-transparent';
              } else if (status === 'unreleased_day') {
                isDisabled = true;
                cursorClass = 'cursor-not-allowed';
                bgClass = 'bg-slate-100/35 text-slate-400/70 border-slate-200/50 border-dashed';
                statusLabel = 'Sem Escala';
              } else if (status === 'fully_booked') {
                isDisabled = true;
                cursorClass = 'cursor-not-allowed';
                bgClass = 'bg-amber-50 text-amber-500 border-amber-100';
                statusLabel = 'Esgotado';
              } else if (isSelected) {
                bgClass = 'bg-[#0A2647] text-white border-[#0A2647] ring-2 ring-[#1E90FF]/35 font-bold';
              }

              return (
                <button
                  key={dateStr}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => {
                    onSelectDate(dateStr);
                    onSelectTime(''); // Reset selected hour to prevent overlap error
                  }}
                  className={`aspect-square p-1 flex flex-col justify-between items-center rounded-xl border text-sm font-medium transition-all relative ${cursorClass} ${bgClass} ${
                    isCurrentToday && !isSelected ? 'ring-2 ring-amber-400/80 font-bold' : ''
                  }`}
                  title={statusLabel}
                >
                  <span className="z-10 font-bold">{day.getDate()}</span>
                  
                  {/* Indicators representing specific date conditions */}
                  {status === 'available' && !isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mb-1"></span>
                  )}
                  {statusLabel && (
                    <span className="text-[8px] font-mono scale-90 text-slate-400 font-semibold mb-0.5 leading-none px-1 text-center truncate w-full">
                      {statusLabel}
                    </span>
                  )}
                  {isCurrentToday && !isSelected && (
                    <span className="text-[8px] text-amber-600 font-extrabold absolute top-0.5 right-0.5 bg-amber-100 px-0.5 rounded">Hoje</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend Panel */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-[#0A2647] border border-slate-300"></span>
              <span>Selecionado</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-white border border-emerald-500 relative flex items-center justify-center">
                <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
              </span>
              <span>Disponível</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-amber-50 border border-amber-100"></span>
              <span>Esgotado / Lotado</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-rose-50/40 border border-rose-100/30"></span>
              <span>Excluído via Aviso de 48h</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-slate-100 border border-slate-200 border-dashed"></span>
              <span>Dias Sem Escala Aberta (Seg/Sex)</span>
            </div>
          </div>
        </div>

        {/* Interactive Hours Slots Grid */}
        <div className="w-full lg:w-96 bg-gradient-to-b from-white to-slate-50 border border-slate-150 rounded-2xl shadow-xs p-5 flex flex-col">
          <h4 className="font-display font-bold text-[#0A2647] flex items-center gap-2 text-base mb-1">
            <Clock className="w-4 h-4 text-[#1E90FF]" />
            Janelas Operacionais Aberta
          </h4>
          
          {selectedDate ? (
            <p className="text-xs text-slate-500 font-sans mb-4">
              Agenda do dia: <strong className="text-slate-855 font-semibold text-[#0A2647]">{selectedDate.split('-').reverse().join('/')}</strong>
            </p>
          ) : (
            <p className="text-xs text-rose-500 font-medium mb-4 flex items-center gap-1 leading-snug">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              Por favor, selecione ao lado um dia aberto (assinalado com ponto verde) para consultar a grade dos guias.
            </p>
          )}

          <div className="space-y-2 flex-1 max-h-[360px] overflow-y-auto pr-1">
            {selectedDate && processedSlots.length > 0 ? (
              processedSlots.map((slot) => {
                const isSelected = selectedTime === slot.value;
                
                let btnStyles = 'border-slate-200 bg-white hover:border-[#1E90FF]/50 text-slate-800';
                let indicatorDot = <span className="w-2 h-2 rounded-full bg-emerald-500"></span>;
                let detailsLabel = null;

                if (!slot.guide) {
                  btnStyles = 'bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed opacity-50';
                  indicatorDot = <span className="w-2 h-2 rounded-full bg-slate-300"></span>;
                  detailsLabel = <span className="text-[10px] text-slate-400">Escala de guias inativa para esta hora</span>;
                } else if (slot.isOccupied) {
                  btnStyles = 'bg-slate-100/60 border-slate-200 text-slate-400 cursor-not-allowed relative opacity-70';
                  indicatorDot = <span className="w-2 h-2 rounded-full bg-rose-455"></span>;
                  detailsLabel = (
                    <span className="text-[10px] text-rose-500 font-medium font-sans flex items-center gap-1 mt-1 bg-rose-50/40 p-1 rounded border border-rose-100/10">
                      <ShieldAlert className="w-3 h-3 text-rose-500 shrink-0" />
                      Reservado por: {slot.occupiedBy || 'Outro Visitante'}
                    </span>
                  );
                } else if (slot.syncConflict) {
                  btnStyles = 'bg-amber-50/30 border-amber-200/50 text-slate-400 cursor-not-allowed relative opacity-85';
                  indicatorDot = <span className="w-2 h-2 rounded-full bg-orange-400"></span>;
                  detailsLabel = (
                    <span className="text-[10px] text-orange-600 font-medium flex flex-col gap-0.5 mt-1 bg-amber-50/60 p-1.5 rounded border border-amber-100/40 font-sans">
                      <span className="flex items-center gap-1">
                        <RefreshCw className="w-3 h-3 text-orange-500 shrink-0 animate-spin-slow" />
                        <strong>Sincronismo ({slot.syncConflict.type})</strong>
                      </span>
                      <span className="font-light text-slate-500 leading-normal pl-4 italic">Conflito externo de agenda: "{slot.syncConflict.reason}"</span>
                    </span>
                  );
                } else if (slot.bufferBlock) {
                  btnStyles = 'bg-amber-100/10 border-slate-200 text-slate-400 cursor-not-allowed relative opacity-80';
                  indicatorDot = <span className="w-2 h-2 rounded-full bg-amber-600"></span>;
                  detailsLabel = (
                    <span className="text-[10px] text-amber-700 font-medium flex flex-col gap-0.5 mt-1 bg-amber-100/10 p-1.5 rounded border border-amber-200/20 font-sans">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-600 shrink-0" />
                        <strong>Buffer Ativo ({slot.bufferBlock.bookedSlot} ±60m)</strong>
                      </span>
                      <span className="font-light text-slate-500 leading-normal pl-4">Indisponível para escolta devido ao tempo de preparação/EPIs do guia regulado de outro agendamento de visitas.</span>
                    </span>
                  );
                } else if (slot.expired48h) {
                  btnStyles = 'bg-rose-50/20 border-rose-100 text-slate-400 cursor-not-allowed relative opacity-80';
                  indicatorDot = <span className="w-2 h-2 rounded-full bg-rose-600"></span>;
                  detailsLabel = (
                    <span className="text-[10px] text-rose-600 font-medium flex items-center gap-1 mt-1 bg-rose-50/40 p-1 rounded border border-rose-100">
                      <Lock className="w-3 h-3 shrink-0" />
                      Bloqueio de antecedência mínima (Exige 48h)
                    </span>
                  );
                } else if (isSelected) {
                  btnStyles = 'bg-[#1E90FF] border-[#1E90FF] text-white shadow-md ring-2 ring-[#1E90FF]/25 font-bold';
                  indicatorDot = <CheckCircle2 className="w-4 h-4 text-white" />;
                }

                return (
                  <button
                    key={slot.value}
                    type="button"
                    disabled={!slot.isAvailable}
                    onClick={() => onSelectTime(slot.value)}
                    className={`w-full py-2.5 px-3.5 rounded-xl text-sm font-medium border text-left transition-all relative flex flex-col gap-1 active:scale-[0.99] select-none ${btnStyles}`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        {indicatorDot}
                        <span className="font-mono font-semibold text-base">{slot.value} h</span>
                      </div>
                      
                      {slot.guide && !slot.isOccupied && !slot.syncConflict && !slot.bufferBlock && !slot.expired48h && (
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border flex items-center gap-1 uppercase font-bold tracking-wider ${
                          isSelected ? 'bg-white/20 border-white text-white' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        }`}>
                          <UserCheck className="w-3 h-3 shrink-0" />
                          Livre
                        </span>
                      )}
                    </div>

                    {slot.guide && (
                      <div className="flex flex-col mt-0.5 pointer-events-none select-none">
                        <span className={`text-xs ${isSelected ? 'text-sky-100' : 'text-slate-700 font-semibold'} leading-tight`}>
                          Escolta: {slot.guide.name}
                        </span>
                        <span className={`text-[10px] ${isSelected ? 'text-sky-150' : 'text-slate-400 font-light'} mt-0.5`}>
                          Frente: {slot.guide.dept}
                        </span>
                      </div>
                    )}

                    {detailsLabel}
                  </button>
                );
              })
            ) : (
              selectedDate && (
                <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                  Sem janelas abertas para este dia nas escalas atuais.
                </div>
              )
            )}
          </div>

          {selectedDate && groupSize > 10 && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2 text-amber-800">
              <Users className="w-4 h-4 mt-0.5 shrink-0 text-amber-600" />
              <div className="text-xs">
                <span className="font-semibold block">Atenção ao tamanho do Grupo:</span>
                Visitas com mais de 10 participantes necessitam de aprovação manual pela equipe do Estaleiro.
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
