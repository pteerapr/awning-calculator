/*
  Sangthong shared price catalog / ราคากลางที่ใช้ร่วมกันหลายเครื่องคำนวณ
  ---------------------------------------------------------------------
  Single source of truth for accessory prices that are IDENTICAL across
  several calculators. Change a number here once and every calculator that
  reads from this file updates automatically.

  ไฟล์ HTML ที่อ่านค่าจากไฟล์นี้ / HTML files that read from this catalog (6):
    - seatel-st2000.html  (มีระบบแบ่งผ้า split fabric ในตัวแล้ว)
    - seatel-st1000e-vertical-awning.html
    - chill-d1.html
    - izip-screen.html
    - terra-ma3.html
    - spettmann-star.html
  แต่ละไฟล์โหลดด้วย <script src="prices.js"></script> ก่อน <script> หลัก
  (each file loads it with <script src="prices.js"></script> before its main inline <script>)

  ยังไม่ได้เชื่อม / NOT yet wired:
    - ma4-calculator.html (ยังมีราคา Strong Up แบบ hardcode อยู่ / still has hardcoded Strong Up prices)

  หมายเหตุ / NOTES:
    * SEATEL ST1000E เคยใช้ราคารีโมท Somfy ของตัวเอง (1ch 2,498 / 2ch 2,636 /
      5ch 4,163) แต่ได้ปรับให้ตรงกับ catalog (3,017 / 3,862 / 6,035) แล้ว
      จึงอ่านค่าจากไฟล์นี้ได้ (aligned to the catalog so it now shares these prices).
    * ไฟล์นี้เก็บเฉพาะราคา "อุปกรณ์เสริมมอเตอร์" เท่านั้น ราคา "ตัวมอเตอร์"
      ยังอยู่ใน <option value="..."> ของแต่ละไฟล์ (motor prices are NOT here).
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
    remote1:     3017,   // Somfy Remote 1 Channel / รีโมท 1 ช่อง
    remote2:     3862,   // Somfy Remote 2 Channel / รีโมท 2 ช่อง
    remote5:     6035    // Somfy Remote 5 Channel / รีโมท 5 ช่อง
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

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', window.applyAccessoryLabelPrices);
} else {
  window.applyAccessoryLabelPrices();
}
