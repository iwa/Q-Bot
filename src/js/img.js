const puppeteer = require('puppeteer')

module.exports = class img {

    static async generator(width, height, content, tag, prefix) {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setViewport({width: width, height: height, deviceScaleFactor: 2})
        await page.setContent(content, {waitUntil: 'networkidle0'});
        await page.screenshot({path: `image/${prefix}${tag}.jpg`, type: 'jpeg', quality: 100});
        await browser.close();
        return `image/${prefix}${tag}.jpg`
    }

}