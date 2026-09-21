/*
  check.js — ตรวจสอบเครื่องคำนวณทุกตัวก่อนส่งขึ้นเว็บ
  Pre-deploy checker for all Sangthong awning calculators.
  ---------------------------------------------------------------------------
  วิธีใช้ / How to run:   ดับเบิลคลิก check.bat   (หรือพิมพ์  node check.js)

  ตรวจอะไรบ้าง / What it checks:
    1. prices.js อ่านได้ไหม (ถ้าพังเครื่องคำนวณทุกตัวจะคิดราคาผิดหมด)
    2. ราคาสำรอง (`|| 12345`) ตรงกับ prices.js ไหม
    3. ไฟล์ที่ใช้ catalog แต่ลืมโหลด prices.js
    4. ตารางแปลอังกฤษของแต่ละไฟล์ยังอ่านได้ไหม
    5. ข้อความส่งลูกค้าที่กดปุ่ม EN แล้วยังมีภาษาไทยปนอยู่
    6. ไฟล์ที่มีตารางราคาแต่ไม่มีข้อความเตือนเมื่อหาราคาไม่เจอ
    7. ข้อความหมายเหตุมาตรฐานเขียนไม่ตรงกันระหว่างไฟล์

  ผลลัพธ์ / Exit code:  0 = ผ่าน (ส่งขึ้นเว็บได้)   1 = มี ERROR (อย่าเพิ่งส่ง)

  หมายเหตุ: ไฟล์นี้ตรวจ "ข้อความและการต่อสาย" เท่านั้น ยังไม่ได้ตรวจว่า
  "ตัวเลขราคาถูกต้อง" — การพิมพ์ราคาผิด (เช่น 47570 -> 4757) ยังจับไม่ได้
  (this checks text and wiring only; it cannot catch a mistyped price)
*/

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = __dirname;
const THAI = /[฀-๿]/;

const errors = [];   // ปัญหาที่ต้องแก้ก่อนส่งขึ้นเว็บ
const warnings = []; // เรื่องที่ควรดู แต่ไม่ถึงกับห้ามส่ง
const err = (file, msg) => errors.push({ file, msg });
const warn = (file, msg) => warnings.push({ file, msg });

// ---------------------------------------------------------------------------
// 1. โหลด prices.js ในกล่องจำลอง (sandbox) ที่มี window/document ปลอมให้
//    เพราะไฟล์นี้เขียนไว้สำหรับรันในเบราว์เซอร์ ไม่ใช่ Node
// ---------------------------------------------------------------------------
let catalog = null;
try {
  const sandbox = {
    window: {},
    document: {
      readyState: 'complete',
      addEventListener() {},
      querySelectorAll: () => [],
      querySelector: () => null,
      getElementById: () => null,
    },
  };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'prices.js'), 'utf8'), sandbox);
  catalog = sandbox.window.SANGTHONG_PRICES;
  if (!catalog) throw new Error('ไม่พบ window.SANGTHONG_PRICES');
} catch (e) {
  err('prices.js', 'อ่านไฟล์ไม่ได้ / failed to load: ' + e.message);
}

// ---------------------------------------------------------------------------
// 1b. โหลด i18n.js (คำแปลกลาง) ด้วยวิธีเดียวกัน
//     ถ้าไฟล์นี้พัง ปุ่ม EN ของทุกเครื่องคำนวณจะแปลไม่ครบ
// ---------------------------------------------------------------------------
let i18n = null;
try {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'i18n.js'), 'utf8'), sandbox);
  i18n = sandbox.window.SANGTHONG_I18N;
  if (!i18n) throw new Error('ไม่พบ window.SANGTHONG_I18N');
} catch (e) {
  err('i18n.js', 'อ่านไฟล์ไม่ได้ / failed to load: ' + e.message);
}

// คีย์คำแปลกลางก็ต้องมีตัวอักษรไทย เหมือนกฎข้อ 4b ของแต่ละไฟล์
// (ไฟล์นี้ใช้ร่วมกันหลายสิบไฟล์ ถ้าคีย์เสียที่นี่ จะพังพร้อมกันทุกไฟล์)
if (i18n && i18n.SHARED) {
  for (const fam of Object.keys(i18n.SHARED)) {
    (i18n.SHARED[fam] || []).forEach(pair => {
      const key = pair && pair[0];
      if (typeof key === 'string' && key.trim() && !THAI.test(key)) {
        err('i18n.js', 'คีย์คำแปลกลุ่ม ' + fam + ' ไม่มีตัวอักษรไทย ให้ลบหรือพิมพ์ใหม่: ' + JSON.stringify(key));
      }
    });
  }
}

// แผ่ราคาทั้งหมดออกมาเป็น { 'somfy.remote1': 3108, ... }
const flatPrices = {};
if (catalog) {
  (function flatten(obj, prefix) {
    for (const key in obj) {
      const val = obj[key];
      if (typeof val === 'number') flatPrices[prefix + key] = val;
      else if (val && typeof val === 'object') flatten(val, prefix + key + '.');
    }
  })(catalog, '');
}

// ---------------------------------------------------------------------------
// ตรวจทีละไฟล์ HTML
// ---------------------------------------------------------------------------
const htmlFiles = fs.readdirSync(ROOT).filter(f => f.endsWith('.html')).sort();
const noteLines = new Map(); // ข้อความหมายเหตุ -> รายชื่อไฟล์ที่ใช้

for (const file of htmlFiles) {
  const src = fs.readFileSync(path.join(ROOT, file), 'utf8');

  // --- 2. ราคาสำรองที่เขียนค้างไว้ ต้องตรงกับ prices.js ---
  // รูปแบบที่มองหา:  SANGTHONG_PRICES.somfy.remote1 || 3108
  const fallbackRe =
    /SANGTHONG_PRICES\s*(?:\?\.)?\s*((?:\.\w+|\[['"]\w+['"]\])+)\s*\)?\s*\|\|\s*(\d{3,7})/g;
  let m;
  while ((m = fallbackRe.exec(src))) {
    const keyPath = m[1].replace(/\[['"]/g, '.').replace(/['"]\]/g, '').replace(/^\./, '');
    const fallback = Number(m[2]);
    if (keyPath in flatPrices && flatPrices[keyPath] !== fallback) {
      err(file, `ราคาสำรองไม่ตรง catalog: ${keyPath} = ${fallback} แต่ prices.js = ${flatPrices[keyPath]}`);
    }
  }

  // --- 3. ใช้ catalog แต่ลืมโหลด prices.js ---
  if (/SANGTHONG_PRICES/.test(src) && !/src=["']prices\.js["']/.test(src)) {
    err(file, 'อ้างถึง SANGTHONG_PRICES แต่ไม่มี <script src="prices.js">');
  }

  // --- 4 + 5. ตารางแปลอังกฤษ และข้อความส่งลูกค้า ---
  // ไฟล์ส่วนใหญ่เก็บคำเฉพาะตัวไว้ใน RESULT_EN_OVERRIDES แล้วรวมกับคำกลางใน i18n.js
  // ส่วนไฟล์ที่ยังไม่ได้ย้าย (canopy, fabric-price) ยังใช้ RESULT_EN_REPLACEMENTS เดิม
  // ต้องประกอบตารางให้เหมือนที่เบราว์เซอร์ทำ ไม่งั้นจะตรวจไม่ครบ
  const overrideMatch = src.match(/RESULT_EN_OVERRIDES\s*=\s*(\[[\s\S]*?\n\s*\];)/);
  const tableMatch = overrideMatch
    || src.match(/RESULT_EN_REPLACEMENTS\s*=\s*(\[[\s\S]*?\n\s*\];)/);
  if (tableMatch) {
    let table = null;
    const name = overrideMatch ? 'RESULT_EN_OVERRIDES' : 'RESULT_EN_REPLACEMENTS';
    try {
      table = eval('(' + tableMatch[1].replace(/;\s*$/, '') + ')');
    } catch (e) {
      err(file, 'ตารางแปลอังกฤษ ' + name + ' พัง: ' + e.message);
    }

    // --- 4b. คีย์คำแปลต้องมีตัวอักษรไทย ---
    // ถ้าไฟล์ถูกบันทึกผิดรหัสภาษา คำไทยจะกลายเป็น "???" หรือตัวอักษรประหลาด
    // คีย์แบบนั้นแปลอะไรไม่ได้เลย (ไม่มีวันตรงกับข้อความจริง) และยังอันตราย
    // เพราะถ้าข้อความมี "???" อยู่จริง จะถูกแทนที่เป็นคำอังกฤษผิด ๆ ให้ลูกค้าเห็น
    // (a key that lost its Thai characters can never match, and can corrupt other text)
    if (table) {
      table.forEach(pair => {
        const key = pair && pair[0];
        if (typeof key === 'string' && key.trim() && !THAI.test(key)) {
          err(file, 'คีย์คำแปลไม่มีตัวอักษรไทย (น่าจะเสียจากการบันทึกผิดรหัสภาษา) ให้ลบหรือพิมพ์ใหม่: ' + JSON.stringify(key));
        }
      });
    }

    // รวมคำกลางของกลุ่มเข้ามา (เหมือนที่ i18n.js merge ให้ตอนเปิดหน้าเว็บ)
    if (table && overrideMatch) {
      const fam = (src.match(/merge\(RESULT_EN_OVERRIDES,\s*['"](\w+)['"]\)/) || [])[1];
      if (!fam) {
        err(file, 'มี RESULT_EN_OVERRIDES แต่ไม่ได้เรียก SANGTHONG_I18N.merge(...) พร้อมชื่อกลุ่ม');
      } else if (!/src=["']i18n\.js["']/.test(src)) {
        err(file, 'อ้างถึง SANGTHONG_I18N แต่ไม่มี <script src="i18n.js">');
      } else if (i18n && !i18n.SHARED[fam]) {
        err(file, 'อ้างถึงกลุ่มคำแปล "' + fam + '" ที่ไม่มีใน i18n.js');
      } else if (i18n) {
        table = i18n.merge(table, fam);
      }
    }

    if (table) {
      // เรียงจากยาวไปสั้น เหมือนที่โค้ดจริงทำ ไม่งั้นคำสั้นจะไปตัดคำยาว
      const sorted = table.slice().sort((a, b) => b[0].length - a[0].length);

      // ต้องดูทุก lines.push ในบรรทัดเดียวกัน ไม่ใช่แค่อันแรก
      // บางไฟล์เขียนติดกันหลายอันในบรรทัดเดียว เช่น
      //   lines.push("...");lines.push("สินค้า Pre-Order รอสินค้า 60-90 วัน");
      // ถ้าจับแค่อันแรก อันหลัง ๆ จะไม่ถูกตรวจเลย และคำไทยจะหลุดไปถึงลูกค้าได้
      // (match EVERY push on a line, not just the first)
      const pushRe = /lines\.push\(\s*(["'`])((?:\\.|(?!\1).)*)\1/g;

      for (const rawLine of src.split('\n')) {
        const line = rawLine.trim();
        if (line.startsWith('//')) continue; // ข้ามโค้ดที่ถูกคอมเมนต์ทิ้งไว้
        pushRe.lastIndex = 0;
        let push;
        while ((push = pushRe.exec(line))) {
        if (!THAI.test(push[2])) continue;
        const thaiLine = push[2];

        // เก็บข้อความหมายเหตุมาตรฐานไว้เทียบกันระหว่างไฟล์ (ข้อ 7)
        if (/VAT|ติดตั้งภายใน|Pre-Order|รับประกัน/.test(thaiLine)) {
          if (!noteLines.has(thaiLine)) noteLines.set(thaiLine, []);
          noteLines.get(thaiLine).push(file);
        }

        // แทน ${...} ด้วย # เพราะเป็นตัวเลขที่ใส่ตอนคำนวณ ไม่ต้องแปล
        let out = thaiLine.replace(/\$\{[^}]*\}/g, '#');
        sorted.forEach(([from, to]) => { out = out.split(from).join(to); });
        if (THAI.test(out)) {
          err(file, `กด EN แล้วยังมีภาษาไทยปน:\n        ไทย  : ${thaiLine}\n        อังกฤษ: ${out}`);
        }
        }
      }
    }
  }

  // --- 6. มีตารางราคา แต่ไม่มีทางบอกผู้ใช้ว่าหาราคาไม่เจอ ---
  const hasTable = /PRICE_ROWS|PRICE_MATRIX|PRICE_TABLES|PRICE_MANUAL|PRICE_MOTOR/.test(src);
  const hasFeedback = /id=["']warning["']/.test(src) || /No price found|ไม่มีราคา|ไม่พบราคา/.test(src);
  if (hasTable && !hasFeedback) {
    warn(file, 'มีตารางราคาแต่ไม่มีข้อความเตือนเมื่อหาราคาไม่เจอ — ถ้าหาไม่เจออาจโชว์ NaN ให้ลูกค้า');
  }
}

// --- 7. ข้อความหมายเหตุมาตรฐานเขียนตรงกันไหม ---
const groups = {};
for (const [line, files] of noteLines) {
  const kind = /VAT/.test(line) ? 'VAT'
    : /ติดตั้งภายใน/.test(line) ? 'พื้นที่ติดตั้ง / install area'
    : /Pre-Order/.test(line) ? 'Pre-Order'
    : 'รับประกัน / warranty';
  (groups[kind] = groups[kind] || []).push([line, files]);
}
for (const kind in groups) {
  if (groups[kind].length > 1) {
    const detail = groups[kind]
      .sort((a, b) => b[1].length - a[1].length)
      .map(([line, files]) => `        ${files.length} ไฟล์: "${line}"`)
      .join('\n');
    warn('(หลายไฟล์)', `ข้อความ "${kind}" เขียนไม่ตรงกัน ${groups[kind].length} แบบ:\n${detail}`);
  }
}

// ---------------------------------------------------------------------------
// สรุปผล
// ---------------------------------------------------------------------------
const swSrc = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
const swVersion = (swSrc.match(/CACHE_NAME\s*=\s*['"]([^'"]+)['"]/) || [])[1] || '(หาไม่เจอ)';

console.log('');
console.log('============================================================');
console.log('  ตรวจสอบเครื่องคำนวณ ' + htmlFiles.length + ' ไฟล์ / checked ' + htmlFiles.length + ' calculators');
console.log('  เวอร์ชันใน sw.js: ' + swVersion);
console.log('============================================================');

if (errors.length) {
  console.log('\n*** ERROR ' + errors.length + ' รายการ — ต้องแก้ก่อนส่งขึ้นเว็บ ***\n');
  for (const e of errors) console.log('  [' + e.file + ']\n        ' + e.msg);
}
if (warnings.length) {
  console.log('\n--- คำเตือน ' + warnings.length + ' รายการ (ส่งขึ้นเว็บได้ แต่ควรดู) ---\n');
  for (const w of warnings) console.log('  [' + w.file + ']\n        ' + w.msg);
}
if (!errors.length && !warnings.length) {
  console.log('\n  ผ่านทั้งหมด ไม่พบปัญหา / all checks passed\n');
} else if (!errors.length) {
  console.log('\n  ไม่พบ ERROR — ส่งขึ้นเว็บได้ / no errors, safe to deploy\n');
} else {
  console.log('\n  อย่าเพิ่งส่งขึ้นเว็บจนกว่าจะแก้ ERROR ข้างบนเสร็จ\n');
}

// อย่าลืมเพิ่มเลขเวอร์ชันใน sw.js ทุกครั้งที่แก้ไฟล์ ไม่งั้นลูกค้าจะเห็นของเก่า
console.log('  อย่าลืม: แก้ไฟล์แล้วต้องเพิ่มเลขเวอร์ชันใน sw.js ก่อน deploy');
console.log('');

process.exit(errors.length ? 1 : 0);
