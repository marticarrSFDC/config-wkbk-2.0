/* istanbul ignore next */
import { BaseProcessor } from "./baseProcessor";
import getSObjects from "@salesforce/apex/CW_ToolingApiService.getSObjects";
import query from "@salesforce/apex/CW_ToolingApiService.query";

const ENTITY_QUERY = 'SELECT+DeploymentStatus,Description,ExternalSharingModel,InternalSharingModel,QualifiedApiName+FROM+EntityDefinition+WHERE+IsLayoutable=true';

class ObjectsProcessor extends BaseProcessor {
	get HEADER_1() {
		return ['', '', '', '', '', 'Organization-Wide Defaults', '', '', ''];
	}

	get HEADER_2() {
		return ['Object Label', 'API Name', 'Type', 'Key Prefix', 'In Use?', 'Internal', 'External', 'Description', 'Deployment Status'];
	}

	_formatObjectType(sobject) {
		if(sobject.customSetting) {
			return 'Custom Setting';
		} else if (sobject.custom) {
			return 'Custom';
		}
		return 'Standard';
	}
	
	_processSObjectData(metadata) {
		const sobjects = metadata.sobjects;
	
		let data = new Map();
		sobjects.forEach((sobject) => {
			if(sobject.layoutable) {
				const apiName = sobject.name;
				data.set(apiName, {
					label: sobject.label,
					type: this._formatObjectType(sobject),
					keyPrefix: sobject.keyPrefix
				});
			}
		});
		return data;
	}
	
	_processEntityData(metadata) {
		const entities = metadata.records;
	
		let data = new Map();
		entities.forEach((entity) => {
			const apiName = entity.QualifiedApiName;
			data.set(apiName, {
				deploymentStatus: entity.DeploymentStatus, 
				description: entity.Description, 
				externalSharingModel: entity.ExternalSharingModel, 
				internalSharingModel: entity.InternalSharingModel
			});
		});
		return data;
	}

	_populateAllObjectSheet() {
		return this._populateSheet([getSObjects(), query({query: ENTITY_QUERY})]);
	}
	
	
	async buildTable() {
		const [sobj, ent] = await this._populateAllObjectSheet();
		const sobjects = this._processSObjectData(sobj);
		const entities = this._processEntityData(ent);
		const apiNames = Array.from(sobjects.keys());
		apiNames.sort();
	
		let data = [this.HEADER_1, this.HEADER_2];
		apiNames.forEach((apiName) => {
			const sobject = sobjects.get(apiName);
			const entity = entities.get(apiName);
			const objectLabel = sobject.label;
			const type = sobject.type;
			const keyPrefix = sobject.keyPrefix;
			const inUse = '';
			const internal = entity.internalSharingModel;
			const external = entity.externalSharingModel;
			const description = entity.description || '';
			const deploymentStatus = entity.deploymentStatus || '';
			data.push([objectLabel, apiName, type, keyPrefix, inUse, internal, external, description, deploymentStatus]);
		});
		return data;
	}
}

export {
	ObjectsProcessor
}