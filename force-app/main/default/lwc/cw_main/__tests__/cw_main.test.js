import { createElement } from "@lwc/engine-dom";
import Cw_main from "c/cw_main";
import { SpreadsheetGenerator } from 'c/cw_spreadsheetGenerator';

jest.mock(
  "@salesforce/apex/CW_ToolingApiService.getMetadataCallout", 
  () => {
    const { createApexTestWireAdapter } = require("@salesforce/sfdx-lwc-jest");
      return {
          default: createApexTestWireAdapter(jest.fn())
      };
  },
  { virtual: true }
);

describe("c-cw-main", () => {
  async function flushPromises() {
    return Promise.resolve();
  }

  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("should contain header", () => {
    // Arrange
    const element = createElement("c-cw-main", {
      is: Cw_main
    });

    // Act
    document.body.appendChild(element);

    // Assert
    const header = element.shadowRoot.querySelector('c-cw_header');
    expect(header).not.toBe(null);
  });

  it("onclick handle: should call SpreadsheetGenerator.createSpreadsheet", async () => {
    // Arrange
    const element = createElement("c-cw-main", {
      is: Cw_main
    });
    document.body.appendChild(element);

    const spy = jest.spyOn(SpreadsheetGenerator.prototype, 'createSpreadsheet');

    // Act
    element.shadowRoot.querySelector('.button_generate').click();
    await flushPromises();

    // Assert
    expect(spy).toHaveBeenCalled();
  });
});
