import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, ShieldCheck, ArrowRight, Cog, Play, AlertTriangle, 
  PackageCheck, User, Sparkles, RefreshCw, Cpu, Layers, Bell, Check, 
  ExternalLink, Volume2, ShieldAlert, ArrowDownRight, CornerDownRight,
  X, RotateCcw, FileWarning, Send
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { voiceService } from '../services/voiceService.js';

const REJECT_CATEGORIES = [
  {
    id: 'wrong_dosage',
    title: '💊 ขนาดยาหรือจำนวนเม็ดไม่ถูกต้อง',
    desc: 'ความแรงยา/จำนวนเม็ดไม่ตรงตามแพทย์สั่ง หรือจัดจำนวนไม่ครบ'
  },
  {
    id: 'wrong_drug',
    title: '⚠️ ชนิดหรือเม็ดยาไม่ตรงกับฉลาก',
    desc: 'หยิบยาผิดตัว หรือสี/รูปทรงเม็ดในถุงไม่ตรงตามข้อมูลบนฉลาก'
  },
  {
    id: 'allergy_conflict',
    title: '🚫 ตรวจพบประวัติการแพ้ยา (Allergy Conflict)',
    desc: 'ผู้ป่วยมีประวัติแพ้ยาตัวนี้ในระบบ อันตรายถึงชีวิต'
  },
  {
    id: 'wrong_patient',
    title: '🏷️ ชื่อ-สกุล หรือ HN บนซองยาไม่ตรงกัน',
    desc: 'สลับซองยา หรือติดสติกเกอร์ผิดคนไข้'
  },
  {
    id: 'packaging_issue',
    title: '📦 บรรจุภัณฑ์หรือถุงซิปชำรุด',
    desc: 'ซองยาฉีกขาด หรือถุงซิปล็อกปิดไม่สนิท มีความชื้น'
  },
  {
    id: 'other',
    title: '📝 อื่นๆ (ระบุรายละเอียดเพิ่มเติม)',
    desc: 'ข้อสังเกตหรือข้อผิดพลาดอื่นๆ ที่ต้องให้เภสัชกรแก้ไข'
  }
];

export default function DoubleCheckConveyorView({
  prescriptions,
  onApproveAndFeedConveyor,
  onRejectPrescription,
  lockers,
  authenticatedStaff
}) {
  // Filter prescriptions waiting for double check
  const waitingPrescriptions = prescriptions.filter(
    p => p.status === 'dispensed_waiting_check'
  );

  const [selectedRx, setSelectedRx] = useState(() => waitingPrescriptions[0] || null);
  
  // 5 Rights Checklist State
  const [checks, setChecks] = useState({
    patient: false,
    drug: false,
    dose: false,
    time: false,
    allergy: false
  });

  // Rejection Modal State
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedRejectCategory, setSelectedRejectCategory] = useState('wrong_dosage');
  const [rejectCustomNote, setRejectCustomNote] = useState('');

  // Conveyor Animation State: idle | running | diverting | completed
  const [conveyorState, setConveyorState] = useState('idle');
  const [bagPosition, setBagPosition] = useState(0); // 0 to 100 percent
  const [esp32Ip, setEsp32Ip] = useState('192.168.1.150');
  const [hardwareLog, setHardwareLog] = useState([]);

  // Auto-select first item if current selection disappears
  useEffect(() => {
    if (!selectedRx && waitingPrescriptions.length > 0) {
      setSelectedRx(waitingPrescriptions[0]);
    }
  }, [waitingPrescriptions, selectedRx]);

  // Reset checks when changing prescription
  useEffect(() => {
    setChecks({
      patient: false,
      drug: false,
      dose: false,
      time: false,
      allergy: false
    });
    setConveyorState('idle');
    setBagPosition(0);
  }, [selectedRx?.id]);

  const allChecked = checks.patient && checks.drug && checks.dose && checks.time && checks.allergy;

  const handleCheckAll = () => {
    setChecks({
      patient: true,
      drug: true,
      dose: true,
      time: true,
      allergy: true
    });
  };

  const addHardwareLog = (msg) => {
    setHardwareLog(prev => [
      `[${new Date().toLocaleTimeString('th-TH')}] ${msg}`,
      ...prev.slice(0, 5)
    ]);
  };

  // Reject and return prescription to pharmacy
  const handleConfirmReject = () => {
    if (!selectedRx) return;
    const cat = REJECT_CATEGORIES.find(c => c.id === selectedRejectCategory);
    const reasonText = cat ? cat.title : 'ตรวจพบข้อผิดพลาด';

    if (onRejectPrescription) {
      onRejectPrescription(selectedRx.id, {
        reason: reasonText,
        code: selectedRejectCategory,
        note: rejectCustomNote
      });
    }

    voiceService.speak(`ตรวจพบข้อผิดพลาด ส่งคืนใบสั่งยาของคุณ${selectedRx.patient.name} กลับห้องยาเรียบร้อยค่ะ`);
    addHardwareLog(`❌ ตรวจพบข้อผิดพลาด: ตีกลับใบสั่งยา ${selectedRx.id} (${reasonText}) กลับห้องยา`);

    setIsRejectModalOpen(false);
    setRejectCustomNote('');
    setSelectedRx(null);
  };

  // Run the conveyor and divert into locker
  const handleStartConveyor = () => {
    if (!selectedRx || conveyorState !== 'idle') return;

    setConveyorState('running');
    addHardwareLog(`🚀 เริ่มเดินสายพาน Infeed สำหรับ ${selectedRx.patient.name} (เป้าหมาย: ตู้ช่อง ${selectedRx.lockerId})`);

    // Optionally ping ESP32 if available
    try {
      if (esp32Ip) {
        addHardwareLog(`📡 ส่งคำสั่ง HTTP: GET http://${esp32Ip}/conveyor?box=${selectedRx.lockerId}`);
        fetch(`http://${esp32Ip}/conveyor?box=${selectedRx.lockerId}`, { mode: 'no-cors' })
          .catch(() => addHardwareLog(`ℹ️ จำลองสัญญาณฮาร์ดแวร์ (Mock Mode)`));
      }
    } catch {
      // ignore
    }

    // Smooth conveyor progression
    let pos = 10;
    const interval = setInterval(() => {
      pos += 5;
      setBagPosition(pos);

      // Target reached around 70%
      if (pos >= 70) {
        clearInterval(interval);
        setConveyorState('diverting');
        addHardwareLog(`⚙️ แขน Servo กาง 45° ปัดถุงยาลงช่องที่ ${selectedRx.lockerId}`);

        // Finish after dropping into box
        setTimeout(() => {
          setConveyorState('completed');
          addHardwareLog(`✅ ถุงยาตกลงช่องที่ ${selectedRx.lockerId} เรียบร้อย • ล็อกประตู • ไฟ LED สว่าง`);

          // Celebratory effect
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.5 }
          });

          // Voice feedback
          const text = `ตรวจสอบความถูกต้องสำเร็จ และนำถุงยาของคุณ${selectedRx.patient.name} เข้าตู้ล็อกเกอร์ช่องที่ ${selectedRx.lockerId} เรียบร้อยแล้วค่ะ`;
          voiceService.speak(text);

          // Update prescription to ready_for_pickup
          setTimeout(() => {
            onApproveAndFeedConveyor(selectedRx.id, selectedRx.lockerId);
            setSelectedRx(null);
            setConveyorState('idle');
            setBagPosition(0);
          }, 2500);

        }, 1600);
      }
    }, 150);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-72 h-72 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-black tracking-wider uppercase">
              <ShieldCheck className="w-4 h-4 text-emerald-200" />
              <span>Safety Protocol • 5 Rights Medication Standard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              สถานีตรวจสอบยา (Double-Check) & ระบบสายพานลำเลียงอัจฉริยะ
            </h1>
            <p className="text-emerald-100 text-sm max-w-2xl">
              ป้องกันความผิดพลาด 100%: ตรวจสอบความถูกต้องของยาโดยพยาบาล/ผู้ตรวจก่อนส่งเข้าตู้ จากนั้นวางลงสายพานเพื่อจำแนกเข้าช่องล็อกเกอร์อัตโนมัติ
            </p>

            <div className="inline-flex items-center gap-2 bg-emerald-950/60 border border-emerald-400/40 px-3 py-1 rounded-full text-xs text-emerald-200 mt-1 font-mono">
              <span>👤 ผู้ตรวจความปลอดภัย:</span>
              <strong className="text-white font-bold">{authenticatedStaff ? authenticatedStaff.name : 'พว. กรรณิการ์ สุขสวัสดิ์'}</strong>
              <span className="text-emerald-300">({authenticatedStaff ? authenticatedStaff.licenseNo : 'พ.55432'})</span>
              <span className="text-[10px] bg-emerald-500/30 text-emerald-200 px-1.5 py-0.5 rounded ml-1">Audit Trail Active</span>
            </div>
          </div>

          <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center min-w-[180px]">
            <div className="text-xs text-emerald-200 font-bold uppercase tracking-wider">
              รอนำส่งเข้าตู้
            </div>
            <div className="text-3xl font-black text-white mt-1 flex items-center justify-center gap-2">
              <PackageCheck className="w-7 h-7 text-emerald-300" />
              <span>{waitingPrescriptions.length}</span>
              <span className="text-base font-medium text-emerald-200">รายการ</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left = Queue & Checklist, Right = Interactive Conveyor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Col (5 cols): Prescriptions Queue & 5-Rights Checklist */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* 1. Queue Card */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <span>📋</span> คิวถุงยาที่รอตรวจ (Waiting Queue)
              </h2>
              <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-full border border-emerald-200">
                {waitingPrescriptions.length} ถุง
              </span>
            </div>

            {waitingPrescriptions.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm space-y-2">
                <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500" />
                <p className="font-bold text-slate-600">ตรวจยาและส่งเข้าตู้ครบทุกรายการแล้ว!</p>
                <p className="text-xs">สามารถไปที่หน้า "จัดยาห้องยา" เพื่อสร้างใบสั่งยาใหม่ได้</p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
                {waitingPrescriptions.map((rx) => {
                  const isSelected = selectedRx?.id === rx.id;
                  return (
                    <div
                      key={rx.id}
                      onClick={() => setSelectedRx(rx)}
                      className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50/70 shadow-xs'
                          : 'border-slate-100 hover:border-slate-200 bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg ${
                          isSelected ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-700'
                        }`}>
                          {rx.lockerId}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-slate-900">
                            {rx.patient.name}
                          </div>
                          <div className="text-xs text-slate-500 flex items-center gap-2">
                            <span>{rx.patient.hn}</span>
                            <span>•</span>
                            <span className="text-emerald-700 font-medium">{rx.medicines.length} รายการ</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="inline-block text-[11px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md border border-amber-200">
                          รอตรวจ
                        </span>
                        <div className="text-[10px] text-slate-400 mt-1">
                          ช่องตู้ {rx.lockerId}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 2. 5 Rights Checklist Card */}
          {selectedRx && (
            <div className="bg-white rounded-3xl p-6 border-2 border-emerald-500/50 shadow-md space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <div className="text-xs text-emerald-600 font-bold uppercase tracking-wider">
                    จุดตรวจซ้ำความปลอดภัย (Double-Check)
                  </div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <span>🔍</span> {selectedRx.patient.name}
                  </h3>
                </div>
                <button
                  onClick={handleCheckAll}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 transition-colors cursor-pointer"
                >
                  ✓ ติ๊กถูกทั้งหมด (Quick Check)
                </button>
              </div>

              {/* Patient Alert Badge */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900">
                  <span className="font-bold">ประวัติการแพ้ยา:</span>{' '}
                  <span className="text-red-600 font-black">{selectedRx.patient.allergies}</span>
                  <div className="text-[11px] text-slate-600 mt-0.5">
                    จัดยาโดย: {selectedRx.pharmacist}
                  </div>
                </div>
              </div>

              {/* 5 Checkboxes */}
              <div className="space-y-2.5 text-xs font-medium text-slate-800">
                <label className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50/50 transition-colors cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={checks.patient}
                    onChange={(e) => setChecks({ ...checks, patient: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded cursor-pointer accent-emerald-600"
                  />
                  <span>
                    <strong className="text-slate-900">1. ถูกคนไข้ (Right Patient):</strong> ชื่อ-สกุลตรง {selectedRx.patient.name} ({selectedRx.patient.hn})
                  </span>
                </label>

                <label className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50/50 transition-colors cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={checks.drug}
                    onChange={(e) => setChecks({ ...checks, drug: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded cursor-pointer accent-emerald-600"
                  />
                  <span>
                    <strong className="text-slate-900">2. ถูกยา (Right Drug):</strong> ตรวจนับยา {selectedRx.medicines.length} รายการ ตรงตามซองยา
                  </span>
                </label>

                <label className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50/50 transition-colors cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={checks.dose}
                    onChange={(e) => setChecks({ ...checks, dose: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded cursor-pointer accent-emerald-600"
                  />
                  <span>
                    <strong className="text-slate-900">3. ถูกขนาด (Right Dose):</strong> ความแรงและจำนวนเม็ดถูกต้อง
                  </span>
                </label>

                <label className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50/50 transition-colors cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={checks.time}
                    onChange={(e) => setChecks({ ...checks, time: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded cursor-pointer accent-emerald-600"
                  />
                  <span>
                    <strong className="text-slate-900">4. ถูกเวลา (Right Time):</strong> มื้อยาก่อน/หลังอาหารระบุชัดเจน
                  </span>
                </label>

                <label className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50/50 transition-colors cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={checks.allergy}
                    onChange={(e) => setChecks({ ...checks, allergy: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded cursor-pointer accent-emerald-600"
                  />
                  <span>
                    <strong className="text-slate-900">5. ตรวจสอบการแพ้ยา (Allergy Check):</strong> ไม่มีตัวยาที่คนไข้แพ้
                  </span>
                </label>
              </div>

              {/* Action Buttons: Approve Conveyor OR Reject & Return to Pharmacy */}
              <div className="space-y-2.5 pt-2">
                {/* Approve & Feed Conveyor Button */}
                <button
                  disabled={!allChecked || conveyorState !== 'idle'}
                  onClick={handleStartConveyor}
                  className={`w-full py-3.5 px-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-md transition-all ${
                    allChecked && conveyorState === 'idle'
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 cursor-pointer scale-100 hover:scale-[1.02]'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                  }`}
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>
                    {allChecked 
                      ? `✓ ตรวจผ่าน 5 ข้อ — ปล่อยถุงยาลงสายพาน (เข้าช่อง ${selectedRx.lockerId})` 
                      : 'กรุณาติ๊กตรวจเช็ค 5 ข้อให้ครบเพื่อปล่อยยา'}
                  </span>
                </button>

                {/* Reject & Return to Pharmacy Button */}
                <button
                  type="button"
                  onClick={() => setIsRejectModalOpen(true)}
                  disabled={conveyorState !== 'idle'}
                  className="w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-all cursor-pointer hover:border-rose-300"
                >
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>❌ ตรวจพบข้อผิดพลาด — ตีกลับห้องยา (Reject & Return)</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Right Col (7 cols): Conveyor Belt Simulation & Sorter Machine */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-800 relative overflow-hidden">
            
            {/* Header of Conveyor */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  SMART CONVEYOR INFEED & SORTER
                </div>
                <h3 className="text-lg font-black text-white mt-0.5 flex items-center gap-2">
                  <span>⚙️</span> ระบบสายพานลำเลียงและคัดแยกเข้าช่องอัตโนมัติ
                </h3>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">สถานะ:</span>
                <span className={`px-2.5 py-1 rounded-full font-bold font-mono text-[11px] ${
                  conveyorState === 'running' 
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                    : conveyorState === 'diverting'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse'
                    : conveyorState === 'completed'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {conveyorState === 'idle' && 'READY (รอเริ่มเดินสายพาน)'}
                  {conveyorState === 'running' && 'CONVEYOR RUNNING (กำลังลำเลียง)'}
                  {conveyorState === 'diverting' && 'SERVO DIVERTING (กำลังปัดเข้าช่อง)'}
                  {conveyorState === 'completed' && 'SORTED & LOCKED (เข้าช่องเรียบร้อย)'}
                </span>
              </div>
            </div>

            {/* Conveyor Belt Graphic Container */}
            <div className="my-8 relative bg-slate-950/80 rounded-2xl p-6 border border-slate-800/80">
              
              {/* Target Locker Slot indicator */}
              <div className="flex items-center justify-between mb-6 text-xs">
                <div className="text-slate-400 flex items-center gap-1.5">
                  <CornerDownRight className="w-4 h-4 text-emerald-400" />
                  <span>จุดนำเข้า (Infeed Entry)</span>
                </div>

                <div className="text-right">
                  <span className="text-slate-400 text-xs">เป้าหมาย: </span>
                  <span className="text-emerald-400 font-black text-sm bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800">
                    ตู้ล็อกเกอร์ช่องที่ {selectedRx?.lockerId || '-'}
                  </span>
                </div>
              </div>

              {/* The Physical Conveyor Belt */}
              <div className="relative h-24 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 rounded-xl border-2 border-slate-600 overflow-hidden shadow-inner flex items-center">
                
                {/* Tread pattern stripes */}
                <div 
                  className="absolute inset-0 opacity-25"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 15px, transparent 15px, transparent 30px)'
                  }}
                />

                {/* Roller Gears at both ends */}
                <div className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-900 border-2 border-slate-500 flex items-center justify-center">
                  <Cog className={`w-5 h-5 text-slate-400 ${conveyorState === 'running' ? 'animate-spin' : ''}`} />
                </div>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-900 border-2 border-slate-500 flex items-center justify-center">
                  <Cog className={`w-5 h-5 text-slate-400 ${conveyorState === 'running' ? 'animate-spin' : ''}`} />
                </div>

                {/* Moving Medicine Bag */}
                {selectedRx && (
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 transition-all duration-150 ease-linear z-20 flex flex-col items-center select-none"
                    style={{ 
                      left: `${Math.min(bagPosition, 75)}%`,
                      transform: conveyorState === 'diverting' ? 'translateY(15px) rotate(15deg)' : 'translateY(-50%)'
                    }}
                  >
                    <div className="relative bg-white/95 text-slate-900 px-3 py-1.5 rounded-xl border-2 border-emerald-400 shadow-xl text-center">
                      <div className="text-xl">💊</div>
                      <div className="text-[10px] font-black leading-tight max-w-[80px] truncate">
                        {selectedRx.patient.name}
                      </div>
                      <div className="text-[9px] text-emerald-700 font-bold">
                        ช่อง {selectedRx.lockerId}
                      </div>
                    </div>
                  </div>
                )}

                {/* Servo Diverter Arm at ~72% mark */}
                <div className="absolute right-[22%] top-0 bottom-0 w-3 flex items-center justify-center z-10">
                  <div 
                    className={`w-1.5 h-16 bg-amber-400 rounded-full shadow-lg transition-transform duration-300 origin-top ${
                      conveyorState === 'diverting' ? 'rotate-45' : 'rotate-0'
                    }`}
                    title="Servo SG90 Diverter Arm"
                  />
                </div>

                {/* Drop Chute into Locker */}
                <div className="absolute right-[14%] bottom-0 w-16 h-4 bg-emerald-500/30 border-t-2 border-dashed border-emerald-400 text-[10px] text-emerald-300 font-mono text-center">
                  DROP CHUTE
                </div>
              </div>

              {/* Visual Mock-up Locker Slots below conveyor */}
              <div className="mt-4 pt-4 border-t border-slate-800">
                <div className="text-xs text-slate-400 mb-2 font-mono flex items-center gap-1.5">
                  <span>📦</span> แผงตู้ล็อกเกอร์เรียงตามแนวสายพาน:
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {[1, 2, 3, 4, 5, 6].map((boxNum) => {
                    const isTarget = selectedRx?.lockerId === boxNum;
                    const isOccupied = lockers.find(l => l.id === boxNum)?.status === 'occupied';

                    return (
                      <div 
                        key={boxNum}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          isTarget && conveyorState === 'completed'
                            ? 'bg-emerald-500/20 border-emerald-400 text-white ring-2 ring-emerald-400 animate-pulse'
                            : isTarget && (conveyorState === 'running' || conveyorState === 'diverting')
                            ? 'bg-amber-500/20 border-amber-400 text-amber-200 ring-2 ring-amber-400'
                            : isOccupied
                            ? 'bg-blue-950/40 border-blue-800 text-blue-300'
                            : 'bg-slate-900 border-slate-800 text-slate-500'
                        }`}
                      >
                        <div className="text-[10px] font-mono font-bold">ช่อง {boxNum}</div>
                        <div className="text-base my-0.5">
                          {isTarget && conveyorState === 'completed' ? '🟢' : isOccupied ? '🔒' : '⚪'}
                        </div>
                        <div className="text-[9px] truncate">
                          {isTarget ? 'เป้าหมาย' : isOccupied ? 'มียาอยู่' : 'ว่าง'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Hardware Bridge / ESP32 Controller Settings */}
            <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-slate-300 font-bold">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <span>ESP32 Hardware Bridge (ตั้งค่าบอร์ดควบคุมจริง)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">ESP32 IP:</span>
                  <input
                    type="text"
                    value={esp32Ip}
                    onChange={(e) => setEsp32Ip(e.target.value)}
                    placeholder="192.168.1.xxx"
                    className="bg-slate-900 border border-slate-700 text-cyan-300 font-mono text-xs px-2.5 py-1 rounded-lg w-32 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Hardware Console Log */}
              <div className="bg-black/80 rounded-xl p-3 font-mono text-[11px] text-slate-300 space-y-1 max-h-24 overflow-y-auto border border-slate-800">
                {hardwareLog.length === 0 ? (
                  <div className="text-slate-500 italic">พร้อมรับคำสั่งควบคุมสายพานและ Servo Motor...</div>
                ) : (
                  hardwareLog.map((log, i) => (
                    <div key={i} className="leading-tight text-emerald-400/90">{log}</div>
                  ))
                )}
              </div>
            </div>

          </div>

        </div>

      {/* Rejection / Near-Miss Return Modal */}
      {isRejectModalOpen && selectedRx && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-rose-100 space-y-5 animate-in fade-in zoom-in-95 duration-150 text-slate-900">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center text-2xl shrink-0">
                  🚨
                </div>
                <div>
                  <div className="text-xs font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1.5">
                    <span>MEDICATION NEAR-MISS INTERCEPTION</span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900">
                    ส่งคืนใบสั่งยาให้ห้องยาแก้ไข
                  </h3>
                  <div className="text-xs text-slate-500 mt-0.5">
                    คนไข้: <strong className="text-slate-800">{selectedRx.patient.name}</strong> ({selectedRx.patient.hn})
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsRejectModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error Category Picker */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                ระบุประเภทข้อผิดพลาดที่ตรวจพบ *
              </label>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {REJECT_CATEGORIES.map((cat) => (
                  <label
                    key={cat.id}
                    onClick={() => setSelectedRejectCategory(cat.id)}
                    className={`p-3 rounded-2xl border text-left flex items-start gap-3 cursor-pointer transition-all ${
                      selectedRejectCategory === cat.id
                        ? 'bg-rose-50/80 border-rose-400 ring-2 ring-rose-400/30 shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="rejectCategory"
                      checked={selectedRejectCategory === cat.id}
                      onChange={() => setSelectedRejectCategory(cat.id)}
                      className="mt-1 w-4 h-4 text-rose-600 accent-rose-600 cursor-pointer"
                    />
                    <div className="text-xs">
                      <div className="font-bold text-slate-900">{cat.title}</div>
                      <div className="text-slate-500 text-[11px] mt-0.5">{cat.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Additional Note */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                ข้อความแจ้งเตือนถึงเภสัชกรต้นทาง (ระบุให้ชัดเจน)
              </label>
              <textarea
                value={rejectCustomNote}
                onChange={(e) => setRejectCustomNote(e.target.value)}
                placeholder="เช่น ขนาดยา Amlodipine ที่จัดมาเป็น 10mg แต่แพทย์สั่ง 5mg กรุณาเปลี่ยนเม็ดยาและตรวจสอบซ้ำค่ะ"
                rows={2}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-rose-400"
              />
            </div>

            {/* Audit Trail Stamp Preview */}
            <div className="bg-slate-900 text-white rounded-2xl p-3.5 text-xs space-y-1 font-mono">
              <div className="text-rose-400 font-bold flex items-center gap-1.5">
                <FileWarning className="w-3.5 h-3.5" />
                <span>บันทึกความรับผิดชอบ (Audit Trail Accountability):</span>
              </div>
              <div className="text-slate-300 grid grid-cols-2 gap-2 text-[11px] pt-1">
                <div>ผู้ส่งตีกลับ: <strong className="text-white">{authenticatedStaff ? authenticatedStaff.name : 'พว. กรรณิการ์ รักษาดี'}</strong></div>
                <div>ใบประกอบ: <strong className="text-emerald-400">{authenticatedStaff ? authenticatedStaff.licenseNo : 'พ.11892'}</strong></div>
                <div className="col-span-2">เภสัชกรผู้รับแจ้งเตือน: <strong className="text-sky-300">{selectedRx.pharmacist}</strong></div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsRejectModalOpen(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-5 py-2.5 rounded-xl text-xs font-black bg-rose-600 hover:bg-rose-700 text-white shadow-md flex items-center gap-2 transition-all cursor-pointer hover:scale-[1.02]"
              >
                <Send className="w-3.5 h-3.5" />
                <span>ยืนยันตีกลับไปยังห้องยา</span>
              </button>
            </div>

          </div>
        </div>
      )}

      </div>
    </div>
  );
}
