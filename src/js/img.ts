import * as puppeteer from 'puppeteer';
const browser = puppeteer.launch();

module.exports = class img {

    static async generator(width:number, height:number, content:string, tag:string, prefix:string) {
        const page = await (await browser).newPage();
        await page.setViewport({width: width, height: height, deviceScaleFactor: 2})
        await page.setContent(content, {waitUntil: 'networkidle0'});
        await page.screenshot({path: `image/${prefix}${tag}.jpg`, type: 'jpeg', quality: 100});
        await page.close();
        return `image/${prefix}${tag}.jpg`
    }
}