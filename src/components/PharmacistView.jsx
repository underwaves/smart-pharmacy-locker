import React, { useState } from 'react';
import { 
  PlusCircle, Package, User, Phone, CheckCircle, Clock, 
  Trash2, RefreshCw, KeyRound, QrCode, ShieldCheck, Stethoscope,
  AlertTriangle, RotateCcw, Edit3, Send, X, FileWarning
} from 'lucide-react';
import LockerGrid from './LockerGrid.jsx';
import { AVAILABLE_MEDICINE_CATALOG } from '../data/mockData.js';

export default function PharmacistView({ 
  lockers, 
  prescriptions, 
  onAddPrescription,
  onRedispensePrescription,
  onCancelPrescription,
  onResetData,
  authenticatedStaff 
}) {
  const [patientName, setPatientName] = useState('');
  const [patientHn, setPatientHn] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [caregiverName, setCaregiverName] = useState('');
  const [caregiverPhone, setCaregiverPhone] = useState('');
  const [selectedLockerId, setSelectedLockerId] = useState('');
  const [selectedMedicines, setSelectedMedicines] = useState([]);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Returned prescriptions from double check station
  const returnedPrescriptions = prescriptions.filter(p => p.status === 'rejected_returned');
  const [editingReturnedRx, setEditingReturnedRx] = useState(null);
  const [editMedicines, setEditMedicines] = useState([]);
  const [editNote, setEditNote] = useState('');

  // Available lockers that are currently empty
  const availableLockers = lockers.filter(l => l.status === 'available');

  const toggleMedicineSelect = (med) => {
    const exists = selectedMedicines.find(m => m.name === med.name);
    if (exists) {
      setSelectedMedicines(selectedMedicines.filter(m => m.name !== med.name));
    } else {
      setSelectedMedicines([...selectedMedicines, { ...med, id: `MED-NEW-${Date.now()}-${Math.random().toString(36).substr(2, 4)}` }]);
    }
  };

  const handleStartEditReturned = (rx) => {
    setEditingReturnedRx(rx);
    setEditMedicines([...rx.medicines]);
    setEditNote(rx.notes || '');
  };

  const toggleEditMedicine = (med) => {
    const exists = editMedicines.find(m => m.name === med.name);
    if (exists) {
      setEditMedicines(editMedicines.filter(m => m.name !== med.name));
    } else {
      setEditMedicines([...editMedicines, { ...med, id: `MED-REV-${Date.now()}-${Math.random().toString(36).substr(2, 4)}` }]);
    }
  };

  const handleSaveAndRedispense = (e) => {
    e.preventDefault();
    if (!editingReturnedRx) return;
    if (editMedicines.length === 0) {
      alert('กรุณาเลือกรายการยาอย่างน้อย 1 รายการ');
      return;
    }
    if (onRedispensePrescription) {
      onRedispensePrescription(editingReturnedRx.id, editMedicines, editNote);
    }
    setEditingReturnedRx(null);
  };

  const handleCreatePrescription = (e) => {
    e.preventDefault();
    if (!patientName || !selectedLockerId || selectedMedicines.length === 0) {
      alert('กรุณากรอกชื่อคนไข้, เลือกตู้ล็อกเกอร์ และเลือกรายการยาอย่างน้อย 1 รายการ');
      return;
    }

    // Generate random 4 digit PIN
    const generatedPin = Math.floor(1000 + Math.random() * 9000).toString();
    const newRx = {
      id: `RX-${Date.now().toString().slice(-6)}`,
      pin: generatedPin,
      cid: '1' + Math.floor(100000000000 + Math.random() * 900000000000).toString(),
      patient: {
        name: patientName,
        hn: patientHn || `HN-${Math.floor(10000 + Math.random() * 90000)}`,
        age: patientAge ? parseInt(patientAge) : 68,
        phone: patientPhone || '089-111-2233',
        caregiverName: caregiverName || 'ญาติผู้ดูแล',
        caregiverPhone: caregiverPhone || '081-999-8877',
        allergies: 'ไม่มีประวัติแพ้ยา'
      },
      lockerId: parseInt(selectedLockerId),
      status: 'dispensed_waiting_check', // ส่งต่อไปยังจุดตรวจ Double-Check และสายพานอัตโนมัติ
      pharmacist: authenticatedStaff ? `${authenticatedStaff.name} (${authenticatedStaff.licenseNo})` : 'ภก. ธนวัฒน์ วงศ์วิจิตร (ภ.34211)',
      hospital: 'โรงพยาบาลศูนย์สุขภาพปวงชน',
      createdAt: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.',
      collectedAt: null,
      medicines: selectedMedicines
    };

    onAddPrescription(newRx);

    // Reset Form
    setPatientName('');
    setPatientHn('');
    setPatientAge('');
    setPatientPhone('');
    setCaregiverName('');
    setCaregiverPhone('');
    setSelectedLockerId('');
    setSelectedMedicines([]);

    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 4000);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#EAF6FF] via-[#F6FBFF] to-white border border-[#BEE3F8] rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md">
        <div>
          <div className="flex items-center gap-2 text-[#4A9FE8] font-bold text-sm mb-1.5">
            <ShieldCheck className="w-5 h-5 text-[#4A9FE8]" />
            ระบบจัดการสำหรับเภสัชกรและเจ้าหน้าที่ห้องยา (Hospital Portal)
          </div>
          <h2 className="text-3xl font-black text-[#183B56]">
            ระบบบันทึกถุงยา & นำส่งเข้าตู้ล็อกเกอร์
          </h2>
          <p className="text-[#486581] text-sm mt-1">
            แพทย์/ห้องยาจัดยาใส่ถุงซิปเรียบร้อยแล้ว บันทึกข้อมูลเข้าระบบเพื่อให้ตู้ล็อกเกอร์ใช้อธิบายวิธีทานยาและพิมพ์ใบจ่ายยา
          </p>

          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full text-xs text-blue-900 mt-2 font-mono">
            <span>👨‍⚕️ เภสัชกรผู้จัดยา:</span>
            <strong className="text-blue-950 font-bold">{authenticatedStaff ? authenticatedStaff.name : 'ภก. ธนวัฒน์ วงศ์วิจิตร'}</strong>
            <span className="text-blue-700">({authenticatedStaff ? authenticatedStaff.licenseNo : 'ภ.34211'})</span>
            <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded ml-1 font-bold">Audit Trail Active</span>
          </div>
        </div>

        <button
          onClick={onResetData}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-[#183B56] border border-[#BEE3F8] text-sm font-semibold transition-all shadow-xs cursor-pointer self-start md:self-auto"
        >
          <RefreshCw className="w-4 h-4 text-[#4A9FE8]" />
          รีเซ็ตข้อมูลทดสอบ
        </button>
      </div>

      {/* Returned Prescriptions Alert Section (Near-Miss Interception) */}
      {returnedPrescriptions.length > 0 && (
        <div className="bg-rose-50/90 border-2 border-rose-300 rounded-3xl p-6 sm:p-7 shadow-lg space-y-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rose-200 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-rose-600 text-white flex items-center justify-center text-2xl shrink-0 shadow-md">
                🚨
              </div>
              <div>
                <div className="text-xs font-black text-rose-600 tracking-wider uppercase flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  <span>MEDICATION ERROR NEAR-MISS • ตรวจพบข้อผิดพลาด</span>
                </div>
                <h3 className="text-xl font-black text-rose-950">
                  รายการยาถูกตีกลับจากจุดตรวจ Double-Check ({returnedPrescriptions.length} รายการ)
                </h3>
              </div>
            </div>
            <span className="text-xs font-bold bg-rose-200 text-rose-900 px-3 py-1 rounded-full self-start sm:self-auto border border-rose-300 font-mono">
              Action Required: กรุณาแก้ไขก่อนนำเข้าตู้
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {returnedPrescriptions.map((rx) => (
              <div
                key={rx.id}
                className="bg-white rounded-2xl p-5 border border-rose-200 shadow-sm space-y-3 relative overflow-hidden"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                      ตู้ล็อกเกอร์ช่อง {rx.lockerId}
                    </span>
                    <h4 className="text-base font-black text-slate-900 mt-1">
                      {rx.patient.name}
                    </h4>
                    <div className="text-xs text-slate-500">
                      HN: {rx.patient.hn} | อายุ {rx.patient.age} ปี
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-lg">
                    {rx.id}
                  </span>
                </div>

                {/* Reason Banner */}
                <div className="bg-rose-50/80 rounded-xl p-3 border border-rose-200 text-xs space-y-1">
                  <div className="font-bold text-rose-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>สาเหตุที่ตีกลับ: {rx.rejectedReason}</span>
                  </div>
                  {rx.rejectedNote && (
                    <div className="text-rose-800 text-[11px] pl-5 italic font-medium">
                      “{rx.rejectedNote}”
                    </div>
                  )}
                  <div className="text-[10px] text-slate-500 pt-1.5 border-t border-rose-200/60 flex items-center justify-between">
                    <span>ผู้ตรวจที่ส่งคืน: <strong className="text-slate-700">{rx.rejectedBy}</strong></span>
                    <span>{rx.rejectedAt}</span>
                  </div>
                </div>

                {/* Current Medicines in Bag */}
                <div className="text-xs space-y-1">
                  <span className="text-slate-500 text-[11px] font-bold">ยาที่จัดไว้เดิมในถุง:</span>
                  <div className="flex flex-wrap gap-1">
                    {rx.medicines.map((m, i) => (
                      <span key={i} className="text-[11px] bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md border border-slate-200">
                        💊 {m.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => handleStartEditReturned(rx)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-[#4A9FE8] hover:bg-[#3b8fd7] text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer hover:scale-[1.02]"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>แก้ไขและจัดยาใหม่ (Re-dispense)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onCancelPrescription && onCancelPrescription(rx.id)}
                    className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-700 text-xs font-bold transition-colors cursor-pointer"
                    title="ยกเลิกใบสั่งยานี้"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Locker Status Matrix */}
      <LockerGrid lockers={lockers} activeLockerId={null} />

      {/* Two Column Layout: Form & Current Active Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Form to pack medicine into Ziploc bag & dispatch to locker */}
        <div className="lg:col-span-7 bg-white border border-[#EAF6FF] rounded-3xl p-6 sm:p-7 shadow-md">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-xl font-bold text-[#183B56] flex items-center gap-2">
                <span className="text-2xl">🛍️</span>
                บันทึกถุงยาที่หมอจัดแล้ว & ส่งเข้าตู้ล็อกเกอร์
              </h3>
              <p className="text-[#486581] text-sm mt-0.5">
                ระบุคนไข้และเลือกรายการยาที่มีอยู่ในถุงซิป (เพื่อให้ตู้ล็อกเกอร์นำไปพูดอธิบายและพิมพ์ใบยา)
              </p>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#DDF4E7] text-[#1E7C4A] border border-emerald-200">
              <CheckCircle className="w-3.5 h-3.5" /> แพทย์จัดยาลงถุงแล้ว
            </span>
          </div>

          <form onSubmit={handleCreatePrescription} className="space-y-5">
            {/* Patient Name & HN */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#183B56] uppercase tracking-wider mb-1.5">
                  ชื่อ-นามสกุล ผู้ป่วย *
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น คุณตาประเสริฐ ทองดี"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full bg-[#F6FBFF] border border-[#BEE3F8] rounded-xl px-4 py-3 text-[#183B56] placeholder-slate-400 focus:outline-none focus:border-[#4A9FE8] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#183B56] uppercase tracking-wider mb-1.5">
                  เลขประจำตัว (HN)
                </label>
                <input
                  type="text"
                  placeholder="เช่น HN-55412"
                  value={patientHn}
                  onChange={(e) => setPatientHn(e.target.value)}
                  className="w-full bg-[#F6FBFF] border border-[#BEE3F8] rounded-xl px-4 py-3 text-[#183B56] placeholder-slate-400 focus:outline-none focus:border-[#4A9FE8] text-sm"
                />
              </div>
            </div>

            {/* Age & Caregiver */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#183B56] uppercase tracking-wider mb-1.5">
                  อายุ (ปี)
                </label>
                <input
                  type="number"
                  placeholder="เช่น 72"
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value)}
                  className="w-full bg-[#F6FBFF] border border-[#BEE3F8] rounded-xl px-4 py-3 text-[#183B56] placeholder-slate-400 focus:outline-none focus:border-[#4A9FE8] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#183B56] uppercase tracking-wider mb-1.5">
                  ชื่อลูกหลาน/ผู้ดูแล
                </label>
                <input
                  type="text"
                  placeholder="เช่น คุณนิด (ลูกสาว)"
                  value={caregiverName}
                  onChange={(e) => setCaregiverName(e.target.value)}
                  className="w-full bg-[#F6FBFF] border border-[#BEE3F8] rounded-xl px-4 py-3 text-[#183B56] placeholder-slate-400 focus:outline-none focus:border-[#4A9FE8] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#183B56] uppercase tracking-wider mb-1.5">
                  เบอร์โทรผู้ดูแล
                </label>
                <input
                  type="text"
                  placeholder="เช่น 089-123-4567"
                  value={caregiverPhone}
                  onChange={(e) => setCaregiverPhone(e.target.value)}
                  className="w-full bg-[#F6FBFF] border border-[#BEE3F8] rounded-xl px-4 py-3 text-[#183B56] placeholder-slate-400 focus:outline-none focus:border-[#4A9FE8] text-sm"
                />
              </div>
            </div>

            {/* Select Locker Slot */}
            <div>
              <label className="block text-xs font-bold text-[#183B56] uppercase tracking-wider mb-1.5">
                เลือกช่องตู้ล็อกเกอร์ที่ต้องการใส่ถุงซิปยา *
              </label>
              {availableLockers.length === 0 ? (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm font-semibold">
                  ⚠️ ขณะนี้ตู้เต็มทุกช่อง กรุณารอให้คนไข้มารับยาก่อน
                </div>
              ) : (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {availableLockers.map(l => (
                    <button
                      type="button"
                      key={l.id}
                      onClick={() => setSelectedLockerId(l.id.toString())}
                      className={`py-3 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                        selectedLockerId === l.id.toString()
                          ? 'bg-[#4A9FE8] border-[#4A9FE8] text-white ring-2 ring-[#4A9FE8]/40 shadow-xs'
                          : 'bg-[#F6FBFF] border-[#BEE3F8] text-[#183B56] hover:border-[#4A9FE8]'
                      }`}
                    >
                      ช่อง {l.id}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Select Medicines that are already packed in the Ziploc bag */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-[#183B56] uppercase tracking-wider">
                  เลือกยาที่ได้บรรจุลงในถุงซิปนี้แล้ว *
                </label>
                <span className="text-[11px] text-[#4A9FE8] font-bold">
                  (เลือกเพื่อให้ตู้ใช้อธิบายและพิมพ์ใบยา)
                </span>
              </div>

              {/* Explanatory banner */}
              <div className="mb-2.5 p-3 rounded-xl bg-[#EAF6FF] border border-[#BEE3F8] text-xs text-[#183B56] flex items-start gap-2">
                <span className="text-base shrink-0">💡</span>
                <div className="leading-relaxed">
                  <strong className="text-[#183B56]">หมอเป็นผู้จัดและบรรจุยาลงถุงซิปเอง:</strong> ให้ติ๊กเลือกเฉพาะรายการยาที่หมอได้จัดใส่ถุงไว้แล้ว เพื่อส่งข้อมูลให้ระบบตู้ล็อกเกอร์นำไป <strong>พูดอธิบายวิธีทานยาด้วยเสียง AI</strong> และ <strong>พิมพ์ใบจ่ายยาอัตโนมัติ (Thermal 80x150 มม.)</strong> เมื่อคนไข้มารับ
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
                {AVAILABLE_MEDICINE_CATALOG.map((med, idx) => {
                  const isSelected = selectedMedicines.some(m => m.name === med.name);
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleMedicineSelect(med)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between text-xs ${
                        isSelected
                          ? 'bg-[#DDF4E7]/60 border-emerald-500 text-emerald-950 ring-1 ring-emerald-400/40'
                          : 'bg-[#F6FBFF] border-[#EAF6FF] text-[#486581] hover:border-[#BEE3F8]'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-[#183B56] text-sm flex items-center gap-1.5">
                          <span>{med.name}</span>
                          {isSelected && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold">
                              บรรจุแล้ว
                            </span>
                          )}
                        </div>
                        <div className="text-[#627D98]">{med.category}</div>
                        <div className="text-[#4A9FE8] font-semibold mt-0.5">{med.timing.summaryTime}</div>
                      </div>
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-all ${
                        isSelected ? 'bg-emerald-600 border-emerald-500 text-white shadow-xs' : 'border-slate-300 bg-white'
                      }`}>
                        {isSelected && <CheckCircle className="w-4 h-4" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Ziploc Bag Preview Box */}
            <div className="bg-gradient-to-b from-[#F6FBFF] to-white border-2 border-dashed border-[#BEE3F8] rounded-2xl p-4 relative overflow-hidden shadow-xs">
              {/* Ziploc Red Line Strip */}
              <div className="h-2.5 bg-rose-500 rounded-full w-full mb-3 flex items-center justify-between px-3">
                <span className="h-1 w-full bg-rose-200 rounded-full"></span>
              </div>
              <div className="flex items-center justify-between mb-2 text-xs">
                <span className="font-bold text-[#183B56] flex items-center gap-1.5">
                  <span>🛍️</span> ถุงซิปล็อกยาของคนไข้ (ที่หมอบรรจุยาแล้ว)
                </span>
                <span className="text-[11px] bg-[#EAF6FF] text-[#4A9FE8] border border-[#BEE3F8] px-2.5 py-0.5 rounded-full font-bold">
                  ปลายทาง: {selectedLockerId ? `ตู้ล็อกเกอร์ช่องที่ ${selectedLockerId}` : 'ยังไม่เลือกตู้'}
                </span>
              </div>

              {/* Patient Label on Ziploc Bag */}
              <div className="bg-white text-[#183B56] rounded-xl p-3 text-xs shadow-xs border border-slate-200 space-y-1 font-sans">
                <div className="font-extrabold text-sm text-[#183B56] border-b border-slate-100 pb-1 flex items-center justify-between">
                  <span>🏥 โรงพยาบาลศูนย์สุขภาพปวงชน</span>
                  <span className="text-[10px] text-emerald-600 font-bold bg-[#DDF4E7] px-2 py-0.5 rounded">
                    แพทย์จัดยาแล้ว พร้อมนำเข้าตู้
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-0.5">
                  <div>ผู้ป่วย: <strong className="text-[#183B56]">{patientName || '..............................'}</strong></div>
                  <div>HN: <strong className="text-[#183B56]">{patientHn || '..............................'}</strong></div>
                </div>
                <div className="text-[#486581] text-[11px] pt-1">
                  รายการยาที่บรรจุในถุง ({selectedMedicines.length} รายการ):{' '}
                  {selectedMedicines.length > 0 ? (
                    <span className="text-emerald-700 font-bold">
                      {selectedMedicines.map(m => m.name).join(', ')}
                    </span>
                  ) : (
                    <span className="text-rose-500 italic">กรุณาเลือกรายการยาที่มีอยู่ในถุงซิปนี้</span>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={availableLockers.length === 0 || selectedMedicines.length === 0 || !selectedLockerId}
              className="w-full py-4 rounded-2xl bg-[#4A9FE8] hover:bg-[#3b8fd7] text-white font-black text-base shadow-lg shadow-[#4A9FE8]/25 transition-all flex items-center justify-center gap-2.5 transform active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <span className="text-xl">🛍️</span>
              <span>
                {selectedLockerId 
                  ? `✓ จัดยาเสร็จแล้ว — ส่งต่อไปยังจุดตรวจ Double-Check (เป้าหมายช่อง ${selectedLockerId})` 
                  : 'กรุณาเลือกช่องตู้เป้าหมาย'}
              </span>
            </button>
          </form>

          {showSuccessToast && (
            <div className="mt-4 p-4 bg-[#DDF4E7] border border-emerald-300 rounded-2xl text-emerald-900 text-sm font-bold flex items-center gap-2 animate-in fade-in shadow-xs">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>จัดยาเสร็จเรียบร้อย! ถุงยาถูกส่งไปยัง "จุดตรวจ Double-Check & สายพาน" เพื่อตรวจสอบ 5 Rights และลำเลียงเข้าตู้โดยอัตโนมัติค่ะ</span>
            </div>
          )}
        </div>

        {/* Right Column: Prescriptions List in Locker */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-[#183B56] flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#4A9FE8]" />
              รายการยาที่อยู่ในตู้ขณะนี้ ({prescriptions.length})
            </h3>
          </div>

          <div className="space-y-3.5 max-h-[640px] overflow-y-auto pr-1">
            {prescriptions.map((rx) => {
              const isWaiting = rx.status === 'ready_for_pickup';
              return (
                <div
                  key={rx.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    isWaiting
                      ? 'bg-white border-[#BEE3F8] shadow-sm'
                      : 'bg-slate-50 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2.5 py-0.5 rounded-full font-black bg-[#4A9FE8] text-white flex items-center gap-1">
                          <span>🛍️</span> ถุงซิปยา ช่องที่ {rx.lockerId}
                        </span>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          isWaiting ? 'bg-[#FFDFA3] text-[#7C4A03]' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {isWaiting ? 'รอมารับยา' : 'รับยาแล้ว'}
                        </span>
                      </div>
                      
                      <h4 className="text-base font-bold text-[#183B56] mt-1.5">
                        {rx.patient.name}
                      </h4>
                      <div className="text-xs text-[#627D98]">
                        HN: {rx.patient.hn} | อายุ {rx.patient.age} ปี
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[11px] text-[#627D98]">รหัส PIN</div>
                      <div className="text-xl font-mono font-black text-[#183B56]">{rx.pin}</div>
                    </div>
                  </div>

                  {/* Medicines badges */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap gap-1.5">
                    {rx.medicines.map((m, i) => (
                      <span key={i} className="text-[11px] bg-[#EAF6FF] text-[#183B56] px-2.5 py-0.5 rounded-md font-medium border border-[#BEE3F8]/50">
                        💊 {m.name}
                      </span>
                    ))}
                  </div>

                  <div className="mt-2 text-[11px] text-[#627D98] flex items-center justify-between">
                    <span>บันทึกเข้าตู้เมื่อ: {rx.createdAt}</span>
                    <span>ผู้ดูแล: {rx.patient.caregiverName}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Edit & Re-dispense Modal */}
      {editingReturnedRx && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-blue-200 space-y-5 animate-in fade-in zoom-in-95 text-slate-900">
            
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 border border-blue-200 flex items-center justify-center text-2xl shrink-0">
                  ✏️
                </div>
                <div>
                  <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                    REVISE & RE-DISPENSE PRESCRIPTION
                  </div>
                  <h3 className="text-xl font-black text-slate-900">
                    แก้ไขและจัดยาใหม่: {editingReturnedRx.patient.name}
                  </h3>
                  <div className="text-xs text-slate-500 mt-0.5">
                    เป้าหมายเดิม: ตู้ช่อง {editingReturnedRx.lockerId} | HN: {editingReturnedRx.patient.hn}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setEditingReturnedRx(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Rejection Cause Reminder */}
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3.5 text-xs text-rose-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-rose-700">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>ข้อผิดพลาดที่แจ้งโดย {editingReturnedRx.rejectedBy}:</span>
              </div>
              <div className="font-semibold text-rose-950 pl-5">
                {editingReturnedRx.rejectedReason}
              </div>
              {editingReturnedRx.rejectedNote && (
                <div className="text-rose-700 pl-5 italic text-[11px]">
                  “{editingReturnedRx.rejectedNote}”
                </div>
              )}
            </div>

            {/* Medicine Selector for Revision */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-slate-700 uppercase tracking-wider">
                  เลือกรายการยาที่ถูกต้องใส่ลงในถุงซิป *
                </label>
                <span className="text-blue-600 font-bold font-mono">
                  เลือกแล้ว {editMedicines.length} รายการ
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                {AVAILABLE_MEDICINE_CATALOG.map((med, idx) => {
                  const isSelected = editMedicines.some(m => m.name === med.name);
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleEditMedicine(med)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all select-none flex items-start gap-2.5 ${
                        isSelected
                          ? 'bg-blue-50 border-blue-400 ring-1 ring-blue-400 font-semibold text-blue-950'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="mt-0.5 rounded text-blue-600 cursor-pointer accent-blue-600"
                      />
                      <div>
                        <div className="font-bold">{med.name}</div>
                        <div className="text-[10px] text-slate-500">{med.dosage} • {med.category}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Note */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                หมายเหตุการแก้ไขของเภสัชกร (แจ้งกลับไปยังจุดตรวจ)
              </label>
              <input
                type="text"
                value={editNote}
                onChange={(e) => setEditNote(e.target.value)}
                placeholder="เช่น เปลี่ยนขนาด Amlodipine เป็น 5mg และนับจำนวนเม็ดครบแล้วค่ะ"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-400"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingReturnedRx(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleSaveAndRedispense}
                className="px-6 py-2.5 rounded-xl text-xs font-black bg-blue-600 hover:bg-blue-700 text-white shadow-md flex items-center gap-2 transition-all cursor-pointer hover:scale-[1.02]"
              >
                <Send className="w-3.5 h-3.5" />
                <span>บันทึก & ส่งกลับไปตรวจ Double-Check อีกครั้ง</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
