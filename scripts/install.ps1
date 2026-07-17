# Sync cursor-config skills and agents into ~/.cursor/
$ErrorActionPreference = "Stop"

$RepoRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$CursorHome = Join-Path $env:USERPROFILE ".cursor"
$SkillsDest = Join-Path $CursorHome "skills"
$AgentsDest = Join-Path $CursorHome "agents"

Write-Host "Installing from: $RepoRoot"
Write-Host "Target: $CursorHome"

New-Item -ItemType Directory -Force -Path $SkillsDest | Out-Null
New-Item -ItemType Directory -Force -Path $AgentsDest | Out-Null

# Skills
$SkillsSrc = Join-Path $RepoRoot "skills"
if (Test-Path $SkillsSrc) {
    Get-ChildItem -Path $SkillsSrc -Directory | ForEach-Object {
        $dest = Join-Path $SkillsDest $_.Name
        if (Test-Path $dest) { Remove-Item -Recurse -Force $dest }
        Copy-Item -Recurse -Force $_.FullName $dest
        Write-Host "  skill: $($_.Name)"
    }
}

# Agents
$AgentsSrc = Join-Path $RepoRoot "agents"
if (Test-Path $AgentsSrc) {
    Get-ChildItem -Path $AgentsSrc -Filter "*.md" | ForEach-Object {
        Copy-Item -Force $_.FullName (Join-Path $AgentsDest $_.Name)
        Write-Host "  agent: $($_.Name)"
    }
}

Write-Host ""
Write-Host "Done. Restart Cursor to pick up changes."
