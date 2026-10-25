import{defineConfig, devices} from '@playwright/test';
import{defineBddConfig, cucumberReporter} from 'playwright-bdd';
import dotenv from 'dotenv';
dotenv.config();
//this is your testrunner where yout features and steps alive
const testDir=defineBddConfig({
  features:'features/**/*.feature',
  steps:['src/fixtures/**/*.ts','src/stepDefinitions/**/*.ts'],

});
export default defineConfig({
  testDir,
  timeout:30_000,
  retries:process.env.CI ? 1 : 0,
  fullyParallel:true,
  workers:process.env.CI ? 2 : 4,
  reporter:[
    ['html',{open:'never'}],
    cucumberReporter('html',{outputFile:'reports/cucumber-report.html'}),
  ['./src/utils/CustomListener.ts'],
  ['allure-playwright', { resultsDir: 'allure-results' ,
    environmentInfo: {
    Browser: 'Chromium',
    Environment: 'QA',
    BaseURL: process.env.BASE_URL,
  },
  }],
],
  
  use:{
    baseURL:process.env.BASE_URL || 'https://selenium-prd.firebaseapp.com',
    headless: process.env.CI ? true : false,
    //headless:false,
    screenshot:'only-on-failure',
    trace:'retain-on-failure',

  },
  projects:[
    {name:'chromium',use:{...devices['Desktop Chrome']}},
    //{ name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
    //{ name: 'webkit',   use: { ...devices['Desktop Safari'] } },
  
  ],


  

});