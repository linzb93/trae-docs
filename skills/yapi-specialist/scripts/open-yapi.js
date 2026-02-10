import open from 'open';
import fs from 'fs';
import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// eslint-disable-next-line no-undef
const apiPath = process.argv[2];

if (!apiPath) {
    console.error('Error: Please provide an API path.');
    console.log('Usage: node scripts/open-yapi.js <api_path>');
    // eslint-disable-next-line no-undef
    process.exit(1);
}

// eslint-disable-next-line no-undef
const docsPath = path.resolve(process.cwd(), 'docs/api/index.json');

try {
    if (!fs.existsSync(docsPath)) {
        console.error(`Error: API index file not found at ${docsPath}`);
        // eslint-disable-next-line no-undef
        process.exit(1);
    }

    const content = fs.readFileSync(docsPath, 'utf-8');
    const apis = JSON.parse(content);

    // Find the API entry matching the path
    const api = apis.find((item) => item.path === apiPath || item.path === `/${apiPath}`);

    if (api) {
        const url = `http://192.168.0.107:3000/project/${api.projectId}/interface/api/${api.id}`;
        console.log(`Found API: ${api.title}`);
        console.log(`Opening URL: ${url}`);
        await open(url);
    } else {
        console.error(`Error: API not found for path: ${apiPath}`);
        // eslint-disable-next-line no-undef
        process.exit(1);
    }
} catch (error) {
    console.error('Error processing API documentation:', error);
    // eslint-disable-next-line no-undef
    process.exit(1);
}
