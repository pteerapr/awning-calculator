# ============================================================
#  deploy.ps1 - ส่งเว็บขึ้น Cloudflare Pages (เว็บจริง)
#  Publish the site to Cloudflare Pages.
#
#  วิธีใช้: ดับเบิลคลิก deploy.bat (ไม่ต้องเปิดไฟล์นี้เอง)
#  ดูคู่มือหัวข้อ 9 ในไฟล์ คู่มือแก้ราคา.md
# ============================================================

$OutputEncoding = [Console]::OutputEncoding = [Text.Encoding]::UTF8
Set-Location $PSScriptRoot

Write-Host ''
Write-Host '============================================================'
Write-Host '  PUBLISH / ส่งขึ้นเว็บจริง'
Write-Host '  https://awning-calculator.pages.dev'
Write-Host '============================================================'
Write-Host ''

# เตือนถ้าลืมเพิ่มเลขเวอร์ชันใน sw.js (สาเหตุอันดับ 1 ที่ลูกค้ายังเห็นราคาเก่า)
$swLine = Select-String -Path (Join-Path $PSScriptRoot 'sw.js') -Pattern "^const CACHE_NAME" |
          Select-Object -First 1
if ($swLine) {
    Write-Host "  เวอร์ชันใน sw.js ตอนนี้: $($swLine.Line.Trim())"
    Write-Host ''
}

Write-Host '  ตรวจสอบก่อนกดยืนยัน:'
Write-Host '    [ ] ทดสอบราคาในเบราว์เซอร์แล้ว ไม่มี NaN / undefined'
Write-Host '    [ ] เพิ่มเลขเวอร์ชันใน sw.js แล้ว (สำคัญมาก)'
Write-Host ''

$ok = Read-Host 'พิมพ์ Y แล้วกด Enter เพื่อส่งขึ้นเว็บจริง (Enter เฉย ๆ = ยกเลิก)'
if ($ok -ne 'Y' -and $ok -ne 'y') {
    Write-Host ''
    Write-Host 'ยกเลิกแล้ว - ไม่มีอะไรถูกส่งขึ้นเว็บ / Cancelled, nothing was published'
    Write-Host ''
    Write-Host 'กด Enter เพื่อปิดหน้าต่าง / Press Enter to close'
    Read-Host | Out-Null
    exit
}

Write-Host ''
Write-Host 'กำลังส่งขึ้นเว็บ... กรุณาอย่าปิดหน้าต่างนี้ / Publishing, do not close this window'
Write-Host ''

& npx --yes wrangler pages deploy . --project-name awning-calculator --branch main --commit-dirty=true
$code = $LASTEXITCODE

Write-Host ''
if ($code -eq 0) {
    Write-Host '============================================================'
    Write-Host '  DONE / ส่งขึ้นเว็บเรียบร้อย'
    Write-Host '============================================================'
    Write-Host ''
    Write-Host '  ขั้นตอนสุดท้าย: เปิด https://awning-calculator.pages.dev'
    Write-Host '  กด Ctrl + Shift + R แล้วเช็กว่าราคาใหม่ขึ้นถูกต้อง'
    Write-Host ''
} else {
    Write-Host '============================================================'
    Write-Host '  FAILED / ส่งขึ้นเว็บไม่สำเร็จ'
    Write-Host '============================================================'
    Write-Host ''
    Write-Host '  สาเหตุที่พบบ่อย:'
    Write-Host '    1. ยังไม่ได้เข้าสู่ระบบ ให้ดับเบิลคลิก login.bat ก่อน'
    Write-Host '       แล้วค่อยรัน deploy.bat ใหม่'
    Write-Host '    2. เน็ตหลุด ให้ลองรันใหม่อีกครั้ง'
    Write-Host ''
    Write-Host '  เว็บจริงยังเป็นเวอร์ชันเดิม ไม่มีอะไรเสียหาย'
    Write-Host ''
}

Write-Host 'กด Enter เพื่อปิดหน้าต่าง / Press Enter to close'
Read-Host | Out-Null
