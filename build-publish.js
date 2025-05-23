// build-publish.js
import { execSync, exec } from 'child_process'; // Using execSync for sequential blocking tasks
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const packageJson = JSON.parse(fs.readFileSync(path.resolve('./package.json'), 'utf8'));
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const push = packageJson.dockerAccount !== "labsaiimi";

const DOCKER_HUB_USERNAME = packageJson.dockerAccount;
const FRONTEND_IMAGE_NAME = `${packageJson.project}-frontend`;
const SERVER_IMAGE_NAME = `${packageJson.project}-server`;
const NGINX_IMAGE_NAME = `${packageJson.project}-nginx`;
const TAG = packageJson.version;

const execPromise = (command, options = {}) => {
  return new Promise((resolve, reject) => {
    console.log(`Executing: ${command}`);
    const process = exec(command, options, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing: ${command}\n${error.message}`);
        if (stderr) console.error(`Stderr: ${stderr}`);
        reject(error);
        return;
      }
      if (stderr) console.warn(`Stderr: ${stderr}`); // Log stderr even if no error
      if (stdout) console.log(`Stdout: ${stdout}`);
      resolve({ stdout, stderr });
    });
    process.stdout.pipe(process.stdout);
    process.stderr.pipe(process.stderr);
  });
};


async function main() {
  try {
    console.log('Starting build and publish process...');


    // 1. Build the React frontend
    console.log('\nStep 1: Building React frontend...');
    execSync('npm run build', { cwd: path.join(__dirname, 'frontend'), stdio: 'inherit' });
    console.log('React frontend built successfully.');

    // Define image tags
    const serverImage = `${DOCKER_HUB_USERNAME}/${SERVER_IMAGE_NAME}`;
    const nginxImage = `${DOCKER_HUB_USERNAME}/${NGINX_IMAGE_NAME}`;
    const serverImageWithTag = `${serverImage}:${TAG}`;
    const serverImageLatest = `${serverImage}:latest`;
    const frontendImage = `${DOCKER_HUB_USERNAME}/${FRONTEND_IMAGE_NAME}`;
    const frontendImageWithTag = `${frontendImage}:${TAG}`;
    const frontendImageLatest = `${frontendImage}:latest`;
    const nginxImageWithTag = `${nginxImage}:${TAG}`;
    const nginxImageLatest = `${nginxImage}:latest`;

    // 2. Build Docker images using docker-compose.yml (or direct docker build commands)
    // The docker-compose.yml is set up to use the server/Dockerfile which copies frontend/dist.
    // We are primarily interested in the images defined in docker-compose.yml
    console.log('\nStep 2: Building Docker images...');

    // Build frontend image
    console.log(`Building frontend image: ${frontendImageWithTag}`);
    execSync(`docker build -t ${frontendImageWithTag} -f frontend/Dockerfile ./frontend`, { stdio: 'inherit' });
    console.log('Frontend image built successfully.');

    // Build server image
    console.log(`Building server image: ${serverImageWithTag}`);
    execSync(`docker build -t ${serverImageWithTag} -f server/Dockerfile ./server`, { stdio: 'inherit' });
    console.log('Server image built successfully.');

    // Build Nginx image
    console.log(`Building Nginx image: ${nginxImageWithTag}`);
    execSync(`docker build -t ${nginxImageWithTag} -f nginx/Dockerfile ./nginx`, { stdio: 'inherit' });
    console.log('Nginx image built successfully.');


    if (push) {
    // 3. Push images to Docker Hub
    console.log('\nStep 3: Pushing images to Docker Hub...');

    console.log(`Pushing ${serverImageWithTag}`);
    execSync(`docker push ${serverImageWithTag}`, { stdio: 'inherit' });
    console.log(`Pushing ${serverImageLatest}`);
    execSync(`docker push ${serverImageLatest}`, { stdio: 'inherit' });

    console.log(`Pushing ${nginxImageWithTag}`);
    execSync(`docker push ${nginxImageWithTag}`, { stdio: 'inherit' });
    console.log(`Pushing ${nginxImageLatest}`);
    execSync(`docker push ${nginxImageLatest}`, { stdio: 'inherit' });

    console.log('\nAll images built and pushed successfully!');
    console.log(`Server: ${serverImageWithTag} & ${serverImageLatest}`);
    console.log(`Nginx:  ${nginxImageWithTag} & ${nginxImageLatest}`);
    }

  } catch (error) {
    console.error(`\nBuild and publish process failed: ${error.message}`);
    if (error.stderr) console.error(`Stderr: ${error.stderr.toString()}`);
    if (error.stdout) console.error(`Stdout: ${error.stdout.toString()}`);
    process.exit(1);
  }
}

main();