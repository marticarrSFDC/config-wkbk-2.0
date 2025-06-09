import { BaseProcessor } from "./baseProcessor";
import getApprovalProcesses from "@salesforce/apex/CW_ToolingApiService.getApprovalProcesses";

const HEADER_1 = ['Approval Processes', '', '', ''];
const HEADER_2 = ['Object Name', 'Name', 'Order', 'Description'];

class ApprovalsProcessor extends BaseProcessor {
	async _populateApprovalProcessesSheet() {
		return this._populateSheet([getApprovalProcesses()]);
	}

	async buildTable() {
		const [metadata] = await this._populateApprovalProcessesSheet();
		const approvals = metadata?.approvals || {};
	
		let data = [HEADER_1, HEADER_2];
		for(const object in approvals) {
			if (Object.hasOwn(approvals, object)) {
				approvals[object].forEach(approval => {
					const name = approval.name;
					const sortOrder = approval.sortOrder;
					const description = approval.description;
					data.push([object, name, sortOrder, description]);
				});
			}
		}
		return data;
	}
}

export {
	ApprovalsProcessor
}