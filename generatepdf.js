const puppeteer = require('puppeteer');
const fs = require('fs');

let site = 'https://jan.trejbal.land';
if (typeof process.argv[2] !== 'undefined') {
    site = process.argv[2];
}

let outputFile = 'jan-trejbal.pdf';
if (typeof process.argv[3] !== 'undefined') {
    outputFile = process.argv[3];
}

(async () => {
    await fs.mkdir('public', {recursive: true}, (err) => {
        if (err) console.error(err);
    });

    const browser = await puppeteer.launch({
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    });

    const page = await browser.newPage();

    await page.goto(site, {waitUntil: 'networkidle2'});

    await page.pdf({
        path: `public/${outputFile}`,
        format: 'A4'
    });

    browser.close();
})();
