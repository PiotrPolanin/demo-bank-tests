# Test Automation training form jaktestowac.pl


## Links
- course https://jaktestowac.pl/course/playwright-wprowadzenie/
- test site
https://demo-bank.vercel.app/  
If link broken check first lesson for update:
https://jaktestowac.pl/lesson/pw1s01l01/


## Commands
- check `NodeJS` version    
`node -v`
- new project with Playwright:  
`npm init playwright@latest`
- record tests for given site  
`npx playwright codegen https://demo-bank.vercel.app/`
- run tests without browser GUI:  
`npx playwright test`
- run test with browser GUI:  
`npx playwright test --headed`
- viewing report  
`npx playwright show-report`
- repeating tests
`npx playwright test --repeat-each=10`


## Playwright Config modifications
- config file `playwright.config.ts`
- disabling browsers, i.e. Firefox:
    ```json
    // {
    //   name: 'firefox',
    //   use: {
    //     ...devices['Desktop Firefox'],
    //   },
    // },
    ```
- retries: process.env.CI ? 2 : 2, - powtarzanie testów

## Visual Code  
- Preview – podgląd pliku README.md (znajdziesz w prawym górnym rogu),
- Autosave – auto zapisywanie plików, które można ustawić w menu: File | Auto Save,
- Timeline – czyli historia danego pliku. Można ją podejrzeć klikając prawym klawiszem myszy na pliku (po lewej stronie w explorer) a następnie wybraniu opcji Timeline z menu kontekstowego.

## Code snippest
- test.use({
    launchOptions: {
        slowMo: 200,
    }
}); - use over test.describe, each action will be executed 200 milliseconds slower
- test.describe('Tests description', () => {})
- test.describe.configure({ retries: 2 });

await expect(page.getByLabel('selector_name')).toBeVisible();