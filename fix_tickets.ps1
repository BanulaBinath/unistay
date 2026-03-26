
$content = Get-Content frontend/src/pages/admin/AdminTicketsPage.js -Raw
$content = $content -replace "navigate\(/admin/tickets/\)", "navigate(``/admin/tickets/`${ticket._id}``)"
Set-Content -Path frontend/src/pages/admin/AdminTicketsPage.js -Value $content

