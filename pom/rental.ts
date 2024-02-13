import { Page, Locator, expect } from '@playwright/test';

export class RentalPage {
	readonly page: Page;
	readonly productNav: Locator;
	readonly inputLocation: Locator;
	readonly listSearchLocation: Locator;
	readonly listSearchItem: Locator;

	constructor(page: Page) {
		this.page = page;
		this.inputLocation = page.getByPlaceholder('Enter city or region');
		this.listSearchLocation = page.locator('div[data-testid="rental-search-form-location-container"]');
		this.listSearchItem = page.locator('[data-testid="rental-search-form-location-item"] h3');
	}

	/**
	 *
	 * @param option : select rental has 2 radio button
	 * Without Driver & With Driver
	 */
	async selectRental(option: string) {
		await this.page.getByRole('radio', { name: option }).check();
	}

	/**
	 * Assertion radio button for car rental
	 */
	async verify_WithDriver_NotChecked() {
		await expect(this.page.getByRole('radio', { name: 'Without Driver' })).toBeChecked();
		await expect(this.page.getByRole('radio', { name: 'With Driver' })).not.toBeChecked();
	}

	/**
	 * Click Location
	 * Your Rental location
	 */
	async click_Location() {
		await this.inputLocation.click();
	}

	/**
	 *
	 * @param place : Please input place location for your rental
	 */
	async fill_Location(place: string) {
		try {
			await this.inputLocation.pressSequentially(place, { delay: 100 });
			await this.listSearchLocation.waitFor({ state: 'visible' });

			for (const item of await this.listSearchItem.all()) {
				await this.page.waitForTimeout(1000);
				const searchText = await item.textContent();
				if (searchText?.includes('Jakarta')) {
					await item.click();
					expect(await this.inputLocation.inputValue()).toEqual(place);
					break;
				}
			}
		} catch (error) {
			console.error('Error during fill location ❌ : ', error);
		}
	}

	/**
	 *
	 * @param startDate :  Please input Rental Start Date
	 */
	async select_StartDate(startDate: string) {
		await this.page.getByTestId('rental-search-form-date-input-start').click();
		await this.page
			.locator(`.css-1dbjc4n [data-testid="date-cell-${startDate}-2-2024"]`)
			.first()
			.filter({ hasText: `${startDate}` })
			.waitFor();
		await this.page
			.locator(`.css-1dbjc4n [data-testid="date-cell-${startDate}-2-2024"]`)
			.first()
			.filter({ hasText: `${startDate}` })
			.click();
		await expect(this.page.getByTestId('rental-search-form-date-input-start')).toHaveValue(`${startDate} February 2024`);
	}

	/**
	 *
	 * @param endDate : Please input Rental End Date
	 */
	async select_EndDate(endDate: string) {
		await this.page.getByTestId('rental-search-form-date-input-end').click();
		await this.page
			.locator(`.css-1dbjc4n [data-testid="date-cell-${endDate}-2-2024"]`)
			.first()
			.filter({ hasText: `${endDate}` })
			.waitFor();
		await this.page
			.locator(`.css-1dbjc4n [data-testid="date-cell-${endDate}-2-2024"]`)
			.nth(1)
			.filter({ hasText: `${endDate}` })
			.click();
		await expect(this.page.getByTestId('rental-search-form-date-input-end')).toHaveValue(`${endDate} February 2024`);
	}

	async change_EndTime(hour: string, minute: string) {
		await this.page.getByTestId('rental-search-form-time-input-end').waitFor();
		await this.page.getByTestId('rental-search-form-time-input-end').click();

		const hours = this.page.locator('[class="css-1dbjc4n r-1l31rp8 r-kdyh1x r-rs99b7 r-key0ze r-1udh08x"]').first();
		const minutes = this.page.locator('[class="css-1dbjc4n r-1l31rp8 r-kdyh1x r-rs99b7 r-key0ze r-1udh08x"]').last();

		await hours.getByText(hour, { exact: true }).click();
		await minutes.getByText(minute, { exact: true }).first().click();
		await this.page.getByRole('button', { name: 'Done' }).click();
	}

	async click_btnSearch() {
		await this.page.waitForTimeout(2000);
		await this.page.getByTestId('rental-search-form-cta').click();
	}
}
