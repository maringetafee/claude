@echo off
cd /d "%~dp0"
echo Iniciando servidor local en http://localhost:8731
echo.
echo Abre esta direccion en tu navegador:
echo   http://localhost:8731/La%%20Esquinita.dc.html
echo.
echo (Pulsa Ctrl+C para detener el servidor)
echo.
python -m http.server 8731
pause
