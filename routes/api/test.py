import pychrome
import codecs
import requests
import sys
from bs4 import BeautifulSoup

browser = pychrome.Browser(url="http://23.22.197.98:5351")
tab = browser.new_tab()


tab.start()
tab.call_method("Network.enable")
tab.call_method("Page.enable")

tab.call_method("Network.setUserAgentOverride",
                userAgent="Mozilla/5.0 (X11; Linux x86_64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36")

scripts = [
    """
(() => {
Object.defineProperty(navigator, 'webdriver', {
  get: () => false,
});
})()
""",
    """
(() => {
// We can mock this in as much depth as we need for the test.
window.navigator.chrome = {
  runtime: {},
  // etc.
};
})()
""",
    """
(() => {
const originalQuery = window.navigator.permissions.query;
return window.navigator.permissions.query = (parameters) => (
  parameters.name === 'notifications' ?
    Promise.resolve({ state: Notification.permission }) :
    originalQuery(parameters)
);
})()
""",
    """
(() => {
// Overwrite the `plugins` property to use a custom getter.
Object.defineProperty(navigator, 'plugins', {
  // This just needs to have `length > 0` for the current test,
  // but we could mock the plugins too if necessary.
  get: () => [1, 2, 3, 4, 5],
});
})()
""",
    """
(() => {
// Overwrite the `plugins` property to use a custom getter.
Object.defineProperty(navigator, 'languages', {
  get: () => ['en-US', 'en'],
});
})()
"""
]
for s in scripts:
    tab.call_method("Page.addScriptToEvaluateOnNewDocument", source=s)

  
url = "https://www.chegg.com/homework-help/questions-and-answers/-q"+sys.argv[1]
port = sys.argv[2]
tab.call_method("Page.navigate", url=url, _timeout=5)
tab.wait(.5)

try:

    el = tab.Runtime.evaluate(
        expression="document.getElementsByClassName('dialog-question')[0].innerHTML")
    html = (el['result'])['value']

    soup = BeautifulSoup(html, 'html.parser')

    question = soup.find(class_='ugc-base question-body-text')

    answer = soup.find(class_='answer-given-body ugc-base')

    data = {'question': str(question),
            'answer': str(answer),
            'url': sys.argv[1]
            }

    r = requests.post('http://localhost:'+port+'/api/answers', json=data)
finally:
    tab.stop()
    browser.close_tab(tab)
