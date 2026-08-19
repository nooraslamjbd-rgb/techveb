$ErrorActionPreference = "Stop"
$baseUrl = "https://en.wikipedia.org/w/api.php"
$searchUrl = $baseUrl + "?action=query&list=search&srsearch=computer+security&srnamespace=6&srlimit=5&format=json"
Write-Host "URL: $searchUrl"

$tmpFile = "C:\TechVeb\scripts\debug_api.json"
& curl.exe -s $searchUrl -o $tmpFile 2>&1
$content = Get-Content -Path $tmpFile -Raw -Encoding UTF8
Write-Host "Content length: $($content.Length)"
Write-Host "Content: $content"
