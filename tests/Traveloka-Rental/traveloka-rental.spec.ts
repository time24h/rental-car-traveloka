import { test, expect } from '@playwright/test';
import { faker, tr } from '@faker-js/faker';
import { NavigatePage } from '../../pom/navigate';
import { RentalPage } from '../../pom/rental';
import { RentalDriverPage } from '../../pom/rentalDriver';
import { RentalPolicyPage } from '../../pom/rentalPolicy';
import { ContactDetailPage } from '../../pom/contactDetail';
import { RentalRequitment } from '../../pom/rentalReqrutiment';
import { Screenshot } from '../../pom/Screenshot';

let navigate: NavigatePage;
let rental: RentalPage;
let rental_WithoutDriver: RentalDriverPage;
let rental_Policy: RentalPolicyPage;
let contactDetail: ContactDetailPage;
let rentalReqruitment: RentalRequitment;
let screenShot: Screenshot;

test.beforeEach(async ({ page }) => {
	navigate = new NavigatePage(page);
	rental = new RentalPage(page);
	rental_WithoutDriver = new RentalDriverPage(page);
	rental_Policy = new RentalPolicyPage(page);
	contactDetail = new ContactDetailPage(page);
	rentalReqruitment = new RentalRequitment(page);
	screenShot = new Screenshot(page);

	await navigate.visitHomePage();
	await navigate.selectProduct('Car Rental');
});

test('User can select car rental until payment', async ({ page }) => {
	const city: string = 'Jakarta';
	const otherCity: string = 'South Jakarta';

	// select location
	await rental.selectRental('Without Driver');
	await rental.verify_WithDriver_NotChecked();
	await rental.click_Location();
	await rental.fill_Location(city);

	// select rental for start date & end date
	await rental.select_StartDate('15');
	await rental.select_EndDate('17');
	await rental.change_EndTime('11', '0');
	await screenShot.takeScreenshot('01-select_location_start_end');
	await rental.click_btnSearch();

	// Redirect to car rental without driver & Check Title here
	await rental_WithoutDriver.verify_HeadingWithoutDriver();
	await screenShot.takeScreenshot('02-select_car');
	await rental_WithoutDriver.select_ListCar(0);

	// Select Rental Provider
	await rental_WithoutDriver.verify_HeadingSelectRental();
	await screenShot.takeScreenshot('03-select_car_provider');
	await rental_WithoutDriver.select_RentalProvider(0);

	// Rental Policy
	await rental_Policy.verify_HeadingRentalPolicy();
	// - Pick-up Location -> Rental Office
	await rental_Policy.select_PickUpLocation('Rental Office');
	await rental_Policy.verify_OtherLocations_NotChecked();
	await rental_Policy.select_Dropdown_PickUp(1);
	await screenShot.takeScreenshot('04-select_pickup_location_rentalOffice');

	// - Drop-Off Location -> Other Locations
	await rental_Policy.select_DropOffLocation('Other Locations');
	await rental_Policy.verify_RentalOffice_NotChecked();
	await rental_Policy.fill_locationAddress(otherCity);
	await rental_Policy.click_Continue();
	await screenShot.takeScreenshot('05-select_dropOff_location_otherLocation');

	// Contact Details
	await contactDetail.verify_HeadingYourBooking();
	await contactDetail.input_fullName_contactDetail(faker.person.firstName());
	await contactDetail.input_phoneNumber_contactDetail('812345678');
	await contactDetail.input_Email_contactDetail(faker.internet.email());
	await contactDetail.click_save_contactDetail();
	await screenShot.takeScreenshot('06-contact_details');

	// Driver Details
	await contactDetail.select_title_driverDetail('Mr.');
	await contactDetail.input_fullName_driverDetail(faker.person.firstName());
	await contactDetail.input_phoneNumber_driverDetail('812345679');
	await contactDetail.click_save_driverDetail();
	await screenShot.takeScreenshot('07-driver_details');
	await contactDetail.click_btn_continue();

	// Rental Requiretments check
	await rentalReqruitment.click_Reqruitment();
	await rentalReqruitment.checkAll_Reqruitment();
	await rentalReqruitment.click_btn_continue();
	await screenShot.takeScreenshot('08-are_u_booking');
	await rentalReqruitment.are_u_booking('Continue');

	// payment
	await page.waitForRequest('https://www.traveloka.com/api/v2/payment/transactionstatus');

	const paymentHeading = page.getByRole('heading', { name: 'Payment', exact: true });
	if (await paymentHeading.isVisible()) {
		await page.getByTestId('paymentOption-TRANSFER').waitFor();
		await screenShot.takeScreenshot('09-payment_Bank');
		await page.getByTestId('paymentOption-TRANSFER').click();
		await page.getByRole('button', { name: 'Pay with Bank Transfer' }).first().click();
		await page.getByTestId('paymentInstructionContainer').waitFor();
		expect(await page.getByTestId('paymentInstructionContainer').textContent()).toContain(
			'Payment instructions have been sent to your email.'
		);
	} else {
		await page.getByRole('button', { name: 'Pay with BCA Transfer' }).waitFor();
		await screenShot.takeScreenshot('09-payment_BCA');
		await page.getByRole('button', { name: 'Pay with BCA Transfer' }).click();
		await page.waitForRequest('https://www.traveloka.com/api/v2/payment/invoicerendering');
		const success = page.locator('[class="css-1dbjc4n r-1awozwy r-18u37iz r-xyw6el"]', {
			has: page.locator('[data-id="IcSystemStatusOkDoneFill16"]'),
		});
		await success.waitFor();
		await expect(success).toBeVisible();
		expect(await success.textContent()).toContain('Check your email');
		await screenShot.takeScreenshot('11-success');
	}
});
