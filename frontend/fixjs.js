const fs = require('fs');
let c = fs.readFileSync('src/Components/admin/UsersManagement.js', 'utf8');
c = c.replace(/\{\{\s*width:\s*\$\(\(users/g, '{{ width: \${(users');
c = c.replace(/\)\)\s*\*\s*100\}%\s*\}\}/g, ')) * 100}%\ }}');
fs.writeFileSync('src/Components/admin/UsersManagement.js', c);
