import { v4 as uuidv4 } from 'uuid';

export class Block {
	readonly uuid: string = uuidv4();
	constructor(readonly type: string) {
		if (type == null) throw Error('[BLOCKS] Type is not defined!');
	}
}
