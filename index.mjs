import puppeteer from 'puppeteer';

const delay = (time) => {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
}

const browser = await puppeteer.launch({ headless: false, userDataDir: "./profile" });
const page = await browser.newPage();

/*
FIRST RUN - UNCOMMENT AND SIGN IN

await page.goto("https://venmo.com/account/sign-in")
await delay(120000)
*/

// Select user to pay
await page.goto("https://account.venmo.com/pay")
await page.type("#search-input", "@Zi-Teoh");
await (await page.waitForSelector("img[alt='Zi-Teoh']")).click()

// Set up payment details
await page.type("#payment-note", "🐜")
await page.type("input[aria-label='Amount']", "999.00")
await page.evaluate(() => {
    document.querySelectorAll("button").forEach((button) => {
        if (button.textContent === "Pay") {
            button.click()
        }
    });
});

// Wait for payment methods to populate
await page.waitForSelector("#select-destination");

// Pay
await page.evaluate(() => {
    document.querySelectorAll("button").forEach((button) => {
        console.log(button.textContent)
        if (button.textContent === "Pay Zi Teoh $999.00") {
            button.click()
        }
    });
});

// Cleanup
await Promise.race([page.waitForNavigation(), delay(30000)]);
await page.close();
process.exit(0);
