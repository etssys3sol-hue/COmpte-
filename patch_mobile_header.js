const fs = require('fs');

function patch(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(
    /<button onClick={\(\) => setIsMobileMenuOpen\(true\)}/g,
    `<div className="flex items-center gap-2">
          <ThemeToggle />
          <button onClick={() => setIsMobileMenuOpen(true)}`
  );
  content = content.replace(
    /className="w-6 h-6" \/>\n        <\/button>/g,
    `className="w-6 h-6" />
          </button>
        </div>`
  );
  fs.writeFileSync(file, content);
}

patch('src/app/layouts/EstablishmentLayout.tsx');
patch('src/app/layouts/AdminLayout.tsx');
