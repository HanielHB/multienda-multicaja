@echo off
echo Generando cliente de Prisma...
cd "..\SisPOS-Backend"
call npx prisma generate
echo Listo! Ahora puedes iniciar el servidor con 'npm run dev' en el backend.
pause
