async function fastShop(browserPage, dataArray, payload = {}) {
    // Extract JSON content
    const element = await browserPage.$('script[type="application/ld+json"]');
    const text = await browserPage.evaluate(element => element ? element.innerText : 'No data!', element);

    const dataToAdd = [...dataArray];
    if (text) {
        const JSONparsedText = JSON.parse(text);
        dataToAdd.push({
            id: dataArray.length + 1,
            name: JSONparsedText.name,
            // description: JSONparsedText.description,
            // image: JSONparsedText.image ? JSONparsedText.image[0] : null,
            price: JSONparsedText.offers.price,
            ...payload,
        });

        return { dataToAdd, isThereData: true };
    }

    return { dataToAdd, isThereData: false };
}

async function fastShopLinks(browserPage, dataArray, querySearch, payload = {}) {
    await browserPage.$eval('div.search-conteiner input', input => input.value = "iphone 12"); // filling input
    await browserPage.keyboard.press('Enter'); // pressing a buttn
    await browserPage.$eval('app-footer', e => {
        e.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'end' });
    });
    const elements = await browserPage.$$eval('app-product-list app-product-item', e => {
        return e;
    });
    console.log(elements);
    
    // app-product-list app-product-item
}

async function amazon(browserPage, dataArray, payload = {}) {

}

module.exports = {
    fastShop,
    fastShopLinks,
}