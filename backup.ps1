# ============================================================
#  backup.ps1 - สำรองไฟล์ทั้งโฟลเดอร์ก่อนแก้ราคา
#  Back up the whole project folder before editing prices.
#
#  วิธีใช้: ดับเบิลคลิก backup.bat (ไม่ต้องเปิดไฟล์นี้เอง)
#  ดูคู่มือหัวข้อ 3.3 และ 10 ในไฟล์ คู่มือแก้ราคา.md
# ============================================================

$OutputEncoding = [Console]::OutputEncoding = [Text.Encoding]::UTF8

$src     = $PSScriptRoot
$srcName = Split-Path $src -Leaf
$stamp   = Get-Date -Format 'yyyy-MM-dd_HHmm'
$dest    = Join-Path (Split-Path $src -Parent) "$srcName - backup $stamp"

Write-Host ''
Write-Host '============================================================'
Write-Host '  BACKUP / สำรองไฟล์ก่อนแก้ราคา'
Write-Host '============================================================'
Write-Host ''
Write-Host "  From / ต้นทาง : $src"
Write-Host "  To   / ปลายทาง: $dest"
Write-Host ''
Write-Host '  Copying, please wait... / กำลังคัดลอก รอสักครู่'
Write-Host ''

# คัดลอกทั้งโฟลเดอร์ ยกเว้นโฟลเดอร์ระบบที่ไม่จำเป็นต้องสำรอง
robocopy $src $dest /E /XD '.git' 'node_modules' '.wrangler' /NFL /NDL /NJH /NJS /R:1 /W:1 | Out-Null

# robocopy: 0-7 = สำเร็จ, 8 ขึ้นไป = ผิดพลาดจริง
if ($LASTEXITCODE -ge 8) {
    Write-Host '============================================================'
    Write-Host '  FAILED / สำรองไฟล์ไม่สำเร็จ'
    Write-Host '============================================================'
    Write-Host ''
    Write-Host '  ตรวจสอบว่ามีพื้นที่ว่างในไดรฟ์พอ และไม่มีไฟล์ถูกเปิดค้างอยู่'
    Write-Host '  *** อย่าเพิ่งแก้ราคา จนกว่าจะสำรองไฟล์สำเร็จ ***'
    Write-Host ''
} else {
    $count = (Get-ChildItem $dest -Recurse -File).Count
    Write-Host '============================================================'
    Write-Host '  DONE / สำรองไฟล์เรียบร้อย'
    Write-Host '============================================================'
    Write-Host ''
    Write-Host "  คัดลอกแล้ว $count ไฟล์ ไปที่:"
    Write-Host "  $dest"
    Write-Host ''
    Write-Host '  ถ้าแก้ราคาแล้วพัง ให้ก๊อปไฟล์จากโฟลเดอร์นี้มาวางทับได้เลย'
    Write-Host ''
}

Write-Host 'กด Enter เพื่อปิดหน้าต่าง / Press Enter to close'
Read-Host | Out-Null
