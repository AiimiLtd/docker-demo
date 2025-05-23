// compose-dev.js
import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const packageJson = JSON.parse(fs.readFileSync(path.resolve('./package.json'), 'utf8'));

const DOCKER_HUB_USERNAME = packageJson.dockerAccount;
const FRONTEND_IMAGE_NAME = `${packageJson.project}-frontend`;
const SERVER_IMAGE_NAME = `${packageJson.project}-server`;
const NGINX_IMAGE_NAME = `${packageJson.project}-nginx`;
const TAG = packageJson.version;

const images= {
  frontend: `${DOCKER_HUB_USERNAME}/${FRONTEND_IMAGE_NAME}:${TAG}`,
  server: `${DOCKER_HUB_USERNAME}/${SERVER_IMAGE_NAME}:${TAG}`,
  nginx: `${DOCKER_HUB_USERNAME}/${NGINX_IMAGE_NAME}:${TAG}`
}
const port= {
  frontend: 3000,
  server: 8080,
  nginx: 80
}

const imageKeys = Object.keys(images);



const runCommand = (command) => {
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
}

console.log(`Starting production containers from ${packageJson.project}...`);
while(imageKeys.length > 0) {
  const imageKey = imageKeys.shift();
//   const command = `docker run -d --name ${packageJson.project}_${imageKey} --entrypoint sleep ${images[imageKey]} infinity`;
  const command = `docker run -d --name ${packageJson.project}_${imageKey} -p ${port[imageKey]}:${port[imageKey]} ${images[imageKey]}`;
  console.log(command);
  runCommand(command);
}