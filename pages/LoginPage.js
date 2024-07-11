const { expect } = require('@playwright/test');

class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('input.LoginEmailForm-emailInput');
    this.userNameBunner = page.getByRole('banner')
    this.passwordInput = page.locator('input.LoginPasswordForm-passwordInput');
    this.continueButton = page.locator('.LoginButton');
    this.loginButton = page.locator('div.LoginButton[role="button"]');
    this.homeheader = page.locator('h1');
    this.avatarMenu = page.locator('div.ThemeableRectangularButtonPresentation--withNoLabel.TopbarSettingsMenuButton');
    this.menu = page.locator('div.GlobalTopbarUserMenu');
    this.logoutBtn = page.locator('div[role="menuitem"]:has-text("Log out")');
    this.loginForm = page.locator('.LoginEmailForm')
  }

  async navigate() {
	  await this.page.goto('/');
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.continueButton.click();
    await this.page.getByText('Welcome to Asana').waitFor();
    await expect(this.userNameBunner).toHaveText(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.homeheader.waitFor(() => {
      expect(this.homeheader).isVisible();
    });
  }

  async logout() {
    await this.avatarMenu.click();
    await this.menu.waitFor();
    await this.logoutBtn.click();
    await this.page.getByText('Welcome to Asana').waitFor();
    await  expect(this.loginForm).toBeVisible();
  }
}

module.exports = LoginPage;