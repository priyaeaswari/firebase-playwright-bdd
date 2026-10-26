import { Page, Locator } from '@playwright/test';

export class IntractionsPage {
  readonly page: Page;
  readonly navbar: Locator;
  readonly dragItem: Locator;
  readonly dropArea: Locator;
  dialogMessage?: string;
  private activeDropdown?: Locator;    // the menu that is currently open

  constructor(page: Page) {
    this.page = page;
    this.navbar = page.locator('.navbar');
    this.dragItem = page.locator('#drag1');   // TODO
    this.dropArea = page.locator('#div1').first();   // TODO
  }

  // The container around a menu button (the button's parent element)
  private dropdownFor(buttonName: string, scope: Page | Locator = this.page): Locator {
    return scope.getByRole('button', { name: buttonName, exact: true }).locator('..');
  }

  // ---------- Top menu (nav bar) ----------
  async openMenu(menuName: string) {
    this.activeDropdown = this.dropdownFor(menuName, this.navbar);
    await this.activeDropdown.getByRole('button').hover();
  }

  async openFromMenu(option: string, menuName: string) {
    await this.openMenu(menuName);
    await this.menuOption(option).click();
  }

  // An option inside the menu that is open (falls back to the whole page)
  menuOption(name: string): Locator {
    const scope = this.activeDropdown ?? this.page;
    return scope.getByText(name, { exact: true });
  }

  // ---------- Mouse Hover page ----------
  async hoverButton(name: string) {
    this.activeDropdown = this.dropdownFor(name);
    await this.activeDropdown.getByRole('button').hover();
  }

  async clickOption(name: string) {
    this.page.once('dialog', async dialog => {
      this.dialogMessage = dialog.message();
      await dialog.accept();
    });
    await this.menuOption(name).click();
  }

  // ---------- Drag & Drop page ----------
  async dragItemToDropArea() {
    await this.dragItem.dragTo(this.dropArea);
  }
}