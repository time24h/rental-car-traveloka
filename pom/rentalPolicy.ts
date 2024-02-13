import { Page, Locator, expect } from '@playwright/test';

export class RentalPolicyPage {
	readonly page: Page;
	readonly heading_SelectRentalPolicy: Locator;
	readonly pickUp_Location: Locator;
	readonly dropOff_Location: Locator;

	constructor(page: Page) {
		this.page = page;
		this.heading_SelectRentalPolicy = page.getByRole('heading', { name: 'Rental Policy' });
		this.pickUp_Location = this.page.locator('#RENTAL_PICKUP_LOCATION');
		this.dropOff_Location = this.page.locator('#RENTAL_DROPOFF_LOCATION');
	}

	async verify_HeadingRentalPolicy() {
		await this.heading_SelectRentalPolicy.waitFor({ state: 'visible' });
		await expect(this.heading_SelectRentalPolicy).toBeVisible();
	}

	async select_PickUpLocation(naming: string) {
		await this.pickUp_Location.getByRole('radio', { name: naming }).check();
	}

	async select_DropOffLocation(naming: string) {
		const enabled = await this.dropOff_Location.isEnabled();
		expect(enabled).toBeTruthy();
		await this.dropOff_Location.getByRole('radio', { name: naming }).check();
	}

	async verify_OtherLocations_NotChecked() {
		await expect(this.pickUp_Location.getByRole('radio', { name: 'Rental Office' })).toBeChecked();
		await expect(this.pickUp_Location.getByRole('radio', { name: 'Other Locations' })).not.toBeChecked();
	}

	async verify_RentalOffice_NotChecked() {
		await expect(this.dropOff_Location.getByRole('radio', { name: 'Other Locations' })).toBeChecked();
		await expect(this.dropOff_Location.getByRole('radio', { name: 'Rental Office' })).not.toBeChecked();
	}

	async select_Dropdown_PickUp(index: number) {
		const dropdownMenu = this.pickUp_Location.locator('div[style="transition-duration: 0s;"]', { hasText: 'Rental Office' });

		await dropdownMenu.getByText('Rental Office', { exact: true }).first().click();
		await this.page.waitForTimeout(500);
		await this.pickUp_Location.locator('div').filter({ hasText: 'SEE MAP' }).nth(index).click();
	}

	async select_Dropdown_DropOff(index: number) {
		const dropdownMenu = this.dropOff_Location.locator('div[style="transition-duration: 0s;"]', { hasText: 'Rental Office' });

		await dropdownMenu.getByText('Rental Office', { exact: true }).click();
		await this.page.waitForTimeout(500);
		await this.pickUp_Location.locator('div').filter({ hasText: 'SEE MAP' }).nth(index).click();
	}

	async fill_locationAddress(place: string) {
		await this.dropOff_Location.getByPlaceholder('Search location or address').pressSequentially(place, { delay: 100 });
		await this.page.getByRole('heading', { name: place, exact: true }).waitFor({ state: 'attached' });
		await this.page.getByRole('heading', { name: place }).click();
	}

	async click_Continue() {
		await this.page.getByRole('button', { name: 'Continue' }).first().click();
	}
}
