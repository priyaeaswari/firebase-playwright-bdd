import { expect } from '@playwright/test';
import { Given, When, Then } from '../fixtures/fixtures';
import { generateFormData } from '../utils/testData';

Given('I am logged in', async ({ loginPage }) => {
  await loginPage.goto();
  await loginPage.enterEmail(process.env.TEST_EMAIL!);
  await loginPage.enterPassword(process.env.TEST_PASSWORD!);
  await loginPage.clickLoginAndCaptureAuth();
  await expect(loginPage.page.getByText('Logout', { exact: true })).toBeVisible();
});

When('I fill in the form with valid details', async ({ homePage }) => {
  const data = generateFormData();
  console.log('Test data:', data);
  await homePage.fillForm(data);
});

When('I click the submit button', async ({ homePage }) => {
  await homePage.clickSubmit();
});

Then('the form should be submitted successfully', async ({ homePage }) => {
  // TODO: depends on what the page shows after Submit
});