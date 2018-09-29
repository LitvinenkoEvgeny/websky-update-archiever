const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
fs = require('fs');
path = require('path');
mkdirp = require('mkdirp');
fsExtra = require('fs-extra');


const WEBSKY_SITES = [
    'https://booking.nordstar.ru/websky/#/search',
    'https://booking.flyone.md/websky/#/search',
    'https://booking.georgian-airways.com/websky/search#/search',
    'https://booking.flyredwings.com/websky/#/search',
    'https://booking.angara.aero/websky/#/search',
    'https://booking.bekair.aero/websky/#/search',
    'http://booking.polarair.ru/websky/#/search',
    'https://airbook.nordwindairlines.ru/online/#/search',
    'http://booking.flyaurora.ru/websky/#/search',
    'http://booking.tajikairlines.com/websky/#/search',
    'https://booking.scat.kz/websky/#/search',
    'https://booking.azurair.ru/websky/#/search',
    'https://booking.iraero.ru/websky/#/search',
    'https://book.yamal.aero/websky/search#/search',
    'https://www.nordavia.ru/book/?lang=ru#/search',
    'https://booking.somonair.com/websky/#/search',
    'https://booking.izhavia.su/websky/#/search',
    'https://booking.alrosa.aero/websky/#/search',
    'https://web-checkin.severstal-avia.ru/websky/search#/search'
];
const CHECKIN_SITES = [
    'https://airbook.nordwindairlines.ru/check-in/',
    'https://www.nordavia.ru/check/',
    'https://booking.nordstar.ru/check-in/',
    'https://booking.flyone.md/websky-check-in/',
    'https://booking.flyredwings.com/websky-check-in/',
    'https://booking.bekair.aero/webcheck-in/',
    'https://ticket.rusline.aero/websky-check-in/'
];

class Archiever {
    static getAviacompanyName(url) {
        return url.split('.')[1];
    }

    static createAdminUrl(nowUrl) {
        return nowUrl.replace(/\/(\?.+|#.+|search)/, '/admin')
    }

    static async createDirectory(directoryPath) {
        await mkdirp.mkdirp(directoryPath)
    }

    constructor() {
        this.devices = {
            iPhone: devices['iPhone 8 Plus'],
            iPhoneLandscape: devices['iPhone 8 Plus landscape'],
            iPad: devices['iPad Pro'],
            iPadLandscape: devices['iPad Pro landscape'],
            galaxy: devices['Galaxy S5'],
            galaxyLandscape: devices['Galaxy S5 landscape']
        };
    }

    async goTo(url) {
        await this.page.goto(url, {waitUntil: 'networkidle2'});
        console.log(`go to ${url}`);
    }


    async takeScreenshot(name) {
        await this.page.screenshot({fullPage: true, path: name});
        console.log(`save screenshot as ${name}`);
    }


    async takeScreenshotForAllDevices(pageName, waitForSelector) {
        const directoryToSave = await path.join(this.companyName, 'screenshots', pageName);


        if (await fsExtra.pathExists(directoryToSave)) {
            console.log(`directory ${directoryToSave} exists in path`);
        } else {
            console.log(`directory ${directoryToSave} does not exists. create it`);
            await Archiever.createDirectory(directoryToSave);
        }

        await this.page.setViewport({width: 1600, height: 900});
        await this.takeScreenshot(`${path.join(directoryToSave, pageName)}_desktop.png`);

        for (let [key, value] of Object.entries(this.devices)) {
            await this.page.emulate(value);
            await this.page.waitForSelector(waitForSelector);
            await this.takeScreenshot(`${path.join(directoryToSave, pageName)}_${key}.png`)
        }

        await this.page.setViewport({width: 1600, height: 900});
    }

    async goToAdminPage(url){
        const adminPageUrl = this.page.url();
        console.log(adminPageUrl);
        await this.goTo();
    }

    async start() {
        console.log('create driver');
        this.driver = await puppeteer.launch({ignoreHTTPSErrors: true});
        console.log('create page');
        this.page = await this.driver.newPage();


        await this.goTo(url);
        // for (let url of WEBSKY_SITES) {
        //     console.log(url);
        //     let webskyUrl = url;
        //     this.companyName = Archiever.getAviacompanyName(url);
        //
        //     await this.takeScreenshotForAllDevices('search', '[submit="vm.searchSubmitHandler"]');
        // }



    }

}

const archiever = new Archiever();
archiever.start();

