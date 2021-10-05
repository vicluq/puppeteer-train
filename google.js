const puppeteer = require("puppeteer");
const fs = require("fs");
const dotenv = require("dotenv");
const {} = require("./controllers");

dotenv.config();
const url = "https://www.google.com/";

async function getTable(page) {
  console.log("Generating table");
  let tbl,
    error = false;
  try {
    tbl = await page.$eval('div[data-name="stores"] table', (table) => {
      return table;
    });
  } catch (err) {
    console.log(err);
    error = true;
  }

  // return { tbl, error };
  if (!error && tbl) {
    console.log(tbl);
  } else if (error) {
    console.log("There was an error!");
  } else if (!error && !tbl) {
    console.log("There is no table!");
  }
}

async function run() {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox"],
    headless: false,
    ignoreHTTPSErrors: true,
  });

  const browserPage = await browser.newPage(); // opens a page
  await browserPage.setViewport({
    width: 1200,
    height: 720,
    deviceScaleFactor: 1,
  });
  await browserPage.goto(url, { waitUntil: "networkidle2" });

  await browserPage.click('input[role="combobox"]');
  await browserPage.$eval('input[role="combobox"]', (input) => {
    input.value = "iphone 12";
  });

  // Alternative for lines 57 and 58
  // await Promise.all([
  //     browserPage.waitForNavigation({waitUntil: 'load'}),
  //     browserPage.keyboard.press('Enter')
  // ]);

  await browserPage.keyboard.press("Enter");
  await browserPage.waitForSelector('button[data-name="stores"]');

  await browserPage.click('button[data-name="stores"]');

  // Add timeout inside while and leave while when timeout arives
  let gotToTimeout = false,
    createdTimeout = false;

  while (!gotToTimeout) {
    if (!createdTimeout) {
      console.log("Created Timeout!");

      setTimeout(async function () {
        gotToTimeout = true;
        await getTable(browserPage);
      }, 3000);

      createdTimeout = true;
    }
    // Preso no while
  }

  await browser.close();
}

run();
