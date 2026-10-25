import { expect } from '@playwright/test';
import { Given, When, Then } from '../fixtures/fixtures';

Given('I am on the login page', async ({ loginPage }) => {
  await loginPage.goto();
});

When('I enter a valid email and password', async ({ loginPage }) => {
  await loginPage.enterEmail(process.env.TEST_EMAIL!);
  await loginPage.enterPassword(process.env.TEST_PASSWORD!);
});

When('I enter email {string} and password {string}', async ({ loginPage }, email, password) => {
  const actualEmail = email === 'VALID_EMAIL' ? process.env.TEST_EMAIL! : email;
  await loginPage.enterEmail(actualEmail);
  await loginPage.enterPassword(password);
});

When('I click on the login button', async ({ loginPage }) => {
  await loginPage.clickLoginAndCaptureAuth();
});

Then('I should be logged in successfully', async ({ loginPage }) => {
  expect(loginPage.authStatus).toBe(200);
  await expect(loginPage.page.getByText('Logout', { exact: true })).toBeVisible();
});

Then('I should not be able to login', async ({ loginPage }) => {
  if (loginPage.authStatus !== undefined) {
    // The server was called, so it must have rejected the login
    expect(loginPage.authStatus).toBe(400);
  }
  // Either way, the user must still be on the login page
  await loginPage.expectOnLoginPage();
});