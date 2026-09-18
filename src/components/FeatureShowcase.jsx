import React from 'react';
import { 
  Smartphone, QrCode, Stethoscope, Volume2, Printer, 
  Send, ShieldCheck, HeartHandshake, Sparkles, CheckCircle2 
} from 'lucide-react';

export default function FeatureShowcase({ onTryPickup }) {
  const showcaseItems = [
    {
      title: 'รับยาอัตโนมัติ (Smart Pickup)',
      subtitle: 'สแกน QR หรือกด PIN 4 หลัก ตู้ล็อกเกอร์ดีดเปิดทันที ไม่ต้องรอคิว',
      tag: 'Kiosk System',
      screenContent: (
        <div className="bg-[#F6FBFF] p-4 rounded-2xl border border-[#BEE3F8] space-y-2.5 text-center">
          <div className="w-12 h-12 mx-auto rounded-xl bg-[#4A9FE8] text-white flex items-center justify-center shadow-xs">
            <QrCode className="w-6 h-6" />
          </div>
          <div className="text-xs font-bold text-[#183B56]">สแกนรับยาสำเร็จ</div>
          <div className="text-[10px] bg-[#DDF4E7] text-[#1E7C4A] font-bold py-1 px-2 rounded-full inline-block">
            ตู้ช่องที่ 03 เปิดแล้ว
          </div>
        </div>
      )
    },
    {
      title: 'หมอจัดยาใส่ถุงซิปล็อก',
      subtitle: 'แพทย์และเภสัชกรตรวจจัดยาลงถุงซิปอย่างปลอดภัย 100% พร้อมติดฉลาก',
      tag: 'Hospital Safety',
      screenContent: (
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-2 shadow-xs">
          <div className="h-1.5 bg-rose-500 rounded-full w-full"></div>
          <div className="text-left text-[11px] font-bold text-[#183B56] flex items-center justify-between">
            <span>🛍️ ถุงซิปยาปลอดภัย</span>
            <span className="text-[9px] text-[#4A9FE8]">รพ. ศูนย์สุขภาพ</span>
          </div>
          <div className="text-[10px] text-slate-500 text-left">
            คุณยายสมศรี มีสุข (HN-89412)<br />
            ยา 3 รายการ บรรจุพร้อมส่ง
          </div>
        </div>
      )
    },
    {
      title: 'AI เสียงไทยอธิบายยา',
      subtitle: 'อ่านชื่อยาและวิธีกินยาให้ฟังช้าๆ ชัดเจน กดฟังซ้ำได้ไม่อั้นสำหรับคนแก่',
      tag: 'Voice Assistant',
      screenContent: (
        <div className="bg-[#EAF6FF] p-4 rounded-2xl border border-[#BEE3F8] space-y-2 text-center">
          <div className="w-10 h-10 mx-auto rounded-full bg-[#4A9FE8] text-white flex items-center justify-center shadow-xs animate-pulse">
            <Volume2 className="w-5 h-5" />
          </div>
          <div className="text-[11px] font-bold text-[#183B56]">
            “ทานหลังอาหารเช้า 1 เม็ดนะคะ”
          </div>
          <div className="text-[9px] text-[#486581]">เสียงอ่านภาษาไทยความเร็ว 0.88x</div>
        </div>
      )
    },
    {
      title: 'สลิปกระดาษความร้อน 80mm',
      subtitle: 'ตู้พิมพ์สลิปตารางยากระดาษความร้อนและตัดอัตโนมัติ ไม่ต้องกดปุ่ม',
      tag: 'Thermal Paper',
      screenContent: (
        <div className="bg-white p-3.5 rounded-xl border border-dashed border-slate-300 space-y-1.5 text-center font-mono text-[10px]">
          <div className="font-bold border-b border-dashed border-slate-300 pb-1">
            *** สลิปตารางเวลากินยา ***
          </div>
          <div className="text-left text-slate-700 space-y-0.5 text-[9px]">
            <div>1. Amlodipine 5mg (เช้า)</div>
            <div>2. Metformin 500mg (เช้า-เย็น)</div>
          </div>
          <div className="text-[9px] text-emerald-700 font-bold bg-[#DDF4E7] py-0.5 rounded">
            พิมพ์และตัดอัตโนมัติ
          </div>
        </div>
      )
    },
    {
      title: 'ส่งสรุปเข้า LINE ลูกหลาน',
      subtitle: 'ลูกหลานอยู่บ้านทราบทันทีว่าคุณยายรับยาแล้ว พร้อมตารางเตือนกินยา',
      tag: 'Caregiver Sync',
      screenContent: (
        <div className="bg-[#8C9DAE] p-3 rounded-2xl space-y-1.5 text-left">
          <div className="bg-white p-2.5 rounded-xl rounded-tl-none shadow-xs text-[10px]">
            <div className="font-bold text-emerald-700">✓ คุณยายรับยาแล้วค่ะ</div>
            <div className="text-slate-600 text-[9px] mt-0.5">
              ตู้ช่องที่ 3 • รายการยา 3 ตัว
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'สายด่วนห้องยา 24 ชม.',
      subtitle: 'มีข้อสงสัยหรืออาการผิดปกติ กดต่อสายตรงถึงเภสัชกรได้ตลอดเวลา',
      tag: '24h Support',
      screenContent: (
        <div className="bg-[#F6FBFF] p-4 rounded-2xl border border-[#BEE3F8] text-center space-y-2">
          <div className="w-10 h-10 mx-auto rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div className="text-xs font-bold text-[#183B56]">เภสัชกรพร้อมดูแล</div>
          <div className="text-[10px] text-slate-600 font-bold">โทร 02-999-8888 ต่อ 101</div>
        </div>
      )
    }
  ];

  return (
    <section className="py-14 border-t border-[#EAF6FF]">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-bold tracking-wider uppercase bg-[#EAF6FF] text-[#4A9FE8] px-3.5 py-1 rounded-full">
          ระบบออกแบบครบวงจร (Complete System Design)
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-[#183B56] mt-2">
          ฟังก์ชันสำคัญที่ออกแบบมาเพื่อทุกคน
        </h2>
        <p className="text-[#486581] text-base mt-2">
          ผสานระบบ Kiosk ตู้ล็อกเกอร์ และแอปพลิเคชันเพื่อสุขภาวะที่ดีของผู้สูงอายุ
        </p>
      </div>

      {/* Grid of Showcase Cards (สไตล์สไลด์นำเสนอ Behance/Figma ในรูปตัวอย่าง) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
        {showcaseItems.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl p-6 border border-[#EAF6FF] shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
          >
            {/* Top Text */}
            <div className="space-y-1.5 mb-6">
              <span className="text-[11px] font-bold text-[#4A9FE8] uppercase tracking-wider bg-[#EAF6FF] px-2.5 py-0.5 rounded-full">
                {item.tag}
              </span>
              <h3 className="text-xl font-bold text-[#183B56] pt-1 group-hover:text-[#4A9FE8] transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-[#486581] leading-relaxed">
                {item.subtitle}
              </p>
            </div>

            {/* Smartphone Mockup Frame (สไตล์มือถือในภาพตัวอย่าง) */}
            <div className="relative mx-auto w-full max-w-[240px] bg-slate-900 rounded-[2.5rem] p-2.5 shadow-xl border-4 border-slate-800">
              {/* Phone Speaker / Dynamic Island Notch */}
              <div className="w-16 h-3 bg-slate-950 rounded-full mx-auto mb-2 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-800"></span>
              </div>

              {/* Phone Screen Container */}
              <div className="bg-white rounded-[1.8rem] p-2.5 min-h-[140px] flex items-center justify-center overflow-hidden">
                <div className="w-full">
                  {item.screenContent}
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>
    </section>
  );
}
