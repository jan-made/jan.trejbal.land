import puppeteer from 'puppeteer';
import { mkdir } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const site = process.argv[2] || 'http://localhost:4321';
const outputFile = process.argv[3] || 'jan-trejbal.pdf';
const outputDir = process.argv[4] || join(__dirname, '..', 'dist');

async function generatePdf() {
  console.log(`Generating PDF from ${site}...`);
  
  await mkdir(outputDir, { recursive: true });

  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
    ],
    headless: true,
  });

  const page = await browser.newPage();

  await page.goto(site, { waitUntil: 'networkidle2', timeout: 30000 });

  const outputPath = join(outputDir, outputFile);
  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '1cm',
      right: '0',
      bottom: '2cm',
      left: '0',
    },
  });

  console.log(`PDF generated: ${outputPath}`);

  await browser.close();
}

generatePdf().catch((err) => {
  console.error('Error generating PDF:', err);
  process.exit(1);
});
