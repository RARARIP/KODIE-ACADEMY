/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertOctagon, 
  Check, 
  Info
} from 'lucide-react';

interface SafetyRegulationsProps {
  safetyRulesAccepted: boolean;
  onToggleSafetyAccepted: (value: boolean) => void;
  clothingRulesAccepted: boolean;
  onToggleClothingAccepted: (value: boolean) => void;
}

export default function SafetyRegulations({
  safetyRulesAccepted,
  onToggleSafetyAccepted,
  clothingRulesAccepted,
  onToggleClothingAccepted
}: SafetyRegulationsProps) {
  
  // Prohibited clothing items with short contextual taglines
  const PROHIBITED_ITEMS = [
    { title: 'Regatas ou sem mangas', desc: 'Braços desprotegidos em áreas com faíscas ou poeiras abrasivas.' },
    { title: 'Shorts, bermudas e saias', desc: 'Risco de queimaduras, escoriações ou impacto de resíduos metálicos.' },
    { title: 'Sapatos abertos', desc: 'Chinelos, sandálias ou salto alto. Apenas calçados fechados e robustos são aceitos.' },
    { title: 'Joias, relógios e anéis', desc: 'Risco gravíssimo de aprisionamento ou condutividade elétrica em máquinas.' }
  ];

  // Mandatory EPIs provided by Wilson Sons with sub-descriptions
  const MANDATORY_EPIS = [
    { title: 'Capacete de proteção', desc: 'Amortecimento de detritos aéreos e impactos estruturais leves.' },
    { title: 'Botas de segurança', desc: 'Com bico de aço e solado antiderrapante especial para docas úmidas.' },
    { title: 'Colete de alta visibilidade', desc: 'Fluorescente com fitas refletivas para identificação visual rápida.' },
    { title: 'Óculos de proteção', desc: 'Utilização mandatória próxima às frentes de soldas e jateamentos.' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Informative Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Prohibitions card */}
        <div className="bg-rose-50/45 border border-rose-100 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4 text-rose-800">
            <div className="p-1.5 bg-rose-100 rounded-lg text-rose-600">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h4 className="font-display font-bold text-lg text-[#0A2647]">
              Vestimenta PROIBIDA
            </h4>
          </div>
          
          <ul className="space-y-3.5">
            {PROHIBITED_ITEMS.map((item, index) => (
              <li key={index} className="flex gap-2.5 items-start">
                <AlertOctagon className="w-4 h-4 text-rose-500 mt-1 shrink-0" />
                <div>
                  <span className="font-semibold text-slate-800 text-sm block leading-snug">
                    {item.title}
                  </span>
                  <span className="text-[11px] text-slate-500 font-sans block leading-relaxed">
                    {item.desc}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Mandatory PPE provisions card */}
        <div className="bg-emerald-50/45 border border-emerald-100 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4 text-emerald-800">
            <div className="p-1.5 bg-emerald-100 rounded-lg text-emerald-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-display font-bold text-lg text-[#0A2647]">
              EPIs Fornecidos (Obrigatórios)
            </h4>
          </div>

          <ul className="space-y-3.5">
            {MANDATORY_EPIS.map((item, index) => (
              <li key={index} className="flex gap-2.5 items-start">
                <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mt-1 shrink-0">
                  <Check className="w-3 h-3" />
                </div>
                <div>
                  <span className="font-semibold text-slate-800 text-sm block leading-snug">
                    {item.title}
                  </span>
                  <span className="text-[11px] text-slate-500 font-sans block leading-relaxed">
                    {item.desc}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Mandatory Notification Box */}
      <div className="bg-[#0A2647] text-white rounded-2xl p-5 shadow-xs border border-[#1E90FF]/25 flex flex-col sm:flex-row gap-4 items-center">
        <div className="p-3 bg-white/10 rounded-xl text-[#1E90FF] shrink-0">
          <Info className="w-6 h-6" />
        </div>
        <div className="space-y-1 text-center sm:text-left">
          <p className="font-semibold text-sm tracking-wide text-[#1E90FF] uppercase font-mono">
            Aviso de Segurança Wilson Sons
          </p>
          <p className="text-sm font-light text-slate-200 leading-relaxed max-w-xl">
            "Os Equipamentos de Proteção Individual (Epis) serão distribuídos 
            <strong className="text-white font-medium"> gratuitamente na entrada principal </strong> 
            do estaleiro. Visitantes que descumprirem as orientações acima ou chegarem calçando sapatos abertos terão o acesso recusado."
          </p>
        </div>
      </div>

      {/* Mandatory Checkboxes accept checkboxes */}
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-150 space-y-4">
        <h5 className="font-display font-bold text-slate-800 text-sm uppercase tracking-wide">
          Confirmação de Termos e Responsabilidades
        </h5>
        
        <div className="grid grid-cols-1 gap-3">
          
          <label className="relative flex items-start gap-3 p-3.5 bg-white border border-slate-200 rounded-xl hover:border-[#1E90FF]/30 cursor-pointer transition-all select-none">
            <div className="flex items-center h-5">
              <input
                id="safety-rules-chk"
                type="checkbox"
                checked={safetyRulesAccepted}
                onChange={(e) => onToggleSafetyAccepted(e.target.checked)}
                className="w-4.5 h-4.5 text-[#1E90FF] border-slate-300 rounded-sm focus:ring-[#1E90FF]/30 cursor-pointer"
              />
            </div>
            <div className="text-sm">
              <span className="font-semibold text-slate-800">
                Declaro que li e compreendo as normas técnicas de segurança
              </span>
              <p className="text-xs text-slate-500 leading-snug mt-0.5">
                Comprometo-me a seguir as rotas de segurança estabelecidas e seguir as ordens dos inspetores de doca nas instalações navais.
              </p>
            </div>
          </label>

          <label className="relative flex items-start gap-3 p-3.5 bg-white border border-slate-200 rounded-xl hover:border-[#1E90FF]/30 cursor-pointer transition-all select-none">
            <div className="flex items-center h-5">
              <input
                id="clothing-rules-chk"
                type="checkbox"
                checked={clothingRulesAccepted}
                onChange={(e) => onToggleClothingAccepted(e.target.checked)}
                className="w-4.5 h-4.5 text-[#1E90FF] border-slate-300 rounded-sm focus:ring-[#1E90FF]/30 cursor-pointer"
              />
            </div>
            <div className="text-sm">
              <span className="font-semibold text-slate-800">
                Estou ciente das regras de vestimenta pessoal e EPIs exigidos
              </span>
              <p className="text-xs text-slate-500 leading-snug mt-0.5">
                Entendo que calçar sapatos abertos ou vestir regatas no dia da visita causa veto imediato de entrada, sem direito a reagendamento automático.
              </p>
            </div>
          </label>

        </div>
      </div>

    </div>
  );
}
