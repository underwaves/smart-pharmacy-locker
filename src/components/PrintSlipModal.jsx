import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Printer, Sparkles } from 'lucide-react';

// Helper to get time icon
const getTimingIcon = (timing) => {
  if (timing.morning) return <span className="text-lg">🌅</span>;
  if (timing.noon) return <span className="text-lg">☀️</span>;
  if (timing.evening) return <span className="text-lg">☕</span>;
  if (timing.beforeBed) return <span className="text-lg">🌙</span>;
  return <span className="text-lg">💊</span>;
};

// Reusable exact 80x150mm Thermal Slip Content
function ThermalSlipContent({ prescription }) {
  return (
    <div 
      id="printable-thermal-slip"
      className="w-[76mm] sm:w-[80mm] min-h-[145mm] bg-white text-slate-950 p-3.5 border-2 border-slate-900 font-['Noto_Sans_Thai_Looped',sans-serif] text-xs flex flex-col justify-between box-border rounded-xs mx-auto"
      style={{ boxSizing: 'border-box' }}
    >
      {/* 1. Header Box */}
      <div className="text-center pb-2.5 border-b-2 border-slate-900 space-y-1">
        <div className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center justify-center gap-1">
          <span>💊</span> ใบจ่ายยา
        </div>
        <div className="text-sm font-bold text-slate-900">
          {prescription.patient.name}
        </div>
        <div className="text-[11px] text-slate-600 flex items-center justify-center gap-2">
          <span>วันที่ {prescription.createdAt}</span>
          <span>•</span>
          <span className="font-bold text-slate-900">ตู้ช่องที่ {prescription.lockerId}</span>
        </div>
      </div>

      {/* 2. Medicine Items (Divided exactly like 80mm receipt) */}
      <div className="divide-y-2 divide-slate-900 flex-1 my-1">
        {prescription.medicines.map((med, idx) => (
          <div key={idx} className="py-2.5 text-center space-y-1">
            {/* Medicine Name / Category */}
            <div className="font-black text-sm text-slate-900 flex items-center justify-center gap-1 leading-tight">
              <span>💊</span> {med.category || med.name}
            </div>
            
            <div className="text-[11px] text-slate-700 font-medium">
              {med.name} ({med.brandName})
            </div>

            {/* Meal Timing in Big Clear Text */}
            <div className="text-sm sm:text-base font-black text-slate-950 bg-slate-100 py-1 px-2 rounded border border-slate-300 flex items-center justify-center gap-1.5">
              {getTimingIcon(med.timing)}
              <span>{med.timing.summaryTime || med.timing.mealRelation}</span>
            </div>

            {/* Dosage Quantity */}
            <div className="text-xs sm:text-sm font-black text-slate-900 pt-0.5">
              👉 กินครั้งละ 1 เม็ด
            </div>

            {med.badgeText && (
              <div className="text-[10px] text-slate-600 italic">
                * {med.badgeText}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 3. Footer Box: Voice Guidance & Emergency */}
      <div className="pt-2.5 border-t-2 border-slate-900 text-center space-y-1">
        <div className="font-black text-xs text-slate-900 flex items-center justify-center gap-1">
          <span>🔊</span> ต้องการฟังวิธีใช้ยา
        </div>
        <div className="text-[11px] font-bold text-slate-800 bg-slate-100 py-1 rounded border border-slate-300">
          👉 กดปุ่มที่หน้าตู้ได้ตลอดเวลา
        </div>
        <div className="text-[10px] text-slate-500 pt-0.5">
          ฉุกเฉินโทร: 02-999-8888 ต่อ 101 (24 ชม.)
        </div>
      </div>
    </div>
  );
}

export default function PrintSlipModal({ isOpen, onClose, prescription, autoPrint = true }) {
  if (!isOpen || !prescription) return null;

  useEffect(() => {
    if (isOpen && autoPrint) {
      const timer = setTimeout(() => {
        window.print();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoPrint]);

  const handleManualPrint = () => {
    window.print();
  };

  const printPortalNode = typeof document !== 'undefined' 
    ? (document.getElementById('print-root') || document.body) 
    : null;

  return (
    <>
      {/* 1. On-Screen Modal Dialog (STRICTLY HIDDEN IN PRINT) */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs print:hidden">
        <div className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 border border-[#BEE3F8]">
          
          {/* Modal Top Header */}
          <div className="bg-[#4A9FE8] text-white px-5 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-base">
              <Printer className="w-5 h-5 text-white" />
              <span>สลิปใบจ่ายยา (ขนาด 80 × 150 มม.)</span>
            </div>
            <button 
              onClick={onClose} 
              className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Notice Bar */}
          <div className="bg-[#EAF6FF] px-5 py-2 border-b border-[#BEE3F8] flex items-center justify-between text-xs text-[#183B56]">
            <span className="flex items-center gap-1.5 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#4A9FE8]" />
              กระดาษความร้อน Thermal: กว้าง 80 มม. × ยาว 150 มม.
            </span>
            <span className="text-emerald-700 font-bold bg-[#DDF4E7] px-2 py-0.5 rounded">1 แผ่นพอดี</span>
          </div>

          {/* Thermal Slip Simulation Preview */}
          <div className="p-4 sm:p-6 max-h-[72vh] overflow-y-auto bg-slate-100 flex justify-center">
            <div className="shadow-xl">
              <ThermalSlipContent prescription={prescription} />
            </div>
          </div>

          {/* Modal Actions */}
          <div className="bg-white border-t border-slate-200 p-4 flex items-center justify-between">
            <div className="text-xs text-slate-600 font-medium">
              📐 ขนาดจริง: <strong className="text-slate-900">80 × 150 mm</strong> (ตัดอัตโนมัติ 1 แผ่น)
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs cursor-pointer"
              >
                ปิดหน้าต่าง
              </button>
              <button
                onClick={handleManualPrint}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#4A9FE8] hover:bg-[#3b8fd7] text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                สั่งพิมพ์ซ้ำ
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Isolated Print Portal (Rendered outside #root so ONLY this prints 1 sheet) */}
      {printPortalNode && createPortal(
        <div className="print-only-container">
          <ThermalSlipContent prescription={prescription} />
        </div>,
        printPortalNode
      )}
    </>
  );
}
