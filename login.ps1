# ============================================================
#  login.ps1 - เข้าสู่ระบบ Cloudflare (ทำครั้งเดียวตลอดไป)
#  Sign in to Cloudflare. Only needed once.
#
#  วิธีใช้: ดับเบิลคลิก login.bat (ไม่ต้องเปิดไฟล์นี้เอง)
#  ดูคู่มือหัวข้อ 9.2 ในไฟล์ คู่มือแก้ราคา.md
# ============================================================

$OutputEncoding = [Console]::OutputEncoding = [Text.Encoding]::UTF8
Set-Location $PSScriptRoot

Write-Host ''
Write-Host '============================================================'
Write-Host '  SIGN IN / เข้าสู่ระบบ Cloudflare'
Write-Host '============================================================'
Write-Host ''
Write-Host '  เบราว์เซอร์จะเปิดขึ้นมาให้กดปุ่ม Allow'
Write-Host '  ใช้บัญชี: pteerapr@gmail.com'
Write-Host ''
Write-Host '  ทำครั้งเดียวพอ ครั้งต่อไปใช้ deploy.bat ได้เลย'
Write-Host ''
Read-Host 'กด Enter เพื่อเริ่ม / Press Enter to start' | Out-Null

& npx --yes wrangler login

Write-Host ''
Write-Host 'เสร็จแล้ว - ต่อไปให้ดับเบิลคลิก deploy.bat เพื่อส่งขึ้นเว็บ'
Write-Host ''
Write-Host 'กด Enter เพื่อปิดหน้าต่าง / Press Enter to close'
Read-Host | Out-Null
