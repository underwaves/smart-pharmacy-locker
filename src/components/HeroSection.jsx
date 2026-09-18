import React, { useState } from 'react';
import { Volume2, VolumeX, ArrowDown, Sparkles, ShieldCheck, Heart, CheckCircle2, ChevronRight } from 'lucide-react';
import { voiceService } from '../services/voiceService.js';

export default function HeroSection({ onScrollToPickup, onScrollToGuide, onQuickDemo }) {
  const [isPlayingAvatar, setIsPlayingAvatar] = useState(false);

  const avatarSpeechText = "สวัสดีค่ะคุณยาย วันนี้มียา 2 รายการนะคะ ยาเม็ดแรกให้รับประทานหลังอาหารเช้า 1 เม็ดค่ะ";

  const handleToggleVoice = () => {
    if (isPlayingAvatar) {
      voiceService.stop();
      setIsPlayingAvatar(false);
    } else {
      setIsPlayingAvatar(true);
      voiceService.speak(
        avatarSpeechText,
        () => setIsPlayingAvatar(true),
        () => setIsPlayingAvatar(false)
      );
    }
  };

  return (
    <section className="relative pt-8 pb-16 overflow-hidden">
      {/* Ambient Gradient Glows (Inspired by modern SaaS web templates like Fiilo & Lighter) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-[#EAF6FF] via-[#DDF4E7]/50 to-[#EAF6FF] rounded-full blur-3xl opacity-70 -z-10 pointer-events-none"></div>
      <div className="absolute top-36 -left-20 w-72 h-72 bg-[#4A9FE8]/10 rounded-full blur-2xl -z-10 pointer-events-none"></div>
      <div className="absolute top-48 -right-20 w-80 h-80 bg-[#FFDFA3]/25 rounded-full blur-2xl -z-10 pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        
        {/* Floating Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-[#BEE3F8] text-[#4A9FE8] text-xs sm:text-sm font-bold shadow-xs backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>นวัตกรรมบริการทางการแพทย์ • โรงพยาบาลศูนย์สุขภาพปวงชน</span>
        </div>

        {/* Centered Modern Headline */}
        <div className="space-y-3 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-black text-[#183B56] tracking-tight leading-[1.15]">
            ตู้รับยาอัจฉริยะ <br />
            <span className="bg-gradient-to-r from-[#4A9FE8] via-[#3587cf] to-[#183B56] bg-clip-text text-transparent">
              ดูแลคุณ... ทุกช่วงเวลา
            </span>
          </h1>
          <p className="text-base sm:text-xl text-[#486581] max-w-2xl mx-auto font-normal leading-relaxed">
            รับยาง่าย ปลอดภัย พร้อม AI อธิบายวิธีกินยาให้เข้าใจง่าย <br className="hidden sm:inline" />
            ออกแบบเป็นพิเศษเพื่อผู้สูงอายุ ตัวหนังสือใหญ่ ฟังซ้ำได้ ไม่ต้องรอคิว
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onScrollToPickup}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#4A9FE8] hover:bg-[#3b8fd7] text-white font-black text-lg shadow-lg shadow-[#4A9FE8]/30 transition-all duration-200 transform active:scale-95 flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <span>💊 รับยาของฉัน</span>
            <ArrowDown className="w-5 h-5 animate-bounce" />
          </button>

          <button
            onClick={onScrollToGuide}
            className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white hover:bg-slate-50 text-[#183B56] border border-[#BEE3F8] font-bold text-lg transition-all duration-200 shadow-xs cursor-pointer"
          >
            📖 ดูวิธีใช้งาน
          </button>
        </div>

        {/* MODERN FLOATING SHOWCASE MOCKUP (สไตล์ Lighter / Fiilo แบบในภาพ) */}
        <div className="pt-8">
          <div className="relative mx-auto max-w-4xl rounded-3xl bg-white/85 border border-[#BEE3F8] shadow-2xl p-4 sm:p-7 backdrop-blur-xl transition-all">
            
            {/* Top Device / App Frame Bar */}
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100 text-xs text-[#627D98]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-400"></span>
                <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                <span className="ml-2 font-mono text-[11px] text-slate-400">smart-locker.kiosk/patient</span>
              </div>
              <div className="flex items-center gap-2 font-semibold text-[#183B56]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>ตู้ล็อกเกอร์ออนไลน์ 12 ช่อง • พร้อมบริการ</span>
              </div>
            </div>

            {/* Showcase Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center text-left">
              
              {/* Doctor / Avatar Card */}
              <div className="md:col-span-5 bg-gradient-to-b from-[#F6FBFF] to-[#EAF6FF] rounded-2xl p-5 border border-[#BEE3F8] flex flex-col justify-between h-full">
                <div className="flex items-center gap-3.5 mb-3">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-md border border-[#BEE3F8] flex items-center justify-center text-3xl shrink-0">
                    👩‍⚕️
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-[#DDF4E7] text-[#1E7C4A] px-2 py-0.5 rounded-md">
                      เภสัชกร AI ผู้ช่วยใจดี
                    </span>
                    <h4 className="font-bold text-[#183B56] text-base mt-1">
                      หมอจัดยาใส่ถุงซิป & พูดอธิบาย
                    </h4>
                  </div>
                </div>

                <p className="text-xs text-[#486581] leading-relaxed mb-4">
                  “ยาจัดลงถุงซิปล็อกเรียบร้อย พร้อมเสียง AI พูดช้าๆ ชัดเจน อบอุ่น เพื่อให้คุณตาคุณยายมั่นใจที่สุดค่ะ”
                </p>

                <button
                  onClick={handleToggleVoice}
                  className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer ${
                    isPlayingAvatar
                      ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300 animate-pulse'
                      : 'bg-[#4A9FE8] hover:bg-[#3b8fd7] text-white'
                  }`}
                >
                  {isPlayingAvatar ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  <span>{isPlayingAvatar ? 'กำลังอ่านออกเสียง...' : '🔊 กดลองฟังเสียงพูดตัวอย่าง'}</span>
                </button>
              </div>

              {/* Quick Action Preview Box */}
              <div className="md:col-span-7 bg-[#F6FBFF] border border-[#BEE3F8] rounded-2xl p-5 space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#4A9FE8]">
                    ทดลองใช้งานเสมือนจริง (Interactive Demo)
                  </span>
                  <span className="text-[11px] text-[#627D98]">คลิกเพื่อทดสอบรับยา</span>
                </div>

                {/* Speech Bubble simulation */}
                <div className="bg-white border border-[#BEE3F8] p-3.5 rounded-xl text-xs sm:text-sm font-medium text-[#183B56] shadow-2xs leading-relaxed">
                  🔊 <strong>AI:</strong> “สวัสดีค่ะคุณยาย วันนี้มียา 2 รายการนะคะ ยาเม็ดแรกให้รับประทานหลังอาหารเช้า 1 เม็ดค่ะ”
                </div>

                {/* Direct Demo Trigger Cards */}
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <button
                    onClick={() => onQuickDemo('RX-2026-001')}
                    className="p-3 rounded-xl bg-white hover:bg-[#EAF6FF] border border-[#BEE3F8] text-left transition-all shadow-2xs cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#183B56] group-hover:text-[#4A9FE8]">
                        👵 คุณยายสมศรี
                      </span>
                      <span className="text-[10px] bg-[#DDF4E7] text-[#1E7C4A] font-bold px-1.5 py-0.5 rounded">
                        ตู้ 3
                      </span>
                    </div>
                    <div className="text-[10px] text-[#627D98] mt-1 flex items-center gap-1">
                      <span>รหัส PIN: 5284</span>
                      <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </button>

                  <button
                    onClick={() => onQuickDemo('RX-2026-002')}
                    className="p-3 rounded-xl bg-white hover:bg-[#EAF6FF] border border-[#BEE3F8] text-left transition-all shadow-2xs cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#183B56] group-hover:text-[#4A9FE8]">
                        👴 คุณตาทวีศักดิ์
                      </span>
                      <span className="text-[10px] bg-[#EAF6FF] text-[#4A9FE8] font-bold px-1.5 py-0.5 rounded">
                        ตู้ 7
                      </span>
                    </div>
                    <div className="text-[10px] text-[#627D98] mt-1 flex items-center gap-1">
                      <span>รหัส PIN: 1947</span>
                      <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </button>
                </div>

                {/* Sub Features */}
                <div className="flex items-center justify-between text-[11px] text-[#627D98] pt-1">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> สั่งพิมพ์สลิปความร้อน 80mm
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> แจ้งเตือนเข้า LINE ลูกหลาน
                  </span>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
