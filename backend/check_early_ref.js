const fs = require('fs');
const path = 'C:/Users/User/Desktop/Conestone_POS-QR_082026/frontend/app/sales-report.tsx';
const content = fs.readFileSync(path, 'utf8');
const lines = content.split('\n');

for (let i = 154; i < 1061; i++) {
  const line = lines[i];
  if (line && line.includes('filteredSales')) {
    console.log(`Line ${i + 1}: ${line}`);
  }
}
