import { Page, Locator } from '@playwright/test';
import { FormData } from '../utils/testData';

export class HomePage {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly fatherNameInput: Locator;
  readonly postalAddressInput: Locator;
  readonly personalAddressInput: Locator;
  readonly pinCodeInput: Locator;
  readonly emailInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // getByPlaceholder matches part of the placeholder text, ignoring case
    this.nameInput = page.getByPlaceholder('Your name');
    this.fatherNameInput = page.getByPlaceholder('father name');
    this.postalAddressInput = page.getByPlaceholder('postal address');
    this.personalAddressInput = page.getByPlaceholder('personal address');
    this.pinCodeInput = page.getByPlaceholder('pincode');
    this.emailInput = page.getByPlaceholder('Email-ID');
    this.submitButton = page.getByRole('button', { name: 'Submit' });
  }

  async selectSex(sex: 'Male' | 'Female') {
  // TEMP: position-based until we know the radio's id/value
  const index = sex === 'Male' ? 0 : 1;
  await this.page.locator('input[type="radio"]').nth(index).check();
}
  async fillForm(data: FormData) {
    await this.nameInput.fill(data.name);
    await this.fatherNameInput.fill(data.fatherName);
    await this.postalAddressInput.fill(data.postalAddress);
    await this.personalAddressInput.fill(data.personalAddress);
    await this.selectSex(data.sex);
    // dropdowns: coming next, once we know the options
    await this.pinCodeInput.fill(data.pinCode);
    await this.emailInput.fill(data.email);
  }

  async clickSubmit() {
    await this.submitButton.click();
  }
}