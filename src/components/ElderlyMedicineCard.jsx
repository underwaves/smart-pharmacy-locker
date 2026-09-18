import React, { useState } from 'react';
import { Volume2, VolumeX, AlertTriangle, Clock, Pill, Sun, Moon, Sunrise, Coffee } from 'lucide-react';
import { voiceService } from '../services/voiceService.js';

export default function ElderlyMedicineCard({ medicine, index, isCurrentlySpeaking, onPlayVoice }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSpeak = () => {
    if (isPlaying) {
      voiceService.stop();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      if (onPlayVoice) onPlayVoice(medicine.id);
      voiceService.speak(medicine.audioScript, () => {
        setIsPlaying(true);
      }, () => {
        setIsPlaying(false);
      });
    }
  };

  return (
    <div className={`relative bg-white border-2 rounded-3xl p-6 sm:p-7 transition-all duration-300 shadow-md ${
      isPlaying ? 'border-[#4A9FE8] ring-4 ring-[#4A9FE8]/20 shadow-lg' : 'border-[#EAF6FF] hover:border-[#BEE3F8]'
    }`}>
      {/* Top Header: Medicine Name & Voice button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-[#EAF6FF] text-[#4A9FE8] border border-[#BEE3F8] text-xs px-3 py-0.5 rounded-full font-bold">
              รายการที่ {index + 1}
            </span>
            <span className="text-[#486581] text-sm font-medium">
              {medicine.category}
            </span>
          </div>
          <h4 className="text-2xl sm:text-3xl font-bold text-[#183B56] tracking-tight">
            {medicine.name}
          </h4>
          <p className="text-[#486581] text-base mt-0.5">
            ชื่อการค้า: <span className="text-[#183B56] font-semibold">{medicine.brandName}</span> ({medicine.dosage})
          </p>
        </div>

        {/* Big Audio Button for the Elderly */}
        <button
          onClick={handleSpeak}
          className={`flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl font-bold text-base sm:text-lg transition-all transform active:scale-95 shadow-md cursor-pointer ${
            isPlaying
              ? 'bg-amber-400 text-slate-900 ring-4 ring-amber-300/50 animate-pulse'
              : 'bg-[#4A9FE8] hover:bg-[#3b8fd7] text-white'
          }`}
        >
          {isPlaying ? (
            <>
              <VolumeX className="w-6 h-6" />
              <span>กำลังอ่านให้ฟัง... (กดเพื่อหยุด)</span>
            </>
          ) : (
            <>
              <Volume2 className="w-6 h-6" />
              <span>🔊 กดฟังเสียงอธิบายยานี้</span>
            </>
          )}
        </button>
      </div>

      {/* Center Details: Visual Pill and Timing */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 my-5 items-center">
        {/* Pill Appearance Box */}
        <div className="md:col-span-4 bg-[#F6FBFF] rounded-2xl p-4 border border-[#EAF6FF] flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#EAF6FF] border border-[#BEE3F8] flex items-center justify-center shrink-0">
            <Pill className="w-9 h-9 text-[#4A9FE8] transform -rotate-45" />
          </div>
          <div>
            <div className="text-xs text-[#627D98] font-medium">ลักษณะเม็ดยา</div>
            <div className="text-lg font-bold text-[#183B56] mt-0.5">{medicine.pillColor}</div>
            <div className="text-sm text-[#486581]">{medicine.pillShape}</div>
          </div>
        </div>

        {/* How & When to take */}
        <div className="md:col-span-8 bg-[#EAF6FF]/60 border border-[#BEE3F8] rounded-2xl p-4">
          <div className="text-xs text-[#4A9FE8] font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Clock className="w-4 h-4" /> วิธีและเวลารับประทาน
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#183B56] mb-2">
            👉 {medicine.timing.mealRelation}
          </div>

          {/* Timing Badges (Morning, Noon, Evening, Bedtime) */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#BEE3F8]/60">
            {medicine.timing.morning && (
              <span className="flex items-center gap-1.5 bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] px-3 py-1 rounded-xl text-sm font-bold">
                <Sunrise className="w-4 h-4 text-[#D97706]" /> เช้า
              </span>
            )}
            {medicine.timing.noon && (
              <span className="flex items-center gap-1.5 bg-[#FFEDD5] text-[#9A3412] border border-[#FED7AA] px-3 py-1 rounded-xl text-sm font-bold">
                <Sun className="w-4 h-4 text-[#EA580C]" /> กลางวัน
              </span>
            )}
            {medicine.timing.evening && (
              <span className="flex items-center gap-1.5 bg-[#E0E7FF] text-[#3730A3] border border-[#C7D2FE] px-3 py-1 rounded-xl text-sm font-bold">
                <Coffee className="w-4 h-4 text-[#4F46E5]" /> เย็น
              </span>
            )}
            {medicine.timing.beforeBed && (
              <span className="flex items-center gap-1.5 bg-[#F3E8FF] text-[#6B21A8] border border-[#E9D5FF] px-3 py-1 rounded-xl text-sm font-bold">
                <Moon className="w-4 h-4 text-[#9333EA]" /> ก่อนนอน
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Precautions / Warnings */}
      <div className="bg-[#FFFBEB] rounded-2xl p-4 border border-[#FDE68A]">
        <div className="flex items-center gap-2 text-[#92400E] font-bold text-sm mb-1.5">
          <AlertTriangle className="w-5 h-5 text-[#D97706] shrink-0" />
          <span>ข้อควรระวังสำคัญสำหรับคุณตาคุณยาย:</span>
        </div>
        <ul className="space-y-1 text-[#78350F] text-sm sm:text-base pl-7 list-disc">
          {medicine.precautions.map((p, i) => (
            <li key={i} className="leading-relaxed font-normal">{p}</li>
          ))}
        </ul>
      </div>

      {/* Pill Badge */}
      {medicine.badgeText && (
        <div className="mt-3 flex justify-end">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#FFDFA3] text-[#7C4A03] border border-[#F6C778]">
            ⚠️ {medicine.badgeText}
          </span>
        </div>
      )}
    </div>
  );
}
