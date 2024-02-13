import { Page, Locator, expect } from '@playwright/test';

export class RentalRequitment {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	async click_Reqruitment() {
		await this.page.getByText('Tap to check the requirements.').click();
	}

	async checkAll_Reqruitment() {
		await this.page
			.locator('div')
			.filter({ hasText: /^Check All$/ })
			.first()
			.click();
		await this.page.getByRole('button', { name: 'Save' }).click();
	}

	async are_u_booking(answering: string) {
		const showModalCorrectBooking = this.page.locator('div', {
			hasText: 'Are your booking details correct?',
		});

		await showModalCorrectBooking.getByRole('button', { name: answering }).click();
	}

	async click_btn_continue() {
		await this.page.getByRole('button', { name: 'Continue to Payment' }).click();
	}
}
