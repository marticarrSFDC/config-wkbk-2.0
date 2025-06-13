import { BaseProcessor } from "./baseProcessor";
import getApprovalProcesses from "@salesforce/apex/CW_ToolingApiService.getApprovalProcesses";

class ApprovalsProcessor extends BaseProcessor {
	get HEADER_1() {
		return ['Approval Processes', '', '', ''];
	}

	get HEADER_2() {
		return ['Object Name', 'Name', 'Order', 'Description'];
	}

	async _populateApprovalProcessesSheet() {
		return this._populateSheet([getApprovalProcesses()]);
	}

	async buildTable() {
		const [metadata] = await this._populateApprovalProcessesSheet();
		const approvals = metadata.approvals;
	
		let data = [this.HEADER_1, this.HEADER_2];
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