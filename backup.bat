@echo off
REM Launcher only - all logic and Thai text live in backup.ps1
REM (Thai characters inside a .bat file get corrupted by the cmd codepage,
REM  so the real script is PowerShell. Do not add Thai text to this file.)
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0backup.ps1"
