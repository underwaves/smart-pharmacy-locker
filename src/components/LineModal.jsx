import React from 'react';
import { X, Send, CheckCheck, Smartphone, Bell, HeartHandshake } from 'lucide-react';

export default function LineModal({ isOpen, onClose, prescription }) {
  if (!isOpen || !prescription) return null;

  const now = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white border border-[#EAF6FF] rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* LINE Header Bar */}
        <div className="bg-[#06C755] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
              🏥
            </div>
            <div>
              <div className="font-bold text-base leading-tight">รพ. ศูนย์สุขภาพปวงชน (LINE OA)</div>
              <div className="text-[11px] text-emerald-100 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span> บัญชีทางการ
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-black/10 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* LINE Chat Screen Area */}
        <div className="bg-[#8C9DAE] p-4 max-h-[70vh] overflow-y-auto space-y-3 font-sans">
          <div className="text-center text-[11px] text-slate-600 bg-slate-300/60 rounded-full py-0.5 px-3 w-fit mx-auto">
            วันนี้ {now} น.
          </div>

          {/* Incoming Message Bubble */}
          <div className="flex items-start gap-2 max-w-[92%]">
            <div className="w-8 h-8 rounded-full bg-[#06C755] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-1 shadow">
              RX
            </div>
            
            <div className="bg-white text-slate-800 rounded-2xl rounded-tl-none p-4 shadow-md text-sm">
              <div className="flex items-center gap-1.5 text-emerald-700 font-bold border-b pb-2 mb-2">
                <CheckCheck className="w-4 h-4 text-emerald-600" />
                แจ้งเตือน: รับยาเรียบร้อยแล้ว
              </div>

              <p className="text-xs text-slate-600 mb-1">
                เรียน <span className="font-bold text-slate-800">{prescription.patient.caregiverName}</span>
              </p>
              <p className="text-xs text-slate-700 leading-relaxed mb-3">
                ขณะนี้ <span className="font-bold text-emerald-700">{prescription.patient.name}</span> ได้ทำการเปิดตู้ล็อกเกอร์ช่องที่ {prescription.lockerId} เพื่อรับยากลับบ้านเรียบร้อยแล้วค่ะ
              </p>

              {/* Medication Summary Table for relative */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-2">
                <div className="font-bold text-slate-800 text-[13px] flex items-center gap-1 text-slate-900">
                  📋 สรุปรายการยาที่ต้องดูแล ({prescription.medicines.length} รายการ):
                </div>
                {prescription.medicines.map((m, idx) => (
                  <div key={idx} className="border-t border-slate-200 pt-1.5">
                    <div className="font-semibold text-slate-900">{idx + 1}. {m.name}</div>
                    <div className="text-emerald-700 font-medium">👉 {m.timing.mealRelation}</div>
                  </div>
                ))}
              </div>

              <div className="mt-3 text-[11px] text-slate-500 bg-amber-50 border border-amber-200 rounded-lg p-2 flex items-start gap-1">
                <HeartHandshake className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>ระบบจะคอยแจ้งเตือนเวลาทานยาของคุณตาคุณยายผ่าน LINE อัตโนมัติค่ะ</span>
              </div>

              <div className="text-[10px] text-slate-400 text-right mt-2 flex items-center justify-end gap-1">
                <span>{now} น.</span>
                <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Action */}
        <div className="bg-[#F6FBFF] border-t border-[#EAF6FF] p-4 flex items-center justify-between">
          <div className="text-xs text-[#627D98] flex items-center gap-1.5 font-medium">
            <Smartphone className="w-4 h-4 text-[#4A9FE8]" />
            ส่งไปยังเบอร์ {prescription.patient.caregiverPhone}
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#4A9FE8] hover:bg-[#3b8fd7] text-white font-bold text-sm transition-colors cursor-pointer"
          >
            เข้าใจแล้ว / ปิดหน้าต่าง
          </button>
        </div>

      </div>
    </div>
  );
}
