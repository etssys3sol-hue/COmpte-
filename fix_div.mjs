import fs from 'fs';

function fixFile(path) {
  let content = fs.readFileSync(path, 'utf8');
  content = content.replace(
    /        <\/button>\n      <\/div>\n\n      \{\/\* Mobile Menu/g,
    `        </button>\n        </div>\n      </div>\n\n      {/* Mobile Menu`
  );
  fs.writeFileSync(path, content);
}

fixFile('src/app/layouts/EstablishmentLayout.tsx');
fixFile('src/app/layouts/AdminLayout.tsx');
