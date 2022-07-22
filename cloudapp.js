/*
cloudapp.js

Author:
jermaine clarke
QA Architect / QA Engineer
mainotaku@gmail.com
*/

const puppeteer = require('puppeteer');
const { dirname } = require('path');

(async function main() {


    const browser = await puppeteer.launch({headless: false, defaultViewport: null}); //show browser
    
    var page = await browser.newPage();

    //login
    await login("automation720@yopmail.com","Test1234!");

    //change avatar
    await updateAvatar('mickey-mouse.jpeg');
    
    await gotodashboard();

    //logout
    await logout();
    
    //signup
    let testemail = generateEmail();
    await signup(testemail, "Test1234!");

    await browser.close();


    /*
    
    //additional test scenarios
    
    login("automation999@yopmail.com","Test1234!"); //wrong email
    login("automation720@yopmail.com","Test5678!"); //wrong password
    login("automation720@yopmail.com",""); //missing password

    updateAvatar('toolarge.png'); //wrong file size

    signup("erroremail@", "Test1234!"); //invalid email
    signup("automation720@yopmail.com", "Test1234!"); //existing account

    */



    async function login(email, password){
        var appurl = 'https://share.getcloudapp.com/login';
        await page.goto(appurl);
        await (await page.waitForSelector('#email')).type(email);
        await (await page.waitForSelector('#password')).type(password);
        await page.keyboard.press("Enter");
    }


    async function logout(){
        await (await page.waitForSelector('#main-menu')).click();
        await (await page.waitForSelector('[data-testid="dropdown-link-sign_out"]')).click(); 
    }

    async function signup(email, password){
        console.log("creating account: ",email,password);
        var appurl = 'https://getcloudapp.com';
        await page.goto(appurl);
        const [downloadButton] = await page.$x("//span[contains(., 'Download Free')]");
        await downloadButton.click();
        await (await page.waitForSelector('#email')).type(email);
        await (await page.waitForSelector('#password')).type(password);
        await page.keyboard.press("Enter");
    }
    
    async function gotodashboard(){
        var appurl = 'https://share.getcloudapp.com/dashboard';
        await page.goto(appurl);
    }

    async function updateAvatar(filename){
        await (await page.waitForSelector('#main-menu')).click();
        await (await page.waitForSelector('[data-testid="dropdown-link-settings"]')).click(); 
        await page.waitForTimeout(2000);
        const fileUpload = await page.$("input[type=file]");
        const appDir = dirname(require.main.filename);
        let filepath = appDir+'/'+filename;
        //let filepath = appDir+'/mickey-mouse.jpeg';
        await fileUpload.uploadFile(filepath);
        await (await page.waitForSelector('[data-testid="onboarding-submit-about-you-form"]')).click(); 
        await page.waitForTimeout(3000);
    }
    

}
)();


function getRandomInt(max) {return Math.floor(Math.random() * max);}

function generateString(length) {
    let result = '';
    const characters ='0123456789';
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

function generateEmail(){
    email = "automation"+generateString(5)+'@yopmail.com';
    return email;
}

