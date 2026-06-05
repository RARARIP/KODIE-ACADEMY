/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Booking, 
  VisitorProfile, 
  TimeSlotOption 
} from './types';
import { 
  formatWhatsApp, 
  formatCPF, 
  validateCPF, 
  validateEmail, 
  generateProtocol,
  isWeekend,
  isPastDate
} from './utils/helpers';
import CalendarElement from './components/CalendarElement';
import SafetyRegulations from './components/SafetyRegulations';
import BookingConfirmation from './components/BookingConfirmation';
import ConsultaAgendamento from './components/ConsultaAgendamento';
import { WilsonSonsFullLogo } from './components/WilsonSonsLogo';
import { 
  Ship, 
  Anchor, 
  User, 
  AtSign, 
  Phone, 
  FileText, 
  Briefcase, 
  Users, 
  Info, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft, 
  History, 
  PlusCircle,
  HelpCircle,
  AlertCircle,
  ChevronRight
} from 'lucide-react';

export default function App() {
  // Navigation between Book form and Query portal
  const [activeTab, setActiveTab] = useState<'agendar' | 'consultar'>('agendar');

  // Step state tracker (1, 2, 3)
  const [currentStep, setCurrentStep] = useState(1);

  // Form Field States
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [documentType, setDocumentType] = useState<'CPF' | 'Passaporte'>('CPF');
  const [documentValue, setDocumentValue] = useState('');
  const [profile, setProfile] = useState<VisitorProfile>('Estudante');
  const [institution, setInstitution] = useState('');
  const [groupType, setGroupType] = useState<'individual' | 'grupo'>('individual');
  const [groupSize, setGroupSize] = useState<number>(1);
  const [notes, setNotes] = useState('');

  // Schedulers State
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  // Safety acceptance checklist state
  const [safetyRulesAccepted, setSafetyRulesAccepted] = useState(false);
  const [clothingRulesAccepted, setClothingRulesAccepted] = useState(false);

  // Real-time live validations dictionary
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Active bookings stored in local state + synchronized with localStorage
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [lastSubmittedBooking, setLastSubmittedBooking] = useState<Booking | null>(null);

  // Load and seed standard occupied bookings inside localStorage on initial mount
  useEffect(() => {
    const stored = localStorage.getItem('wilsonsons_shipyard_bookings');
    if (stored) {
      try {
        setBookings(JSON.parse(stored));
      } catch (e) {
        console.error('Falha ao ler agendamentos do local storage.', e);
      }
    } else {
      // Seed initial mock bookings to demonstrate occupied/busy slots
      const seedBookings: Booking[] = [];
      const today = new Date();
      
      // Select 3 upcoming business days for realistic busy slots
      let workingDaysCounter = 0;
      let checkDate = new Date(today);
      
      while (workingDaysCounter < 3) {
        checkDate.setDate(checkDate.getDate() + 1); // skip forward
        if (!isWeekend(checkDate) && !isPastDate(checkDate)) {
          workingDaysCounter++;
          const year = checkDate.getFullYear();
          const month = String(checkDate.getMonth() + 1).padStart(2, '0');
          const day = String(checkDate.getDate()).padStart(2, '0');
          const dateStr = `${year}-${month}-${day}`;
          
          if (workingDaysCounter === 1) {
            // Seed Monday/First working day slots
            seedBookings.push({
              id: 'WS-SEED829A',
              fullName: 'Carlos André Silva (Petrobras)',
              email: 'carlos.andre@petrobras.com.br',
              whatsapp: '(21) 98765-4321',
              documentType: 'CPF',
              documentValue: '123.456.789-01',
              profile: 'Profissional naval',
              institutionOrCompany: 'Petrobras S/A',
              groupType: 'grupo',
              groupSize: 5,
              date: dateStr,
              timeSlot: '08:00',
              safetyAccepted: true,
              status: 'confirmado',
              createdAt: new Date().toISOString()
            });
            seedBookings.push({
              id: 'WS-SEED829B',
              fullName: 'Dra. Márcia Fagundes (UFRJ)',
              email: 'marcia.f@parque.ufrj.br',
              whatsapp: '(21) 99112-2334',
              documentType: 'CPF',
              documentValue: '234.567.890-12',
              profile: 'Pesquisador',
              institutionOrCompany: 'COPPE - UFRJ',
              groupType: 'individual',
              groupSize: 1,
              date: dateStr,
              timeSlot: '13:00',
              safetyAccepted: true,
              status: 'confirmado',
              createdAt: new Date().toISOString()
            });
          } else if (workingDaysCounter === 2) {
            // Seed second working day slot
            seedBookings.push({
              id: 'WS-SEED829C',
              fullName: 'Prof. Renato Mendes (Senai Cetiqt)',
              email: 'renato.mendes@afir.senai.br',
              whatsapp: '(21) 97722-1199',
              documentType: 'CPF',
              documentValue: '345.678.901-23',
              profile: 'Estudante',
              institutionOrCompany: 'SENAI Niterói',
              groupType: 'grupo',
              groupSize: 15, // Groups > 10 get flagged under approval!
              date: dateStr,
              timeSlot: '10:00',
              safetyAccepted: true,
              status: 'pendente_aprovacao',
              createdAt: new Date().toISOString()
            });
            seedBookings.push({
              id: 'WS-SEED829D',
              fullName: 'Roberto Albuquerque',
              email: 'roberto@globonews.com.br',
              whatsapp: '(21) 98877-6655',
              documentType: 'CPF',
              documentValue: '456.789.012-34',
              profile: 'Imprensa',
              institutionOrCompany: 'Rede Globo de Televisão',
              groupType: 'individual',
              groupSize: 1,
              date: dateStr,
              timeSlot: '14:00',
              safetyAccepted: true,
              status: 'confirmado',
              createdAt: new Date().toISOString()
            });
            seedBookings.push({
              id: 'WS-SEED829E',
              fullName: 'Engº Thales Cavalcanti',
              email: 'thales@navenbras.com',
              whatsapp: '(11) 96655-4433',
              documentType: 'Passaporte',
              documentValue: 'FC982741',
              profile: 'Parceiro comercial',
              institutionOrCompany: 'Navenbras S.A.',
              groupType: 'grupo',
              groupSize: 4,
              date: dateStr,
              timeSlot: '16:00',
              safetyAccepted: true,
              status: 'confirmado',
              createdAt: new Date().toISOString()
            });
          } else if (workingDaysCounter === 3) {
            // Fully occupy third working day slots (e.g. 10:00, 15:00)
            seedBookings.push({
              id: 'WS-SEED829F',
              fullName: 'Visita Particular',
              email: 'geral@wilsonsons.com.br',
              whatsapp: '(21) 3211-8899',
              documentType: 'CPF',
              documentValue: '567.890.123-45',
              profile: 'Público geral',
              institutionOrCompany: '',
              groupType: 'individual',
              groupSize: 1,
              date: dateStr,
              timeSlot: '11:00',
              safetyAccepted: true,
              status: 'confirmado',
              createdAt: new Date().toISOString()
            });
            seedBookings.push({
              id: 'WS-SEED829G',
              fullName: 'Supervisão de Casco',
              email: 'supervisao@wilsonsons.com.br',
              whatsapp: '(21) 3211-8898',
              documentType: 'CPF',
              documentValue: '678.901.234-56',
              profile: 'Parceiro comercial',
              groupType: 'grupo',
              groupSize: 3,
              date: dateStr,
              timeSlot: '15:00',
              safetyAccepted: true,
              status: 'confirmado',
              createdAt: new Date().toISOString()
            });
          }
        }
      }

      setBookings(seedBookings);
      localStorage.setItem('wilsonsons_shipyard_bookings', JSON.stringify(seedBookings));
    }
  }, []);

  // Save changes to localstorage when bookings state changes
  const saveBookingsToLocalStorage = (newBookings: Booking[]) => {
    setBookings(newBookings);
    localStorage.setItem('wilsonsons_shipyard_bookings', JSON.stringify(newBookings));
  };

  // Live validator effect triggered when fields change
  const validateStep1 = () => {
    const tempErrors: { [key: string]: string } = {};

    if (!fullName.trim() || fullName.trim().length < 5) {
      tempErrors.fullName = 'O nome completo deve conter ao menos 5 caracteres.';
    }

    if (!email.trim() || !validateEmail(email)) {
      tempErrors.email = 'Informe um endereço de e-mail válido.';
    }

    // WhatsApp needs 11 digits (excluding mascara characters)
    const rawWa = whatsapp.replace(/\D/g, '');
    if (!whatsapp || rawWa.length < 10) {
      tempErrors.whatsapp = 'Insira o número de WhatsApp com DDD.';
    }

    // Document typing validation
    if (documentType === 'CPF') {
      const rawCPF = documentValue.replace(/\D/g, '');
      if (!documentValue || rawCPF.length !== 11) {
        tempErrors.documentValue = 'O CPF deve possuir exatamente 11 números.';
      } else if (!validateCPF(documentValue)) {
        tempErrors.documentValue = 'Número de CPF inválido.';
      }
    } else {
      // Passaporte validation
      if (!documentValue.trim() || documentValue.trim().length < 5) {
        tempErrors.documentValue = 'Informe um passaporte válido (mínimo 5 caracteres).';
      }
    }

    if (groupType === 'grupo' && (groupSize <= 1 || isNaN(groupSize))) {
      tempErrors.groupSize = 'Para agendamentos de grupo, informe acima de 1 participante.';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      const isValid = validateStep1();
      if (isValid) {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      if (!selectedDate || !selectedTime) {
        setErrors({ schedule: 'Por favor, selecione uma data no calendário e um horário válido.' });
      } else {
        setErrors({});
        setCurrentStep(3);
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Submit and compile dynamic booking object
  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!safetyRulesAccepted || !clothingRulesAccepted) {
      alert('Para prosseguir, você deve ler e assinalar as duas declarações de aceite obrigatório de segurança.');
      return;
    }

    // Generate unique WS protocol
    const protocolCode = generateProtocol();

    // Determine status (groups larger than 10 go to manual reviews)
    const isApprovalRequired = groupType === 'grupo' && groupSize > 10;
    const finalStatus = isApprovalRequired ? 'pendente_aprovacao' : 'confirmado';

    const newBooking: Booking = {
      id: protocolCode,
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      whatsapp,
      documentType,
      documentValue,
      profile,
      institutionOrCompany: institution.trim() || undefined,
      groupType,
      groupSize: groupType === 'individual' ? 1 : Number(groupSize),
      notes: notes.trim() || undefined,
      date: selectedDate,
      timeSlot: selectedTime,
      safetyAccepted: true,
      status: finalStatus,
      createdAt: new Date().toISOString()
    };

    const updatedBookings = [...bookings, newBooking];
    saveBookingsToLocalStorage(updatedBookings);
    setLastSubmittedBooking(newBooking);
  };

  // Handle active cancellations
  const handleCancelBooking = (protocol: string) => {
    const freshList = bookings.filter(b => b.id !== protocol);
    saveBookingsToLocalStorage(freshList);
    alert(`Agendamento de protocolo ${protocol} cancelado com sucesso.`);
    
    if (lastSubmittedBooking?.id === protocol) {
      setLastSubmittedBooking(null);
      handleResetForm();
    }
  };

  // Reset entire form to defaults
  const handleResetForm = () => {
    setFullName('');
    setEmail('');
    setWhatsapp('');
    setDocumentValue('');
    setInstitution('');
    setGroupType('individual');
    setGroupSize(1);
    setNotes('');
    setSelectedDate('');
    setSelectedTime('');
    setSafetyRulesAccepted(false);
    setClothingRulesAccepted(false);
    setErrors({});
    setLastSubmittedBooking(null);
    setCurrentStep(1);
  };

  // Document formatting triggers
  const handleCPFChange = (val: string) => {
    const formatted = formatCPF(val);
    setDocumentValue(formatted);
  };

  const handleWAChange = (val: string) => {
    const formatted = formatWhatsApp(val);
    setWhatsapp(formatted);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-800 flex flex-col selection:bg-[#1E90FF]/20">
      
      {/* Industrial Maritime Header Banner */}
      <header id="main-header" className="bg-[#0A2647] border-b-2 border-[#1E90FF] py-5 px-6 shadow-md text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Logo brand */}
          <div className="flex items-center">
            <WilsonSonsFullLogo colorTheme="white" size="md" />
          </div>

          {/* Navigation Controls */}
          <div className="flex bg-slate-900/60 p-1 border border-slate-700/30 rounded-xl relative">
            <button
              onClick={() => {
                setActiveTab('agendar');
                setLastSubmittedBooking(null);
              }}
              className={`flex items-center gap-2 py-2 px-4 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'agendar' && !lastSubmittedBooking
                  ? 'bg-[#1E90FF] text-white shadow-md' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Agendar Visita
            </button>
            <button
              onClick={() => setActiveTab('consultar')}
              className={`flex items-center gap-2 py-2 px-4 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'consultar' || lastSubmittedBooking
                  ? 'bg-slate-800 text-white' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              Consultar Protocolos
            </button>
          </div>

        </div>
      </header>

      {/* Primary Application Layout container with responsive bounds */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 md:px-6 relative">
        
        {/* If booking was just submitted successfully, override regular tabs and exhibit the receipt instantly */}
        {lastSubmittedBooking ? (
          <div className="animate-fade-in space-y-6">
            <div className="p-4 bg-emerald-550/10 border border-emerald-500/25 text-emerald-800 rounded-2xl flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <p className="text-sm">
                Seu agendamento foi processado e gerou o número de protocolo abaixo. Guarde-o para futuras consultas!
              </p>
            </div>
            
            <BookingConfirmation 
              booking={lastSubmittedBooking} 
              onReset={handleResetForm}
              onCancelBooking={handleCancelBooking}
            />
          </div>
        ) : activeTab === 'consultar' ? (
          // Search Engine Layout
          <div className="animate-fade-in">
            <ConsultaAgendamento 
              bookings={bookings} 
              onCancelBooking={handleCancelBooking}
            />
          </div>
        ) : (
          // Primary scheduler workflow funnel
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column (Main Panel) */}
            <div className="lg:col-span-8 bg-white border border-slate-150 rounded-3xl shadow-xs py-7 px-6 md:p-8 space-y-7">
              
              {/* Funnel title and dynamic progress indicator tracker */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-xs font-mono font-semibold tracking-wider text-[#1E90FF] uppercase">
                      Portal de Acesso ao Estaleiro
                    </span>
                    <h2 className="text-2xl md:text-3xl font-display font-bold text-[#0A2647] tracking-tight">
                      Agendamento de Visitas
                    </h2>
                  </div>
                  <div className="text-xs text-slate-400 font-medium">
                    Etapa <strong className="text-[#0A2647]">{currentStep}</strong> de 3
                  </div>
                </div>

                {/* Progress bar pipeline */}
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between text-xs text-slate-500 font-semibold uppercase font-display">
                    <span className={currentStep >= 1 ? 'text-[#0A2647] font-bold' : ''}>1. Cadastro</span>
                    <span className={currentStep >= 2 ? 'text-[#0A2647] font-bold' : ''}>2. Calendário e Horário</span>
                    <span className={currentStep >= 3 ? 'text-[#0A2647] font-bold' : ''}>3. Segurança e Envio</span>
                  </div>
                  
                  <div className="overflow-hidden h-2.5 text-xs flex rounded-full bg-slate-100 border border-slate-200">
                    <div 
                      style={{ width: `${(currentStep / 3) * 100}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-[#031d3d] to-[#1E90FF] transition-all duration-300"
                    ></div>
                  </div>
                </div>
              </div>

              {/* Step 1 Form fields: Visitor Identifications */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-fade-in">
                  
                  <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl flex gap-3 text-slate-600">
                    <Info className="w-5 h-5 text-[#1E90FF] shrink-0 mt-0.5" />
                    <p className="text-xs leading-relaxed font-sans">
                      Preencha os dados do visitante líder ou coordenador do grupo. Todas as comunicações automáticas de confirmação, avisos de maré e links de cancelamento serão enviados para os contatos declarados abaixo.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    
                    {/* Full Name input */}
                    <div className="space-y-1.5Col">
                      <label className="text-xs font-bold text-[#0A2647] uppercase tracking-wider block">
                        Nome Completo do Líder <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-450 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          id="fullName"
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => {
                            setFullName(e.target.value);
                            if (errors.fullName) setErrors(prev => ({ ...prev, fullName: '' }));
                          }}
                          placeholder="Digite seu nome completo"
                          className={`w-full text-sm py-2.5 pl-10 pr-4 border rounded-xl bg-slate-50/40 focus:bg-white transition-all focus:ring-1 focus:ring-[#1E90FF]/30 focus:outline-hidden ${
                            errors.fullName ? 'border-rose-455 focus:border-rose-500 bg-rose-50/10' : 'border-slate-200 focus:border-[#1E90FF]'
                          }`}
                        />
                      </div>
                      {errors.fullName && (
                        <span className="text-[11px] text-rose-500 font-semibold">{errors.fullName}</span>
                      )}
                    </div>

                    {/* Email input */}
                    <div className="space-y-1.5Col">
                      <label className="text-xs font-bold text-[#0A2647] uppercase tracking-wider block">
                        E-mail para Confirmação <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <AtSign className="w-4 h-4 text-slate-450 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          id="email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                          }}
                          placeholder="nome@exemplo.com"
                          className={`w-full text-sm py-2.5 pl-10 pr-4 border rounded-xl bg-slate-50/40 focus:bg-white transition-all focus:ring-1 focus:ring-[#1E90FF]/30 focus:outline-hidden ${
                            errors.email ? 'border-rose-455 focus:border-rose-500 bg-rose-50/10' : 'border-slate-200 focus:border-[#1E90FF]'
                          }`}
                        />
                      </div>
                      {errors.email && (
                        <span className="text-[11px] text-rose-500 font-semibold">{errors.email}</span>
                      )}
                    </div>

                    {/* WhatsApp with automatic mask formatting */}
                    <div className="space-y-1.5Col">
                      <label className="text-xs font-bold text-[#0A2647] uppercase tracking-wider block">
                        WhatsApp (com DDD) <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-455 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          id="whatsapp"
                          type="text"
                          required
                          value={whatsapp}
                          onChange={(e) => {
                            handleWAChange(e.target.value);
                            if (errors.whatsapp) setErrors(prev => ({ ...prev, whatsapp: '' }));
                          }}
                          placeholder="(21) 99999-9999"
                          className={`w-full text-sm py-2.5 pl-10 pr-4 border rounded-xl bg-slate-50/40 focus:bg-white transition-all focus:ring-1 focus:ring-[#1E90FF]/30 focus:outline-hidden ${
                            errors.whatsapp ? 'border-rose-455 focus:border-rose-500 bg-rose-50/10' : 'border-slate-200 focus:border-[#1E90FF]'
                          }`}
                        />
                      </div>
                      {errors.whatsapp && (
                        <span className="text-[11px] text-rose-500 font-semibold">{errors.whatsapp}</span>
                      )}
                    </div>

                    {/* Document Selector with validation */}
                    <div className="space-y-1.5Col">
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-bold text-[#0A2647] uppercase tracking-wider block">
                          Documento de Identificação <span className="text-rose-500">*</span>
                        </label>
                        <div className="flex gap-2 text-xs">
                          <label className="inline-flex items-center gap-1 cursor-pointer">
                            <input
                              type="radio"
                              name="docType"
                              checked={documentType === 'CPF'}
                              onChange={() => {
                                setDocumentType('CPF');
                                setDocumentValue('');
                                setErrors(prev => ({ ...prev, documentValue: '' }));
                              }}
                              className="w-3.5 h-3.5 text-[#1E90FF]"
                            />
                            <span>CPF</span>
                          </label>
                          <label className="inline-flex items-center gap-1 cursor-pointer">
                            <input
                              type="radio"
                              name="docType"
                              checked={documentType === 'Passaporte'}
                              onChange={() => {
                                setDocumentType('Passaporte');
                                setDocumentValue('');
                                setErrors(prev => ({ ...prev, documentValue: '' }));
                              }}
                              className="w-3.5 h-3.5 text-[#1E90FF]"
                            />
                            <span>Passaporte</span>
                          </label>
                        </div>
                      </div>

                      <div className="relative">
                        <FileText className="w-4 h-4 text-slate-455 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          id="documentValue"
                          type="text"
                          required
                          value={documentValue}
                          onChange={(e) => {
                            if (documentType === 'CPF') {
                              handleCPFChange(e.target.value);
                            } else {
                              setDocumentValue(e.target.value);
                            }
                            if (errors.documentValue) setErrors(prev => ({ ...prev, documentValue: '' }));
                          }}
                          placeholder={documentType === 'CPF' ? '999.999.999-99' : 'Número do Passaporte'}
                          className={`w-full text-sm py-2.5 pl-10 pr-4 border rounded-xl bg-slate-50/40 focus:bg-white transition-all focus:ring-1 focus:ring-[#1E90FF]/30 focus:outline-hidden ${
                            errors.documentValue ? 'border-rose-455 focus:border-rose-500 bg-rose-50/10' : 'border-slate-200 focus:border-[#1E90FF]'
                          }`}
                        />
                      </div>
                      {errors.documentValue && (
                        <span className="text-[11px] text-rose-500 font-semibold">{errors.documentValue}</span>
                      )}
                    </div>

                    {/* Visitor Profile select */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#0A2647] uppercase tracking-wider block">
                        Perfil do Visitante <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Briefcase className="w-4 h-4 text-slate-450 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <select
                          id="profile"
                          value={profile}
                          onChange={(e) => {
                            const selectedProf = e.target.value as VisitorProfile;
                            setProfile(selectedProf);
                            // Auto populate institution hint if applicable
                          }}
                          className="w-full text-sm py-2.5 pl-10 pr-4 border border-slate-200 rounded-xl bg-slate-50/40 focus:bg-white transition-all focus:ring-1 focus:ring-[#1E90FF]/30 focus:outline-hidden appearance-none"
                        >
                          <option value="Estudante">Estudante</option>
                          <option value="Profissional naval">Profissional naval</option>
                          <option value="Pesquisador">Pesquisador</option>
                          <option value="Público geral">Público geral</option>
                          <option value="Imprensa">Imprensa</option>
                          <option value="Parceiro comercial">Parceiro comercial</option>
                        </select>
                        <ChevronRight className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 rotate-95" />
                      </div>
                    </div>

                    {/* Institution or Company (Opcional, with dynamic labeling) */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#0A2647] uppercase tracking-wider block">
                        Empresa / Instituição <span className="text-slate-400 font-light">(Opcional)</span>
                      </label>
                      <div className="relative">
                        <Anchor className="w-4 h-4 text-slate-450 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          id="institution"
                          type="text"
                          value={institution}
                          onChange={(e) => setInstitution(e.target.value)}
                          placeholder={
                            profile === 'Estudante' ? 'Ex: Escola Técnica, Faculdade UFRJ' :
                            profile === 'Profissional naval' || profile === 'Parceiro comercial' ? 'Ex: Logística S/A, Estaleiro' :
                            'Nome do órgão ou empresa'
                          }
                          className="w-full text-sm py-2.5 pl-10 pr-4 border border-slate-200 rounded-xl bg-slate-50/40 focus:bg-white transition-all focus:ring-1 focus:ring-[#1E90FF]/30 focus:outline-hidden"
                        />
                      </div>
                    </div>

                  </div>

                  <div className="border-t border-slate-100 pt-5 space-y-4">
                    {/* Visitor count section */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <label className="text-xs font-bold text-[#0A2647] uppercase tracking-wider block">
                          Formato da Visita <span className="text-rose-500">*</span>
                        </label>
                        <p className="text-[11px] text-slate-400 font-light">Selecione se virá sozinho ou guiando um grupo de estudos/parceiros.</p>
                      </div>

                      <div className="flex bg-slate-100 p-1 rounded-xl">
                        <button
                          type="button"
                          onClick={() => {
                            setGroupType('individual');
                            setGroupSize(1);
                            if (errors.groupSize) setErrors(prev => ({ ...prev, groupSize: '' }));
                          }}
                          className={`flex items-center gap-1.5 py-1.5 px-4 text-xs font-semibold rounded-lg transition-all ${
                            groupType === 'individual' 
                              ? 'bg-[#0A2647] text-white shadow-xs' 
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          <User className="w-3.5 h-3.5" />
                          Individual
                        </button>
                        <button
                          type="button"
                          onClick={() => setGroupType('grupo')}
                          className={`flex items-center gap-1.5 py-1.5 px-4 text-xs font-semibold rounded-lg transition-all ${
                            groupType === 'grupo' 
                              ? 'bg-[#1E90FF] text-white shadow-xs' 
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          <Users className="w-3.5 h-3.5" />
                          Em Grupo
                        </button>
                      </div>
                    </div>

                    {/* Numeric group input loaded when "grupo is chosen" */}
                    {groupType === 'grupo' && (
                      <div className="bg-slate-50/80 border border-slate-150 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
                        <div className="space-y-1 select-none">
                          <span className="text-xs font-bold text-slate-700 block uppercase tracking-wide">
                            Quantidade de Componentes do Grupo
                          </span>
                          <span className="text-[11px] text-slate-400 block leading-snug">
                            Contando com você. Grupos com <strong className="text-amber-600 font-semibold">mais de 10 pessoas</strong> necessitam de uma autorização prévia de doca.
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <input
                            id="groupSize"
                            type="number"
                            min="2"
                            value={groupSize}
                            onChange={(e) => {
                              const v = parseInt(e.target.value);
                              setGroupSize(v >= 2 ? v : 2);
                              if (errors.groupSize) setErrors(prev => ({ ...prev, groupSize: '' }));
                            }}
                            className={`w-24 text-center text-sm py-2 px-3 border rounded-xl bg-white focus:outline-hidden ${
                              errors.groupSize ? 'border-rose-500 focus:ring-rose-200' : 'border-slate-250 focus:ring-sky-200'
                            }`}
                          />
                          
                          {groupSize > 10 && (
                            <span className="inline-flex items-center gap-1 text-[10px] uppercase font-mono font-bold px-2 py-1 rounded-md bg-amber-100 text-amber-800 border border-amber-200">
                              Revisão Especial
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Free form Notes */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#0A2647] uppercase tracking-wider block">
                      Observações ou Necessidades Especiais <span className="text-slate-400 font-light">(Opcional)</span>
                    </label>
                    <textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Espaço livre para declarar necessidades de acessibilidade, finalidades da pesquisa, ou detalhes extras do agendamento."
                      rows={3}
                      className="w-full text-sm py-2.5 px-4 border border-slate-200 rounded-xl bg-slate-50/40 focus:bg-white focus:outline-hidden transition-all focus:ring-1 focus:ring-[#1E90FF]/30"
                    />
                  </div>

                </div>
              )}

              {/* Step 2 Form fields: Calendar & Timetable select */}
              {currentStep === 2 && (
                <div className="space-y-5 animate-fade-in">
                  
                  <div className="border bg-sky-50/45 border-sky-100 p-4 rounded-2xl flex gap-3 text-slate-700">
                    <Calendar className="w-5 h-5 text-[#1E90FF] shrink-0 mt-0.5" />
                    <div className="text-xs space-y-1 leading-relaxed">
                      <p className="font-semibold text-slate-800">Selecione o Dia e o Horário de sua preferência:</p>
                      <p className="font-light text-slate-600">Não abrimos aos fins de semana. O horário escolhido é rígido e a equipe de escolta o aguardará na guarita principal de recebimento científico.</p>
                    </div>
                  </div>

                  <CalendarElement 
                    selectedDate={selectedDate}
                    selectedTime={selectedTime}
                    onSelectDate={setSelectedDate}
                    onSelectTime={setSelectedTime}
                    bookings={bookings}
                    groupSize={groupType === 'individual' ? 1 : groupSize}
                  />

                  {errors.schedule && (
                    <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-xs font-semibold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                      {errors.schedule}
                    </div>
                  )}

                </div>
              )}

              {/* Step 3 Form fields: Rules declarations & Disclaimers */}
              {currentStep === 3 && (
                <div className="space-y-5 animate-fade-in">
                  
                  <div className="bg-[#0a2647]/5 border border-slate-150 p-4 rounded-2xl flex gap-3 text-slate-700">
                    <ShieldCheck className="w-5 h-5 text-[#0A2647] shrink-0 mt-0.5" />
                    <div className="text-xs leading-relaxed space-y-1">
                      <p className="font-semibold text-[#0A2647]">Verificação Final das Normas de Doca Seca</p>
                      <p className="font-light text-slate-500">Como o estaleiro da Wilson Sons é um ambiente industrial pesado de alto risco, todos os visitantes precisam concordar expressamente com os protocolos físicos de EPI e vestimenta prévia antes de enviar.</p>
                    </div>
                  </div>

                  <SafetyRegulations 
                    safetyRulesAccepted={safetyRulesAccepted}
                    onToggleSafetyAccepted={setSafetyRulesAccepted}
                    clothingRulesAccepted={clothingRulesAccepted}
                    onToggleClothingAccepted={setClothingRulesAccepted}
                  />

                </div>
              )}

              {/* Funnel Navigation Footer Controls */}
              <div className="border-t border-slate-100 pt-5 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  disabled={currentStep === 1}
                  className={`py-2.5 px-5 rounded-xl text-xs font-semibold border flex items-center gap-1 transition-all ${
                    currentStep === 1 
                      ? 'border-slate-50 text-slate-300 bg-slate-50 cursor-not-allowed' 
                      : 'border-slate-200 text-[#0A2647] hover:bg-slate-50 active:scale-95 cursor-pointer'
                  }`}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Voltar
                </button>

                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="py-2.5 px-6 bg-[#0A2647] hover:bg-[#1E90FF] text-white text-xs font-semibold rounded-xl transition-all shadow-xs active:scale-95 cursor-pointer flex items-center gap-1"
                  >
                    Próximo Passo
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmitBooking}
                    disabled={!safetyRulesAccepted || !clothingRulesAccepted}
                    className={`py-3 px-8 text-xs font-bold rounded-xl transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-2 ${
                      safetyRulesAccepted && clothingRulesAccepted
                        ? 'bg-[#1E90FF] hover:bg-[#0A2647] text-white'
                        : 'bg-slate-150 border border-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Confirmar e Agendar Visita
                  </button>
                )}
              </div>

            </div>

            {/* Right Column (Sidebar Summary Info Panel) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Active Selection Sidebar Card */}
              <div className="bg-[#0A2647] text-white border border-[#0A2647] rounded-3xl p-6 shadow-md relative overflow-hidden">
                <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
                  <Anchor className="w-44 h-44 -mr-10 -mb-10 text-white" />
                </div>

                <h4 className="font-display font-bold text-[#1E90FF] text-xs uppercase tracking-widest border-b border-white/10 pb-3 mb-4">
                  Sua Informação de Reservas
                </h4>

                <div className="space-y-4">
                  
                  {/* Visitor summary */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-slate-300/85 uppercase font-mono tracking-widest block font-light">Líder</span>
                    <p className="text-sm font-semibold truncate">
                      {fullName.trim() || <span className="text-slate-400 font-normal italic">Não informado</span>}
                    </p>
                    {groupType === 'grupo' && groupSize > 1 && (
                      <span className="inline-flex items-center gap-1 text-[10px] py-0.5 px-1.5 rounded bg-white/10 border border-white/20 font-semibold font-mono">
                        Grupo de {groupSize} pessoas
                      </span>
                    )}
                  </div>

                  {/* Profile badge details */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-300/85 uppercase font-mono tracking-widest block font-light">Tipo de Perfil</span>
                    <span className="inline-block text-xs bg-[#1E90FF]/20 border border-[#1E90FF]/30 py-0.5 px-2 rounded-lg font-medium text-sky-200">
                      {profile}
                    </span>
                  </div>

                  {/* Date selection block */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-300/85 uppercase font-mono tracking-widest block font-light">Data Escolhida</span>
                    <p className="text-sm font-semibold flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-[#1E90FF]" />
                      {selectedDate ? selectedDate.split('-').reverse().join('/') : <span className="text-slate-400 font-normal italic">Escolha na etapa 2</span>}
                    </p>
                  </div>

                  {/* Hour slot selection block */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-300/85 uppercase font-mono tracking-widest block font-light">Horário de Entrada</span>
                    <p className="text-sm font-semibold flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-[#1E90FF]" />
                      {selectedTime ? `${selectedTime} h` : <span className="text-slate-400 font-normal italic">Escolha na etapa 2</span>}
                    </p>
                  </div>

                  {/* Escort Port location label */}
                  <div className="space-y-1 pt-2 border-t border-white/10">
                    <span className="text-[10px] text-slate-350 uppercase font-mono tracking-widest block font-light">Estaleiro Destino</span>
                    <p className="text-xs text-sky-100 font-medium leading-relaxed">
                      Porto de Niterói / Ponta d'Areia
                    </p>
                    <span className="text-[10px] text-slate-400 block font-light leading-snug">Rua Dr. Paulo Frumêncio, 28 - RJ</span>
                  </div>

                </div>
              </div>

              {/* Informative Help Card */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-[#0A2647] border-b border-slate-100 pb-2">
                  <HelpCircle className="w-4.5 h-4.5 text-[#1E90FF] shrink-0" />
                  <h5 className="font-display font-bold text-sm uppercase tracking-wide">
                    Dúvidas Frequentes
                  </h5>
                </div>

                <div className="space-y-3.5 text-xs text-slate-600 leading-normal">
                  <div className="space-y-1">
                    <p className="font-bold text-slate-800">Como reagendar ou cancelar?</p>
                    <p className="font-light">Ao finalizar, você receberá um protocolo único. Vá à guia "Consultar Protocolos" ou clique no link do seu e-mail simulado para excluir o horário e liberar para outros.</p>
                  </div>

                  <div className="space-y-1">
                    <p className="font-bold text-slate-800">Menores de idade podem participar?</p>
                    <p className="font-light">Apenas acompanhados por responsáveis ou professores guias acadêmicos cadastrados no protocolo.</p>
                  </div>

                  <div className="space-y-1">
                    <p className="font-bold text-slate-800">Fotografia é permitida?</p>
                    <p className="font-light">Sim, apenas em rotas seguras demarcadas. É absolutamente vedado fotografar projetos de Defesa Nacional ou navios militares ancorados sem autorização escrita.</p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

      </main>

      {/* Corporate footer details */}
      <footer id="main-footer" className="bg-[#0A2647] border-t border-slate-800 text-slate-400 py-6 px-6 mt-12 text-center text-xs">
        <p className="leading-relaxed">
          © 2026 Wilson Sons S.A. Todos os direitos reservados. 
          <span className="block sm:inline sm:ml-2">Atendimento Portuário Industrial e Logística em Cadeia de Suprimentos.</span>
        </p>
        <p className="text-[10px] text-slate-500 font-mono mt-1">
          Portaria Estaleiro Niterói - Segurança do Trabalho e Gerenciamento Ambiental integrado.
        </p>
      </footer>

    </div>
  );
}
