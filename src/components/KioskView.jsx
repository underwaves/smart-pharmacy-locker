import React, { useState } from 'react';
import { 
  QrCode, CreditCard, KeyRound, CheckCircle2, AlertCircle, 
  Volume2, VolumeX, Sparkles, Send, Printer, UserCheck, 
  ArrowLeft, Heart, Lock, Unlock, PhoneCall, RefreshCw,
  Bell, ShieldAlert, Search, X, Stethoscope, User
} from 'lucide-react';
import confetti from 'canvas-confetti';
import LockerGrid from './LockerGrid.jsx';
import ElderlyMedicineCard from './ElderlyMedicineCard.jsx';
import LineModal from './LineModal.jsx';
import PrintSlipModal from './PrintSlipModal.jsx';
import { voiceService } from '../services/voiceService.js';

export default function KioskView({ 
  lockers, 
  prescriptions, 
  onCollectPrescription,
  pickupSectionRef,
  activeDemoRxId 
}) {
  const [authMethod, setAuthMethod] = useState(null); // 'qr' | 'cid' | 'pin' | null
  const [pinInput, setPinInput] = useState('');
  const [activePrescription, setActivePrescription] = useState(null);
  const [isLineModalOpen, setIsLineModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isSpeakingFull, setIsSpeakingFull] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Nurse & Station Staff Assist states
  const [isNurseCallModalOpen, setIsNurseCallModalOpen] = useState(false);
  const [isStaffAssistModalOpen, setIsStaffAssistModalOpen] = useState(false);
  const [staffSearchQuery, setStaffSearchQuery] = useState('');

  // Auto-trigger demo if triggered from Hero showcase
  React.useEffect(() => {
    if (activeDemoRxId) {
      const rx = prescriptions.find(p => p.id === activeDemoRxId && p.status === 'ready_for_pickup');
      if (rx) {
        handleVerify(rx.id, 'qr');
      }
    }
  }, [activeDemoRxId]);

  // Handle identification check
  const handleVerify = (identifier, type) => {
    setErrorMessage('');
    let found = null;

    if (type === 'pin') {
      found = prescriptions.find(p => p.pin === identifier && p.status === 'ready_for_pickup');
    } else if (type === 'cid') {
      found = prescriptions.find(p => p.cid === identifier && p.status === 'ready_for_pickup');
    } else if (type === 'qr') {
      found = prescriptions.find(p => p.id === identifier && p.status === 'ready_for_pickup');
    }

    if (found) {
      setActivePrescription(found);
      
      // Fire celebratory confetti!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Automatically trigger print dialog after a brief moment (Auto-print receipt like an ATM!)
      setTimeout(() => {
        setIsPrintModalOpen(true);
      }, 700);

      // Announce with Thai voice for the elderly
      const welcomeText = `สวัสดีค่ะ${found.patient.name} ถุงซิปยาของท่านถูกจัดเตรียมไว้ที่ตู้ล็อกเกอร์ช่องที่ ${found.lockerId} ขณะนี้ประตูตู้ได้เปิดออกแล้ว และตู้กำลังพิมพ์สลิปใบจ่ายยาจากกระดาษความร้อนให้อัตโนมัติ กรุณาหยิบถุงซิปยาและดึงสลิปเอกสารได้เลยค่ะ`;
      voiceService.speak(welcomeText);

    } else {
      setErrorMessage('ไม่พบข้อมูลยาที่รอรับ หรือรหัสไม่ถูกต้อง กรุณาตรวจสอบอีกครั้งค่ะ');
      voiceService.speak('ไม่พบข้อมูลยาที่รอรับ หรือรหัสไม่ถูกต้อง กรุณาตรวจสอบอีกครั้งค่ะ');
    }
  };

  // Numpad click for PIN
  const handleNumpad = (num) => {
    if (pinInput.length < 4) {
      const next = pinInput + num;
      setPinInput(next);
      if (next.length === 4) {
        handleVerify(next, 'pin');
      }
    }
  };

  const handleNumpadClear = () => {
    setPinInput('');
    setErrorMessage('');
  };

  // Quick Demo Buttons
  const triggerDemo = (rxId) => {
    const rx = prescriptions.find(p => p.id === rxId);
    if (rx) {
      handleVerify(rx.id, 'qr');
    }
  };

  // Voice narration of full medication list
  const handleSpeakAll = () => {
    if (isSpeakingFull) {
      voiceService.stop();
      setIsSpeakingFull(false);
    } else {
      if (!activePrescription) return;
      setIsSpeakingFull(true);
      const scripts = activePrescription.medicines.map((m) => m.audioScript).join(' ... และ ... ');
      const fullText = `สรุปรายการยาของคุณ${activePrescription.patient.name} มีทั้งหมด ${activePrescription.medicines.length} รายการดังนี้ค่ะ ... ${scripts} ... ขอให้มีสุขภาพแข็งแรงนะคะ`;
      voiceService.speak(fullText, () => setIsSpeakingFull(true), () => setIsSpeakingFull(false));
    }
  };

  // Handle completion / close locker
  const handleFinishPickup = () => {
    if (activePrescription) {
      onCollectPrescription(activePrescription.id, activePrescription.lockerId);
      voiceService.speak('ขอบคุณค่ะ คุณได้รับยาเรียบร้อยแล้ว เดินทางกลับบ้านปลอดภัยนะคะ');
    }
    setActivePrescription(null);
    setPinInput('');
    setAuthMethod(null);
  };

  // Direct Print Handler
  const handleDirectPrint = () => {
    setIsPrintModalOpen(true);
    voiceService.speak("กำลังสั่งพิมพ์ใบจ่ายยาตัวหนังสือใหญ่ให้นะคะ กรุณารอรับกระดาษที่ช่องจ่ายเอกสารค่ะ");
  };

  // Call Station Nurse Handler
  const handleCallNurse = () => {
    setIsNurseCallModalOpen(true);
    voiceService.speak("ส่งสัญญาณเรียกพยาบาลประจำจุดตู้ยาแล้วค่ะ พยาบาลกำลังเข้ามาดูแลคุณยายนะคะ กรุณารอสักครู่ค่ะ");
  };

  // Staff Override Unlock
  const handleStaffUnlock = (rx) => {
    setIsStaffAssistModalOpen(false);
    handleVerify(rx.id, 'qr');
    voiceService.speak(`เจ้าหน้าที่ได้ทำการเปิดช่องที่ ${rx.lockerId} ให้คุณยาย${rx.patient.name} เรียบร้อยแล้วค่ะ`);
  };

  return (
    <div id="pickup-section" ref={pickupSectionRef} className="space-y-8 scroll-mt-24">
      {/* Quick Test Demo Bar */}
      <div className="bg-white border border-[#EAF6FF] rounded-2xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-[#183B56] font-medium">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span className="font-bold">ปุ่มทดสอบด่วน (Quick Demo):</span>
          <span className="text-[#486581]">คลิกเพื่อจำลองสแกนคนไข้ตัวอย่างได้ทันที</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {prescriptions.filter(p => p.status === 'ready_for_pickup').map((p) => (
            <button
              key={p.id}
              onClick={() => triggerDemo(p.id)}
              className="px-3.5 py-1.5 rounded-xl bg-[#EAF6FF] hover:bg-[#d5edfd] text-[#183B56] border border-[#BEE3F8] font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <span>👵 {p.patient.name}</span>
              <span className="bg-[#4A9FE8] text-white px-2 py-0.5 rounded text-[10px] font-bold">
                ตู้ {p.lockerId} (PIN: {p.pin})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* STATE 1: Welcoming & Authentication Selection (When no active prescription) */}
      {!activePrescription ? (
        <div className="space-y-8">
          {/* Section Header */}
          <div className="text-center py-2">
            <span className="text-xs font-bold uppercase tracking-wider bg-[#EAF6FF] text-[#4A9FE8] px-3.5 py-1 rounded-full">
              จุดรับยาอัตโนมัติ
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#183B56] mt-2">
              กรุณาเลือกวิธียืนยันตัวตนเพื่อรับยา
            </h2>
            <p className="text-[#486581] text-base mt-1.5 max-w-xl mx-auto">
              แตะที่วิธีใดก็ได้ที่ท่านสะดวก ระบบจะนำทางด้วยเสียงพูดอย่างง่ายดายค่ะ
            </p>
          </div>

          {/* 3 Main Choice Cards for Elderly */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            
            {/* Card 1: Scan QR */}
            <button
              onClick={() => {
                setAuthMethod('qr');
                if (prescriptions[0]) triggerDemo(prescriptions[0].id);
              }}
              className="group bg-white border-2 border-[#EAF6FF] hover:border-[#4A9FE8] p-7 rounded-3xl text-left transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between min-h-[250px] cursor-pointer"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#EAF6FF] border border-[#BEE3F8] flex items-center justify-center text-[#4A9FE8] group-hover:scale-110 transition-transform">
                <QrCode className="w-9 h-9" />
              </div>
              <div className="mt-5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#4A9FE8]">วิธีที่ 1</span>
                <h3 className="text-2xl font-bold text-[#183B56] mt-1 group-hover:text-[#4A9FE8] transition-colors">
                  สแกน QR Code
                </h3>
                <p className="text-[#486581] text-sm mt-1.5 leading-relaxed">
                  นำบาร์โค้ดจากใบนัด หรือหน้าจอมือถือมาจ่อที่ช่องสแกน
                </p>
              </div>
              <div className="mt-4 text-xs font-bold text-[#4A9FE8] flex items-center gap-1">
                👉 แตะเพื่อเริ่มสแกน
              </div>
            </button>

            {/* Card 2: Smart Card ID */}
            <button
              onClick={() => {
                setAuthMethod('cid');
                if (prescriptions[0]) handleVerify(prescriptions[0].cid, 'cid');
              }}
              className="group bg-white border-2 border-[#EAF6FF] hover:border-emerald-500 p-7 rounded-3xl text-left transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between min-h-[250px] cursor-pointer"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#DDF4E7] border border-emerald-200 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                <CreditCard className="w-9 h-9" />
              </div>
              <div className="mt-5">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">วิธีที่ 2</span>
                <h3 className="text-2xl font-bold text-[#183B56] mt-1 group-hover:text-emerald-600 transition-colors">
                  เสียบบัตรประชาชน
                </h3>
                <p className="text-[#486581] text-sm mt-1.5 leading-relaxed">
                  เสียบบัตร Smart Card ของผู้ป่วยเข้าช่องอ่านบัตรด้านล่างตู้
                </p>
              </div>
              <div className="mt-4 text-xs font-bold text-emerald-600 flex items-center gap-1">
                👉 แตะเพื่อจำลองเสียบบัตร
              </div>
            </button>

            {/* Card 3: PIN code */}
            <button
              onClick={() => setAuthMethod('pin')}
              className={`group bg-white border-2 p-7 rounded-3xl text-left transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between min-h-[250px] cursor-pointer ${
                authMethod === 'pin' ? 'border-[#4A9FE8] ring-4 ring-[#4A9FE8]/20' : 'border-[#EAF6FF] hover:border-[#4A9FE8]'
              }`}
            >
              <div className="w-16 h-16 rounded-2xl bg-[#FFF7E6] border border-[#FFDFA3] flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                <KeyRound className="w-9 h-9" />
              </div>
              <div className="mt-5">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600">วิธีที่ 3</span>
                <h3 className="text-2xl font-bold text-[#183B56] mt-1 group-hover:text-amber-600 transition-colors">
                  กดรหัสรับยา 4 หลัก
                </h3>
                <p className="text-[#486581] text-sm mt-1.5 leading-relaxed">
                  กรอกรหัส PIN 4 หลักที่ได้รับจาก SMS หรือใบเสร็จตรวจ
                </p>
              </div>
              <div className="mt-4 text-xs font-bold text-amber-600 flex items-center gap-1">
                👉 แตะเพื่อเปิดแป้นตัวเลข
              </div>
            </button>

          </div>

          {/* Station Staff & Nurse Standby Assistant Banner */}
          <div className="max-w-5xl mx-auto bg-gradient-to-r from-rose-50 via-amber-50 to-sky-50 border-2 border-rose-200/80 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-4 text-left">
              <div className="w-14 h-14 rounded-2xl bg-rose-500 text-white flex items-center justify-center text-3xl shadow-md shrink-0">
                👩‍⚕️
              </div>
              <div>
                <div className="font-black text-base sm:text-lg text-slate-900 flex items-center gap-2">
                  <span>มีพยาบาล / เจ้าหน้าที่ดูแลอยู่ข้างตู้ตลอดเวลา</span>
                  <span className="hidden sm:inline-block text-[11px] bg-rose-100 text-rose-700 font-bold px-2.5 py-0.5 rounded-full border border-rose-200">
                    Standby Assistant
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  หากคุณตามองไม่ชัด ลืมรหัส หรือกดไม่ถูก ไม่ต้องกังวลนะคะ กดปุ่มสีแดงเพื่อเรียกพยาบาลเข้ามาช่วยได้ทันทีค่ะ
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
              <button
                onClick={handleCallNurse}
                className="flex-1 sm:flex-none px-6 py-3.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all cursor-pointer hover:scale-[1.02]"
              >
                <Bell className="w-5 h-5 animate-bounce" />
                <span>🆘 แตะเรียกพยาบาล</span>
              </button>
              
              <button
                onClick={() => setIsStaffAssistModalOpen(true)}
                className="px-4 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
                title="สำหรับพยาบาลหรือเจ้าหน้าที่ประจำตู้"
              >
                <ShieldAlert className="w-4 h-4 text-slate-500" />
                <span>โหมดเจ้าหน้าที่</span>
              </button>
            </div>
          </div>

          {/* PIN Input Keypad (If selected) */}
          {authMethod === 'pin' && (
            <div className="max-w-md mx-auto bg-white border-2 border-[#4A9FE8] rounded-3xl p-7 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-[#183B56] flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-[#4A9FE8]" />
                  กรุณากดรหัสรับยา 4 หลัก
                </h3>
                <button
                  onClick={() => setAuthMethod(null)}
                  className="text-xs text-[#627D98] hover:text-[#183B56] font-semibold cursor-pointer"
                >
                  ยกเลิก
                </button>
              </div>

              {/* Display Box */}
              <div className="h-16 bg-[#F6FBFF] border-2 border-[#BEE3F8] rounded-2xl flex items-center justify-center gap-3 text-3xl font-mono tracking-widest text-[#183B56] font-bold mb-5 shadow-inner">
                {pinInput ? pinInput.padEnd(4, '•').split('').map((char, i) => (
                  <span key={i} className={i < pinInput.length ? 'text-[#4A9FE8] text-4xl' : 'text-slate-300'}>
                    {char}
                  </span>
                )) : (
                  <span className="text-[#627D98] text-base font-normal font-sans">กดตัวเลข 4 หลักด้านล่าง...</span>
                )}
              </div>

              {/* Big Numpad */}
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                  <button
                    key={n}
                    onClick={() => handleNumpad(n.toString())}
                    className="h-16 rounded-2xl bg-[#F6FBFF] hover:bg-[#EAF6FF] active:bg-[#4A9FE8] active:text-white border border-[#BEE3F8] text-2xl font-bold text-[#183B56] transition-all shadow-xs flex items-center justify-center cursor-pointer"
                  >
                    {n}
                  </button>
                ))}
                <button
                  onClick={handleNumpadClear}
                  className="h-16 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-base font-bold transition-all flex items-center justify-center cursor-pointer"
                >
                  ลบใหม่
                </button>
                <button
                  onClick={() => handleNumpad('0')}
                  className="h-16 rounded-2xl bg-[#F6FBFF] hover:bg-[#EAF6FF] active:bg-[#4A9FE8] active:text-white border border-[#BEE3F8] text-2xl font-bold text-[#183B56] transition-all shadow-xs flex items-center justify-center cursor-pointer"
                >
                  0
                </button>
                <button
                  onClick={() => handleVerify(pinInput, 'pin')}
                  disabled={pinInput.length !== 4}
                  className="h-16 rounded-2xl bg-[#4A9FE8] hover:bg-[#3b8fd7] disabled:opacity-40 disabled:cursor-not-allowed text-white text-base font-bold transition-all shadow-md flex items-center justify-center cursor-pointer"
                >
                  ตกลง
                </button>
              </div>

              {errorMessage && (
                <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm font-medium flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  {errorMessage}
                </div>
              )}
            </div>
          )}

          {/* Realtime Locker Status Overview below */}
          <div className="max-w-5xl mx-auto pt-4">
            <LockerGrid lockers={lockers} activeLockerId={null} />
          </div>
        </div>

      ) : (

        /* STATE 2: Patient Identified & Pickup In Progress */
        <div className="space-y-8 animate-in fade-in duration-300">
          
          {/* Top Banner: Patient Info & Open Locker Notification (Warm Healthy Theme) */}
          <div className="bg-gradient-to-r from-[#DDF4E7] via-[#EAF6FF] to-white border-2 border-emerald-400 rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-600"></span>
                  </span>
                  <span className="text-emerald-800 font-black text-sm tracking-wide uppercase">
                    ยืนยันตัวตนสำเร็จ • ประตูตู้เปิดแล้ว
                  </span>
                </div>
                
                <h2 className="text-3xl sm:text-4xl font-black text-[#183B56]">
                  ยินดีต้อนรับ: {activePrescription.patient.name}
                </h2>
                
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[#486581] text-sm sm:text-base mt-2">
                  <span>เลขประจำตัว (HN): <strong className="text-[#183B56]">{activePrescription.patient.hn}</strong></span>
                  <span>•</span>
                  <span>อายุ: <strong className="text-[#183B56]">{activePrescription.patient.age} ปี</strong></span>
                  <span>•</span>
                  <span>ผู้ดูแล: <strong className="text-[#4A9FE8] font-bold">{activePrescription.patient.caregiverName}</strong></span>
                </div>
              </div>

              {/* Big Locker Alert Box */}
              <div className="bg-white border-2 border-emerald-500 text-[#183B56] p-6 rounded-2xl shadow-lg flex items-center gap-5 shrink-0 ring-4 ring-emerald-400/20">
                <div className="w-14 h-14 rounded-2xl bg-[#DDF4E7] text-emerald-700 flex items-center justify-center shrink-0">
                  <Unlock className="w-8 h-8" />
                </div>
                <div>
                  <div className="text-xs uppercase font-extrabold tracking-wider text-emerald-800 flex items-center gap-1">
                    <span>🛍️</span> ถุงซิปยาของคุณอยู่ที่
                  </div>
                  <div className="text-3xl sm:text-4xl font-black leading-tight text-[#183B56]">
                    ตู้ช่องที่ {activePrescription.lockerId}
                  </div>
                  <div className="text-xs font-bold mt-1 bg-emerald-600 text-white px-2.5 py-0.5 rounded-full text-center shadow-xs">
                    ประตูดีดเปิดแล้ว! กรุณาหยิบถุงซิปยา
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="mt-6 pt-6 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                {/* Audio Narration */}
                <button
                  onClick={handleSpeakAll}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-base transition-all shadow-xs cursor-pointer ${
                    isSpeakingFull 
                      ? 'bg-amber-400 text-slate-900 animate-pulse'
                      : 'bg-white hover:bg-slate-50 text-[#183B56] border border-[#BEE3F8]'
                  }`}
                >
                  {isSpeakingFull ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 text-[#4A9FE8]" />}
                  <span>{isSpeakingFull ? 'หยุดเสียงสรุป' : '🔊 ฟังเสียงสรุปยาทั้งหมด'}</span>
                </button>

                {/* Send LINE to Caregiver */}
                <button
                  onClick={() => setIsLineModalOpen(true)}
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#06C755] hover:bg-[#05a847] text-white font-bold text-base transition-all shadow-md cursor-pointer"
                >
                  <Send className="w-5 h-5" />
                  <span>📱 ส่งวิธีกินยาเข้า LINE ลูกหลาน</span>
                </button>

                {/* Reprint Prescription Sheet */}
                <button
                  onClick={handleDirectPrint}
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white hover:bg-[#EAF6FF] text-[#183B56] border border-[#BEE3F8] font-bold text-base transition-all shadow-xs cursor-pointer active:scale-95"
                  title="กดเพื่อสั่งพิมพ์ซ้ำอีกใบ ในกรณีที่ต้องการสำเนาหรือกระดาษติด"
                >
                  <Printer className="w-5 h-5 text-[#4A9FE8]" />
                  <span>🖨️ พิมพ์ใบจ่ายยาซ้ำอีกใบ</span>
                </button>
              </div>

              {/* Complete Pickup Button */}
              <button
                onClick={handleFinishPickup}
                className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#4A9FE8] hover:bg-[#3b8fd7] text-white font-black text-lg transition-all shadow-lg shadow-[#4A9FE8]/30 transform active:scale-95 cursor-pointer"
              >
                <CheckCircle2 className="w-6 h-6" />
                <span>หยิบถุงซิปยาแล้ว / เสร็จสิ้น</span>
              </button>
            </div>
          </div>

          {/* Automatic Print Notification Banner */}
          <div className="bg-[#EAF6FF] border-2 border-[#BEE3F8] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs animate-in fade-in">
            <div className="flex items-center gap-3.5 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-[#4A9FE8] text-white flex items-center justify-center shrink-0 shadow-xs animate-bounce">
                <Printer className="w-6 h-6" />
              </div>
              <div>
                <div className="text-base font-bold text-[#183B56] flex items-center justify-center sm:justify-start gap-2">
                  <span>ตู้กำลังพิมพ์สลิปใบจ่ายยา (กระดาษความร้อน 80mm)</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                </div>
                <div className="text-xs sm:text-sm text-[#486581] mt-0.5">
                  สลิปตารางยาขนาด 80 มม. กำลังถูกพิมพ์และตัดอัตโนมัติ กรุณาดึงสลิปที่ช่องพิมพ์ด้านล่างตู้ค่ะ
                </div>
              </div>
            </div>
            <button
              onClick={handleDirectPrint}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-[#183B56] border border-[#BEE3F8] text-xs font-bold shadow-2xs cursor-pointer shrink-0"
            >
              🖨️ พิมพ์สลิปซ้ำอีกใบ
            </button>
          </div>

          {/* Interactive Locker Visualizer showing active door open */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#EAF6FF] shadow-sm">
            <LockerGrid 
              lockers={lockers} 
              activeLockerId={activePrescription.lockerId}
              onLockerClick={(locker) => {
                if (locker.id === activePrescription.lockerId) {
                  handleFinishPickup();
                }
              }}
            />
          </div>

          {/* Detailed Medicine Cards */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-[#183B56] flex items-center gap-2">
                  <span>💊</span> รายการยาในถุงซิปของคุณ ({activePrescription.medicines.length} รายการ)
                </h3>
                <p className="text-[#486581] text-sm mt-0.5">
                  กดปุ่มลำโพงสีฟ้าเพื่อฟังเสียงอธิบายยาแต่ละรายการซ้ำได้ตลอดเวลา
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {activePrescription.medicines.map((med, idx) => (
                <ElderlyMedicineCard
                  key={med.id || idx}
                  medicine={med}
                  index={idx}
                  isCurrentlySpeaking={false}
                />
              ))}
            </div>
          </div>

          {/* Bottom Complete Bar */}
          <div className="bg-white border-2 border-[#EAF6FF] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-md">
            <div>
              <div className="text-xl font-bold text-[#183B56]">ตรวจสอบยาครบถ้วนแล้วหรือยังคะ?</div>
              <div className="text-sm text-[#486581] mt-1">กรุณาปิดประตูตู้ล็อกเกอร์ให้สนิทหลังหยิบถุงซิปยาเรียบร้อยค่ะ</div>
            </div>
            <button
              onClick={handleFinishPickup}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#4A9FE8] hover:bg-[#3b8fd7] text-white font-black text-lg transition-all shadow-md cursor-pointer"
            >
              ✅ ปิดประตูตู้ & เสร็จสิ้นการรับยา
            </button>
          </div>

        </div>
      )}

      {/* Modals */}
      <LineModal
        isOpen={isLineModalOpen}
        onClose={() => setIsLineModalOpen(false)}
        prescription={activePrescription}
      />

      <PrintSlipModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        prescription={activePrescription}
      />

      {/* 1. Nurse Call Modal */}
      {isNurseCallModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 text-center space-y-5 shadow-2xl border-4 border-rose-400">
            <div className="w-20 h-20 rounded-3xl bg-rose-100 text-rose-600 flex items-center justify-center text-4xl mx-auto shadow-inner animate-bounce">
              👩‍⚕️
            </div>
            
            <div>
              <span className="inline-block bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
                ส่งสัญญาณขอความช่วยเหลือแล้ว
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-2">
                พยาบาลกำลังเดินมาหาคุณยายค่ะ
              </h3>
              <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                เจ้าหน้าที่พยาบาลประจำจุดตู้ยาได้รับแจ้งแล้ว และกำลังเดินมาดูแลคุณยายที่หน้าตู้เพื่อช่วยแนะนำการใช้งานค่ะ กรุณายืนรอสักครู่นะคะ
              </p>
            </div>

            <div className="bg-amber-50 rounded-2xl p-3 border border-amber-200 text-xs text-amber-900 flex items-center gap-2 justify-center">
              <span>🔔 มีไฟสัญญาณกระพริบแจ้งเตือนที่โต๊ะเจ้าหน้าที่แล้ว</span>
            </div>

            <button
              onClick={() => setIsNurseCallModalOpen(false)}
              className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-colors cursor-pointer"
            >
              เจ้าหน้าที่มาถึงแล้ว / ปิดหน้าต่างนี้
            </button>
          </div>
        </div>
      )}

      {/* 2. Staff Assist Modal */}
      {isStaffAssistModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 space-y-5 shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl">
                  👩‍⚕️
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    โหมดเจ้าหน้าที่ประจำตู้ (Station Staff Override)
                  </h3>
                  <p className="text-xs text-slate-500">
                    ช่วยเหลือคนไข้ที่ลืมรหัส PIN, ทำใบนัดหาย, หรือมีปัญหาด้านสายตา
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsStaffAssistModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={staffSearchQuery}
                onChange={(e) => setStaffSearchQuery(e.target.value)}
                placeholder="ค้นหาชื่อคนไข้ หรือเลข HN เพื่อเปิดตู้ให้ทันที..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* List of active ready-for-pickup prescriptions */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {prescriptions
                .filter(p => p.status === 'ready_for_pickup')
                .filter(p => {
                  if (!staffSearchQuery.trim()) return true;
                  const q = staffSearchQuery.toLowerCase();
                  return p.patient.name.toLowerCase().includes(q) || p.patient.hn.toLowerCase().includes(q);
                })
                .map((rx) => (
                  <div
                    key={rx.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-blue-50/50 hover:border-blue-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-black text-xl flex items-center justify-center shrink-0">
                        {rx.lockerId}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                          <span>{rx.patient.name}</span>
                          <span className="text-xs text-slate-500">({rx.patient.hn})</span>
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                          <span>อายุ {rx.patient.age} ปี</span>
                          <span>•</span>
                          <span className="text-emerald-700 font-bold">ยา {rx.medicines.length} รายการ</span>
                          <span>•</span>
                          <span className="font-mono text-slate-700 font-bold">PIN: {rx.pin}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleStaffUnlock(rx)}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer hover:scale-[1.02]"
                    >
                      <Unlock className="w-4 h-4" />
                      <span>เปิดตู้ช่อง {rx.lockerId} ให้คนไข้</span>
                    </button>
                  </div>
                ))}
            </div>

            <div className="border-t border-slate-100 pt-3 text-center text-xs text-slate-400">
              * การกดเปิดตู้โดยเจ้าหน้าที่จะถูกบันทึกประวัติเพื่อความปลอดภัยในการจ่ายยา
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
