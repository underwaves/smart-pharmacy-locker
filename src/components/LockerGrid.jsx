import React from 'react';
import { Package, CheckCircle2, Lock, Unlock } from 'lucide-react';

export default function LockerGrid({ lockers, activeLockerId, onLockerClick }) {
  return (
    <div className="bg-white border border-[#EAF6FF] rounded-3xl p-6 sm:p-7 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-xl font-bold text-[#183B56] flex items-center gap-2">
            <Package className="w-6 h-6 text-[#4A9FE8]" />
            ผังตู้ล็อกเกอร์รับยาอัตโนมัติ (12 ช่อง)
          </h3>
          <p className="text-[#486581] text-sm mt-0.5">
            ไฟสัญญาณนำทางและสถานะช่องตู้แบบเรียลไทม์ ปลอดภัยและชัดเจน
          </p>
        </div>
        
        {/* Legend in Warm Colors */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
          <span className="flex items-center gap-1.5 bg-[#DDF4E7] text-[#1E7C4A] px-2.5 py-1 rounded-full border border-emerald-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping inline-block"></span>
            ช่องของคุณ (เปิดอยู่)
          </span>
          <span className="flex items-center gap-1.5 bg-[#EAF6FF] text-[#183B56] px-2.5 py-1 rounded-full border border-[#BEE3F8]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4A9FE8] inline-block"></span>
            มียารอรับ
          </span>
          <span className="flex items-center gap-1.5 bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full border border-slate-200">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block"></span>
            ตู้ว่าง
          </span>
        </div>
      </div>

      {/* 12 Locker Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3.5 sm:gap-4">
        {lockers.map((locker) => {
          const isActive = activeLockerId === locker.id;
          const isOccupied = locker.status === 'occupied';
          const isCollected = locker.status === 'collected';

          let borderStyle = 'border-slate-200 bg-slate-50/70 text-slate-400 hover:border-slate-300';
          let badgeColor = 'bg-slate-200 text-slate-600';
          let icon = <Lock className="w-5 h-5 text-slate-400" />;

          if (isActive) {
            borderStyle = 'border-2 border-emerald-500 bg-[#DDF4E7] text-[#1E7C4A] shadow-lg shadow-emerald-500/20 scale-105 ring-4 ring-emerald-400/30 animate-pulse';
            badgeColor = 'bg-emerald-600 text-white font-bold';
            icon = <Unlock className="w-7 h-7 text-emerald-600 animate-bounce" />;
          } else if (isOccupied) {
            borderStyle = 'border-2 border-[#4A9FE8] bg-[#EAF6FF] text-[#183B56] shadow-xs';
            badgeColor = 'bg-[#4A9FE8] text-white';
            icon = <Package className="w-5 h-5 text-[#4A9FE8]" />;
          } else if (isCollected) {
            borderStyle = 'border-slate-200 bg-slate-100/60 text-slate-400 opacity-60';
            badgeColor = 'bg-slate-200 text-slate-500';
            icon = <CheckCircle2 className="w-5 h-5 text-slate-400" />;
          }

          return (
            <div
              key={locker.id}
              onClick={() => onLockerClick && onLockerClick(locker)}
              className={`relative rounded-2xl p-4 transition-all duration-300 cursor-pointer flex flex-col items-center justify-between min-h-[120px] ${borderStyle}`}
            >
              {/* Top Locker Number Badge */}
              <div className="w-full flex items-center justify-between">
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${badgeColor}`}>
                  ช่อง {locker.id < 10 ? `0${locker.id}` : locker.id}
                </span>
                {isActive && (
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                )}
              </div>

              {/* Center Door / Icon representation */}
              <div className="my-2 flex flex-col items-center justify-center">
                {icon}
                <div className="text-xs font-bold mt-1.5 text-center">
                  {isActive ? (
                    <span className="text-emerald-800 font-black text-sm">ประตูเปิดแล้ว!</span>
                  ) : isOccupied ? (
                    <span className="text-[#183B56]">มีถุงยาในตู้</span>
                  ) : isCollected ? (
                    <span>รับยาแล้ว</span>
                  ) : (
                    <span>ตู้ว่าง</span>
                  )}
                </div>
              </div>

              {/* Interactive Cue */}
              {isActive ? (
                <div className="text-[11px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-md text-center w-full shadow-xs">
                  แตะเพื่อหยิบยา
                </div>
              ) : (
                <div className="text-[10px] text-slate-400">
                  {isOccupied ? 'พร้อมให้รับ' : 'ว่าง'}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
