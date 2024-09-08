import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';

async function fetchWebsite(url, printMetadata = false) {
    try {
        const response = await axios.get(url);
        const domain = new URL(url).hostname;
        const outputPath = path.join(process.cwd(), `${domain}.html`);

        // Save the HTML file
        await fs.writeFile(outputPath, response.data);

        // Extract metadata
        const linkCount = (response.data.match(/<a /gi) || []).length;
        const imageCount = (response.data.match(/<img /gi) || []).length;

        const metadata = {
            site: domain,
            num_links: linkCount,
            images: imageCount,
            last_fetch: new Date().toString()
        };

        // Save metadata
        await fs.writeFile(`${domain}_metadata.json`, JSON.stringify(metadata, null, 2));

        if (printMetadata) {
            console.log(`site: ${metadata.site}`);
            console.log(`num_links: ${metadata.num_links}`);
            console.log(`images: ${metadata.images}`);
            console.log(`last_fetch: ${metadata.last_fetch}`);
        } else {
            console.log(`Fetched ${url} successfully.`);
        }
    } catch (error) {
        console.error(`Error fetching ${url}:`, error.message);
    }
}

async function main() {
    const args = process.argv.slice(2);
    const printMetadata = args.includes('--metadata');
    const urls = args.filter(arg => arg !== '--metadata');

    if (urls.length === 0) {
        console.error('Please provide at least one URL');
        process.exit(1);
    }

    for (const url of urls) {
        await fetchWebsite(url, printMetadata);
    }
}

main();