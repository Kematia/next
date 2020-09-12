import { createStore } from 'pinia';
import api from '@/api';

export const useWebsitesStore = createStore({
	id: 'websitesStore',
	state: () => ({
		languages: [],
		selectedLanguage: null,
		defaultBlocks: [],
	}),
	actions: {
		async hydrate() {
			this.dehydrate();
			const languageRequest = await api.get('/items/settings/1');

			languageRequest.data.data.languages.map((language) => this.state.languages.push(language));

			if (this.state.selectedLanguage == null) this.state.selectedLanguage = this.state.languages[0];

			const blocksRequest = await api.get('collections');
			blocksRequest.data.data.map(async ({ collection }) => {
				if (collection.startsWith('blocks_')) {
					const blockCollectionRequest = await api.get('/collections/' + collection);
					const blockCollection = blockCollectionRequest.data.data;

					const blockFieldsRequest = await api.get('/fields/' + collection);
					const blockFields = blockFieldsRequest.data.data;

					this.state.defaultBlocks.push({
						type: collection,
						meta: blockCollection.meta,
						fields: [...blockFields],
					});
				}
			});
		},

		async dehydrate() {
			this.reset();
		},

		setLanguage(language) {
			this.state.selectedLanguage = language;
		},
	},
});
