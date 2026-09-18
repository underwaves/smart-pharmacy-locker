import React, { useState } from 'react';
import { ChevronDown, HelpCircle, PhoneCall } from 'lucide-react';

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'คุณตาคุณยายที่ใช้สมาร์ตโฟนไม่เป็น สามารถมารับยาเองได้ไหม?',
      a: 'สามารถรับได้ง่ายมากค่ะ! เพียงแค่นำบัตรประชาชนมาเสียบที่ช่องอ่านบัตร หรือกดรหัสตัวเลข 4 หลักบนหน้าจอตู้ ประตูตู้ช่องยาจะดีดเปิดออกทันทีโดยไม่ต้องใช้สมาร์ตโฟนเลยค่ะ'
    },
    {
      q: 'ถ้าฟังเสียง AI อธิบายยาไม่ทัน สามารถกดฟังซ้ำได้ไหม?',
      a: 'สามารถกดฟังซ้ำได้ไม่อั้นเลยค่ะ! บนหน้าจอจะมีปุ่มลำโพงขนาดใหญ่ให้กดฟังเสียงอธิบายยาแต่ละเม็ดซ้ำกี่รอบก็ได้จนกว่าจะเข้าใจ โดยไม่มีการเร่งรีบค่ะ'
    },
    {
      q: 'ลูกหลานที่อยู่บ้านจะรู้ได้อย่างไรว่าคุณตาคุณยายรับยาแล้ว?',
      a: 'ทันทีที่ประตูตู้ล็อกเกอร์ถูกเปิดออก ระบบจะส่งข้อความแจ้งเตือนพร้อมสรุปตารางวิธีกินยาเข้าแอปพลิเคชัน LINE ของลูกหลาน/ผู้ดูแลทันทีโดยอัตโนมัติค่ะ'
    },
    {
      q: 'ทำไมคุณหมอและเภสัชกรถึงต้องจัดยาใส่ถุงซิปล็อก?',
      a: 'การบรรจุยาลงในถุงซิปล็อกช่วยป้องกันความชื้นและสิ่งสกปรก อีกทั้งยังผ่านการตรวจสอบความถูกต้องจากเภสัชกรโรงพยาบาล 100% ก่อนนำมาบรรจุลงตู้ จึงมั่นใจได้ในความปลอดภัยสูงสุดค่ะ'
    }
  ];

  return (
    <section id="faq" className="py-12 border-t border-[#EAF6FF]">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-bold tracking-wider uppercase bg-[#EAF6FF] text-[#4A9FE8] px-3.5 py-1 rounded-full">
          คำถามที่พบบ่อย (FAQ)
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-[#183B56] mt-2">
          ข้อสงสัยเกี่ยวกับการรับยา
        </h2>
        <p className="text-[#486581] text-base mt-2">
          คำตอบสำหรับผู้สูงอายุและญาติ เพื่อความมั่นใจในการใช้งาน
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-3.5">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-[#EAF6FF] shadow-xs overflow-hidden transition-all duration-200"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-base sm:text-lg text-[#183B56] hover:text-[#4A9FE8] transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-[#4A9FE8] shrink-0" />
                  {faq.q}
                </span>
                <ChevronDown className={`w-5 h-5 text-[#4A9FE8] transition-transform duration-200 shrink-0 ${isOpen ? 'transform rotate-180' : ''}`} />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-[#334E68] text-sm sm:text-base leading-relaxed border-t border-slate-50">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Emergency Assistance Card */}
      <div id="contact" className="max-w-3xl mx-auto mt-8 bg-gradient-to-r from-[#EAF6FF] to-white border border-[#BEE3F8] rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 text-center sm:text-left">
          <div className="w-12 h-12 rounded-xl bg-[#4A9FE8] text-white flex items-center justify-center shrink-0 shadow-md">
            <PhoneCall className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-[#183B56] text-base">ต้องการความช่วยเหลือ หรือมีข้อสงสัยเรื่องยา?</h4>
            <p className="text-xs text-[#486581]">โทรปรึกษาเภสัชกรประจำโรงพยาบาลศูนย์สุขภาพปวงชนได้ตลอด 24 ชั่วโมง</p>
          </div>
        </div>
        <a
          href="tel:029998888"
          className="px-5 py-2.5 rounded-xl bg-[#4A9FE8] hover:bg-[#3b8fd7] text-white font-bold text-sm shrink-0 shadow-xs"
        >
          โทร 02-999-8888
        </a>
      </div>
    </section>
  );
}
