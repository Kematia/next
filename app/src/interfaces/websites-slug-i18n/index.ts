import { defineInterface } from '@/interfaces/define';
import WebsitesInterfaceSlugI18n from './websites-slug-i18n.vue';

export default defineInterface(({ i18n }) => ({
	id: 'websites-slug-i18n',
	name: i18n.t('websites-slug-i18n'),
	description: i18n.t('interfaces.slug.description'),
	icon: 'link',
	component: WebsitesInterfaceSlugI18n,
	types: ['json'],
	options: [
		{
			field: 'placeholder',
			name: i18n.t('placeholder'),
			meta: {
				width: 'full',
				interface: 'text-input',
				options: {
					placeholder: i18n.t('enter_a_placeholder'),
				},
			},
		},
		{
			field: 'iconLeft',
			name: i18n.t('icon_left'),
			type: 'string',
			meta: {
				width: 'half',
				interface: 'icon',
			},
		},
		{
			field: 'iconRight',
			name: i18n.t('icon_right'),
			type: 'string',
			meta: {
				width: 'half',
				interface: 'icon',
			},
		},
	],
}));
