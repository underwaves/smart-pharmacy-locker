import React, { useState, useRef, useEffect } from 'react';
import { 
  Building2, Smartphone, ShieldCheck, Heart, 
  HelpCircle, Monitor, Sparkles, AlertCircle, Menu, X, ArrowUp,
  ExternalLink, Split, Tv, Lock, LogOut, UserCheck
} from 'lucide-react';
import HeroSection from './components/HeroSection.jsx';
import FeatureShowcase from './components/FeatureShowcase.jsx';
import HowItWorksSection from './components/HowItWorksSection.jsx';
import FaqSection from './components/FaqSection.jsx';
import KioskView from './components/KioskView.jsx';
import PharmacistView from './components/PharmacistView.jsx';
import DoubleCheckConveyorView from './components/DoubleCheckConveyorView.jsx';
import StaffLoginModal from './components/StaffLoginModal.jsx';
import { INITIAL_PRESCRIPTIONS, TOTAL_LOCKERS, MOCK_HOSPITAL_STAFF } from './data/mockData.js';

export default function App() {
  const [currentTab, setCurrentTab] = useState('kiosk'); // 'kiosk' | 'conveyor' | 'pharmacist'
  
  // Display Modes:
  // 'normal': Full website with Landing & Tab switchers
  // 'dual': Split Screen Simulator (Left: Rear Station, Right: Front Kiosk)
  // 'front': Dedicated Front Patient Kiosk (for Tablet/Front Monitor)
  // 'back': Dedicated Rear Staff Station (for Assistant/Back Monitor)
  const [displayMode, setDisplayMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const v = params.get('view');
      if (v === 'front' || v === 'back' || v === 'dual') return v;
    }
    return 'normal';
  });

  const [prescriptions, setPrescriptions] = useState(INITIAL_PRESCRIPTIONS);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDemoRxId, setActiveDemoRxId] = useState(null);
  
  const pickupSectionRef = useRef(null);

  // 12 Lockers initial state
  const [lockers, setLockers] = useState(() => {
    return Array.from({ length: TOTAL_LOCKERS }, (_, i) => {
      const lockerId = i + 1;
      const assigned = INITIAL_PRESCRIPTIONS.find(p => p.lockerId === lockerId && p.status === 'ready_for_pickup');
      return {
        id: lockerId,
        status: assigned ? 'occupied' : 'available',
        prescriptionId: assigned ? assigned.id : null,
      };
    });
  });

  // Keep lockers in sync with prescriptions
  const syncLockers = (updatedPrescriptions) => {
    setLockers(prevLockers => {
      return prevLockers.map(locker => {
        const activeRx = updatedPrescriptions.find(
          p => p.lockerId === locker.id && p.status === 'ready_for_pickup'
        );
        return {
          ...locker,
          status: activeRx ? 'occupied' : 'available',
          prescriptionId: activeRx ? activeRx.id : null,
        };
      });
    });
  };

  // Cross-Window / Multi-Screen Real-time Sync (e.g., Front Screen Tablet & Rear Screen Laptop)
  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return;
    const channel = new BroadcastChannel('smart_pharmacy_locker_sync');
    channel.onmessage = (event) => {
      const { type, payload } = event.data || {};
      if (type === 'SYNC_PRESCRIPTIONS' && Array.isArray(payload)) {
        setPrescriptions(payload);
        syncLockers(payload);
      }
    };
    return () => {
      channel.close();
    };
  }, []);

  const broadcastPrescriptions = (updated) => {
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        const channel = new BroadcastChannel('smart_pharmacy_locker_sync');
        channel.postMessage({ type: 'SYNC_PRESCRIPTIONS', payload: updated });
        channel.close();
      } catch {
        // ignore
      }
    }
  };

  // When patient picks up medicine from kiosk
  const handleCollectPrescription = (prescriptionId, lockerId) => {
    const updated = prescriptions.map(p => {
      if (p.id === prescriptionId) {
        return {
          ...p,
          status: 'collected',
          collectedAt: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.'
        };
      }
      return p;
    });

    setPrescriptions(updated);
    syncLockers(updated);
    broadcastPrescriptions(updated);
  };

  // Staff Authentication & Audit Trail
  const [authenticatedStaff, setAuthenticatedStaff] = useState(null);
  const [isStaffLoginModalOpen, setIsStaffLoginModalOpen] = useState(false);
  const [pendingTabAfterLogin, setPendingTabAfterLogin] = useState(null);

  const handleRequestStaffTab = (tabName) => {
    if (authenticatedStaff) {
      setCurrentTab(tabName);
    } else {
      setPendingTabAfterLogin(tabName);
      setIsStaffLoginModalOpen(true);
    }
  };

  const handleStaffLoginSuccess = (staff) => {
    setAuthenticatedStaff(staff);
    setIsStaffLoginModalOpen(false);
    if (pendingTabAfterLogin) {
      setCurrentTab(pendingTabAfterLogin);
      setPendingTabAfterLogin(null);
    }
  };

  const handleStaffLogout = () => {
    setAuthenticatedStaff(null);
    setCurrentTab('kiosk');
  };

  // When medicine is verified at Double-Check station and sorted into locker by conveyor
  const handleApproveAndFeedConveyor = (prescriptionId, lockerId) => {
    const updated = prescriptions.map(p => {
      if (p.id === prescriptionId) {
        return {
          ...p,
          status: 'ready_for_pickup',
          checkedBy: authenticatedStaff ? `${authenticatedStaff.name} (${authenticatedStaff.licenseNo})` : 'พว. กรรณิการ์ สุขสวัสดิ์ (พ.55432)',
          checkedById: authenticatedStaff?.id || 'STF-03',
          checkedAt: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.'
        };
      }
      return p;
    });

    setPrescriptions(updated);
    syncLockers(updated);
    broadcastPrescriptions(updated);
  };

  // When inspector rejects medicine at Double-Check station and returns it to pharmacy
  const handleRejectPrescription = (prescriptionId, rejectInfo) => {
    const updated = prescriptions.map(p => {
      if (p.id === prescriptionId) {
        return {
          ...p,
          status: 'rejected_returned',
          rejectedBy: authenticatedStaff ? `${authenticatedStaff.name} (${authenticatedStaff.licenseNo})` : 'พว. กรรณิการ์ รักษาดี (พ.11892)',
          rejectedById: authenticatedStaff?.id || 'STF-03',
          rejectedReason: rejectInfo.reason,
          rejectedReasonCode: rejectInfo.code,
          rejectedNote: rejectInfo.note || '',
          rejectedAt: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.'
        };
      }
      return p;
    });

    setPrescriptions(updated);
    syncLockers(updated);
    broadcastPrescriptions(updated);
  };

  // When pharmacist re-dispenses / fixes a returned prescription
  const handleRedispensePrescription = (prescriptionId, updatedMedicines, updatedNotes) => {
    const updated = prescriptions.map(p => {
      if (p.id === prescriptionId) {
        return {
          ...p,
          medicines: updatedMedicines || p.medicines,
          notes: updatedNotes || p.notes,
          status: 'dispensed_waiting_check', // ส่งกลับไปคิวตรวจ Double-Check อีกครั้ง
          pharmacist: authenticatedStaff ? `${authenticatedStaff.name} (${authenticatedStaff.licenseNo})` : p.pharmacist,
          redispensedBy: authenticatedStaff ? `${authenticatedStaff.name} (${authenticatedStaff.licenseNo})` : 'ภก. ธนวัฒน์ วงศ์วิจิตร (ภ.34211)',
          redispensedAt: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.',
          previousRejection: {
            rejectedBy: p.rejectedBy,
            rejectedReason: p.rejectedReason,
            rejectedNote: p.rejectedNote,
            rejectedAt: p.rejectedAt
          }
        };
      }
      return p;
    });

    setPrescriptions(updated);
    syncLockers(updated);
    broadcastPrescriptions(updated);
  };

  // When pharmacist cancels an invalid prescription
  const handleCancelPrescription = (prescriptionId) => {
    const updated = prescriptions.filter(p => p.id !== prescriptionId);
    setPrescriptions(updated);
    syncLockers(updated);
    broadcastPrescriptions(updated);
  };

  // When pharmacist packs new medicine
  const handleAddPrescription = (newRx) => {
    const rxWithStaff = {
      ...newRx,
      pharmacist: authenticatedStaff ? `${authenticatedStaff.name} (${authenticatedStaff.licenseNo})` : newRx.pharmacist,
      dispensedById: authenticatedStaff?.id || 'STF-01',
      dispensedLicense: authenticatedStaff?.licenseNo || 'ภ.34211'
    };
    const updated = [rxWithStaff, ...prescriptions];
    setPrescriptions(updated);
    syncLockers(updated);
    broadcastPrescriptions(updated);
  };

  // Reset demo data
  const handleResetData = () => {
    setPrescriptions(INITIAL_PRESCRIPTIONS);
    syncLockers(INITIAL_PRESCRIPTIONS);
    broadcastPrescriptions(INITIAL_PRESCRIPTIONS);
  };

  // Smooth scroll helpers
  const scrollToPickup = () => {
    setCurrentTab('kiosk');
    setTimeout(() => {
      const el = document.getElementById('pickup-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const scrollToSection = (id) => {
    setCurrentTab('kiosk');
    setIsMobileMenuOpen(false);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handleQuickDemoFromHero = (rxId) => {
    setActiveDemoRxId(null);
    setCurrentTab('kiosk');
    setTimeout(() => {
      setActiveDemoRxId(rxId);
      const el = document.getElementById('pickup-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  // 1. Dedicated Front Screen View (?view=front) - สำหรับจอ Tablet หน้าตู้ (ฝั่งคนไข้)
  if (displayMode === 'front') {
    return (
      <div className="min-h-screen bg-[#F6FBFF] text-[#183B56] flex flex-col font-['Noto_Sans_Thai_Looped',sans-serif]">
        <div className="bg-sky-600 text-white px-4 py-2 flex items-center justify-between text-xs font-bold shadow-md">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 animate-ping" />
            <span>🖥️ จอหน้าตู้ (Front Kiosk Display) • สำหรับผู้ป่วยและผู้สูงอายุรับยา</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDisplayMode('dual')}
              className="bg-white/20 hover:bg-white/30 text-white px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
            >
              🖥️+🖥️ ดู 2 จอพร้อมกัน
            </button>
            <button
              onClick={() => setDisplayMode('normal')}
              className="bg-white/20 hover:bg-white/30 text-white px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
            >
              ✖️ ออกจากโหมดจอหน้า
            </button>
          </div>
        </div>
        <div className="p-4 sm:p-6 md:p-8 flex-1 max-w-7xl mx-auto w-full">
          <KioskView
            lockers={lockers}
            prescriptions={prescriptions}
            onCollectPrescription={handleCollectPrescription}
            pickupSectionRef={pickupSectionRef}
            activeDemoRxId={activeDemoRxId}
          />
        </div>
      </div>
    );
  }

  // 2. Dedicated Back Screen View (?view=back) - สำหรับจอหลังตู้ (ฝั่งผู้ช่วยตรวจยาและคุมสายพาน)
  if (displayMode === 'back') {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-['Noto_Sans_Thai_Looped',sans-serif]">
        <div className="bg-emerald-700 text-white px-4 py-2 flex items-center justify-between text-xs font-bold shadow-md">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 animate-ping" />
            <span>🖥️ จอหลังตู้ (Rear Station Display) • สถานีตรวจ Double-Check & ควบคุมสายพาน</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDisplayMode('dual')}
              className="bg-white/20 hover:bg-white/30 text-white px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
            >
              🖥️+🖥️ ดู 2 จอพร้อมกัน
            </button>
            <button
              onClick={() => setDisplayMode('normal')}
              className="bg-white/20 hover:bg-white/30 text-white px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
            >
              ✖️ ออกจากโหมดจอหลัง
            </button>
          </div>
        </div>
        <div className="p-4 sm:p-6 md:p-8 flex-1 max-w-7xl mx-auto w-full">
          <DoubleCheckConveyorView
            prescriptions={prescriptions}
            onApproveAndFeedConveyor={handleApproveAndFeedConveyor}
            onRejectPrescription={handleRejectPrescription}
            lockers={lockers}
            authenticatedStaff={authenticatedStaff}
          />
        </div>
      </div>
    );
  }

  // 3. Dual-Screen Interactive Simulator (?view=dual) - โหมดจำลอง 2 จอข้างกันสุดล้ำ
  if (displayMode === 'dual') {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col font-['Noto_Sans_Thai_Looped',sans-serif]">
        {/* Dual Screen Control Header */}
        <header className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-lg sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-sky-500 flex items-center justify-center text-xl font-black shadow-md">
              🖥️
            </div>
            <div>
              <div className="font-extrabold text-sm sm:text-base text-white flex items-center gap-2">
                <span>ระบบจำลอง 2 หน้าจอพร้อมกัน (Dual-Screen Interactive Simulator)</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-mono">
                  LIVE SYNC ACTIVE
                </span>
              </div>
              <div className="text-xs text-slate-400">
                ฝั่งซ้าย: จอหลังตู้ (ผู้ช่วยตรวจยา & ปล่อยสายพาน) • ฝั่งขวา: จอหน้าตู้ (คนไข้รับยา & ฟังเสียง AI)
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <a
              href={`${window.location.pathname}?view=back`}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 px-3 py-1.5 rounded-xl border border-slate-700 font-bold transition-colors"
              title="เปิดจอหลังในแท็บใหม่"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>แยกจอหลัง</span>
            </a>
            <a
              href={`${window.location.pathname}?view=front`}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-sky-300 px-3 py-1.5 rounded-xl border border-slate-700 font-bold transition-colors"
              title="เปิดจอหน้าในแท็บใหม่"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>แยกจอหน้า</span>
            </a>
            <button
              onClick={() => setDisplayMode('normal')}
              className="bg-white/10 hover:bg-white/20 text-white px-3.5 py-1.5 rounded-xl font-bold transition-colors cursor-pointer"
            >
              ✖️ กลับหน้าหลัก
            </button>
          </div>
        </header>

        {/* 2-Screen Split View Layout */}
        <div className="flex-1 p-3 sm:p-5 grid grid-cols-1 xl:grid-cols-2 gap-6 w-full max-w-[1920px] mx-auto">
          
          {/* Left: Rear Station (Screen 2) */}
          <div className="bg-slate-900 border-2 border-emerald-500/40 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col space-y-4">
            <div className="bg-emerald-950/80 border border-emerald-700/60 rounded-2xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">👩‍⚕️</span>
                <div>
                  <div className="font-bold text-xs text-emerald-300 uppercase tracking-wider">
                    SCREEN 2: REAR STATION (จอหลังตู้)
                  </div>
                  <div className="text-sm font-black text-white">
                    สถานีผู้ช่วยตรวจยา (Double-Check) & ควบคุมสายพานเข้าตู้
                  </div>
                </div>
              </div>
              <span className="text-xs font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-500/30">
                Staff Terminal
              </span>
            </div>

            <div className="flex-1">
              <DoubleCheckConveyorView
                prescriptions={prescriptions}
                onApproveAndFeedConveyor={handleApproveAndFeedConveyor}
                onRejectPrescription={handleRejectPrescription}
                lockers={lockers}
                authenticatedStaff={authenticatedStaff}
              />
            </div>
          </div>

          {/* Right: Front Kiosk (Screen 1) */}
          <div className="bg-[#F6FBFF] text-[#183B56] border-2 border-sky-400/50 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col space-y-4">
            <div className="bg-sky-100 border border-sky-200 rounded-2xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">👵</span>
                <div>
                  <div className="font-bold text-xs text-sky-700 uppercase tracking-wider">
                    SCREEN 1: FRONT KIOSK (จอหน้าตู้)
                  </div>
                  <div className="text-sm font-black text-slate-900">
                    หน้าจอผู้ป่วย/ผู้สูงอายุรับยา & ฟังเสียง AI & สแตนด์บายพยาบาล
                  </div>
                </div>
              </div>
              <span className="text-xs font-mono bg-sky-200 text-sky-800 px-2 py-0.5 rounded-md font-bold">
                Patient Terminal
              </span>
            </div>

            <div className="flex-1">
              <KioskView
                lockers={lockers}
                prescriptions={prescriptions}
                onCollectPrescription={handleCollectPrescription}
                pickupSectionRef={pickupSectionRef}
                activeDemoRxId={activeDemoRxId}
              />
            </div>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6FBFF] text-[#183B56] flex flex-col font-['Noto_Sans_Thai_Looped',sans-serif]">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#EAF6FF] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <div 
            onClick={() => scrollToSection('hero')}
            className="flex items-center gap-3 cursor-pointer select-none"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#4A9FE8] flex items-center justify-center text-white shadow-md text-xl">
              💊
            </div>
            <div>
              <div className="font-extrabold text-lg sm:text-xl text-[#183B56] leading-none">
                ตู้รับยาอัจฉริยะ
              </div>
              <div className="text-[11px] text-[#627D98] mt-1 font-medium">
                โรงพยาบาลศูนย์สุขภาพปวงชน
              </div>
            </div>
          </div>

          {/* Right Action: Clean & Spacious Controls */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            
            {/* Desktop 3-tab pill switcher */}
            <div className="hidden sm:flex items-center p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80 text-xs font-bold shadow-2xs">
              <button
                onClick={() => setCurrentTab('kiosk')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  currentTab === 'kiosk'
                    ? 'bg-white text-[#4A9FE8] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>🧓 หน้าตู้รับยา</span>
              </button>

              <button
                onClick={() => handleRequestStaffTab('conveyor')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                  currentTab === 'conveyor'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>⚙️ สายพานตรวจยา</span>
                {prescriptions.filter(p => p.status === 'dispensed_waiting_check').length > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                    currentTab === 'conveyor' ? 'bg-white text-emerald-800' : 'bg-amber-500 text-white animate-pulse'
                  }`}>
                    {prescriptions.filter(p => p.status === 'dispensed_waiting_check').length}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleRequestStaffTab('pharmacist')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  currentTab === 'pharmacist'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>👨‍⚕️ ห้องยา</span>
                {prescriptions.filter(p => p.status === 'rejected_returned').length > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                    currentTab === 'pharmacist' ? 'bg-white text-rose-700' : 'bg-rose-500 text-white animate-bounce shadow-xs'
                  }`}>
                    🚨 {prescriptions.filter(p => p.status === 'rejected_returned').length}
                  </span>
                )}
              </button>
            </div>

            {/* Dual Screen Simulator Button */}
            <button
              onClick={() => setDisplayMode('dual')}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-700 hover:to-sky-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer hover:scale-[1.02]"
              title="เปิดโหมดจำลอง 2 หน้าจอพร้อมกัน (จอหลังผู้ช่วยตรวจยา + จอหน้าคนไข้)"
            >
              <Split className="w-3.5 h-3.5" />
              <span>🖥️ จำลอง 2 จอ</span>
            </button>

            {/* Staff Authentication Status Badge or Login Button */}
            {authenticatedStaff ? (
              <div className="hidden lg:flex items-center gap-2 bg-slate-900 text-white pl-2.5 pr-1.5 py-1 rounded-xl border border-slate-700 text-xs shadow-xs">
                <span className="text-base">{authenticatedStaff.avatar}</span>
                <div className="text-left leading-tight">
                  <div className="font-bold text-white max-w-[120px] truncate">{authenticatedStaff.name}</div>
                  <div className="text-[10px] text-emerald-400 font-mono">{authenticatedStaff.licenseNo}</div>
                </div>
                <button
                  onClick={handleStaffLogout}
                  className="ml-1 p-1 rounded-lg bg-slate-800 hover:bg-rose-900/80 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="ออกจากระบบเจ้าหน้าที่"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setPendingTabAfterLogin(null); setIsStaffLoginModalOpen(true); }}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-300 transition-all cursor-pointer shadow-2xs"
                title="เข้าสู่ระบบสำหรับเจ้าหน้าที่เพื่อจัดการหลังบ้าน"
              >
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                <span>🔒 เจ้าหน้าที่</span>
              </button>
            )}

            {/* Mobile quick switcher button */}
            <button
              onClick={() => {
                if (currentTab === 'kiosk') setCurrentTab('conveyor');
                else if (currentTab === 'conveyor') setCurrentTab('pharmacist');
                else setCurrentTab('kiosk');
              }}
              className="sm:hidden px-3 py-2 rounded-xl bg-[#EAF6FF] text-[#183B56] border border-[#BEE3F8] text-xs font-bold flex items-center gap-1.5"
            >
              <span>{currentTab === 'kiosk' ? '👵 ตู้รับยา' : currentTab === 'conveyor' ? '⚙️ สายพาน' : '👨‍⚕️ ห้องยา'}</span>
              <span className="text-[10px] text-[#4A9FE8]">สลับ ❯</span>
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-[#183B56] hover:bg-[#EAF6FF]"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-[#EAF6FF] bg-white px-5 py-4 space-y-3 font-semibold text-sm shadow-lg">
            <div className="border-b border-slate-100 pb-2 space-y-1">
              <div className="text-xs text-slate-400 font-bold uppercase">เลือกโหมดหน้าจอ</div>
              <button 
                onClick={() => { setCurrentTab('kiosk'); setIsMobileMenuOpen(false); }}
                className={`block w-full text-left py-2 px-3 rounded-xl font-bold ${currentTab === 'kiosk' ? 'bg-[#EAF6FF] text-[#4A9FE8]' : 'text-slate-700'}`}
              >
                👵 ตู้รับยาคนไข้ (Kiosk + พยาบาลข้างตู้)
              </button>
              <button 
                onClick={() => { setCurrentTab('conveyor'); setIsMobileMenuOpen(false); }}
                className={`block w-full text-left py-2 px-3 rounded-xl font-bold ${currentTab === 'conveyor' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700'}`}
              >
                ⚙️ จุดตรวจ Double-Check & สายพานลำเลียง ({prescriptions.filter(p => p.status === 'dispensed_waiting_check').length})
              </button>
              <button 
                onClick={() => { setCurrentTab('pharmacist'); setIsMobileMenuOpen(false); }}
                className={`block w-full text-left py-2 px-3 rounded-xl font-bold ${currentTab === 'pharmacist' ? 'bg-blue-50 text-blue-700' : 'text-slate-700'}`}
              >
                👨‍⚕️ จัดยาห้องยา (Pharmacist Portal)
              </button>
              <button 
                onClick={() => { setDisplayMode('dual'); setIsMobileMenuOpen(false); }}
                className="block w-full text-left py-2 px-3 rounded-xl font-black bg-gradient-to-r from-emerald-600 to-sky-600 text-white shadow-xs"
              >
                🖥️+🖥️ โหมดสาธิต 2 จอพร้อมกัน (Dual-Screen)
              </button>
            </div>

            <button onClick={() => scrollToSection('hero')} className="block w-full text-left py-1 text-[#183B56]">
              หน้าหลัก
            </button>
            <button onClick={() => scrollToSection('how-it-works')} className="block w-full text-left py-1 text-[#183B56]">
              วิธีใช้งาน
            </button>
            <button onClick={scrollToPickup} className="block w-full text-left py-1 text-[#4A9FE8] font-bold">
              ยาของฉัน (รับยา)
            </button>
            <button onClick={() => scrollToSection('faq')} className="block w-full text-left py-1 text-[#183B56]">
              คำถามที่พบบ่อย
            </button>
            <button onClick={() => scrollToSection('contact')} className="block w-full text-left py-1 text-[#183B56]">
              ติดต่อเรา
            </button>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8">
        {currentTab === 'kiosk' && (
          <div className="space-y-12">
            {/* Hero Section */}
            <div id="hero">
              <HeroSection
                onScrollToPickup={scrollToPickup}
                onScrollToGuide={() => scrollToSection('how-it-works')}
                onQuickDemo={handleQuickDemoFromHero}
              />
            </div>

            {/* Main Interactive Pickup Section (Kiosk) */}
            <KioskView
              lockers={lockers}
              prescriptions={prescriptions}
              onCollectPrescription={handleCollectPrescription}
              pickupSectionRef={pickupSectionRef}
              activeDemoRxId={activeDemoRxId}
            />

            {/* Feature Showcase (สไตล์สไลด์นำเสนอ Behance/Figma) */}
            <FeatureShowcase onTryPickup={scrollToPickup} />

            {/* How It Works Section */}
            <HowItWorksSection />

            {/* FAQ & Contact Section */}
            <FaqSection />
          </div>
        )}

        {currentTab === 'conveyor' && (
          <DoubleCheckConveyorView
            prescriptions={prescriptions}
            onApproveAndFeedConveyor={handleApproveAndFeedConveyor}
            onRejectPrescription={handleRejectPrescription}
            lockers={lockers}
            authenticatedStaff={authenticatedStaff}
          />
        )}

        {currentTab === 'pharmacist' && (
          <PharmacistView
            lockers={lockers}
            prescriptions={prescriptions}
            onAddPrescription={handleAddPrescription}
            onRedispensePrescription={handleRedispensePrescription}
            onCancelPrescription={handleCancelPrescription}
            onResetData={handleResetData}
            authenticatedStaff={authenticatedStaff}
          />
        )}
      </main>

      {/* Warm Healthcare Footer */}
      <footer className="border-t border-[#EAF6FF] bg-white py-8 text-center text-xs text-[#627D98] mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500 inline" />
            <span className="font-medium text-[#334E68]">
              Smart Medicine Locker — ตู้รับยาที่เข้าใจคุณ เพื่อผู้สูงอายุและครอบครัวไทย
            </span>
          </div>
          <div className="text-[#829AB1]">
            โรงพยาบาลศูนย์สุขภาพปวงชน • ระบบต้นแบบเพื่อสุขภาวะที่ดี © 2026
          </div>
        </div>
      </footer>

      {/* Staff Authentication Gate Modal */}
      <StaffLoginModal
        isOpen={isStaffLoginModalOpen}
        onClose={() => {
          setIsStaffLoginModalOpen(false);
          setPendingTabAfterLogin(null);
        }}
        onLoginSuccess={handleStaffLoginSuccess}
        targetModeName={
          pendingTabAfterLogin === 'conveyor'
            ? 'จุดตรวจ Double-Check & สายพานลำเลียง'
            : pendingTabAfterLogin === 'pharmacist'
            ? 'ระบบบันทึกและจัดยาห้องยา (Pharmacist Portal)'
            : 'ระบบบริหารจัดการสำหรับเจ้าหน้าที่'
        }
      />

    </div>
  );
}
