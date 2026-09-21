/*
  Sangthong — คำแปลไทย→อังกฤษที่ใช้ร่วมกันหลายเครื่องคำนวณ
  Shared Thai→English wording for the "EN" button on the quotation result.
  ---------------------------------------------------------------------------
  เดิมทุกไฟล์เก็บตารางแปลของตัวเอง รวมกัน 2429 บรรทัด และซ้ำกันเกือบหมด
  แก้คำเดียวต้องไล่แก้ทีละไฟล์ ทำให้คำแปลเริ่มไม่ตรงกันระหว่างไฟล์
  ตอนนี้คำที่ใช้ร่วมกันมาอยู่ที่ไฟล์นี้ที่เดียว แก้ครั้งเดียวเปลี่ยนทุกไฟล์ในกลุ่ม
  (every file used to carry its own near-identical copy; the shared wording now
  lives here once)

  แยกเป็น "กลุ่มสินค้า" เพราะคำเดียวกันแปลไม่เหมือนกันในสินค้าคนละแบบ
  ถ้ารวมทุกไฟล์เป็นกองเดียว ใบเสนอราคาเฉพาะโครงสร้างจะไปหยิบคำของกันสาดแขนพับมาใช้
  (families are kept separate: pooling them changed 117 output strings)

    AWNING    = เครื่องคำนวณกันสาด/สกรีน 15 ไฟล์
    STRUCTURE = ใบเสนอราคาเฉพาะโครงสร้าง 4 ไฟล์

  แต่ละไฟล์ยังมีคำของตัวเองได้ใน RESULT_EN_OVERRIDES และจะถูกใช้ก่อนเสมอ
  เช่น 'ระยะยื่น' = "Projection" ในกันสาดแขนพับ แต่ = "Drop" ในกันสาดแนวตั้ง
  (a file's own RESULT_EN_OVERRIDES always wins over the shared list)

  วิธีเพิ่มคำแปล / how to add a word:
    * ใช้ทุกไฟล์ในกลุ่ม -> เพิ่มใน SHARED กลุ่มนั้น
    * ใช้ไฟล์เดียว      -> เพิ่มใน RESULT_EN_OVERRIDES ของไฟล์นั้น
  แก้เสร็จรัน check.bat ทุกครั้ง (จับคำไทยที่หลุดไปอยู่ในข้อความอังกฤษ)

  หมายเหตุ: canopy-calculator.html และ fabric-price-calculator.html ใช้คำเฉพาะตัว
  เกือบทั้งหมด จึงยังเก็บตารางแปลไว้ในไฟล์ตัวเองเหมือนเดิม
*/
window.SANGTHONG_I18N = {

  // เรียงจากคำยาวไปคำสั้น เพราะต้องแทนคำยาวก่อน ไม่งั้นคำสั้นจะไปตัดคำยาวขาด
  // (longest first: a short word must never cut a longer phrase in half)
  SHARED: {

    // กันสาด / สกรีน — ใช้ร่วมกัน 15 ไฟล์
    AWNING: [
    // ต้องยาวกว่ากฎ 'ชุด' -> 'set' ไม่งั้นจะได้ 'ราคาตั้งต่อset' (คำไทยค้างให้ลูกค้าเห็น)
    // (must be longer than the bare 'ชุด' rule, or the short rule cuts this phrase apart)
    ['ราคาตั้งต่อชุด', 'List price per set'],

    // หมายเหตุมาตรฐานท้ายใบเสนอราคา / standard disclaimer at the end of a quote.
    // เก็บไว้ 2 แบบเพราะคำว่า "สํา" พิมพ์ได้ 2 วิธีและคอมพิวเตอร์มองว่าคนละตัวอักษร:
    //   แบบที่ 1 = ส + ํ + า  (U+0E4D + U+0E32) -- แบบที่ไฟล์ปัจจุบันใช้อยู่
    //   แบบที่ 2 = ส + ำ      (U+0E33)          -- แบบที่ได้จากการพิมพ์ปกติ
    // ถ้ามีแบบเดียวแล้วพิมพ์อีกแบบ ปุ่ม EN จะแปลบรรทัดนี้ไม่ออกและลูกค้าจะเห็นภาษาไทยค้าง
    // (the same word can be typed two ways; keep both or the EN toggle silently misses it)
    ['ราคาที่แจ้งเป็นราคาเบื้องต้นเท่านั้น ราคาที่แท้จริงสามารถแจ้งได้หลังสํารวจหน้างาน', 'The price quoted is preliminary only. The actual price can be confirmed after a site survey.'],
    ['ราคาที่แจ้งเป็นราคาเบื้องต้นเท่านั้น ราคาที่แท้จริงสามารถแจ้งได้หลังสำรวจหน้างาน', 'The price quoted is preliminary only. The actual price can be confirmed after a site survey.'],
    ['* รับประกันโครงสร้างและการติดตั้ง แต่ไม่ครอบคลุมตัวผ้าใบ1 ปี,รับประกันการทำงานของมอเตอร์ 2 ปี  (เป็นไปตามเงื่อนไขของทางบริษัท)', '* Structure and installation warranty: 1 year, excluding fabric. Motor warranty: 2 years, subject to company terms.'],
    ['* ราคาที่แจ้งเป็นการประมาณการ ราคาอาจเปลี่ยนแปลงได้เมื่อสำรวจหน้างานจริง', '* This is an initial estimate and may change after the site survey'],
    ['กรุณาเลือกอย่างน้อย 1 ระบบ: ระบบมือหมุน หรือ ระบบมอเตอร์', 'Please select at least one system: manual or motorized'],
    ['ราคาประเมินเบื้องต้น อาจเปลี่ยนแปลงหลังสำรวจหน้างานจริง', 'This is an initial estimate and may change after the site survey'],
    ['กรุณาเลือกระบบมือหมุนหรือระบบมอเตอร์อย่างน้อย 1 ระบบ', 'Please select at least one system: manual or motorized'],
    ['รับประกันการทำงานของมอเตอร์ 2 ปี ตามเงื่อนไขบริษัท', 'Motor warranty: 2 years, subject to company terms'],
    ['มอเตอร์พร้อมมือหมุน + 1 ก้านหมุน / ฝาครอบกันนํ้า', 'Motor with manual override + 1 crank handle / waterproof cover'],
    ['โครงสร้างสีดํา/เทา หรือขาว , Waterproof Cover', 'Black/gray or white frame, waterproof cover'],
    ['โครงสร้างสีดำ/เทา หรือขาว , Waterproof Cover', 'Black/gray or white frame, waterproof cover'],
    ['ราคานี้ยังไม่รวมงานโครงสร้างเสริมพิเศษ หากมี', 'This price excludes additional structural work, if any'],
    ['* ราคาที่แจ้งสินค้ารวมภาษีมูลค่าเพิ่มแล้ว', '* VAT is included'],
    ['โครงสร้างอลูมิเนียม เคลือบ Powder Coated', 'Powder-coated aluminum structure'],
    ['รุ่นพรีเมี่ยม + มอเตอร์ RTS ไม่มีไฟ LED', 'Premium model + RTS motor without LED'],
    ['ระบบมอเตอร์ RTS + รีโมท + LED Lighting', 'RTS motor system + remote + LED lighting'],
    ['รุ่นมาตรฐาน + มอเตอร์ RTS ไม่มีไฟ LED', 'Standard model + RTS motor without LED'],
    ['รับประกันโครงสร้างและการติดตั้ง 1 ปี', 'Structure and installation warranty: 1 year'],
    ['Quotation Preview / ข้อความส่งลูกค้า', 'Quotation Preview'],
    ['ไม่มีราคาสำหรับระบบมือหมุนในขนาดนี้', 'No price found for manual system at this size'],
    ['ราคาติดตั้งภายในกรุงเทพฯ และปริมณฑล', 'Installation within Bangkok and Vicinity'],
    ['โครงสร้างสีดํา/เทา มีฝาครอบกันนํ้า', 'Black/gray frame with waterproof cover'],
    ['โครงสร้างสีดำ/เทา มีฝาครอบกันน้ำ', 'Black/gray frame with waterproof cover'],
    ['มอเตอร์พร้อมมือหมุน + 1 ก้านหมุน', 'Motor with manual override + 1 crank handle'],
    ['ยังไม่มีราคามอเตอร์สำหรับขนาดนี้', 'No motorized price found for this size'],
    ['โครงสร้างสีมาตรฐานตามรุ่นสินค้า', 'Standard frame color for this model'],
    ['Crank Size: ก้านหมุนเลือกได้', 'Crank size: selectable'],
    ['ระบบมอเตอร์: 50/12 เท่านั้น', 'Motor system: 50/12 only'],
    ['โครงสร้างสีดํา/เทา หรือขาว', 'Black/gray or white frame'],
    ['โครงสร้างสีดำ/เทา หรือขาว', 'Black/gray or white frame'],
    ['ระบบมอเตอร์ RTS + รีโมท', 'RTS motor system + remote'],
    ['ข้อความสำหรับส่งลูกค้า', 'Customer copy text'],
    ['ไม่มีราคาสำหรับขนาดนี้', 'No price found for this size'],
    ['//ราคาต่อชุดก่อนส่วนลด', 'Unit Price Before Discount'],
    ['อุปกรณ์เสริมเพิ่มเติม', 'Additional Accessories'],
    ['ราคาต่อชุดก่อนส่วนลด', 'Unit Price Before Discount'],
    ['มอเตอร์พร้อมมือหมุน', 'Motor with manual override'],
    ['สำหรับระบบมือหมุน', 'for manual system'],
    ['ก้านหมุนเลือกได้', 'selectable crank handle'],
    ['ข้อความส่งลูกค้า', 'Customer copy text'],
    ['ฝาครอบอลูมิเนียม', 'Aluminum cover'],
    ['ผ้าใบโซล่าแซนด์', 'Solar Sand Fabric'],
    ['รวม VAT 7% แล้ว', 'VAT 7% included'],
    ['คิดจากกว้างรวม', 'calculated from total width'],
    ['ผลการคำนวณราคา', 'Price Calculation Result'],
    ['อุปกรณ์เสริม', 'Accessories'],
    ['ผ้า Acrylic', 'Acrylic Fabric'],
    ['ฝาครอบสีขาว', 'White cover'],
    ['ไม่มีฝาครอบ', 'No cover'],
    ['ระบบมอเตอร์', 'Motor System'],
    ['ระบบมือหมุน', 'Manual System'],
    ['แขนพร้อมไฟ', 'arms with LED'],
    ['ผลการคำนวณ', 'Calculation Result'],
    ['ระบบมือดึง', 'Manual Pull System'],
    ['ราคาต่อตรม', 'Rate per sqm'],
    ['กรุณากรอก', 'Please enter'],
    ['ชนิดผ้าใบ', 'Fabric'],
    ['ในกรณีใช้', 'when using'],
    ['รอสินค้า', 'lead time'],
    ['ราคาต่อ', 'Unit Price'],
    ['ในกรณี', 'for'],
    ['มือดึง', 'Manual pull'],
    ['ผ้าใบ', 'Fabric'],
    ['ไม่มี', 'None'],
    ['รีโมท', 'Remote'],
    ['ก่อน', 'Before'],
    ['ช่อง', 'channel'],
    ['เมตร', 'm'],
    ['ระบบ', 'System'],
    ['ชุด', 'set'],
    ['ใช้', 'using'],
    ['ตรม', 'sqm'],
    ['บาท', 'THB'],
    ['ผ้า', 'Fabric'],
    ['รวม', 'Total'],
    ['สูง', 'Height'],
    ['ปี', 'years'],
    ['ม.', 'm.']
    ],

    // เฉพาะโครงสร้าง — ใช้ร่วมกัน 4 ไฟล์
    STRUCTURE: [
    ['ขนาดกว้าง 2 - 4.50 เมตร ใช้ท่อกลมกัลวาไนซ์ 70 mm. / ขนาดกว้าง 4.51 - 5.00 เมตร ใช้ท่อกลม 78 mm.', 'Width 2 - 4.50 m uses 70 mm galvanised round tube / Width 4.51 - 5.00 m uses 78 mm round tube'],
    ['ขนาดนี้ไม่มีในตารางราคา (ช่อง x) กรุณาติดต่อฝ่ายขาย', 'This size is not available in the pricelist. Please contact sales.'],
    ['ราคาไม่รวมภาษีมูลค่าเพิ่ม (Price Excluded VAT.)', 'Price excluded VAT'],
    ['ตัวเลขในวงเล็บ ( ) = จำนวนแขน (No. of Arms)', 'Number in brackets ( ) = number of arms'],
    ['Customer copy text / ข้อความสำหรับส่งลูกค้า', 'Customer copy text'],
    ['กันสาดแนวตั้ง (Vertical Drop Awning)', 'Vertical Drop Awning'],
    ['ความสูง (Drop) อยู่นอกช่วงตารางราคา', 'Drop is outside the pricelist range'],
    ['ราคาเฉพาะโครงสร้าง ไม่รวมราคาผ้า', 'Structure price only, fabric not included'],
    ['กรุณาเลือกระยะแขนยื่นจากรายการ', 'Please select an arm projection from the list'],
    ['ราคาขายสุทธิแล้ว (ไม่มีส่วนลด)', 'Net selling price (no further discount)'],
    ['ความกว้างอยู่นอกช่วงตารางราคา', 'Width is outside the pricelist range'],
    ['ระบบมือหมุน (Manual System)', 'Manual System'],
    ['ท่อกลมกัลวาไนซ์ 70 mm.', '70 mm galvanised round tube'],
    ['อุปกรณ์เสริมเพิ่มเติม', 'Additional accessories'],
    ['ราคารวม (ไม่รวม VAT)', 'Total (excl. VAT)'],
    ['อุปกรณ์เสริมมอเตอร์', 'Motor accessory'],
    ['ราคารวมก่อนส่วนลด', 'Total before discount'],
    ['ท่อกลม 78 mm.', '78 mm round tube'],
    ['ความสูง Drop', 'Drop height'],
    ['ท่อโครงสร้าง', 'Structure tube'],
    ['ระบบมอเตอร์', 'Motor system'],
    ['ระยะแขนยื่น', 'Arm projection'],
    ['ราคามอเตอร์', 'Motor price'],
    ['ราคารวม VAT', 'Total incl. VAT'],
    ['ส่วนลดพิเศษ', 'Special discount'],
    ['ผลการคำนวณ', 'Result'],
    ['ราคาต่อชุด', 'Price per set'],
    ['ความกว้าง', 'Width'],
    ['เงื่อนไข', 'Condition'],
    ['จำนวนแขน', 'Number of arms'],
    ['หมายเหตุ', 'Note'],
    ['ส่วนลด', 'Discount'],
    ['จำนวน', 'Quantity'],
    ['ช่วง', 'range'],
    ['ระบบ', 'System'],
    ['รุ่น', 'Model'],
    ['แขน', 'arms'],
    ['ชุด', 'set'],
    ['บาท', 'THB'],
    ['ม.', 'm.']
    ]
  },

  /*
    รวมคำของไฟล์นั้น (overrides) เข้ากับคำกลางของกลุ่ม
    ถ้าคำไทยซ้ำกัน ให้ใช้ของไฟล์นั้นเป็นหลัก
    (merge a file's own list with its family's; the file's own entry wins)
  */
  merge: function (overrides, family) {
    var list = (overrides || []).concat(this.SHARED[family] || []);
    var seen = {};
    var out = [];
    for (var i = 0; i < list.length; i++) {
      var th = list[i][0];
      if (seen[th]) continue;   // เจอคำนี้แล้ว (ของไฟล์มาก่อน) ข้ามไป
      seen[th] = true;
      out.push(list[i]);
    }
    return out;
  }
};
