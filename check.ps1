# ============================================================
#  check.ps1 - ตรวจสอบเครื่องคำนวณทุกตัวก่อนส่งขึ้นเว็บ
#  Runs check.js and shows the result.
#
#  วิธีใช้: ดับเบิลคลิก check.bat (ไม่ต้องเปิดไฟล์นี้เอง)
# ============================================================

$OutputEncoding = [Console]::OutputEncoding = [Text.Encoding]::UTF8
Set-Location $PSScriptRoot

& node "$PSScriptRoot\check.js"
$code = $LASTEXITCODE

if ($code -ne 0) {
    Write-Host 'พบปัญหาที่ต้องแก้ก่อน - ยังไม่ควรรัน deploy.bat' -ForegroundColor Red
} else {
    Write-Host 'ตรวจผ่าน - รัน deploy.bat ได้เลย' -ForegroundColor Green
}

Write-Host ''
Write-Host 'กด Enter เพื่อปิดหน้าต่าง / Press Enter to close'
Read-Host | Out-Null
