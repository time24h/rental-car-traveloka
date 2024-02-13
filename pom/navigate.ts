import { Page, Locator, expect } from '@playwright/test';

export class NavigatePage {
	readonly page: Page;
	productNav: Locator;

	constructor(page: Page) {
		this.page = page;
		this.productNav = page.getByTestId('product-nav');
	}

	async visitHomePage() {
		await this.page.goto('https://www.traveloka.com/en-id');
	}

	async selectProduct(product: string) {
		await this.productNav.getByText(product).click();
		expect(this.page.url()).toEqual('https://www.traveloka.com/en-id/car-rental');
	}
}
