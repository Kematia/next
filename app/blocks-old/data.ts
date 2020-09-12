import { BlockType } from './blocks';

const defaultBlockTypesData = [
	{
		type: 'default-title',
		label: 'Title',
		description: 'A title for your content',
		meta: {
			...blockTypeMeta(),
		},
		fields: [
			{
				name: 'Title',
				field: 'default-title',
				meta: {
					i18n: true,
					special: 'json',
					interface: 'websites-text-input-i18n',
					options: {
						placeholder: 'Your title',
					},
					note: 'your i18n title!',
				},
				display: {
					tag: 'h2',
					class: 'block-display__default-title',
				},
			},
		],
	},
	{
		type: 'image-and-text',
		label: 'Image and Text',
		description: 'A block with an image and text',
		meta: {
			...blockTypeMeta(),
		},
		fields: [
			{
				field: 'image',
				type: 'string',
				schema: {
					name: 'image',
					table: 'pages',
					type: 'char',
					default_value: null,
					max_length: 36,
					is_nullable: true,
					is_primary_key: false,
					has_auto_increment: false,
					foreign_key_column: null,
					foreign_key_table: null,
					comment: '',
				},
				meta: {
					id: 98,
					field: 'image',
					special: null,
					interface: 'image',
					options: null,
					display: 'image',
					display_options: { circle: false },
					locked: false,
					readonly: false,
					hidden: false,
					sort: 1,
					width: 'full',
					group: null,
					translation: null,
					note: null,
				},
				name: 'Image',
				display: {
					tag: 'h2',
					class: 'block-display__default-title',
				},
			},
			{
				name: 'Title',
				field: 'title',
				meta: {
					i18n: true,
					special: 'json',
					interface: 'websites-text-input-i18n',
					options: {
						placeholder: 'Your title',
					},
					note: 'your i18n title!',
				},
				display: {
					tag: 'h2',
					class: 'block-display__default-title',
				},
			},
			{
				name: 'Subtitle',
				field: 'subtitle',
				meta: {
					i18n: true,
					special: 'json',
					interface: 'websites-text-input-i18n',
					options: {
						placeholder: 'Your subtitle',
					},
					note: 'your i18n subtitle!',
				},
				display: {
					tag: 'h2',
					class: 'block-display__default-subtitle',
				},
			},
		],
	},
];

export const defaultBlockTypes = defaultBlockTypesData.map(
	(defaultType) =>
		new BlockType(
			defaultType.meta,
			defaultType.type,
			defaultType.label,
			defaultType.description,
			defaultType.fields
		)
);

const customBlockTypesData = [];
export const customBlockTypes = customBlockTypesData.map(
	(defaultType) =>
		new BlockType(
			defaultType.meta,
			defaultType.type,
			defaultType.label,
			defaultType.description,
			defaultType.fields
		)
);

function blockTypeMeta() {
	return {
		html_id: {
			name: 'ID HTML',
			field: 'html_id',
			type: 'string',
			meta: {
				field: 'html_id',
				special: null,
				interface: 'slug',
				display: 'raw',
				display_options: null,
				locked: false,
				readonly: false,
				hidden: false,
				width: 'half',
				group: null,
				translation: null,
				note: 'The HTML ID (#)',
			},
			display: {
				tag: 'span',
				class: 'block-display__html_id',
			},
		},
	};
}
