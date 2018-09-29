const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const Iphone = devices['iPhone 6'];


class Archiever {
    static WEBSKY_SITES = [
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
    static CHECKIN_SITES = [
        'https://airbook.nordwindairlines.ru/check-in/',
        'https://www.nordavia.ru/check/',
        'https://booking.nordstar.ru/check-in/',
        'https://booking.flyone.md/websky-check-in/',
        'https://booking.flyredwings.com/websky-check-in/',
        'https://booking.bekair.aero/webcheck-in/',
        'https://ticket.rusline.aero/websky-check-in/'
    ];

    constructor() {
    }

    async goTo(url) {
        await this.page.goto(url);
        console.log(`go to ${url}`);
    }

    async takeScreenshot(name) {
        await this.page.screenshot({fullPage: true, path: name});
        console.log(`save screenshot as ${name}`);
    }

    async start() {
        this.driver = await puppeteer.launch();
        this.page = await this.driver.newPage();

        await this.goTo('https://google.com');
        await this.takeScreenshot('test.png');
    }

}

const archiever = new Archiever();
archiever.start();
