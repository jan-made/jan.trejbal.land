const puppeteer = require('puppeteer');
const fs = require('fs');

var site = 'https://jan.trejbal.land';
if (typeof process.argv[2] !== 'undefined') {
    site = process.argv[2];
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
        path: 'public/jan-trejbal.pdf',
        format: 'A4'
    });

    browser.close();
})();
