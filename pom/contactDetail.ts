import { Page, Locator, expect } from '@playwright/test';

export class ContactDetailPage {
	readonly page: Page;
	headingBooking: Locator;
	contactDetail: Locator;
	driverDetail: Locator;

	constructor(page: Page) {
		this.page = page;
		this.headingBooking = this.page.getByRole('heading', { name: 'Your Booking' });
		this.contactDetail = this.page.locator('div', {
			hasText: 'Mobile Number',
		});
		this.driverDetail = this.page.locator('div', {
			has: page.locator('#adultForm0'),
		});
	}

	async verify_HeadingYourBooking() {
		await this.headingBooking.waitFor({ state: 'visible' });
		await expect(this.headingBooking).toBeVisible();
	}

	/**
	 *
	 * Form for Contact Details
	 *
	 */
	async input_fullName_contactDetail(name: string) {
		await this.contactDetail.getByLabel('Full Name*').first().fill(name);
	}

	async input_phoneNumber_contactDetail(phone: string) {
		await this.contactDetail.getByLabel('Phone Number').first().fill(phone);
	}

	async input_Email_contactDetail(email: string) {
		await this.contactDetail.getByLabel('Email*').fill(email);
	}

	async click_save_contactDetail() {
		const editDetails = this.contactDetail.getByRole('button', { name: 'Edit Details' });

		await this.contactDetail.getByRole('button', { name: 'Save' }).first().click();
		await editDetails.waitFor({ state: 'visible' });
		await expect(editDetails).toBeVisible();
	}

	async select_title_driverDetail(title: string) {
		await this.driverDetail.getByLabel('Title*').getByRole('combobox').selectOption({ label: title });
	}

	async input_fullName_driverDetail(fullName: string) {
		await this.driverDetail.getByLabel('Full Name*').fill(fullName);
	}

	async input_phoneNumber_driverDetail(phone: string) {
		await this.driverDetail.getByLabel('Phone Number').fill(phone);
	}

	async click_save_driverDetail() {
		await this.driverDetail.getByRole('button', { name: 'Save' }).first().click();
	}

	async click_btn_continue() {
		await this.page.getByRole('button', { name: 'Continue' }).click();
	}
}
