import{test as base,createBdd} from 'playwright-bdd';
import{LoginPage} from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage'; 
import{IntractionsPage} from '../pages/IntractionsPage';
type MyFixtures={
    loginPage: LoginPage;
    homePage: HomePage;
    intractionPage: IntractionsPage;
}
export const test=base.extend<MyFixtures>({
    loginPage: async({page}, use)=>{
        const loginPage= new LoginPage(page);
        await use(loginPage);
    },
    homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  intractionPage:async({page},use)=>{
    await use(new IntractionsPage(page));
  }
});
export const{Given, When, Then }=createBdd(test);
