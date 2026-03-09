const { spawn } = require('child_process');

const isReplit = !!process.env.REPLIT_DEV_DOMAIN;

const cmd = 'npx';
const args = ['expo', 'start', '--localhost'];
const env = { ...process.env };

if (isReplit) {
  console.log('Detected Replit environment. Configuring proxy URLs...');
  env.EXPO_PACKAGER_PROXY_URL = `https://${process.env.REPLIT_DEV_DOMAIN}`;
  env.REACT_NATIVE_PACKAGER_HOSTNAME = process.env.REPLIT_DEV_DOMAIN;
  env.EXPO_PUBLIC_DOMAIN = `${process.env.REPLIT_DEV_DOMAIN}:5000`;
} else {
  console.log('Detected local environment. Using default configuration...');
}

const child = spawn(cmd, args, { stdio: 'inherit', env });

child.on('exit', (code) => {
  process.exit(code);
});
