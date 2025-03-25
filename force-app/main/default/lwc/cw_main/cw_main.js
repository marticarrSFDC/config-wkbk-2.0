import { LightningElement } from "lwc";
import { NavigationMixin } from "lightning/navigation";

import getMetadataCallout from "@salesforce/apex/CW_ToolingApiService.getMetadataCallout";
// import createGoogleSheet from '@salesforce/apex/CW_GoogleSheetsService.createGoogleSheet';

export default class Cw_main extends NavigationMixin(LightningElement) {
  handleClick() {
    getMetadataCallout()
      .then((result) => {
        console.log(result);
        // const workbook = JSON.parse(result);
        // this[NavigationMixin.Navigate]({
        //     type: 'standard__webPage',
        //     attributes: {
        //         url: workbook.spreadsheetUrl
        //     }
        // });
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
