@echo off
setlocal

echo ==============================
echo Ejecutando pruebas con Maven Wrapper
echo ==============================

REM Verificamos si mvnw.cmd existe en el proyecto
if not exist mvnw.cmd (
    echo [ERROR] mvnw.cmd no se encuentra. Asegúrate de haber generado el wrapper con:
    echo        mvn -N io.takari:maven:wrapper
    pause
    exit /b 1
)

call mvnw.cmd clean test
if errorlevel 1 (
    echo [ERROR] Las pruebas fallaron. Revisa los errores antes de generar el reporte.
    pause
    exit /b 1
)

echo ==============================
echo Generando reporte Allure
echo ==============================

tools\allure\bin\allure.bat generate target\allure-results --clean -o target\allure-report
if errorlevel 1 (
    echo [ERROR] Fallo al generar el reporte de Allure.
    pause
    exit /b 1
)

echo ==============================
echo Abriendo el reporte en navegador...
echo ==============================

start "" tools\allure\bin\allure.bat open target\allure-report

endlocal
pause
