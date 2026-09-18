import React, { useState } from 'react';
import { ShieldCheck, KeyRound, Lock, UserCheck, X, AlertCircle, Sparkles, CreditCard } from 'lucide-react';
import { MOCK_HOSPITAL_STAFF } from '../data/mockData.js';

export default function StaffLoginModal({ isOpen, onClose, onLoginSuccess, targetModeName }) {
  const [selectedStaff, setSelectedStaff] = useState(MOCK_HOSPITAL_STAFF[0]);
  const [pinInput, setPinInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleVerify = (pinToTest) => {
    setErrorMessage('');
    if (!selectedStaff) {
      setErrorMessage('กรุณาเลือกเจ้าหน้าที่');
      return;
    }

    if (pinToTest === selectedStaff.pin) {
      onLoginSuccess(selectedStaff);
      setPinInput('');
    } else {
      setErrorMessage(`รหัส PIN ไม่ถูกต้องสำหรับ ${selectedStaff.name} (รหัสทดสอบ: ${selectedStaff.pin})`);
    }
  };

  const handleNumpad = (digit) => {
    if (pinInput.length < 4) {
      const next = pinInput + digit;
      setPinInput(next);
      if (next.length === 4) {
        handleVerify(next);
      }
    }
  };

  const handleQuickBadgeTap = (staff) => {
    setSelectedStaff(staff);
    onLoginSuccess(staff);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 font-['Noto_Sans_Thai_Looped',sans-serif]">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border-2 border-slate-200 space-y-6 relative overflow-hidden">
        
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 via-emerald-600 to-teal-600" />

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center text-2xl shadow-sm">
              <Lock className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-blue-600 uppercase tracking-wider">
                STAFF ACCESS CONTROL & AUDIT TRAIL
              </div>
              <h3 className="text-xl font-black text-slate-900">
                เข้าสู่ระบบสำหรับเจ้าหน้าที่
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {targetModeName ? `เพื่อเข้าถึง "${targetModeName}"` : 'กรุณายืนยันตัวตนก่อนเข้าจัดการระบบหลังบ้าน'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Audit Trail Disclaimer Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
          <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="font-bold">ระบบบันทึกความรับผิดชอบ (Audit Trail):</strong> ทุกการจัดยาและตรวจสอบจะบันทึกชื่อ รหัสวิชาชีพ และเวลาแสตมป์ของท่าน หากเกิดข้อผิดพลาดด้านยาจะสามารถตรวจสอบย้อนกลับได้ 100%
          </div>
        </div>

        {/* Staff Directory Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
            <span>เลือกบัญชีผู้ปฏิบัติหน้าที่:</span>
            <span className="text-[10px] text-slate-400 font-normal">คลิกบัตรเพื่อสลับ</span>
          </label>

          <div className="grid grid-cols-2 gap-2">
            {MOCK_HOSPITAL_STAFF.map((staff) => {
              const isSelected = selectedStaff?.id === staff.id;
              return (
                <div
                  key={staff.id}
                  onClick={() => {
                    setSelectedStaff(staff);
                    setPinInput('');
                    setErrorMessage('');
                  }}
                  className={`p-3 rounded-2xl border-2 transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/70 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/40'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{staff.avatar}</span>
                    <div className="truncate">
                      <div className="font-bold text-xs text-slate-900 truncate">
                        {staff.name}
                      </div>
                      <div className="text-[10px] text-blue-700 font-medium truncate">
                        {staff.licenseNo}
                      </div>
                    </div>
                  </div>
                  <div className="mt-1.5 text-[10px] text-slate-500 truncate">
                    {staff.roleTitle}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* PIN Input Form */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-blue-600" />
              <span>ใส่รหัส PIN 4 หลักของ {selectedStaff?.name?.split(' ')[1] || 'เจ้าหน้าที่'}:</span>
            </span>
            <span className="font-mono text-xs text-slate-400">
              (PIN ทดสอบ: <strong className="text-blue-600 font-bold">{selectedStaff?.pin}</strong>)
            </span>
          </div>

          {/* PIN Dots Display */}
          <div className="flex items-center justify-center gap-3 py-2">
            {[0, 1, 2, 3].map((idx) => (
              <div
                key={idx}
                className={`w-11 h-12 rounded-2xl border-2 flex items-center justify-center text-xl font-mono font-bold transition-all ${
                  pinInput.length > idx
                    ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-xs scale-105'
                    : 'border-slate-200 bg-slate-50 text-slate-300'
                }`}
              >
                {pinInput.length > idx ? '●' : '—'}
              </div>
            ))}
          </div>

          {errorMessage && (
            <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-bold text-center flex items-center justify-center gap-1.5 animate-shake">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Quick Numpad */}
          <div className="grid grid-cols-3 gap-2 max-w-[260px] mx-auto pt-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleNumpad(num.toString())}
                className="py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-base transition-colors cursor-pointer active:scale-95"
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              onClick={() => { setPinInput(''); setErrorMessage(''); }}
              className="py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold text-xs transition-colors cursor-pointer"
            >
              ลบ
            </button>
            <button
              type="button"
              onClick={() => handleNumpad('0')}
              className="py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-base transition-colors cursor-pointer active:scale-95"
            >
              0
            </button>
            <button
              type="button"
              onClick={() => handleVerify(pinInput)}
              className="py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              ยืนยัน
            </button>
          </div>
        </div>

        {/* Demo Fast Track: One-Click Smart Badge Tap */}
        <div className="pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => handleQuickBadgeTap(selectedStaff)}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer hover:scale-[1.01]"
          >
            <CreditCard className="w-4 h-4 text-emerald-400" />
            <span>⚡ จำลองแตะบัตรประจำตัว RFID (One-Touch Demo Login)</span>
          </button>
        </div>

      </div>
    </div>
  );
}
