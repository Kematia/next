import { defineInterface } from '@/interfaces/define';
import InterfaceBlocks from './index.vue';

export default defineInterface(({ i18n }) => ({
	id: 'blocks',
	name: i18n.t('blocks'),
	icon: 'block',
	component: InterfaceBlocks,
	types: ['json'],
	options: [],
}));
