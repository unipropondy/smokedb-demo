const fs = require('fs');
const path = 'C:/Users/User/Desktop/Conestone_POS-QR_082026/frontend/app/sales-report.tsx';
const content = fs.readFileSync(path, 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('useMemo') || line.includes('const filtered') || line.includes('function') || line.includes('export default')) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
