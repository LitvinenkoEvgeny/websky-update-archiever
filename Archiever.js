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

    async goTo(url, selectorForWait) {
        await this.page.goto(url, {waitUntil: 'networkidle2'});

        if (selectorForWait) {
            await this.page.waitForSelector(selectorForWait);
        }

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

    exposeDownloadFunction(){
        this.page.exposeFunction("writeABString", async (strbuf, targetFile) => {

            var str2ab = function _str2ab(str) { // Convert a UTF-8 String to an ArrayBuffer

                var buf = new ArrayBuffer(str.length); // 1 byte for each char
                var bufView = new Uint8Array(buf);

                for (var i = 0, strLen = str.length; i < strLen; i++) {
                    bufView[i] = str.charCodeAt(i);
                }
                return buf;
            };

            console.log("In 'writeABString' function...");

            return new Promise((resolve, reject) => {

                // Convert the ArrayBuffer string back to an ArrayBufffer, which in turn is converted to a Buffer
                let buf = Buffer.from(str2ab(strbuf));

                // Try saving the file.
                fs.writeFile(targetFile, buf, (err, text) => {
                    if (err) reject(err);
                    else resolve(targetFile);
                });
            });
        });
    }

    async goToAdminPage(url) {
        this.exposeDownloadFunction();
        const adminPageUrl = Archiever.createAdminUrl(url);

        await this.goTo(adminPageUrl, '.login-form');
        const loginInput = await this.page.$('[name="login"]');
        const passwordInput = await this.page.$('[name="password"]');
        const submit = await this.page.$('.login-form button');

        await loginInput.type('e.litvinenko@mute-lab.com');
        await passwordInput.type('qwertyqwerty');
        await submit.click();
        await this.page.waitForSelector('.btn-save-parameters');


        const downloadParamsUrl = await this.page.$eval('.btn-save-parameters a', a => a.href);


        const file = await this.page.evaluate(async (url) => {

            function arrayBufferToString(buffer) {
                // Convert an ArrayBuffer to an UTF-8 String

                var bufView = new Uint8Array(buffer);
                var length = bufView.length;
                var result = '';
                var addition = Math.pow(2, 8) - 1;

                for (var i = 0; i < length; i += addition) {
                    if (i + addition > length) {
                        addition = length - i;
                    }
                    result += String.fromCharCode.apply(null, bufView.subarray(i, i + addition));
                }
                return result;
            }

            return fetch(url, {
                credentials: 'same-origin',
                responseType: 'arraybuffer', // get response as an ArrayBuffer
            })
                .then(response => response.arrayBuffer())
                .then(arrayBuffer => {
                    var bufstring = arrayBufferToString(arrayBuffer);
                    return window.writeABString(bufstring, '/tmp/downloadtest.xlsx');
                })
                .catch(function (error) {
                    console.log('Request failed: ', error);
                });


            // .then(blob => {
            //     // return URL.createObjectURL(blob);
            //     return new Blob(blob)
            // })

        }, downloadParamsUrl);
        //
        // var string = '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';
        // console.log(file.length, string.length);


        fs.writeFile('test.xlsx', file,
            'base64', function (e) {
                if (e) console.log(e);
            });

        await this.page.waitFor(100000);
    }

    async start() {
        console.log('create driver');
        this.driver = await puppeteer.launch({ignoreHTTPSErrors: true, headless: true});
        console.log('create page');
        this.page = await this.driver.newPage();


        for (let url of WEBSKY_SITES) {
            console.log(url);
            let webskyUrl = url;
            this.companyName = Archiever.getAviacompanyName(url);

            await this.goTo(url, '[submit="vm.searchSubmitHandler"]');
            await this.goToAdminPage(url)

            // await this.takeScreenshotForAllDevices('search', '[submit="vm.searchSubmitHandler"]');
        }


    }

}

const archiever = new Archiever();
archiever.start();

