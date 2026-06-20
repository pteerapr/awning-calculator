# HTML Calculator Skill Reference

This file is the reference guide for building and editing Sangthong Canvas / awning HTML calculators.

Use this document whenever creating, fixing, or improving an HTML quotation calculator in this project.

---

## 1. Main Goal

Build professional, customer-copy-friendly HTML calculators for awning, screen, shade, and canvas products.

Each calculator should allow the user to enter product dimensions, choose fabric/system/motor/accessories, and automatically produce a clean quotation result.

The calculator must be easy for sales staff to use and easy to copy/send to customers.

---

## 2. General Rules

### Always keep the calculator simple for sales use

The user should only need to enter:

* Width
* Drop / projection
* Fabric type
* System type
* Motor option
* Accessories
* Quantity
* Discount, if available

The result must update automatically after input changes.

Do not require the user to click “calculate” unless specifically requested.

---

## 3. File Style

Each calculator should usually be a single `.html` file containing:

* HTML
* CSS
* JavaScript
* Price table data
* Calculation logic
* Result display
* Copy button

Avoid external dependencies unless requested.

The file should work by opening directly in a browser.

---

## 4. Visual Style

Use a clean professional look.

Recommended style:

* Navy blue / dark blue theme
* White card panels
* Clear input labels
* Large readable result panel
* Customer-copy-friendly result box
* Mobile-friendly layout
* No unnecessary preview panel unless requested

The result panel should look like a quotation, not like developer debug output.

---

## 5. Layout Structure

A good calculator layout should contain:

1. Header
   Product name and short description.

2. Input Panel
   Width, drop/projection, fabric, motor, accessories, discount, quantity.

3. Result Panel
   Clean quotation result.

4. Copy Button
   One button to copy the customer-friendly quotation text.

Example layout:

```html
<header>
  <h1>Product Calculator</h1>
  <p>Professional quotation calculator</p>
</header>

<main class="app">
  <section class="card inputs">
    <!-- inputs here -->
  </section>

  <section class="card result">
    <!-- result here -->
  </section>
</main>
```

---

## 6. Required JavaScript Behavior

All input changes should trigger recalculation automatically.

Use event listeners like:

```js
document.querySelectorAll("input, select").forEach(el => {
  el.addEventListener("input", calculate);
  el.addEventListener("change", calculate);
});

window.addEventListener("DOMContentLoaded", calculate);
```

The calculator must also calculate once on page load.

---

## 7. Price Table Rules

Store price data clearly in JavaScript.

Use a simple array such as:

```js
const PRICE_ROWS = [
  {
    widthMin: 0,
    widthMax: 2.00,
    dropMin: 0,
    dropMax: 1.50,
    fabric: "Acrylic",
    manualPrice: 12000,
    motorPrice: 21900
  }
];
```

Or use product-specific table structures if needed.

Important:

* Price table must be easy to update manually.
* Do not hide prices inside complicated formulas unless necessary.
* Use clear variable names.
* Keep original price table data intact when modifying UI.

---

## 8. Dimension Rules

Use meters as the standard unit.

Inputs:

```js
const width = Number(document.getElementById("width").value || 0);
const drop = Number(document.getElementById("drop").value || 0);
```

Area:

```js
const area = width * drop;
```

Always display dimensions clearly:

```text
ขนาด: 3.00 x 2.50 เมตร
พื้นที่: 7.50 ตร.ม.
```

---

## 9. Price Lookup Rule

Use the entered width and drop to find the matching price row.

Example:

```js
function findPriceRow(width, drop, fabric) {
  return PRICE_ROWS.find(row =>
    width >= row.widthMin &&
    width <= row.widthMax &&
    drop >= row.dropMin &&
    drop <= row.dropMax &&
    row.fabric === fabric
  );
}
```

If no price is found, show a clear warning:

```text
ไม่พบราคาสำหรับขนาดนี้ กรุณาตรวจสอบตารางราคา
```

Do not show broken or undefined prices.

---

## 10. Manual and Motorized Result Rule

For many products, the result should show both:

1. Manual system price
2. Motorized system price

This is especially useful for products like ST2000, Terra MA3, Chill D1, and similar calculators.

The manual result should not disappear just because a motor is selected.

Recommended result structure:

```text
สินค้า: SEATEL ST2000

ระบบมือหมุน
ขนาด: 3.00 x 3.00 เมตร
ราคา: 18,500 บาท

ระบบมอเตอร์
มอเตอร์: Strong Up 50/12
ขนาด: 3.00 x 3.00 เมตร
ราคาม่าน: 18,500 บาท
ราคามอเตอร์: 9,900 บาท
ราคารวม: 28,400 บาท
```

---

## 11. Motor Default Rule

If the product has a motorized result, default motor should normally be:

```text
Strong Up 50/12
```

Do not default to “ไม่มีมอเตอร์” unless the user specifically requests it.

Avoid this as default:

```html
<option value="0" selected>ไม่มีมอเตอร์</option>
```

Instead, use:

```html
<option value="9900" selected>Strong Up 50/12 - 9,900 บาท</option>
<option value="12500">Strong Up 80/15 - 12,500 บาท</option>
<option value="26800">Somfy Altus RTS 50/12 - 26,800 บาท</option>
```

---

## 12. Known Motor Prices

Use these standard motor prices unless the product file has different data:

```js
const MOTORS = {
  strongUp5012: {
    label: "Strong Up 50/12",
    price: 9900
  },
  strongUp8015: {
    label: "Strong Up 80/15",
    price: 12500
  },
  somfyAltus5012: {
    label: "Somfy Altus RTS 50/12",
    price: 26800
  }
};
```

Motor warranty note:

```text
มอเตอร์รับประกัน 2 ปี
```

---

## 13. Accessories Rule

Accessories should be added before discount unless the product requires otherwise.

Accessory examples:

```js
const accessories = [
  {
    id: "remote",
    label: "Remote Control",
    price: 1500
  },
  {
    id: "cover",
    label: "Cover Profile",
    price: 2400
  }
];
```

If the user asks for custom accessory names, include:

* Accessory name input
* Accessory price input
* Quantity input

Result should show accessory name and price clearly.

---

## 14. Cover Profile Rule

Cover profile is calculated by width.

Common prices:

```js
const COVER_PROFILE = {
  aluminum: 2400,
  white: 2900
};
```

Calculation:

```js
const coverPrice = width * coverRate;
```

Display:

```text
Cover Profile: 3.00 เมตร x 2,400 = 7,200 บาท
```

If fabric is split into multiple systems, calculate cover profile by total width.

---

## 15. Fabric Joining Rule

Solar Screen fabric should normally be joined horizontally.

Other fabrics such as Acrylic, PVC, and Sunbrella can normally be joined vertically unless the product rule says otherwise.

Use this general rule:

```text
Solar Screen: join horizontally
Acrylic: join vertically
PVC: join vertically
Sunbrella: join vertically
```

Overlap for joining:

```text
2 cm
```

---

## 16. Split Width Rule

For some vertical awning products:

```text
If width > 5.00 meters, split into 2 fabric pieces / 2 systems.
```

Example:

```text
6.00 m width may split into 3.00 m + 3.00 m
```

When splitting:

* Show each piece clearly
* Calculate total price correctly
* Do not duplicate motor unless the product requires separate motors
* Make the customer result easy to understand

---

## 17. Gear Rule

Manual gear options:

```text
Gear 9:1
Gear 13:1
```

Rules:

```text
If Gear 9:1 is selected, reduce fabric width by 9 cm.
If Gear 13:1 is selected, reduce fabric width by 11 cm.
Only one gear can be selected at a time.
Gear 13:1 is used for awnings wider than 5 meters.
```

Known Gear 13:1 data:

```text
Price: 2,950 บาท
Housing width: 5.6 cm
```

---

## 18. Quantity Rule

Quantity should multiply the final price.

Example:

```js
const finalTotal = unitTotal * quantity;
```

Result should show:

```text
จำนวน: 2 ชุด
ราคาต่อชุด: 28,400 บาท
ราคารวมทั้งหมด: 56,800 บาท
```

---

## 19. Discount Rule

Discount should be clear and not confusing.

Recommended calculation:

```js
const discountPercent = Number(document.getElementById("discount").value || 0);
const discountAmount = subtotal * discountPercent / 100;
const finalPrice = subtotal - discountAmount;
```

Display:

```text
ราคาก่อนส่วนลด: 30,000 บาท
ส่วนลด: 10%
ราคาหลังส่วนลด: 27,000 บาท
```

If no discount:

```text
ราคา: 30,000 บาท
```

Do not show unnecessary discount lines if discount is zero.

---

## 20. Currency Display Rule

Use Thai Baht text clearly.

Preferred:

```text
28,400 บาท
```

Avoid mixing too many currency styles.

A helper function:

```js
function money(value) {
  return Math.round(value).toLocaleString("th-TH") + " บาท";
}
```

---

## 21. Customer Copy-Friendly Result

The copied result should be clean text, not messy HTML.

Use a hidden or generated text string:

```js
function buildCopyText(data) {
  return `
สินค้า: ${data.productName}
ระบบ: ${data.systemName}
ขนาด: ${data.width.toFixed(2)} x ${data.drop.toFixed(2)} เมตร
จำนวน: ${data.quantity} ชุด
ราคา: ${money(data.total)}
`.trim();
}
```

Copy button:

```js
async function copyResult() {
  const text = document.getElementById("copyText").value;
  await navigator.clipboard.writeText(text);
  alert("คัดลอกข้อความแล้ว");
}
```

Use only one copy button unless the user requests multiple copy buttons.

---

## 22. Result Panel Headings

The heading must match the selected system.

Wrong example:

```text
CHILL D1 Manual
ระบบมือหมุน
```

When motor is selected, it should not still say manual.

Correct example:

```text
CHILL D1 Motorized
ระบบมอเตอร์ Strong Up 50/12
```

If showing both manual and motorized prices, label them separately:

```text
CHILL D1 Manual
ระบบมือหมุน

CHILL D1 Motorized
ระบบมอเตอร์ Strong Up 50/12
```

---

## 23. Error Handling

Never allow the result to show:

```text
undefined
NaN
null
```

Use checks:

```js
if (!width || !drop) {
  showMessage("กรุณากรอกขนาด");
  return;
}

if (!priceRow) {
  showMessage("ไม่พบราคาสำหรับขนาดนี้");
  return;
}
```

---

## 24. Testing Checklist

After creating or editing any calculator, test:

* Page opens without error
* Default result appears on load
* Width change updates result
* Drop/projection change updates result
* Fabric change updates price
* Motor change updates only motor area
* Manual price remains correct
* Motorized price includes motor
* Accessories add correctly
* Quantity multiplies correctly
* Discount calculates correctly
* Copy button copies clean customer text
* No NaN
* No undefined
* No broken result panel
* Mobile layout still usable

---

## 25. Common Fix Pattern

When a calculator does not update, check these first:

1. Is `calculate()` called on page load?
2. Are all inputs connected to event listeners?
3. Do input IDs match JavaScript selectors?
4. Does the price table contain the selected fabric/system?
5. Does `findPriceRow()` return a valid row?
6. Is the motor default value valid?
7. Is quantity parsed as a number?
8. Are prices converted from string to number?

---

## 26. Preferred Coding Style

Use clear function names:

```js
calculate()
findPriceRow()
calculateManualPrice()
calculateMotorPrice()
calculateAccessories()
renderResult()
buildCopyText()
money()
```

Avoid large messy code blocks where possible.

Separate logic into small functions.

---

## 27. Do Not Break Existing Price Tables

When improving UI or result format, do not rewrite or simplify the existing price table unless specifically requested.

Price table accuracy is more important than code elegance.

Before changing price logic, explain what will change.

---

## 28. Standard Calculator Flow

Use this flow:

```text
1. Read inputs
2. Validate dimensions
3. Find price row
4. Calculate base price
5. Calculate motor price
6. Calculate accessories
7. Apply quantity
8. Apply discount
9. Render customer-friendly result
10. Update copy text
```

---

## 29. Standard HTML Input Example

```html
<label>
  Width / ความกว้าง (เมตร)
  <input id="width" type="number" step="0.01" value="3.00">
</label>

<label>
  Drop / ระยะยื่น (เมตร)
  <input id="drop" type="number" step="0.01" value="3.00">
</label>

<label>
  Motor
  <select id="motor">
    <option value="9900" selected>Strong Up 50/12 - 9,900 บาท</option>
    <option value="12500">Strong Up 80/15 - 12,500 บาท</option>
    <option value="26800">Somfy Altus RTS 50/12 - 26,800 บาท</option>
  </select>
</label>
```

---

## 30. Standard Money Function

```js
function money(value) {
  const number = Number(value || 0);
  return Math.round(number).toLocaleString("th-TH") + " บาท";
}
```

---

## 31. Standard Copy Button

```html
<button type="button" onclick="copyResult()">Copy Quotation</button>
<textarea id="copyText" hidden></textarea>
```

```js
async function copyResult() {
  const text = document.getElementById("copyText").value;
  try {
    await navigator.clipboard.writeText(text);
    alert("คัดลอกข้อความแล้ว");
  } catch (error) {
    alert("Copy ไม่สำเร็จ กรุณาคัดลอกเองจากผลลัพธ์");
  }
}
```

---

## 32. Final Principle

The calculator must feel like a sales quotation tool, not a programming demo.

Priority order:

1. Correct price
2. Automatic calculation
3. Clean customer result
4. Easy copy button
5. Simple UI
6. Easy future editing
