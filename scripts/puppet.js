// We'll use Puppeteer is our browser automation framework.
const puppeteer = require('puppeteer');
//const CREDS = require('../config/creds');
//const addAnswer = require('.\\
const axios = require('axios')
const port = require('../server')
//const addAnswer = require('../client/src/actions/answerActions').addAnswer

const cookie = {
  name: 'PHPSESSID',
  value: '568qlkg4fp4862skepj59bpsk4',
  domain: '.chegg.com',
  url: 'http://chegg.com/',
  path: '/',
  httpOnly: false,
  secure: false
}
// This is where we'll put the code to get around the tests.
const preparePageForTests = async (page) => {
  // Pass the User-Agent Test.
  await page.setCookie(cookie)
  const userAgent = 'Mozilla/5.0 (X11; Linux x86_64)' +
    'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36';
  await page.setUserAgent(userAgent);

  // Pass the Webdriver Test.
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', {
      get: () => false,
    });
  });

  // Pass the Chrome Test.
  await page.evaluateOnNewDocument(() => {
    // We can mock this in as much depth as we need for the test.
    window.navigator.chrome = {
      runtime: {},
      // etc.
    };
  });

  // Pass the Permissions Test.
  await page.evaluateOnNewDocument(() => {
    const originalQuery = window.navigator.permissions.query;
    return window.navigator.permissions.query = (parameters) => (
      parameters.name === 'notifications' ?
        Promise.resolve({ state: Notification.permission }) :
        originalQuery(parameters)
    );
  });

  // Pass the Plugins Length Test.
  await page.evaluateOnNewDocument(() => {
    // Overwrite the `plugins` property to use a custom getter.
    Object.defineProperty(navigator, 'plugins', {
      // This just needs to have `length > 0` for the current test,
      // but we could mock the plugins too if necessary.
      get: () => [1, 2, 3, 4, 5],
    });
  });

  // Pass the Languages Test.
  await page.evaluateOnNewDocument(() => {
    // Overwrite the `plugins` property to use a custom getter.
    Object.defineProperty(navigator, 'languages', {
      get: () => ['en-US', 'en'],
    });
  });
}

async function run(number) {
  // Launch the browser in headless mode and set up a page.
  console.log('TEST')
  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    headless: true,
  });
  const page = await browser.newPage();

  // Prepare for the tests (not yet implemented).
  await preparePageForTests(page);

  // Navigate to the page that will perform the tests.
  //const testUrl = 'https://www.distilnetworks.com/';

  /*
  const loginURL = 'https://www.chegg.com/auth?action=login';
  //const testUrl = 'https://www.chegg.com/auth?action=login&redirect=https%3A%2F%2Fwww.chegg.com%2F&reset_password=0';
  await page.goto(loginURL);
  const EMAIL_SELECTOR = '#emailForSignIn';
  const PASSWORD_SELECTOR = '#passwordForSignIn';
  const BUTTON_SELECTOR = '.login-button';

  await page.click(EMAIL_SELECTOR);
  await page.keyboard.type(CREDS.username);
  
  await page.click(PASSWORD_SELECTOR);
  await page.keyboard.type(CREDS.password);
  
  await page.click(BUTTON_SELECTOR);

  */
  url = "https://www.chegg.com/homework-help/questions-and-answers/-q" + number
  await page.goto(url);
  console.log('WAITING')

  const html = await page.evaluate(() => {
    let bodyHTML = await page.evaluate(() => document.body.innerHTML);
    console.log('body'+bodyHTML);
  })


  if (await page.$('div.ugc-base:nth-child(2)') !== null) {
    console.log('IM IN')
    const html = await page.evaluate(() => {
      const question = document.querySelector('div.ugc-base:nth-child(2)').innerHTML;
      let answer = 'None';
        try{
        answer = document.querySelector('.answer-given-body').innerHTML;
        }
        catch(error){
          console.log('No Answer');
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

    //addAnswer(data)
    axios.post('http://localhost:' + port + '/api/answers/', data)
      .then((res) => {
      })
      .catch((error) => {
        console.error(error)
      })


    return {
      question: html.question,
      answer: html.answer,
      url: number
    }
  }
  else {
    await browser.close()
    console.log('NOTHING HAPPENED')
    return {
    }
  }

}
module.exports = run = run;