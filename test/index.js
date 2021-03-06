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

async function assertTitle(target) {
  const title = await browser.getTitle();

  assert.equal(title, `CakeStocks | ${target}`);
}

async function login() {
  await clickLink('Login');
  await sleep(500);
  await assertTitle('Login');
  await assertUrl('/login');

  const $form = await browser.findElement(By.css('form'));
  const $email = await $form.findElement(By.name('email'));
  const $password = await $form.findElement(By.name('password'));

  await $email.sendKeys('test@test.com');
  await $password.sendKeys('Bananbr0d');
  await $form.submit();

  // Wait until form submitted fully
  await browser.wait(until.elementLocated(By.css('h2')));
  //await browser.wait(until.titleIs('CakeStocks | Hem'), 5000);
  await assertTitle('Hem');
  await assertUrl('/');
}

async function getText(css, parent = null) {
  const $root = parent || browser;
  const $el = await $root.findElement(By.css(css));

  return $el.getText();
}

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
  test.it('Test go to login', async function () {
    this.timeout(10000);
    await login();
  });

  test.it('Test go to register page', async function () {
    this.timeout(10000);
    await clickLink('Registrera');
    await assertTitle('Registrera');
    await assertUrl('/register');
  });

  test.it('Test login and add balance', async function () {
    this.timeout(20000);
    await login();

    const oldBalance = await getText('.balance');

    await clickLink('Betalmedel');

    const $form = await browser.wait(until.elementLocated(By.css('form')), 5000);
    const $amount = await $form.findElement(By.css('input[type=number]'));
    await $amount.sendKeys(50);
    await $form.submit();

    // Wait until form has been submitted properly
    await browser.wait(until.elementLocated(By.css('h2')));
    await assertTitle('Hem');
    await assertUrl('/');

    const newBalance = await getText('.balance');
    assert.ok(oldBalance != newBalance);
  });

  test.it('Test login and buy item', async function () {
    this.timeout(20000);
    await login();

    const $card = await browser.findElement(By.css('.card'));
    const oldAmount = await getText('.amount', $card);
    const $btn = await $card.findElement(By.css('button.solid'));

    await $btn.click();
    await sleep(1000);

    const newAmount = await getText('.amount', $card);

    assert.ok(oldAmount != newAmount);
  });

  test.it('Test login and sell item', async function () {
    this.timeout(20000);
    await login();

    const $card = await browser.findElement(By.css('.card'));
    const oldAmount = await getText('.amount', $card);
    const $btn = await $card.findElement(By.css('button'));

    await $btn.click();
    await sleep(1000);

    const newAmount = await getText('.amount', $card);

    assert.ok(oldAmount != newAmount);
  });
});
