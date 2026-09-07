<#
.SYNOPSIS
  Start, stop or check a local PostgreSQL for Vaultiva — no Docker, no admin rights.

.DESCRIPTION
  Docker Desktop needs hardware virtualisation, which is disabled in BIOS on this
  machine. PostgreSQL itself needs neither, so this runs the official Windows
  binaries directly from a folder in the user profile.

  Two things matter and both bit us during setup:

    * The install path must be SHORT. Running from a long path (an AppData\Local\
      Temp\...\<guid>\... directory) made every forked backend die with
      0xC0000142 (STATUS_DLL_INIT_FAILED) and "could not reserve shared memory
      region ... error code 487". The server started and then refused every
      connection. C:\Users\<you>\pgsql works.

    * The binaries are fetched once via npm (@embedded-postgres/windows-x64),
      which is just a download — nothing is installed system-wide.

.EXAMPLE
  .\scripts\local-postgres.ps1 start
  .\scripts\local-postgres.ps1 status
  .\scripts\local-postgres.ps1 stop
#>
param(
  [Parameter(Position = 0)]
  [ValidateSet('setup', 'start', 'stop', 'status', 'reset')]
  [string]$Command = 'status'
)

$ErrorActionPreference = 'Stop'

$PgHome  = Join-Path $env:USERPROFILE 'pgsql'
$PgBin   = Join-Path $PgHome 'bin'
$PgData  = Join-Path $PgHome 'data'
$PgLog   = Join-Path $PgHome 'server.log'
$Port    = 5432
$DbName  = 'vaultiva_db'
$DbUser  = 'postgres'
$DbPass  = 'password'

function Test-Listening {
  [bool](Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue |
         Where-Object { $_.LocalPort -eq $Port })
}

function Invoke-Setup {
  if (Test-Path (Join-Path $PgBin 'postgres.exe')) {
    Write-Host "Binaries already present at $PgHome"
  } else {
    $staging = Join-Path $env:TEMP 'vaultiva-pg-download'
    New-Item -ItemType Directory -Force -Path $staging | Out-Null
    Push-Location $staging
    try {
      if (-not (Test-Path 'package.json')) { & npm init -y | Out-Null }
      Write-Host 'Downloading PostgreSQL binaries (once)...'
      & npm install embedded-postgres | Out-Null
      $native = Join-Path $staging 'node_modules\@embedded-postgres\windows-x64'
      # npm blocks postinstall by default here; the symlink step must be run by hand.
      if (Test-Path (Join-Path $native 'scripts\hydrate-symlinks.js')) {
        Push-Location $native
        & node 'scripts\hydrate-symlinks.js' | Out-Null
        Pop-Location
      }
      New-Item -ItemType Directory -Force -Path $PgHome | Out-Null
      Copy-Item (Join-Path $native 'native\*') -Destination $PgHome -Recurse -Force
      Write-Host "Binaries installed to $PgHome"
    } finally { Pop-Location }
  }

  if (Test-Path (Join-Path $PgData 'PG_VERSION')) {
    Write-Host 'Cluster already initialised.'
    return
  }

  $pwfile = Join-Path $PgHome 'pw.txt'
  Set-Content -Path $pwfile -Value $DbPass -NoNewline -Encoding ascii
  try {
    & (Join-Path $PgBin 'initdb.exe') -D $PgData -U $DbUser --pwfile=$pwfile `
        --auth-local=scram-sha-256 --auth-host=scram-sha-256 -E UTF8 | Out-Null
    Write-Host "Cluster initialised at $PgData"
  } finally { Remove-Item $pwfile -Force -ErrorAction SilentlyContinue }
}

function Invoke-Start {
  if (Test-Listening) { Write-Host "Already listening on $Port."; return }
  if (-not (Test-Path (Join-Path $PgData 'PG_VERSION'))) {
    throw "No cluster at $PgData. Run: .\scripts\local-postgres.ps1 setup"
  }

  Remove-Item (Join-Path $PgData 'postmaster.pid') -ErrorAction SilentlyContinue
  Start-Process -FilePath (Join-Path $PgBin 'postgres.exe') `
    -ArgumentList @('-D', $PgData, '-p', $Port) `
    -RedirectStandardOutput (Join-Path $PgHome 'stdout.log') `
    -RedirectStandardError  $PgLog `
    -WorkingDirectory $PgBin -WindowStyle Hidden

  for ($i = 0; $i -lt 20 -and -not (Test-Listening); $i++) { Start-Sleep -Seconds 1 }

  if (Test-Listening) {
    Write-Host "PostgreSQL listening on $Port."
    Write-Host "Create the database if this is a first run:"
    Write-Host "  .\scripts\local-postgres.ps1 reset"
  } else {
    Write-Warning 'Did not start. Last lines of the server log:'
    Get-Content $PgLog -Tail 20 -ErrorAction SilentlyContinue
  }
}

function Invoke-Stop {
  Get-CimInstance Win32_Process -Filter "Name='postgres.exe'" |
    Where-Object { $_.CommandLine -like "*$PgData*" } |
    ForEach-Object { Stop-Process -Id $_.ProcessId -Force }
  Start-Sleep -Seconds 2
  if (Test-Listening) { Write-Warning "Still listening on $Port." }
  else { Write-Host 'Stopped.' }
}

function Invoke-Reset {
  if (-not (Test-Listening)) { throw 'Server is not running. Start it first.' }
  $script = @"
const { Client } = require('pg');
(async () => {
  const c = new Client({ host:'127.0.0.1', port:$Port, user:'$DbUser', password:'$DbPass', database:'postgres' });
  await c.connect();
  await c.query("SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname='$DbName' AND pid<>pg_backend_pid()");
  await c.query('DROP DATABASE IF EXISTS $DbName');
  await c.query('CREATE DATABASE $DbName');
  console.log('$DbName recreated');
  await c.end();
})().catch(e => { console.error(e.message); process.exit(1); });
"@
  $tmp = Join-Path $env:TEMP 'vaultiva-reset-db.js'
  Set-Content -Path $tmp -Value $script -Encoding utf8
  # `pg` ships with the backend's dependencies.
  & node $tmp
  Remove-Item $tmp -Force -ErrorAction SilentlyContinue
}

switch ($Command) {
  'setup'  { Invoke-Setup }
  'start'  { Invoke-Start }
  'stop'   { Invoke-Stop }
  'reset'  { Invoke-Reset }
  'status' {
    Write-Host "home:      $PgHome"
    Write-Host "cluster:   $(if (Test-Path (Join-Path $PgData 'PG_VERSION')) { 'initialised' } else { 'not initialised' })"
    Write-Host "listening: $(if (Test-Listening) { "yes (port $Port)" } else { 'no' })"
  }
}
