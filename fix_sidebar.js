const fs = require('fs');
let code = fs.readFileSync('src/components/Sidebar.jsx', 'utf8');

code = code.replace(
  "} from 'Truck, \n} from 'lucide-react';",
  "  Truck\n} from 'lucide-react';"
);

fs.writeFileSync('src/components/Sidebar.jsx', code);
