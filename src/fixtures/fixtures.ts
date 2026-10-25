import{test as base,createBdd} from 'playwright-bdd';
import{LoginPage} from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage'; 
type MyFixtures={
    loginPage: LoginPage;
    homePage: HomePage;
}
export const test=base.extend<MyFixtures>({
    loginPage: async({page}, use)=>{
        const loginPage= new LoginPage(page);
        await use(loginPage);
    },
    homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
});
export const{Given, When, Then }=createBdd(test);
