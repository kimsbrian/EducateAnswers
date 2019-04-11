const puppeteer = require('puppeteer');
const axios = require('axios')
const cookie = {
    name: 'PHPSESSID',
    value: 'e6thrtfm2cagu4uaijc0ane893',
    domain: '.chegg.com',
    url: 'http://chegg.com/',
    path: '/',
    httpOnly: false,
    secure: false
}
const preparePageForTests = async (page) => {
    await page.setCookie(cookie)
    const userAgent = 'Mozilla/5.0 (X11; Linux x86_64)' +
        'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36';
    await page.setUserAgent(userAgent);

    await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'webdriver', {
            get: () => false,
        });
    });

    await page.evaluateOnNewDocument(() => {
        window.navigator.chrome = {
            runtime: {},
        };
    });

    await page.evaluateOnNewDocument(() => {
        const originalQuery = window.navigator.permissions.query;
        return window.navigator.permissions.query = (parameters) => (
            parameters.name === 'notifications' ?
                Promise.resolve({ state: Notification.permission }) :
                originalQuery(parameters)
        );
    });

    await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'plugins', {
            get: () => [1, 2, 3, 4, 5],
        });
    });

    await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'languages', {
            get: () => ['en-US', 'en'],
        });
    });
}

async function run(number) {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox'],
        headless: false
    });

    const page = await browser.newPage();

    await preparePageForTests(page);



    url = "https://www.chegg.com/homework-help/questions-and-answers/-q" + number
    await page.goto(url);


    if (await page.$('div.ugc-base:nth-child(2)') !== null) {
        const html = await page.evaluate(() => {
            const question = document.querySelector('div.ugc-base:nth-child(2)').innerHTML;
            let answer = 'None';
            try {
                answer = document.querySelector('.answer-given-body').innerHTML;
            }
            catch (error) {
            }
            return {
                question: question,
                answer: answer
            }
        });
        await browser.close()
        const data = {
            question: html.question,
            answer: html.answer,
            url: number
        }

        console.log(html.question)
        console.log(html.answer)
        console.log(number)

        return {
            question: html.question,
            answer: html.answer,
            url: number
        }
    }
    else {
        await browser.close()
        return {
        }
    }
}

run('8435457')