$ErrorActionPreference = "Continue"
$baseUrl = "https://en.wikipedia.org/w/api.php"

$topics = @(
    @{ Category = "Computer_security"; Query = "computer security cybersecurity firewall encryption"; Topic = "cybersecurity"; Limit = 50 },
    @{ Category = "Cloud_computing"; Query = "cloud computing server datacenter AWS Azure"; Topic = "cloud"; Limit = 50 },
    @{ Category = "Artificial_intelligence"; Query = "artificial intelligence machine learning neural network"; Topic = "AI"; Limit = 50 },
    @{ Category = "Video_games"; Query = "video games gaming console esports"; Topic = "gaming"; Limit = 50 },
    @{ Category = "Computer_programming"; Query = "computer programming code developer software"; Topic = "programming"; Limit = 50 },
    @{ Category = "Computer_hardware"; Query = "computer hardware processor motherboard RAM"; Topic = "hardware"; Limit = 50 },
    @{ Category = "Quantum_computing"; Query = "quantum computing qubit quantum processor"; Topic = "quantum"; Limit = 30 },
    @{ Category = "Robotics"; Query = "robotics robot autonomous"; Topic = "robotics"; Limit = 30 },
    @{ Category = "Internet_of_things"; Query = "internet of things IoT smart sensor"; Topic = "IoT"; Limit = 30 },
    @{ Category = "Blockchain"; Query = "blockchain cryptocurrency bitcoin distributed ledger"; Topic = "blockchain"; Limit = 30 },
    @{ Category = "Privacy"; Query = "privacy data protection surveillance encryption"; Topic = "privacy"; Limit = 30 },
    @{ Category = "Smartphones"; Query = "smartphone mobile phone touchscreen Android iPhone"; Topic = "smartphones"; Limit = 30 },
    @{ Category = "Data_centers"; Query = "data center server room networking"; Topic = "data_centers"; Limit = 30 },
    @{ Category = "Continuous_integration"; Query = "continuous integration devops deployment pipeline"; Topic = "DevOps"; Limit = 20 },
    @{ Category = "Laptops"; Query = "laptop computer notebook portable"; Topic = "laptops"; Limit = 30 },
    @{ Category = "Graphics_processing_units"; Query = "GPU graphics processing unit NVIDIA AMD"; Topic = "GPUs"; Limit = 20 },
    @{ Category = "Solid-state_drives"; Query = "solid state drive SSD storage"; Topic = "SSD"; Limit = 15 },
    @{ Category = "Virtual_reality"; Query = "virtual reality VR headset immersive"; Topic = "VR"; Limit = 20 },
    @{ Category = "5G"; Query = "5G network wireless mobile broadband"; Topic = "5G"; Limit = 15 },
    @{ Category = "Deep_learning"; Query = "deep learning neural network AI training"; Topic = "deep_learning"; Limit = 20 }
)

function Strip-Html {
    param([string]$Text)
    if ([string]::IsNullOrEmpty($Text)) { return "" }
    return ($Text -replace '<[^>]+>', '' -replace '&amp;', '&' -replace '&nbsp;', ' ' -replace '&#\d+;', '').Trim()
}

$allImages = [System.Collections.Generic.List[PSObject]]::new()
$seenUrls = [System.Collections.Generic.HashSet[string]]::new()
$tmpFile = "C:\TechVeb\scripts\_tmp_api.json"

foreach ($topicDef in $topics) {
    Write-Host "`n=== $($topicDef.Topic) ==="
    $targetCount = $topicDef.Limit
    $fileTitles = @{}
    
    $queries = @()
    $words = $topicDef.Query -split " "
    $queries += $topicDef.Query
    $queries += ($words | Select-Object -First 2) -join " "
    $queries += ($words | Select-Object -Last 2) -join " "
    foreach ($w in $words) { if ($w.Length -ge 3) { $queries += $w } }
    
    foreach ($q in $queries) {
        $encoded = [System.Uri]::EscapeDataString($q)
        $url = "$baseUrl?action=query&list=search&srsearch=$encoded&srnamespace=6&srlimit=50&format=json"
        & curl.exe -s $url -o $tmpFile 2>$null
        if (Test-Path $tmpFile) {
            try {
                $json = Get-Content -Path $tmpFile -Raw -Encoding UTF8 | ConvertFrom-Json
                if ($json.query.search) {
                    foreach ($item in $json.query.search) {
                        $t = $item.title
                        if ($t -match '\.(png|jpg|jpeg|PNG|JPG|JPEG)$') {
                            $fileTitles[$t] = $true
                        }
                    }
                }
            } catch {}
        }
        Start-Sleep -Milliseconds 250
    }
    
    $titles = @($fileTitles.Keys)
    Write-Host "  Candidates: $($titles.Count) files"
    
    $count = 0
    for ($i = 0; $i -lt $titles.Count; $i += 50) {
        if ($count -ge $targetCount) { break }
        $end = [Math]::Min($i + 49, $titles.Count - 1)
        $batch = $titles[$i..$end]
        $joined = ($batch | ForEach-Object { [System.Uri]::EscapeDataString($_) }) -join "|"
        $url = "$baseUrl?action=query&prop=imageinfo&titles=$joined&iiprop=url|mime|extmetadata&iiurlwidth=1200&format=json"
        & curl.exe -s $url -o $tmpFile 2>$null
        if (Test-Path $tmpFile) {
            try {
                $json = Get-Content -Path $tmpFile -Raw -Encoding UTF8 | ConvertFrom-Json
                if ($json.query.pages) {
                    foreach ($pageProp in $json.query.pages.PSObject.Properties) {
                        if ($count -ge $targetCount) { break }
                        $p = $pageProp.Value
                        if (-not $p.imageinfo -or $p.imageinfo.Count -eq 0) { continue }
                        $info = $p.imageinfo[0]
                        if ($info.mime -notmatch '^image/') { continue }
                        if ($info.mime -match 'svg|gif') { continue }
                        if (-not $info.thumburl) { continue }
                        if (-not $info.thumburl.StartsWith('https://upload.wikimedia.org/')) { continue }
                        if ($seenUrls.Contains($info.thumburl)) { continue }
                        $seenUrls.Add($info.thumburl) | Out-Null
                        
                        $artist = ""; $credit = ""; $license = ""
                        if ($info.extmetadata) {
                            if ($info.extmetadata.Artist) { $artist = Strip-Html $info.extmetadata.Artist.value }
                            if ($info.extmetadata.Credit) { $credit = Strip-Html $info.extmetadata.Credit.value }
                            if ($info.extmetadata.LicenseShortName) { $license = $info.extmetadata.LicenseShortName.value }
                        }
                        $creditText = if ($artist) { $artist } elseif ($credit) { $credit } else { "Wikimedia Commons contributor" }
                        $creditText = if ($license) { "$creditText, $license" } else { "$creditText, via Wikimedia Commons" }
                        
                        $wikiUrl = "https://commons.wikimedia.org/wiki/" + [System.Uri]::EscapeDataString($p.title)
                        $allImages.Add([PSCustomObject]@{
                            url = $info.thumburl
                            credit = $creditText
                            creditUrl = $wikiUrl
                            topic = $topicDef.Topic
                        }) | Out-Null
                        $count++
                    }
                }
            } catch { Write-Host "  Parse error: $_" }
        }
        Start-Sleep -Milliseconds 250
    }
    Write-Host "  Added: $count"
}

if (Test-Path $tmpFile) { Remove-Item $tmpFile -Force }

Write-Host "`nTotal: $($allImages.Count) unique images"
$output = @{ images = $allImages.ToArray() }
$output | ConvertTo-Json -Depth 5 | Out-File -FilePath "C:\TechVeb\scripts\.wikimedia-images.json" -Encoding UTF8
Write-Host "Written to C:\TechVeb\scripts\.wikimedia-images.json"

Write-Host "`n=== Summary ==="
$allImages | Group-Object topic | ForEach-Object { Write-Host "$($_.Name): $($_.Count)" }
