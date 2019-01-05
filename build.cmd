@ECHO OFF

REM Build applicatin to temporary separate files
CALL tsc --project tsconfig.json --outDir "docs\temp" --module es2015

REM Use Rollup to bundle files
CALL rollup --config

REM Cleanup temporary js files
CALL RMDIR /S /Q "docs\temp"