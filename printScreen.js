const puppeteer = require('puppeteer');


(async () => {
  const browser = await puppeteer.launch({headless: false });

  const page = await browser.newPage();
  await page.goto('https://netflix.com.br/login');
  console.log('Page loaded!');
  const title = await page.evaluate(() => {
    return document.title;
  });
    console.log('Page title:', title);
  await page.screenshot({ path: 'screenshot.png' }); 
  
  // await browser.close();
})();