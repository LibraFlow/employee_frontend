# Retry failed tests script for GitLab CI
param(
    [string]$CypressOutputFile = "cypress-output.txt"
)

Write-Host "Running all tests first..."

# Run Cypress and capture output
$output = & npx cypress run 2>&1 | Tee-Object -FilePath $CypressOutputFile

# Check if there were any failures
if ($LASTEXITCODE -eq 0) {
    Write-Host "All tests passed on first run!"
    exit 0
}

Write-Host "Some tests failed. Analyzing failures..."

# Parse the output to find failed test files
$failedSpecs = @()
$lines = Get-Content $CypressOutputFile

foreach ($line in $lines) {
    if ($line -match "✖\s+(.+\.cy\.js)\s+") {
        $specFile = $matches[1]
        $failedSpecs += $specFile
        Write-Host "Found failed spec: $specFile"
    }
}

if ($failedSpecs.Count -eq 0) {
    Write-Host "No specific test files found in output. Exiting."
    exit 1
}

Write-Host "Retrying $($failedSpecs.Count) failed test files..."

# Retry each failed spec individually
$retrySuccess = $true
foreach ($spec in $failedSpecs) {
    Write-Host "Retrying: $spec"
    $retryOutput = & npx cypress run --spec "cypress/e2e/$spec" 2>&1
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Test $spec still failed on retry"
        $retrySuccess = $false
    } else {
        Write-Host "Test $spec passed on retry!"
    }
}

if ($retrySuccess) {
    Write-Host "All failed tests passed on retry!"
    exit 0
} else {
    Write-Host "Some tests still failed after retry"
    exit 1
} 