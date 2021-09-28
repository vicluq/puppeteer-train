const puppeteer = require('puppeteer');
const fs = require('fs');
const dotenv = require('dotenv');
const { fastShop, fastShopLinks } = require('./controllers');

dotenv.config();
const url = "https://www.fastshop.com.br/web/p/d/AEMGJ53BRAPTO_PRD/iphone-12-64gb-preto-com-tela-de-61-5g-e-camera-dupla-de-12-mp-mgj53bra";
const url2 = "https://www.fastshop.com.br/";

async function run(dataArray, initialTime) {
    const browser = await puppeteer.launch({
        args: ["--no-sandbox"],
        headless: false,
        ignoreHTTPSErrors: true
    }); // launches chromium

    // headless => exibir uma interface (o browser) com as operações sendo feitas
    const browserPage = await browser.newPage();  // opens a page
    await browserPage.setViewport({
        width: 1200,
        height: 720,
        deviceScaleFactor: 1,
    })
    await browserPage.goto(url2, { waitUntil: 'networkidle2' });

    await browserPage.click('div.search-conteiner input');
    await browserPage.$eval('div.search-conteiner input', input => {
        input.value = "iphone 12";
    }); // filling input

    browserPage.keyboard.press('Enter').then(async () => {
        console.log("pressed enter!");
        await browserPage.waitForSelector('div.search-results');
        await browserPage.waitForSelector('footer', { visible: true });

        await browserPage.evaluate(selector => {
            return document.querySelector(selector).scrollIntoView();
        }, 'footer');

        const elements = await browserPage.evaluate(() => {
            return document.querySelectorAll('div.wrapper.animation.category-list');
        });

        // const elements = await browserPage.$$eval('div.wrapper.animation.category-list', e => e);
        console.log("[LIST ELEMENTS]: ", elements);

        await browser.close();
    }); // pressing a buttn

    // const bodyMatch = await browserPage.$eval('body', (body) => {
    //     const matching = body.innerHTML.match(/([0-1][0-9])x de R\$&nbsp;[0-9]+,[0-9]+/g);
    //     return matching;
    // });

    // // Getting the deadline price
    // let priceByDeadline;
    // if (bodyMatch) {
    //     const str = bodyMatch[0].replace('&nbsp;', ' ');
    //     const deadline = str.match(/([0-1][0-9])x/g)[0].slice(0, 2);
    //     const price = str.match(/R\$ [0-9]+,[0-9]+/g)[0].slice(3).replace(',', '.');
    //     priceByDeadline = (Number(deadline) * Number(price)).toFixed(2);
    // }

    // // Getting the screenshot
    // await browserPage.screenshot({
    //     path: process.env.BASE_DIR_DATA + '/screenshot_id_' + (dataArray.length + 1) + '.png',
    //     type: 'png'
    // })

    // // Getting the data schema
    // const { dataToAdd, isThereData } = await fastShop(browserPage, dataArray, { priceByDeadline: Number(priceByDeadline) });

    // // Adding data to JSON file
    // if (isThereData) {
    //     new Promise(async (resolve, reject) => {
    //         fs.writeFile(process.env.BASE_DIR_DATA + process.env.LINKS_PATH, JSON.stringify(dataToAdd), (err) => {
    //             if (err) {
    //                 console.log("Error when appending to the file!");
    //                 reject(0);
    //             }

    //             console.log("successfully appended the schema to the file");
    //             resolve(1);
    //         })
    //     })
    //         .then(async (code) => {
    //             await browser.close(); // Closing browser
    //             const execTime = ((new Date().getTime()) - initialTime) / 1000;
    //             if (code) {
    //                 console.log("Operation Done! It took ", execTime, "s");
    //             } else {
    //                 console.log("Operation Not Succesful! It took ", execTime, "s");
    //             }
    //         })
    //         .catch((err) => {
    //             throw new Error(err.message);
    //         });
    // } else {
    //     console.log('There is no JSON schema for this webpage!');
    // }
}

try {
    const initialTime = new Date().getTime();
    // Checks if file exists, else, creates a new one with an empty array!
    if (!fs.existsSync(process.env.BASE_DIR_DATA + process.env.LINKS_PATH)) {
        console.log('Creating File...');
        fs.writeFile(process.env.BASE_DIR_DATA + process.env.LINKS_PATH, JSON.stringify([]), (err) => {
            if (!err) {
                console.log('Created file with sucess!');
                console.log('Started Scrapping');
                run([], initialTime);
            } else {
                throw new Error(err);
            }
        });
    } else {
        console.log('Reding File Data...');
        fs.readFile(process.env.BASE_DIR_DATA + process.env.LINKS_PATH, (err, data) => {
            if (err) {
                throw new Error(err);
            }
            console.log('Started Scrapping');
            run(JSON.parse(data), initialTime);
        })
    }
} catch (err) {
    console.error(err)
}

/*
    COMMANDS
    - launch, newPage, setViewport, goto
    - $(returns the element), $eval, $$eval (more elements)
    - evaluate (use HTML content with the element passed to evaluate)
    -
*/