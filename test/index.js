const assert = require('assert').strict;
const test = require('selenium-webdriver/testing');
const { Builder, By, until } = require('selenium-webdriver');
const Chrome = require('selenium-webdriver/chrome');

const URL = 'http://localhost:1234';
let browser;

// Helper functions
const sleep = (ms = 0) => new Promise(resolve => setTimeout(() => resolve(), ms));

async function clickLink(target) {
  const $el = await browser.wait(until.elementLocated(By.linkText(target)), 5000);
  return $el.click();
}

async function assertUrl(target) {
  const url = await browser.getCurrentUrl();
  assert.equal(url, `${URL}${target}`);
}

async function assertH1(target) {
  const $el = await browser.wait(until.elementLocated(By.css('h1')), 5000);
  const text = await $el.getText();
  assert.equal(text, target);
}

async function assertTitle(target) {
  const title = await browser.getTitle();
  assert.equal(title, `CakeStocks | ${target}`);
}

// Test go login
// Test go register
// Test change amount on home
// Test add balance
// Test buy one of something
// Test sell one of something
// Test 404 page?

test.describe('Page', () => {
  // Hooks
  test.beforeEach(async function () {
    this.timeout(20000);

    const builder = new Builder().forBrowser('chrome');
    builder.setChromeOptions(new Chrome.Options().headless());

    browser = await builder.build();
    await browser.get(URL);
  });
  test.afterEach(() => browser.quit());

  // Test cases
  test.it('Test go to register page', async function () {
    this.timeout(10000);
    await clickLink('Registrera');
    await sleep(500);
    await assertH1('Registrera konto');
    await assertTitle('Registrera');
    await assertUrl('/register');
  });

  test.it('Test go to login', async function () {
    this.timeout(10000);
    await clickLink('Login');
    await sleep(500);
    await assertH1('Login');
    await assertTitle('Login');
    await assertUrl('/login');
  });

  test.it('Test login and add balance', async function () {
    this.timeout(20000);
    await clickLink('Login');
    await sleep(500);
    await assertH1('Login');
    await assertTitle('Login');
    await assertUrl('/login');

    const $form = await browser.findElement(By.css('form'));
    const $email = await $form.findElement(By.name('email'));
    const $password = await $form.findElement(By.name('password'));

    await $email.sendKeys('test@test.com');
    await $password.sendKeys('Bananbr0d');
    await $form.submit();

    // Wait until form has been submitted properly
    await browser.wait(until.urlIs(URL), 10000);
    await assertTitle('Hem');
    await assertUrl('/');
  });

  /*test.it('Test login and buy item', async function () {

  });

  test.it('Test login and sell item', async function () {

  });*/

  /* Test cases
  test.it('Test go to register page', async function () {
    this.timeout(10000);
    await clickLink('Registrera');
    await sleep(500);
    await assertH1('Registrera konto');
    await assertTitle('Registrera');
    await assertUrl('/register');
  });

  test.it('Test go to login page', async function () {
    this.timeout(10000);
    await clickLink('Login');
    await sleep(500);
    await assertH1('Login');
    await assertTitle('Login');
    await assertUrl('/login');
  });

  test.it('Test go to first report', async function () {
    this.timeout(10000);
    await clickLink('Rapporter');
    await assertH1('Rapporter');
    await assertTitle('Rapporter');
    await assertUrl('/reports');

    // Click report for week 1
    await clickLink('Rapport vecka 1');
    await sleep(500);
    await assertH1('Rapport vecka 1');
    await assertTitle('Rapport vecka 1');
    await assertUrl('/reports/week/1');
  });*/
});
