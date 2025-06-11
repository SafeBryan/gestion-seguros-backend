@echo off
setlocal enabledelayedexpansion

REM ====== Obtener fecha actual ======
for /f %%a in ('powershell -Command "Get-Date -Format yyyy-MM-dd"') do set DATE=%%a

REM ====== Configuración de rutas ======
set BASE_DIR=target
set ROOT_RESULTS=allure-results
set TARGET_RESULTS=%BASE_DIR%\allure-results
set REPORT_DIR=%BASE_DIR%\allure-report
set HISTORY_BACKUP=%BASE_DIR%\allure-history
set ROOT_HISTORY_BACKUP=allure-history-backup-%DATE%

REM ====== 1. Ejecutar análisis con SonarQube ======
echo Ejecutando mvn clean verify + análisis SonarQube...
call mvn clean verify sonar:sonar ^
    -Dsonar.projectKey=GestionSeguros ^
    -Dsonar.projectName=GestionSeguros ^
    -Dsonar.host.url=http://localhost:9000 ^
    -Dsonar.token=sqp_6e371afcc1c885a98ebab32bb4f792f92321e4d2

REM ====== 2. Mover allure-results de raíz a target si existe ======
if exist "%ROOT_RESULTS%\" (
    echo Moviendo allure-results desde raíz a target...
    rmdir /S /Q "%TARGET_RESULTS%" >nul 2>&1
    move "%ROOT_RESULTS%" "%TARGET_RESULTS%" >nul
)

REM ====== 3. Restaurar historial previo (si existe) ======
if exist "%HISTORY_BACKUP%\" (
    echo Restaurando historial desde target...
    mkdir "%TARGET_RESULTS%\history" >nul 2>&1
    xcopy /E /Y "%HISTORY_BACKUP%\*" "%TARGET_RESULTS%\history\" >nul
)

REM ====== 4. Generar reporte Allure ======
echo Generando nuevo reporte Allure...
call allure generate "%TARGET_RESULTS%" -o "%REPORT_DIR%" --clean

REM ====== 5. Verificar que se generó correctamente ======
if not exist "%REPORT_DIR%\index.html" (
    echo ERROR: No se generó el reporte correctamente.
    exit /b 1
)

REM ====== 6. Guardar historial actualizado en target y backup con fecha ======
if exist "%REPORT_DIR%\history\" (
    echo Guardando historial actualizado...
    rmdir /S /Q "%HISTORY_BACKUP%" >nul 2>&1
    rmdir /S /Q "%ROOT_HISTORY_BACKUP%" >nul 2>&1
    xcopy /E /Y "%REPORT_DIR%\history" "%HISTORY_BACKUP%\" >nul
    xcopy /E /Y "%REPORT_DIR%\history" "%ROOT_HISTORY_BACKUP%\" >nul
    echo Historial guardado en: %ROOT_HISTORY_BACKUP%
)

REM ====== 7. Abrir el reporte Allure ======
echo Abriendo reporte en navegador...
call allure open "%REPORT_DIR%"

endlocal
