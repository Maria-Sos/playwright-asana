const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');

const credentials = {
    userName: process.env.USER_NAME,
    password: process.env.PASSWORD
};

const locators = {
  header: 'h1',
  column: (name) => `.BoardBody-columnDraggableItemWrapper:has-text("${name}")`,
  card: (title) => `.BoardCardLayout-contentAboveSubtasks .BoardCardLayout-titleAndIndicator .BoardCardLayout-title .TypographyPresentation--m.BoardCard-taskName:text("${title}")`
} ;

const testCases = [
  {
    "id": 1,
    "name": "Test Case 1",
    "leftNav": "Cross-functional project plan, Project",
    "column": "To do",
    "card_title": "Draft project brief",
  },
  {
    "id": 2,
    "name": "Test Case 2",
    "leftNav": "Cross-functional project plan, Project",
    "column": "To do",
    "card_title": "Schedule kickoff meeting",
  },
  {
    "id": 3,
    "name": "Test Case 3",
    "leftNav": "Cross-functional project plan, Project",
    "column": "To do",
    "card_title": "Share timeline with teammates",
  },
  {
    "id": 4,
    "name": "Test Case 4",
    "leftNav": "Work Requests",
    "column": "New Requests",
    "card_title": "[Example] Laptop setup for new hire",
  },
  {
    "id": 5,
    "name": "Test Case 5",
    "leftNav": "Work Requests",
    "column": "In Progress",
    "card_title": "[Example] Password not working",
  },
  {
    "id": 6,
    "name": "Test Case 6",
    "leftNav": "Work Requests",
    "column": "Completed",
    "card_title": "[Example] New keycard for Daniela V",
  }
];

test.describe('Asana Data-Driven Tests', () => {
  // Logout after each test:
  test.afterEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.logout(page);
  });

  testCases.forEach((testCases) => {
    test(`${testCases.name}`, async ({ page }) => {
      await test.step('Login to Asana', async () => {
        const loginPage = new LoginPage(page);
        await loginPage.navigate();
        await loginPage.login(credentials.userName, credentials.password);
      });

      await test.step('Navigate to the project page', async () => {
        await page.getByText(testCases.leftNav).click();
        await page.locator(locators.header).waitFor(() => {
          expect(page.locator(locators.header)).toHaveText(testCases.leftNav);
        });
      });

      await test.step('Verify the card is within the right column', async () => {
        const column = await page.locator(locators.column(testCases.column));
        const taskNameLocator = await column.locator(locators.card(testCases.card_title));
        const isElementInColumn = await taskNameLocator.count() > 0;
        expect(isElementInColumn).toBe(true);
      });
      
    });
  });
});
