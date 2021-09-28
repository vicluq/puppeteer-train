const puppeteer = require('puppeteer');
const fs = require('fs');
const dotenv = require('dotenv');
const { } = require('./controllers');

dotenv.config();
const url = "https://www.google.com/";

async function getTable(page) {
    let tbl, error = false;
    try {
        tbl = await page.$eval('div[data-name="stores"] table', (table) => {
            return table;
        });
    } catch (err) {
        console.log(err)
        error = true;
    }

    return { tbl, error };
}

async function run() {
    const browser = await puppeteer.launch({
        args: ["--no-sandbox"],
        headless: false,
        ignoreHTTPSErrors: true
    });

    const browserPage = await browser.newPage();  // opens a page
    await browserPage.setViewport({
        width: 1200,
        height: 720,
        deviceScaleFactor: 1,
    })
    await browserPage.goto(url, { waitUntil: 'networkidle2' });

    await browserPage.click('input[role="combobox"]');
    await browserPage.$eval('input[role="combobox"]', (input) => {
        input.value = "iphone 12";
    });

    // await Promise.all([
    //     browserPage.waitForNavigation({waitUntil: 'load'}),
    //     browserPage.keyboard.press('Enter')
    // ]);

    await browserPage.keyboard.press('Enter');
    await browserPage.waitForSelector('button[data-name="stores"]');

    await browserPage.click('button[data-name="stores"]');
    let table;

    // Add timeout inside while and leave while when timeout arives
    try {
        table = await getTable(browserPage);
    } catch (err) {
        console.log(err);
    }

    console.log(table);
    await browser.close();
}

run();