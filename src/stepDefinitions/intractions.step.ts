import { expect } from '@playwright/test';
import { DataTable } from 'playwright-bdd';
import { When, Then } from '../fixtures/fixtures';

When('I open the Intractions menu', async ({ intractionPage }) => {
  await intractionPage.openMenu('Intractions');
});

Then('I should see these menu options:', async ({ intractionPage }, dataTable: DataTable) => {
  for (const [option] of dataTable.raw()) {
    await expect(intractionPage.menuOption(option)).toBeVisible();
  }
});

When('I open {string} from the {string} menu', async ({ intractionPage }, option: string, menu: string) => {
  await intractionPage.openFromMenu(option, menu);
});

When('I drag the item into the drop area', async ({ intractionPage }) => {
  await intractionPage.dragItemToDropArea();
});
Then('the item should be in drop area', async ({ intractionPage }) => {
  await expect(intractionPage.dropArea.locator('#drag1')).toBeVisible();
});

When('I hover over the {string} button', async ({ intractionPage }, name: string) => {
  await intractionPage.hoverButton(name);
});

When('I click the {string} option', async ({ intractionPage }, name: string) => {
  await intractionPage.clickOption(name);
});

Then('I should see a pop-up with the message {string}', async ({ intractionPage }, message: string) => {
  await expect.poll(() => intractionPage.dialogMessage).toBe(message);
});