# ============================================================
#  deploy.ps1 - ส่งเว็บขึ้น Cloudflare Pages (เว็บจริง)
#  Publish the site to Cloudflare Pages.
#
#  วิธีใช้: ดับเบิลคลิก deploy.bat (ไม่ต้องเปิดไฟล์นี้เอง)
#  ดูคู่มือหัวข้อ 9 ในไฟล์ คู่มือแก้ราคา.md
#
#  สคริปต์นี้ทำ 4 อย่างให้อัตโนมัติ / this script does 4 things for you:
#    1. รัน check.js ตรวจก่อน ถ้าเจอ ERROR จะไม่ยอมส่งขึ้นเว็บ
#    2. เพิ่มเลขเวอร์ชันใน sw.js ให้เอง (ไม่ต้องแก้มือแล้ว)
#    3. คัดลอกเฉพาะไฟล์ที่ "ควรขึ้นเว็บ" ไปไว้ในโฟลเดอร์ .deploy
#       เอกสารภายใน (คู่มือ, _notes) และสคริปต์ (.ps1/.bat) จะไม่ถูกส่งขึ้นเว็บ
#    4. ส่งเฉพาะโฟลเดอร์ .deploy ขึ้น Cloudflare Pages
# ============================================================

$OutputEncoding = [Console]::OutputEncoding = [Text.Encoding]::UTF8
Set-Location $PSScriptRoot

Write-Host ''
Write-Host '============================================================'
Write-Host '  PUBLISH / ส่งขึ้นเว็บจริง'
Write-Host '  https://awning-calculator.pages.dev'
Write-Host '============================================================'
Write-Host ''

# ------------------------------------------------------------
# 1. ตรวจไฟล์ก่อน (check.js) - ถ้ามี ERROR ห้ามส่งขึ้นเว็บ
# ------------------------------------------------------------
Write-Host '  [1/4] กำลังตรวจไฟล์ด้วย check.js ...'
Write-Host ''

$nodeCmd = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodeCmd) {
    Write-Host '  ไม่พบโปรแกรม Node.js จึงตรวจไฟล์ก่อนส่งไม่ได้'
    Write-Host '  (Node.js not found - cannot run the pre-deploy check)'
    Write-Host ''
    Write-Host '  ให้ติดตั้ง Node.js จาก https://nodejs.org แล้วรัน deploy.bat ใหม่'
    Write-Host ''
    Write-Host 'กด Enter เพื่อปิดหน้าต่าง / Press Enter to close'
    Read-Host | Out-Null
    exit 1
}

& node (Join-Path $PSScriptRoot 'check.js')
$checkCode = $LASTEXITCODE

if ($checkCode -ne 0) {
    Write-Host ''
    Write-Host '============================================================'
    Write-Host '  หยุด - ยังส่งขึ้นเว็บไม่ได้ / STOPPED, not published'
    Write-Host '============================================================'
    Write-Host ''
    Write-Host '  check.js เจอ ERROR ข้างบน ให้แก้ก่อนแล้วรัน deploy.bat ใหม่'
    Write-Host '  เว็บจริงยังเป็นเวอร์ชันเดิม ไม่มีอะไรเสียหาย'
    Write-Host ''
    Write-Host 'กด Enter เพื่อปิดหน้าต่าง / Press Enter to close'
    Read-Host | Out-Null
    exit 1
}

# ------------------------------------------------------------
# 2. ยืนยันก่อนส่งจริง (ยังไม่แก้ไฟล์อะไรจนกว่าจะกด Y)
# ------------------------------------------------------------
$swPath = Join-Path $PSScriptRoot 'sw.js'

# ต้องอ่านแบบ UTF-8 ให้ชัดเจน ห้ามใช้ Get-Content เฉย ๆ
# เพราะ Windows PowerShell จะเดาว่าเป็นรหัส windows-874 แล้วคำอธิบายภาษาไทย
# ในไฟล์ sw.js จะเพี้ยนทั้งไฟล์ตอนเขียนกลับ (ตรวจสอบมาแล้วว่าเพี้ยนจริง)
# (must read as explicit UTF-8: Get-Content would decode as windows-874
#  and silently mangle every Thai comment when the file is written back)
$swText = [System.IO.File]::ReadAllText($swPath, [System.Text.Encoding]::UTF8)
$swMatch = [regex]::Match($swText, "CACHE_NAME\s*=\s*'sangthong-awning-v(\d+)'")

if (-not $swMatch.Success) {
    Write-Host ''
    Write-Host '  หาเลขเวอร์ชันใน sw.js ไม่เจอ (รูปแบบเปลี่ยนไป?)'
    Write-Host "  (could not find CACHE_NAME in sw.js - not published)"
    Write-Host ''
    Write-Host 'กด Enter เพื่อปิดหน้าต่าง / Press Enter to close'
    Read-Host | Out-Null
    exit 1
}

$oldVersion = [int]$swMatch.Groups[1].Value
$newVersion = $oldVersion + 1

Write-Host ''
Write-Host '  ตรวจไฟล์ผ่านแล้ว / checks passed'
Write-Host "  เลขเวอร์ชันใน sw.js จะเปลี่ยนให้อัตโนมัติ: v$oldVersion -> v$newVersion"
Write-Host ''
Write-Host '  ตรวจสอบก่อนกดยืนยัน:'
Write-Host '    [ ] ทดสอบราคาในเบราว์เซอร์แล้ว ไม่มี NaN / undefined'
Write-Host ''

$ok = Read-Host 'พิมพ์ Y แล้วกด Enter เพื่อส่งขึ้นเว็บจริง (Enter เฉย ๆ = ยกเลิก)'
if ($ok -ne 'Y' -and $ok -ne 'y') {
    Write-Host ''
    Write-Host 'ยกเลิกแล้ว - ไม่มีอะไรถูกส่งขึ้นเว็บ / Cancelled, nothing was published'
    Write-Host '(sw.js ยังไม่ถูกแก้ / sw.js was not modified)'
    Write-Host ''
    Write-Host 'กด Enter เพื่อปิดหน้าต่าง / Press Enter to close'
    Read-Host | Out-Null
    exit
}

# ------------------------------------------------------------
# 3. เพิ่มเลขเวอร์ชันใน sw.js
#    ต้องเขียนแบบ UTF-8 ไม่มี BOM เพราะไฟล์เดิมเป็นแบบนั้น
#    (write UTF-8 without BOM to match the existing file)
# ------------------------------------------------------------
Write-Host ''
Write-Host "  [2/4] เพิ่มเลขเวอร์ชันใน sw.js เป็น v$newVersion ..."

$swText = [regex]::Replace($swText, "sangthong-awning-v\d+", "sangthong-awning-v$newVersion")
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($swPath, $swText, $utf8NoBom)

# ------------------------------------------------------------
# 4. คัดลอกเฉพาะไฟล์ที่ควรขึ้นเว็บไปไว้ใน .deploy
#
#    ทำไมต้องมีขั้นนี้: คำสั่ง wrangler จะส่ง "ทุกไฟล์ในโฟลเดอร์" ขึ้นเว็บ
#    ถ้าส่งทั้งโฟลเดอร์ไป คู่มือแก้ราคา.md และสคริปต์ต่าง ๆ จะกลายเป็น
#    ลิงก์สาธารณะที่ใครก็เปิดดูได้
#    (wrangler uploads the whole folder, so internal docs and scripts
#     would otherwise become public URLs)
#
#    วิธีนี้เป็นแบบ "ตัดออก" ไม่ใช่ "เลือกเข้า" - ถ้าเพิ่มเครื่องคำนวณใหม่
#    จะถูกส่งขึ้นเว็บให้เองโดยไม่ต้องมาแก้สคริปต์นี้
#    (exclude-list, not include-list: a new calculator ships automatically)
# ------------------------------------------------------------
Write-Host '  [3/4] เตรียมไฟล์ที่จะส่งขึ้นเว็บ ...'

$stageDir = Join-Path $PSScriptRoot '.deploy'
if (Test-Path $stageDir) { Remove-Item $stageDir -Recurse -Force }
New-Item -ItemType Directory -Path $stageDir | Out-Null

# โฟลเดอร์ที่ไม่ส่งขึ้นเว็บ / folders never published
$skipDirs = @('.git', '.claude', '.wrangler', '.deploy', '_notes')

# ไฟล์ที่ไม่ส่งขึ้นเว็บ / files never published
#   *.md   = คู่มือและเอกสารภายในทั้งหมด
#   *.ps1 / *.bat = สคริปต์ของเราเอง (deploy, backup, login, check)
#   *.js นั้นส่งขึ้นเว็บ (prices.js / i18n.js / sw.js ต้องใช้) ยกเว้น check.js
#   *-mockup.* = ตัวต้นแบบสำหรับทดลอง ยังไม่ให้ลูกค้าเห็น (prototypes stay private)
#   *.xlsx / *.csv = ไฟล์ข้อมูลภายใน เผื่อมีใครวางไว้ในโฟลเดอร์นี้ ห้ามขึ้นเว็บ
$skipFiles = @('*.md', '*.ps1', '*.bat', '*.bak', '*.log', 'check.js', '*-mockup.*',
               '*.xlsx', '*.xlsm', '*.csv',
               '.gitignore', '.gitattributes', '* - Copy.*', '*-DESKTOP-*', '*-LAPTOP-*')

$rc = @($PSScriptRoot, $stageDir, '/E', '/NFL', '/NDL', '/NJH', '/NJS', '/NP')
$rc += '/XD'
$rc += $skipDirs
$rc += '/XF'
$rc += $skipFiles

& robocopy @rc | Out-Null

# robocopy: โค้ด 0-7 = สำเร็จ, 8 ขึ้นไป = มีปัญหาจริง
if ($LASTEXITCODE -ge 8) {
    Write-Host ''
    Write-Host '  เตรียมไฟล์ไม่สำเร็จ (robocopy) - ยังไม่ได้ส่งขึ้นเว็บ'
    Write-Host '  (staging failed - nothing was published)'
    Write-Host ''
    Write-Host 'กด Enter เพื่อปิดหน้าต่าง / Press Enter to close'
    Read-Host | Out-Null
    exit 1
}

$stagedCount = (Get-ChildItem -Path $stageDir -Recurse -File).Count
Write-Host "        จะส่งขึ้นเว็บทั้งหมด $stagedCount ไฟล์ (ดูได้ในโฟลเดอร์ .deploy)"

# ------------------------------------------------------------
# 5. ส่งขึ้นเว็บจริง
# ------------------------------------------------------------
Write-Host ''
Write-Host '  [4/4] กำลังส่งขึ้นเว็บ... กรุณาอย่าปิดหน้าต่างนี้'
Write-Host '        (Publishing, do not close this window)'
Write-Host ''

& npx --yes wrangler pages deploy $stageDir --project-name awning-calculator --branch main --commit-dirty=true
$code = $LASTEXITCODE

Write-Host ''
if ($code -eq 0) {
    Write-Host '============================================================'
    Write-Host '  DONE / ส่งขึ้นเว็บเรียบร้อย'
    Write-Host '============================================================'
    Write-Host ''
    Write-Host "  เวอร์ชันที่ส่งขึ้นไป: sangthong-awning-v$newVersion"
    Write-Host ''
    Write-Host '  ขั้นตอนสุดท้าย: เปิด https://awning-calculator.pages.dev'
    Write-Host '  กด Ctrl + Shift + R แล้วเช็กว่าราคาใหม่ขึ้นถูกต้อง'
    Write-Host ''
    Write-Host '  อย่าลืม commit ไฟล์ sw.js ที่เพิ่งเปลี่ยนเลขเวอร์ชันด้วย'
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
    Write-Host "  (sw.js ถูกเปลี่ยนเป็น v$newVersion แล้ว รันใหม่ได้เลยไม่ต้องแก้อะไร)"
    Write-Host ''
}

Write-Host 'กด Enter เพื่อปิดหน้าต่าง / Press Enter to close'
Read-Host | Out-Null
