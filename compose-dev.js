// compose-dev.js
import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const composeFile = path.join(__dirname, '.devcontainer', 'docker-compose.dev.yml');
const command = `docker-compose -f "${composeFile}" up -d --build`;

console.log(`Starting development containers from ${composeFile}...`);

const child = exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error starting containers: ${error.message}`);
    if (stderr) console.error(`Stderr: ${stderr}`);
    return;
  }
  if (stderr && !stdout) { // Sometimes compose logs to stderr even on success
    // console.warn(`Stderr (possibly ignorable): ${stderr}`);
  }
  if (stdout) {
    // console.log(`Stdout: ${stdout}`);
  }
  console.log('Development containers started successfully (or already running).');
  console.log('Access your app via Nginx at http://localhost:80');
});

child.on('exit', (code) => {
  if (code !== 0) {
    console.error(`Docker Compose command exited with code ${code}`);
  }
});