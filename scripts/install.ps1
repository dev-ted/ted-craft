# Deprecated: prefer `npx ted-craft add <slug> -a cursor -g -y`
$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent $PSScriptRoot
Write-Host "ted-craft: prefer npx ted-craft add <slug>. Syncing first-party registry…"

$CursorHome = Join-Path $env:USERPROFILE ".cursor"
$SkillsDest = Join-Path $CursorHome "skills"
$AgentsDest = Join-Path $CursorHome "agents"
New-Item -ItemType Directory -Force -Path $SkillsDest, $AgentsDest | Out-Null

$FirstParty = Join-Path $RepoRoot "registry\first-party"
Get-ChildItem -Directory $FirstParty | ForEach-Object {
  $name = $_.Name
  $skill = Join-Path $_.FullName "skill"
  if (Test-Path $skill) {
    $dest = Join-Path $SkillsDest $name
    if (Test-Path $dest) { Remove-Item -Recurse -Force $dest }
    Copy-Item -Recurse $skill $dest
    Write-Host "  skill: $name"
  }
  $sub = Join-Path $_.FullName "subagent"
  if (Test-Path $sub) {
    Get-ChildItem -Filter *.md $sub | ForEach-Object {
      Copy-Item $_.FullName $AgentsDest -Force
      Write-Host "  agent: $($_.Name)"
    }
  }
}

Write-Host ""
Write-Host "Done. Restart Cursor to pick up changes."
