import { Page, Locator, expect } from '@playwright/test';

export class RentalDriverPage {
	readonly page: Page;
	readonly heading_WithoutDriver: Locator;
	readonly heading_SelectRentalProvider: Locator;
	readonly heading_SelectRentalPolicy: Locator;
	readonly list_cardsCar: Locator;

	constructor(page: Page) {
		this.page = page;
		this.heading_WithoutDriver = page.getByRole('heading', { name: 'Car Rental Without Driver' });
		this.heading_SelectRentalProvider = page.getByRole('heading', { name: 'Select Rental Provider' });
		this.list_cardsCar = this.page.locator('div[style="padding-bottom: 0px;"]', { hasText: 'Continue' });
	}

	async verify_HeadingWithoutDriver() {
		await this.heading_WithoutDriver.waitFor({ state: 'visible' });
		await this.list_cardsCar.nth(1).waitFor({ state: 'visible' });
		await expect(this.heading_WithoutDriver).toBeVisible();
	}

	async verify_HeadingSelectRental() {
		await this.heading_SelectRentalProvider.waitFor({ state: 'visible' });
		await expect(this.heading_SelectRentalProvider).toBeVisible();
	}

	async select_ListCar(index: number) {
		try {
			await this.list_cardsCar.nth(index).waitFor({ state: 'visible' });
			await this.list_cardsCar.nth(index).getByRole('button', { name: 'Continue' }).click();
		} catch (error) {
			console.error('❌ Error during select list car : ', error);
		}
	}

	async select_RentalProvider(index: number) {
		try {
			const cardsRentalProvider = this.page.locator('div', { has: this.page.getByRole('button', { name: 'Continue' }) });
			await cardsRentalProvider.nth(index).waitFor({ state: 'visible' });
			await cardsRentalProvider.nth(index).getByRole('button', { name: 'Continue' }).first().click();
		} catch (error) {
			console.error('❌ Error during select rental provider : ', error);
		}
	}
}
