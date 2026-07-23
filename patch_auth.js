const fs = require('fs');
let content = fs.readFileSync('src/services/auth.service.ts', 'utf8');

content = content.replace(
  /throw new Error\(\s*"Cet établissement n’est pas autorisé."\s*\);/g,
  `throw new Error(
      "Cet établissement n’est pas autorisé. User meta: " + JSON.stringify(authData.user?.user_metadata) + " App meta: " + JSON.stringify(authData.user?.app_metadata)
    );`
);

fs.writeFileSync('src/services/auth.service.ts', content);
