import React from 'react';
import { Stethoscope, Bell, QrCode, Volume2, CheckCircle2 } from 'lucide-react';

export default function HowItWorksSection() {
  const steps = [
    {
      number: '01',
      icon: <Stethoscope className="w-7 h-7 text-[#4A9FE8]" />,
      title: 'หมอจัดยาใส่ถุงซิป',
      desc: 'แพทย์และเภสัชกรตรวจจัดยาใส่ถุงซิปล็อกอย่างปลอดภัย พร้อมติดฉลากระบุชื่อคนไข้และบรรจุเข้าช่องตู้'
    },
    {
      number: '02',
      icon: <Bell className="w-7 h-7 text-[#4A9FE8]" />,
      title: 'รับรหัสแจ้งเตือน',
      desc: 'ระบบส่ง SMS หรือข้อความ LINE แจ้งคนไข้และญาติ พร้อมรหัส PIN 4 หลัก โดยไม่ต้องนั่งแออัดรอหน้าห้องยา'
    },
    {
      number: '03',
      icon: <QrCode className="w-7 h-7 text-[#4A9FE8]" />,
      title: 'เปิดตู้รับยาง่ายๆ',
      desc: 'เดินมาที่ตู้ล็อกเกอร์ สแกน QR Code หรือกดรหัส PIN 4 หลัก ประตูตู้ช่องยาจะดีดเปิดออกพร้อมไฟสัญญาณนำทาง'
    },
    {
      number: '04',
      icon: <Volume2 className="w-7 h-7 text-[#4A9FE8]" />,
      title: 'AI อธิบายยาชัดเจน',
      desc: 'หน้าจอแสดงภาพยาตัวโตๆ พร้อมเสียง AI ภาษาไทยอ่านวิธีกินยาให้ฟังอย่างใจเย็น และส่งสรุปเข้า LINE ลูกหลาน'
    }
  ];

  return (
    <section id="how-it-works" className="py-12 border-t border-[#EAF6FF]">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-bold tracking-wider uppercase bg-[#EAF6FF] text-[#4A9FE8] px-3.5 py-1 rounded-full">
          ขั้นตอนง่ายๆ 4 สเต็ป
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-[#183B56] mt-2">
          วิธีใช้งานตู้รับยาอัจฉริยะ
        </h2>
        <p className="text-[#486581] text-base mt-2">
          สะดวก ปลอดภัย ออกแบบให้เข้าใจง่ายสำหรับผู้สูงอายุและทุกครอบครัว
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl p-6 border border-[#EAF6FF] shadow-md hover:shadow-lg transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute top-3 right-4 text-3xl font-black text-[#EAF6FF]">
              {step.number}
            </div>

            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#EAF6FF] border border-[#BEE3F8] flex items-center justify-center mb-4">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-[#183B56] mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-[#486581] leading-relaxed">
                {step.desc}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>ผ่านการรับรองความปลอดภัย</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
