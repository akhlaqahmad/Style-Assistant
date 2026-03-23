const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const files = execSync('grep -rl "<Pressable" app components').toString().split('\n').filter(Boolean);

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('<Pressable') && !content.includes('import ') || (!content.includes('Pressable') && !content.match(/import.*Pressable.*from/s))) {
     // this logic is flawed. Let's just do regex:
  }
  
  const importsMatch = content.match(/import\s+[^'"]*?Pressable[^'"]*?from\s+['"]react-native['"]/s);
  if (!importsMatch) {
    console.log(file);
  }
}
