import { Page } from '@playwright/test';

export class Screenshot {
	readonly page: Page;
	constructor(page: Page) {
		this.page = page;
	}

	async takeScreenshot(path_name: string) {
		await this.page.waitForLoadState('domcontentloaded');
		await this.page.waitForTimeout(100);
		await this.page.screenshot({ path: `./Screenshot/${path_name}.png` });
	}
}
