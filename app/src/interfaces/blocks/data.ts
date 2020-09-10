import { BlockType } from './blocks';

const defaultBlockTypesData = [
	{
		type: 'default-title',
		label: 'Default Title',
		description: 'A title for your content',
		meta: {
			...metaFields(),
		},
		fields: [
			{
				name: 'Title',
				field: 'default-title',
				interface: 'field',
				meta: {
					options: {
						placeholder: 'Your title',
					},
					note: 'your title!',
				},
				display: {
					tag: 'h2',
					class: 'block-display__default-title',
				},
			},
		],
	},
	// {
	// 	type: 'default-subtitle',
	// 	label: 'Subtitle',
	// 	description: 'A subtitle for your title!',
	// 	display: {
	// 		tag: 'h4',
	// 		class: 'block-display__default-subtitle',
	// 	},
	// 	fields: [...commonFields()],
	// },
	// {
	// 	type: 'default-text-editor',
	// 	label: 'Text Editor',
	// 	description: 'A rich text editor for your content!',
	// 	display: {
	// 		tag: 'div',
	// 		class: 'block-display__default-text-editor',
	// 	},
	// 	fields: [...commonFields()],
	// },
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

function metaFields() {
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
