/*
  Sangthong shared price catalog / ราคากลางที่ใช้ร่วมกันหลายเครื่องคำนวณ
  ---------------------------------------------------------------------
  Single source of truth for accessory prices that are IDENTICAL across
  several calculators. Change a number here once and every calculator that
  reads from this file updates automatically.

  ไฟล์ HTML ที่อ่านค่าจากไฟล์นี้ / HTML files that read from this catalog (12):
    - seatel-st2000.html  (มีระบบแบ่งผ้า split fabric ในตัวแล้ว)
    - seatel-st1000e-vertical-awning.html
    - chill-d1.html
    - izip-screen.html
    - terra-ma3.html
    - terra-ma3-LED.html  (ฝาครอบกันน้ำเท่านั้น / cover profile only)
    - spettmann-star.html
    - ma4-calculator.html  (Strong Up accessories + ฝาครอบกันน้ำ)
    - ma4-calculator-structure.html, terra-ma3-structure.html,
      seatel-st2000-structure.html, spettmann-star-structure.html
  แต่ละไฟล์โหลดด้วย <script src="prices.js"></script> ก่อน <script> หลัก
  (each file loads it with <script src="prices.js"></script> before its main inline <script>)

  หมายเหตุ / NOTES:
    * SEATEL ST1000E เคยใช้ราคารีโมท Somfy ของตัวเอง (1ch 2,498 / 2ch 2,636 /
      5ch 4,163) แต่ได้ปรับให้ตรงกับ catalog (3,017 / 3,862 / 6,035) แล้ว
      จึงอ่านค่าจากไฟล์นี้ได้ (aligned to the catalog so it now shares these prices).
    * ราคา "ตัวมอเตอร์" (Somfy / Strong Up) อยู่ในบล็อก `motors` ด้านล่าง = single
      source of truth ใช้ร่วมกันโดย:
        - *-structure.html (4 ไฟล์)            อ่านผ่าน MC.<key> ในตาราง MOTORS
        - chill-d1, seatel-st2000, seatel-st1000e-vertical-awning, izip-screen
                                               อ่านผ่าน data-price-key="<key>" ใน <option>
        - terra-ma3 / spettmann-star (ตัวเต็ม) อ่าน motors.somfyAltus* สำหรับตัวเลือก Somfy
      แก้ราคามอเตอร์ที่บล็อก `motors` ที่เดียว ทุกไฟล์ข้างต้นจะเปลี่ยนตามอัตโนมัติ
    * ราคา "ฝาครอบกันน้ำ" (cover profile) อยู่ในบล็อก `coverProfile` ด้านล่าง
      คิดเป็น "บาทต่อความกว้าง 1 เมตร" ใช้ร่วมกัน 7 ไฟล์ (ดูรายละเอียดที่บล็อกนั้น)
    * ราคาในป้าย checkbox (เช่น "+13,675 บาท") จะอัปเดตอัตโนมัติจาก catalog นี้
      ตอนโหลดหน้า (ดูส่วน "Auto-sync checkbox label prices" ท้ายไฟล์)
      แก้ราคาที่นี่ที่เดียว ทั้งการคำนวณและป้ายจะเปลี่ยนตาม
      (checkbox label text is auto-synced from this catalog on page load —
      edit a price here once and both the math and the label update).

  วิธีอ่านค่าในแต่ละไฟล์ / How a calculator reads a value:
    window.SANGTHONG_PRICES.somfy.ondeisRain   // => 13675
    window.SANGTHONG_PRICES.strongUp.remote1   // => 950
*/
window.SANGTHONG_PRICES = {

  // อุปกรณ์เสริมมอเตอร์ Somfy / Somfy motor accessories
  somfy: {
    ondeisRain: 13675,   // Ondeis Rain Sensor
    dryContact: 14918,   // Dry Contact Transmitter RTS
    sunis:      23315,   // Sunis Sensor RTS Wirefree
    eolis:      11663,   // Eolis Sensor RTS
    eolis3D:    11663,   // Eolis 3D Sensor RTS
    soliris:    21756,   // Soliris RTS Sensor
    taHoma:     11005,   // TaHoma
    remote1:     3108,   // Somfy Remote 1 Channel / รีโมท 1 ช่อง
    remote2:     3978,   // Somfy Remote 2 Channel / รีโมท 2 ช่อง
    remote5:     6216,    // Somfy Remote 5 Channel / รีโมท 5 ช่อง
	remote6:     13675,    // Somfy Remote 6 Channel / รีโมท 6 ช่อง
	remote16:    12432,    // Somfy Remote 16 Channel / รีโมท 16 ช่อง
    smoove:     2362     // สวิตซ์ Smoove 1 ช่อง RTS Origin / Smoove 1-channel switch
  },

  // อุปกรณ์เสริมมอเตอร์ Strong Up / Strong Up motor accessories
  strongUp: {
    remote1:      950,   // Transmitter 1 Channel / รีโมท 1 ช่อง
    remote15:    1800,   // Transmitter 15 Channel / รีโมท 15 ช่อง
    windSun:     6600,   // Wind-Sun Sensor / เซ็นเซอร์ลม-แดด
    wifiAdapter: 7500,   // Wifi Smart Bridge with Adapter
    wifiBridge:  6600,   // Wifi Smart Bridge only
    usbCharger:   900,   // USB Charger
    lanBridge:   9000    // Lan Smart Bridge 1.20 m
  },

  // ราคาตัวมอเตอร์ (add-on) / Motor unit prices — SINGLE SOURCE OF TRUTH
  // ใช้โดย / used by:
  //   - *-structure.html (4 ไฟล์)  อ่านผ่าน MC.<key> ในตาราง MOTORS
  //   - chill-d1.html, seatel-st2000.html, seatel-st1000e-vertical-awning.html,
  //     izip-screen.html            อ่านผ่าน data-price-key="<key>" ในแต่ละ <option>
  // ราคาเป็นแบบ "ตามที่ขายจริง" = รวมรีโมท 1 ช่องแล้วในรุ่นที่ป้ายระบุ "+ Remote"
  //   (as-sold prices: the bundled 1-channel remote is already included where the
  //    option label says "+ Remote", so customer-facing totals do not change)
  // แก้ราคาที่นี่ที่เดียว ทุกไฟล์ในกลุ่มจะเปลี่ยนตามทั้งค่าที่ใช้คำนวณและตัวเลขบนป้าย
  motors: {
    // --- Strong Up (ราคาเท่ากันทุกไฟล์ / identical in every file) ---
    strongUp50_12:           9900,   // Strong Up 50/12
    strongUp50_12_crank:     11900,  // Strong Up 50/12 + มือหมุน (crank handle)
    strongUp80_15:           15900,  // Strong Up 80/15

    // --- Somfy Altus (สายมาตรฐาน / standard Altus line) ---
    somfyAltus50_12:         26800,  // Somfy Altus 50/12  (chill-d1 ป้ายว่า "Altus RTS 50/12")
    somfyAltus30_17:         24800,  // Somfy Altus 30/17 + Remote
    somfyAltus40_17:         26800,  // Somfy Altus 40/17 + Remote
    somfyAltus85_17:         36800,  // Somfy Altus 85/17 + Remote

    // --- Somfy Maestria ---
    somfyMaestria15_17:      25000,  // Somfy Maestria 15/17 + Remote
    somfyMaestria35_17:      31000,  // Somfy Maestria 35/17 + Remote

    // --- Somfy MAESTRIA+50 RTS (Telis situo 1 RTS) ---
    somfyMaestria50RTS15_17: 25000,  // MAESTRIA+50 RTS 15/17 + Remote
    somfyMaestria50RTS35_17: 31000,  // MAESTRIA+50 RTS 35/17 + Remote

    // --- Somfy Altus 50 RTS (เฉพาะ izip-screen / izip-screen only) ---
    somfyAltus50RTS10_17:    21800,  // Altus 50 RTS 10/17 + Remote
    somfyAltus50RTS20_17:    23800,  // Altus 50 RTS 20/17 + Remote
    somfyAltus50RTS30_17:    24800,  // Altus 50 RTS 30/17 + Remote
    somfyAltus50RTS40_17:    25800   // Altus 50 RTS 40/17 + Remote
  },

  // ราคาฝาครอบกันน้ำ / Cover profile prices — SINGLE SOURCE OF TRUTH
  // *** หน่วยเป็น "บาทต่อความกว้าง 1 เมตร" ไม่ใช่ราคาต่อชุด ***
  //     (unit is BAHT PER METRE OF WIDTH, not a per-set price)
  //     ราคาที่คิดจริง = ราคาต่อเมตร × ความกว้าง (เมตร)
  // ใช้โดย 7 เครื่องคำนวณ / used by 7 calculators:
  //   - seatel-st2000.html, seatel-st1000e-vertical-awning.html
  //         <option> เก็บ "ราคาต่อเมตร" ไว้ในค่า value โดยตรง (auto-synced)
  //   - chill-d1.html, ma4-calculator.html, spettmann-star.html,
  //     terra-ma3.html, terra-ma3-LED.html
  //         <option> เก็บ "รหัส" (aluminum/white หรือ B/C) แล้วคูณในฟังก์ชัน
  //         getCoverCost() ซึ่งอ่านราคาต่อเมตรจาก catalog นี้
  // แก้ราคาที่นี่ที่เดียว ทั้ง 7 ไฟล์จะเปลี่ยนตาม ทั้งค่าที่ใช้คำนวณและตัวเลขบนป้าย
  coverProfile: {
    aluminum: 2400,   // ฝาครอบอลูมิเนียม MF (สีเงิน) / aluminium cover, silver MF — บาท/เมตร
    white:    2900    // ฝาครอบสีขาว WH / white cover, WH — บาท/เมตร
  }
};


/*
  ===== ป้ายราคาอัตโนมัติ / Auto-sync checkbox label prices =====
  อัปเดต "ตัวเลขราคา" ที่แสดงในป้าย checkbox ให้ตรงกับ catalog ด้านบนโดยอัตโนมัติ
  ตอนโหลดหน้า โดยใช้ id ของ checkbox เป็นตัวเชื่อม จึงไม่ต้องแก้ไฟล์ HTML เลย
  Updates the price number shown in each accessory checkbox label to match the
  catalog above, automatically on page load. Keyed by checkbox id, so the HTML
  files need no changes. แก้ราคาที่ catalog ที่เดียว ทั้งการคำนวณและป้ายจะเปลี่ยนตาม.
*/
window.SANGTHONG_ACCESSORY_KEYS = {
  // ตัวมอเตอร์ Somfy (ป้าย checkbox ในเครื่องคำนวณตัวเต็ม terra-ma3 / spettmann-star)
  chkSomfy50:          ['motors', 'somfyAltus50_12'],
  chkSomfy85:          ['motors', 'somfyAltus85_17'],
  // อุปกรณ์เสริม Somfy
  chkSomfyOndeisRain:  ['somfy', 'ondeisRain'],
  chkSomfyDryContact:  ['somfy', 'dryContact'],
  chkSomfySunis:       ['somfy', 'sunis'],
  chkSomfyEolis:       ['somfy', 'eolis'],
  chkSomfyEolis3D:     ['somfy', 'eolis3D'],
  chkSomfySoliris:     ['somfy', 'soliris'],
  chkSomfyTaHoma:      ['somfy', 'taHoma'],
  chkSomfyRemote1:     ['somfy', 'remote1'],
  chkSomfyRemote2:     ['somfy', 'remote2'],
  chkSomfyRemote5:     ['somfy', 'remote5'],
  chkSomfyRemote6:     ['somfy', 'remote6'],
  chkSomfyRemote16:    ['somfy', 'remote16'],
  chkSomfySmoove:      ['somfy', 'smoove'],
  // อุปกรณ์เสริม Strong Up
  chkStrongRemote1:    ['strongUp', 'remote1'],
  chkStrongRemote15:   ['strongUp', 'remote15'],
  chkStrongWindSun:    ['strongUp', 'windSun'],
  chkStrongWifiAdapter:['strongUp', 'wifiAdapter'],
  chkStrongWifiBridge: ['strongUp', 'wifiBridge'],
  chkStrongUsbCharger: ['strongUp', 'usbCharger'],
  chkStrongLanBridge:  ['strongUp', 'lanBridge']
};

window.applyAccessoryLabelPrices = function () {
  var P = window.SANGTHONG_PRICES;
  var map = window.SANGTHONG_ACCESSORY_KEYS;
  Object.keys(map).forEach(function (id) {
    var input = document.getElementById(id);
    if (!input) return;                       // calculator doesn't have this item
    var key = map[id];
    var price = P[key[0]] && P[key[0]][key[1]];
    if (price == null) return;
    var label = input.closest('label');
    if (!label) return;
    var formatted = price.toLocaleString('th-TH');
    // Replace only the number that sits right before "บาท" in the label's text,
    // leaving other numbers (e.g. "1.20 m") untouched. Works for both
    // "... (+13,675 บาท)" and "... เพิ่ม 3,017 บาท" label styles.
    for (var i = 0; i < label.childNodes.length; i++) {
      var node = label.childNodes[i];
      if (node.nodeType === 3 && /บาท/.test(node.nodeValue)) {
        node.nodeValue = node.nodeValue.replace(/[\d,]+(\s*บาท)/, formatted + '$1');
      }
    }
  });
};

/*
  ===== ค้นหาราคาจาก catalog ด้วยชื่อคีย์ / Look up a price by key =====
  รองรับ 2 แบบ / accepts two forms:
    'somfyAltus50_12'          => มองหาในบล็อก motors (แบบเดิม / legacy, motors block)
    'coverProfile.aluminum'    => ระบุบล็อกเองด้วยจุด (explicit "<block>.<key>")
  คืน null ถ้าไม่พบ (returns null when the key is not in the catalog).
*/
window.getCatalogPrice = function (key) {
  var P = window.SANGTHONG_PRICES || {};
  if (!key) return null;
  var dot = key.indexOf('.');
  if (dot === -1) {                            // ไม่มีจุด = คีย์ของมอเตอร์ (legacy)
    return (P.motors && P.motors[key] != null) ? P.motors[key] : null;
  }
  var block = P[key.slice(0, dot)];
  var name  = key.slice(dot + 1);
  return (block && block[name] != null) ? block[name] : null;
};

/*
  ===== ราคาฝาครอบต่อเมตร / Cover profile rate per metre =====
  ใช้ในฟังก์ชัน getCoverCost() ของเครื่องคำนวณที่เก็บ "รหัส" ไว้ใน <option value>
  (chill-d1 · ma4-calculator · spettmann-star · terra-ma3 · terra-ma3-LED)
  คืน 0 ถ้าไม่พบ เพื่อไม่ให้การคำนวณพังหาก prices.js ยังโหลดไม่เสร็จ
  Returns the per-metre cover rate, or 0 if unknown, so the math never breaks.
*/
window.getCoverProfileRate = function (type) {
  var CP = (window.SANGTHONG_PRICES || {}).coverProfile || {};
  return CP[type] || 0;
};

/*
  ===== ราคาใน <option> อัตโนมัติ / Auto-sync <option> prices =====
  อัปเดตทุก <option data-price-key="..."> ให้ตรงกับ catalog ด้านบน ตอนโหลดหน้า:
    - "ตัวเลขราคาบนข้อความ"  อัปเดตเสมอ (always updated)
    - "ค่า value"            อัปเดตเฉพาะเมื่อค่าเดิมเป็นตัวเลข เช่น value="9900"
                             ถ้าค่าเดิมเป็นรหัส เช่น value="aluminum" หรือ "B"
                             จะไม่แตะ เพราะโค้ดของไฟล์นั้นใช้รหัสในการตัดสินใจ
                             (a code value is left alone — only its label is synced)
  แก้ราคาที่ prices.js ที่เดียว ไม่ต้องแก้ HTML แต่ละไฟล์
*/
window.applyOptionPrices = function () {
  var opts = document.querySelectorAll('option[data-price-key]');
  for (var i = 0; i < opts.length; i++) {
    var opt = opts[i];
    var price = window.getCatalogPrice(opt.getAttribute('data-price-key'));
    if (price == null) continue;               // key not in catalog — leave option as-is
    // ค่าที่เป็นตัวเลข (หรือว่าง) = ราคาที่เครื่องคำนวณอ่านไปใช้ตรง ๆ จึงเขียนทับได้
    if (/^\d*\.?\d*$/.test(opt.value.trim())) opt.value = String(price);
    var formatted = price.toLocaleString('th-TH');
    // แทนที่เฉพาะตัวเลขที่อยู่ก่อนคำว่า "บาท" (รองรับทั้ง "(9,900 บาท)" และ "= 9,900 บาท")
    opt.textContent = opt.textContent.replace(/[\d,]+(\s*บาท)/, formatted + '$1');
  }
};

// ชื่อเดิม เก็บไว้เพื่อความเข้ากันได้ / legacy alias, kept for backwards compatibility
window.applyMotorOptionPrices = window.applyOptionPrices;

function applyCatalogPrices() {
  window.applyAccessoryLabelPrices();
  window.applyOptionPrices();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', applyCatalogPrices);
} else {
  applyCatalogPrices();
}
