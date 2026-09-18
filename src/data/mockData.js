export const INITIAL_PRESCRIPTIONS = [
  {
    id: 'RX-2026-001',
    pin: '5284',
    cid: '1100500123456',
    patient: {
      name: 'คุณยายสมศรี มีสุข',
      hn: 'HN-89412',
      age: 74,
      phone: '081-234-5678',
      caregiverName: 'คุณสมชาย (ลูกชาย)',
      caregiverPhone: '089-999-8877',
      allergies: 'แพ้ยาเพนิซิลลิน (Penicillin)'
    },
    lockerId: 3,
    status: 'ready_for_pickup', // 'ready_for_pickup' | 'collected'
    pharmacist: 'ภก. ธนวัฒน์ วงศ์วิจิตร (ใบอนุญาต ภ.34211)',
    hospital: 'โรงพยาบาลศูนย์สุขภาพปวงชน',
    createdAt: '17 ก.ย. 2026, 09:30 น.',
    collectedAt: null,
    notes: 'ผู้ป่วยมีโรคประจำตัวความดันและเบาหวาน ต้องทานยาต่อเนื่อง',
    medicines: [
      {
        id: 'MED-01',
        name: 'Amlodipine (แอมโลดิพีน)',
        brandName: 'Norvasc',
        dosage: '5 มก.',
        category: 'ยาลดความดันโลหิตสูง',
        pillColor: 'สีขาว',
        pillShape: 'เม็ดกลม มีขีดแบ่งตรงกลาง',
        timing: {
          morning: true,
          noon: false,
          evening: false,
          beforeBed: false,
          mealRelation: 'หลังอาหารเช้าทันที 1 เม็ด',
          summaryTime: 'เช้า (หลังอาหาร)'
        },
        audioScript: 'รายการที่หนึ่ง ยาแอมโลดิพีน สำหรับลดความดันโลหิต เม็ดสีขาวกลม ทานหลังอาหารเช้าทันที วันละหนึ่งเม็ด ยานี้ช่วยให้หลอดเลือดคลายตัว ควบคุมความดันให้อยู่ในเกณฑ์ปกติ ห้ามหยุดยาเองนะคะคุณยาย',
        precautions: [
          'ควรทานเวลาเดิมทุกเช้าอย่างสม่ำเสมอ',
          'อาจมีอาการข้อเท้าบวมเล็กน้อย หากเวียนหัวหน้ามืดให้ค่อยๆ ลุกยืน'
        ],
        badgeType: 'critical',
        badgeText: 'ทานสม่ำเสมอ ห้ามหยุดยาเอง'
      },
      {
        id: 'MED-02',
        name: 'Metformin (เมทฟอร์มิน)',
        brandName: 'Glucophage',
        dosage: '500 มก.',
        category: 'ยาลดระดับน้ำตาลในเลือด (เบาหวาน)',
        pillColor: 'สีขาวรี',
        pillShape: 'เม็ดรี เคลือบฟิล์ม',
        timing: {
          morning: true,
          noon: false,
          evening: true,
          beforeBed: false,
          mealRelation: 'พร้อมอาหาร หรือหลังอาหารทันที เช้า-เย็น ครั้งละ 1 เม็ด',
          summaryTime: 'เช้า และ เย็น (พร้อมอาหาร)'
        },
        audioScript: 'รายการที่สอง ยาเมทฟอร์มิน ยาลดน้ำตาลเบาหวาน เม็ดรียาวสีขาว ทานวันละสองครั้ง หลังอาหารเช้าหนึ่งเม็ด และหลังอาหารเย็นหนึ่งเม็ด แนะนำให้ทานพร้อมอาหารทันที จะช่วยลดอาการคลื่นไส้หรือแน่นท้องได้ค่ะ',
        precautions: [
          'ทานพร้อมหรือหลังอาหารทันที เพื่อป้องกันการระคายเคืองกระเพาะ',
          'ดื่มน้ำตามมากๆ ระหว่างวัน'
        ],
        badgeType: 'warning',
        badgeText: 'ทานพร้อมอาหารทันที'
      },
      {
        id: 'MED-03',
        name: 'Atorvastatin (อะทอร์วาสแตติน)',
        brandName: 'Lipitor',
        dosage: '20 มก.',
        category: 'ยาลดไขมันคอเลสเตอรอลในเลือด',
        pillColor: 'สีขาวนวล',
        pillShape: 'เม็ดรีมน เคลือบฟิล์ม',
        timing: {
          morning: false,
          noon: false,
          evening: false,
          beforeBed: true,
          mealRelation: 'ก่อนนอน 1 เม็ด',
          summaryTime: 'ก่อนนอน'
        },
        audioScript: 'รายการที่สาม ยาอะทอร์วาสแตติน ยาลดไขมันในเส้นเลือด ทานเฉพาะก่อนนอน วันละหนึ่งเม็ด เพราะร่างกายจะสร้างไขมันมากที่สุดตอนกลางคืน หากมีอาการปวดเมื่อยกล้ามเนื้อผิดปกติ ให้รีบแจ้งแพทย์นะคะ',
        precautions: [
          'ทานก่อนนอนเป็นประจำทุกคืน',
          'หลีกเลี่ยงการดื่มน้ำเกรปฟรุตปริมาณมาก'
        ],
        badgeType: 'info',
        badgeText: 'ทานเฉพาะก่อนนอน'
      }
    ]
  },
  {
    id: 'RX-2026-002',
    pin: '1947',
    cid: '3100200889912',
    patient: {
      name: 'คุณตาทวีศักดิ์ ชัยเจริญ',
      hn: 'HN-65209',
      age: 81,
      phone: '086-456-7890',
      caregiverName: 'คุณกานดา (ลูกสาว)',
      caregiverPhone: '081-555-1234',
      allergies: 'ไม่มีประวัติแพ้ยา'
    },
    lockerId: 7,
    status: 'ready_for_pickup',
    pharmacist: 'ภกญ. ศิริพร ปัญญาเลิศ (ใบอนุญาต ภ.29814)',
    hospital: 'โรงพยาบาลศูนย์สุขภาพปวงชน',
    createdAt: '17 ก.ย. 2026, 10:15 น.',
    collectedAt: null,
    notes: 'ยากระเพาะอาหารและวิตามินบำรุงปลายประสาท',
    medicines: [
      {
        id: 'MED-04',
        name: 'Omeprazole (โอเมพราโซล)',
        brandName: 'Losec',
        dosage: '20 มก.',
        category: 'ยาลดกรด รักษาแผลในกระเพาะอาหาร',
        pillColor: 'แคปซูลสีชมพู-น้ำตาล',
        pillShape: 'แคปซูล',
        timing: {
          morning: true,
          noon: false,
          evening: false,
          beforeBed: false,
          mealRelation: 'ก่อนอาหารเช้า 30 นาที 1 แคปซูล',
          summaryTime: 'เช้า (ก่อนอาหาร 30 นาที)'
        },
        audioScript: 'รายการที่หนึ่ง ยาโอเมพราโซล แคปซูลสีชมพูน้ำตาล ทานก่อนอาหารเช้าสามสิบนาที วันละหนึ่งเม็ด กลืนทั้งเม็ดพร้อมน้ำ ห้ามเคี้ยวหรือแกะแคปซูลออกนะคะ',
        precautions: [
          'ต้องทานก่อนอาหารเช้าอย่างน้อย 30 นาทีเพื่อให้ยาออกฤทธิ์ได้ดีที่สุด',
          'กลืนทั้งแคปซูล ห้ามเคี้ยวหรือบดยา'
        ],
        badgeType: 'critical',
        badgeText: 'ก่อนอาหาร 30 นาที ห้ามเคี้ยว'
      },
      {
        id: 'MED-05',
        name: 'Vitamin B-Complex (วิตามินบีรวม)',
        brandName: 'Neurobion',
        dosage: '1 เม็ด',
        category: 'วิตามินบำรุงปลายประสาทแก้อาการชา',
        pillColor: 'สีแดงเลือดหมู',
        pillShape: 'เม็ดกลมเคลือบน้ำตาล',
        timing: {
          morning: true,
          noon: false,
          evening: false,
          beforeBed: false,
          mealRelation: 'หลังอาหารเช้า 1 เม็ด',
          summaryTime: 'เช้า (หลังอาหาร)'
        },
        audioScript: 'รายการที่สอง วิตามินบีรวม เม็ดกลมสีแดง ทานหลังอาหารเช้าหนึ่งเม็ด ช่วยบำรุงปลายประสาท ลดอาการมือชาเท้าชา ปัสสาวะอาจมีสีเหลืองเข้มขึ้น เป็นเรื่องปกติไม่ต้องตกใจนะคะคุณตา',
        precautions: [
          'ปัสสาวะอาจมีสีเหลืองเข้ม เป็นผลปกติจากวิตามินบี 2',
          'ทานหลังอาหารเพื่อการดูดซึมที่ดี'
        ],
        badgeType: 'info',
        badgeText: 'ปัสสาวะสีเหลืองเข้มเป็นปกติ'
      }
    ]
  },
  {
    id: 'RX-2026-003',
    pin: '7392',
    cid: '1509900234567',
    patient: {
      name: 'คุณลุงสมปอง จิตสงบ',
      hn: 'HN-55120',
      age: 71,
      phone: '085-123-9988',
      caregiverName: 'คุณวรัญญา (ลูกสาว)',
      caregiverPhone: '089-777-6655',
      allergies: 'ไม่มีประวัติแพ้ยา'
    },
    lockerId: 5,
    status: 'dispensed_waiting_check', // รอจุดตรวจ Double-Check ก่อนส่งเข้าสายพาน
    pharmacist: 'ภก. ธนวัฒน์ วงศ์วิจิตร',
    hospital: 'โรงพยาบาลศูนย์สุขภาพปวงชน',
    createdAt: '17 ก.ย. 2026, 11:20 น.',
    collectedAt: null,
    notes: 'จัดยาเสร็จแล้ว รอนำส่งจุดตรวจ Double-Check ก่อนเข้าสายพาน',
    medicines: [
      {
        id: 'MED-06',
        name: 'Losartan (โลซาร์แทน)',
        brandName: 'Cozaar',
        dosage: '50 มก.',
        category: 'ยาลดความดันโลหิต',
        pillColor: 'สีขาว',
        pillShape: 'เม็ดรีมน',
        timing: {
          morning: true,
          noon: false,
          evening: false,
          beforeBed: false,
          mealRelation: 'หลังอาหารเช้า 1 เม็ด',
          summaryTime: 'เช้า (หลังอาหาร)'
        },
        audioScript: 'ยาโลซาร์แทน ยาลดความดันโลหิต ทานหลังอาหารเช้าวันละหนึ่งเม็ด ช่วยปกป้องไตในผู้ป่วยเบาหวานด้วยค่ะ',
        precautions: ['ทานสม่ำเสมอในเวลาเดิมทุกวัน'],
        badgeType: 'critical',
        badgeText: 'ทานเป็นประจำทุกเช้า'
      },
      {
        id: 'MED-07',
        name: 'Paracetamol (พาราเซตามอล)',
        brandName: 'Sara',
        dosage: '500 มก.',
        category: 'ยาบรรเทาปวด ลดไข้',
        pillColor: 'สีขาว',
        pillShape: 'เม็ดกลม',
        timing: {
          morning: false,
          noon: false,
          evening: false,
          beforeBed: false,
          mealRelation: 'ทานครั้งละ 1 เม็ด เมื่อมีอาการปวด ทุก 4-6 ชั่วโมง',
          summaryTime: 'เมื่อมีอาการปวด'
        },
        audioScript: 'ยาพาราเซตามอล บรรเทาอาการปวด ทานครั้งละหนึ่งเม็ดเมื่อมีอาการ ห่างกันอย่างน้อยสี่ชั่วโมงค่ะ',
        precautions: ['ห้ามทานเกินวันละ 8 เม็ด'],
        badgeType: 'info',
        badgeText: 'ทานเมื่อมีอาการปวด'
      }
    ]
  },
  {
    id: 'RX-2026-004',
    pin: '4410',
    cid: '3101700445566',
    patient: {
      name: 'คุณป้ามาลี รัตนโชติ',
      hn: 'HN-77291',
      age: 69,
      phone: '082-345-6789',
      caregiverName: 'คุณชัยวัฒน์ (สามี)',
      caregiverPhone: '081-222-3344',
      allergies: 'แพ้ยาแอสไพริน (Aspirin)'
    },
    lockerId: 2,
    status: 'dispensed_waiting_check', // รอจุดตรวจ Double-Check
    pharmacist: 'ภกญ. ศิริพร ปัญญาเลิศ',
    hospital: 'โรงพยาบาลศูนย์สุขภาพปวงชน',
    createdAt: '17 ก.ย. 2026, 11:25 น.',
    collectedAt: null,
    notes: 'ผู้ป่วยแพ้แอสไพริน เภสัชจัดยาเสร็จแล้ว รอตรวจซ้ำและปล่อยลงสายพานเข้าช่อง 2',
    medicines: [
      {
        id: 'MED-08',
        name: 'Atorvastatin (อะทอร์วาสแตติน)',
        brandName: 'Lipitor',
        dosage: '20 มก.',
        category: 'ยาลดไขมันในเลือด',
        pillColor: 'สีขาวนวล',
        pillShape: 'เม็ดรีมน เคลือบฟิล์ม',
        timing: {
          morning: false,
          noon: false,
          evening: false,
          beforeBed: true,
          mealRelation: 'ก่อนนอน 1 เม็ด',
          summaryTime: 'ก่อนนอน'
        },
        audioScript: 'ยาอะทอร์วาสแตติน ยาลดไขมัน ทานเฉพาะก่อนนอน วันละหนึ่งเม็ดค่ะ',
        precautions: ['ทานก่อนนอนเป็นประจำทุกคืน'],
        badgeType: 'info',
        badgeText: 'ทานเฉพาะก่อนนอน'
      }
    ]
  }
];

export const AVAILABLE_MEDICINE_CATALOG = [
  {
    name: 'Amlodipine 5mg',
    brandName: 'Norvasc',
    dosage: '5 มก.',
    category: 'ยาลดความดันโลหิตสูง',
    pillColor: 'สีขาว',
    pillShape: 'เม็ดกลม มีขีดแบ่งตรงกลาง',
    timing: {
      morning: true,
      noon: false,
      evening: false,
      beforeBed: false,
      mealRelation: 'หลังอาหารเช้าทันที 1 เม็ด',
      summaryTime: 'เช้า (หลังอาหาร)'
    },
    audioScript: 'ยาแอมโลดิพีน สำหรับลดความดันโลหิต เม็ดสีขาวกลม ทานหลังอาหารเช้าทันที วันละหนึ่งเม็ด ห้ามหยุดยาเองนะคะ',
    precautions: ['ควรทานเวลาเดิมทุกเช้าอย่างสม่ำเสมอ'],
    badgeType: 'critical',
    badgeText: 'ทานสม่ำเสมอ ห้ามหยุดยาเอง'
  },
  {
    name: 'Metformin 500mg',
    brandName: 'Glucophage',
    dosage: '500 มก.',
    category: 'ยาลดระดับน้ำตาลในเลือด',
    pillColor: 'สีขาวรี',
    pillShape: 'เม็ดรี เคลือบฟิล์ม',
    timing: {
      morning: true,
      noon: false,
      evening: true,
      beforeBed: false,
      mealRelation: 'หลังอาหารทันที เช้า-เย็น ครั้งละ 1 เม็ด',
      summaryTime: 'เช้า และ เย็น (พร้อมอาหาร)'
    },
    audioScript: 'ยาเมทฟอร์มิน ยาลดน้ำตาลเบาหวาน ทานพร้อมอาหารหรือหลังอาหารทันที เช้าและเย็น ครั้งละหนึ่งเม็ดค่ะ',
    precautions: ['ทานพร้อมหรือหลังอาหารทันที เพื่อลดอาการคลื่นไส้'],
    badgeType: 'warning',
    badgeText: 'ทานพร้อมอาหารทันที'
  },
  {
    name: 'Paracetamol 500mg',
    brandName: 'Sara / Tylenol',
    dosage: '500 มก.',
    category: 'ยาบรรเทาปวด ลดไข้',
    pillColor: 'สีขาว',
    pillShape: 'เม็ดกลม',
    timing: {
      morning: false,
      noon: false,
      evening: false,
      beforeBed: false,
      mealRelation: 'ทานครั้งละ 1 เม็ด ทุก 4-6 ชั่วโมง เมื่อมีอาการปวดหรือมีไข้',
      summaryTime: 'เมื่อมีอาการปวดหรือมีไข้'
    },
    audioScript: 'ยาพาราเซตามอล บรรเทาอาการปวด ลดไข้ ทานหนึ่งเม็ดเมื่อมีอาการ ห่างกันอย่างน้อยสี่ชั่วโมง ห้ามทานเกินวันละแปดเม็ดนะคะ',
    precautions: ['ห้ามทานเกินวันละ 8 เม็ด และไม่ควรทานติดต่อกันเกิน 5 วันโดยไม่พบแพทย์'],
    badgeType: 'info',
    badgeText: 'ทานเมื่อมีอาการ ห้ามเกิน 8 เม็ด/วัน'
  },
  {
    name: 'Losartan 50mg',
    brandName: 'Cozaar',
    dosage: '50 มก.',
    category: 'ยาลดความดันโลหิต',
    pillColor: 'สีขาว',
    pillShape: 'เม็ดรีมน',
    timing: {
      morning: true,
      noon: false,
      evening: false,
      beforeBed: false,
      mealRelation: 'หลังอาหารเช้า 1 เม็ด',
      summaryTime: 'เช้า (หลังอาหาร)'
    },
    audioScript: 'ยาโลซาร์แทน ยาลดความดันโลหิต ทานหลังอาหารเช้าวันละหนึ่งเม็ด ช่วยปกป้องไตในผู้ป่วยเบาหวานด้วยค่ะ',
    precautions: ['ทานสม่ำเสมอในเวลาเดิมทุกวัน'],
    badgeType: 'critical',
    badgeText: 'ทานเป็นประจำทุกเช้า'
  }
];

export const TOTAL_LOCKERS = 12;

// บัญชีเจ้าหน้าที่ที่ได้รับอนุญาตเข้าถึงระบบหลังบ้าน (Hospital Staff Directory)
export const MOCK_HOSPITAL_STAFF = [
  {
    id: 'STF-01',
    name: 'ภก. ธนวัฒน์ วงศ์วิจิตร',
    role: 'pharmacist',
    roleTitle: 'เภสัชกรชำนาญการ (หัวหน้าเวรห้องยา)',
    licenseNo: 'ภ.34211',
    pin: '1111',
    department: 'กลุ่มงานเภสัชกรรมผู้ป่วยนอก',
    avatar: '👨‍⚕️'
  },
  {
    id: 'STF-02',
    name: 'ภกญ. ศิริพร ปัญญาเลิศ',
    role: 'pharmacist',
    roleTitle: 'เภสัชกรวิชาชีพ',
    licenseNo: 'ภ.29814',
    pin: '2222',
    department: 'กลุ่มงานเภสัชกรรมผู้ป่วยนอก',
    avatar: '👩‍⚕️'
  },
  {
    id: 'STF-03',
    name: 'พว. กรรณิการ์ สุขสวัสดิ์',
    role: 'checker',
    roleTitle: 'พยาบาลวิชาชีพ (ผู้ตรวจ Double-Check)',
    licenseNo: 'พ.55432',
    pin: '3333',
    department: 'จุดตรวจความปลอดภัยก่อนจ่ายยา',
    avatar: '🩺'
  },
  {
    id: 'STF-04',
    name: 'นายชวลิต มั่นคง',
    role: 'assistant',
    roleTitle: 'ผู้ช่วยพยาบาลประจำจุดตู้ยา (Concierge)',
    licenseNo: 'NA-8921',
    pin: '4444',
    department: 'หน่วยบริการตู้ยาอัตโนมัติ',
    avatar: '🧑‍⚕️'
  }
];
