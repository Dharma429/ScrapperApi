const express = require('express');
const { chromium } = require('playwright');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', async (req, res) => {
  let browser;
  try {
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.goto('https://www.google.com', { waitUntil: 'domcontentloaded' });
    const content = await page.content();
    res.send(`
      <h1>Playwright Screenshot Example</h1>
      <p>Page loaded successfully!</p>
      <pre>${content.substring(0, 500)}...</pre>
    `);
  } catch (err) {
    res.status(500).send('Error: ' + err.message);
  } finally {
    if (browser) await browser.close();
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
