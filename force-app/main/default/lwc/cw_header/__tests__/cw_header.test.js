import { createElement } from "lwc";
import Cw_header from "c/cw_header";

describe("c-cw-header", () => {
	afterEach(() => {
		while (document.body.firstChild) {
			document.body.removeChild(document.body.firstChild);
		}
	});

	it("display header", () => {
		// Arrange
		const element = createElement("c-cw-header", {
			is: Cw_header
		});

		// Act
		document.body.appendChild(element);

		// Assert
		const div = element.shadowRoot.querySelector('.slds-text-heading_large');
		expect(div.textContent).toBe('Config Workbook');
	});
});
