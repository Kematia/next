import { IBlock, IBlockType } from './types';
import { v4 as uuidv4 } from 'uuid';

export class Block {
	uuid: string;
	blockType: IBlockType;

	constructor(blockType: IBlockType) {
		this.uuid = uuidv4();
		this.blockType = blockType;
	}
}

export class BlockType {
	meta: object;
	type: string;
	label: string;
	description: string;
	fields: object[];

	constructor(meta: object, type: string, label: string, description: string, fields: object[]) {
		this.meta = meta;
		this.type = type;
		this.label = label;
		this.description = description;
		this.fields = fields;
	}
}
