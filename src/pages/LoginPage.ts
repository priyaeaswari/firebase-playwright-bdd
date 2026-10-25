import{Page,Locator,expect} from '@playwright/test';
export class LoginPage{
    readonly page: Page;
    readonly emailInput:Locator;
    readonly passwordInput:Locator;
    readonly loginButton:Locator;
    authStatus?: number;
    constructor(page:Page){
        this.page=page;
        this.emailInput=page.getByPlaceholder("Email...");
        this.passwordInput=page.getByPlaceholder("Password...");
        this.loginButton=page.getByRole('button',{name:"Login to Account"});
    }
    async goto(){
        await this.page.goto('/home.html');
    }
    async enterEmail(email:string){
        await this.emailInput.fill(email);
    }
    async enterPassword(password:string){
        await this.passwordInput.fill(password);
    }
    async clickLogin(){
        await this.loginButton.click();
    }
    async clickLoginAndCaptureAuth() {
  // Start listening, but give up after 5s instead of failing the test
  const responsePromise = this.page
    .waitForResponse(res => res.url().includes('verifyPassword'), { timeout: 5000 })
    .catch(() => null);   // no API call → null

  await this.loginButton.click();

  const response = await responsePromise;
  this.authStatus = response?.status();   // undefined if no call was made
}
    async expectOnLoginPage(){
        await expect(this.loginButton).toBeVisible();
    }

}