import { LightningElement } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import { SpreadsheetGenerator } from 'c/cw_spreadsheetGenerator';

const generator = new SpreadsheetGenerator();

export default class Cw_main extends NavigationMixin(LightningElement) {
  handleClick() {
    generator.createSpreadsheet(['limits', 'allobjects']);
  }
}
