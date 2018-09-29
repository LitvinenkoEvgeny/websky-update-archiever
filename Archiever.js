const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const Iphone = devices['iPhone 6'];


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
        await this.page.goto(url, { waitUntil: 'networkidle2' });
        console.log(`go to ${url}`);
    }


    async takeScreenshot(name) {
        await this.page.screenshot({fullPage: true, path: name});
        console.log(`save screenshot as ${name}`);
    }

    async goToAdminPage() {

    }

    async start() {
        console.log('create driver');
        this.driver = await puppeteer.launch();
        console.log('create page');
        this.page = await this.driver.newPage();

        for (let url of WEBSKY_SITES) {
            console.log(url);
            let webskyUrl = url;
            let companyName = Archiever.getAviacompanyName(url);

            await this.goTo(url);
            await this.takeScreenshot(`${companyName}.png`);
        }

    }

}

const archiever = new Archiever();
archiever.start();
// console.log(Archiever.createAdminUrl(WEBSKY_SITES[0]));
// console.log(Archiever.getAviacompanyName(WEBSKY_SITES[0]));

