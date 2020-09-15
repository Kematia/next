<template>
	<div v-if="selectedLanguage">
		<!-- We pass all the props but the value -->
		<slug v-bind="$attrs" v-model="i18nHandler" :trim="false" />
		<div>the slug does not mirror yet</div>
	</div>
	<div v-else>
		<v-notice type="warning">No language provided!</v-notice>
	</div>
</template>
<script lang="ts">
import { defineComponent, computed, reactive, ref, nextTick } from '@vue/composition-api';
import { useWebsitesStore } from '@/stores';

import slug from '../slug/slug.vue';

export default defineComponent({
	inheritAttrs: false,
	props: {
		value: {
			type: Object,
			default: null,
		},
	},
	components: {
		slug: slug,
	},
	setup(props, { emit, attrs }) {
		const websitesStore = useWebsitesStore();
		const languages = computed(() => websitesStore.state.languages);
		const selectedLanguage = computed(() => websitesStore.state.selectedLanguage);

		const updatedValue = reactive({});

		// @ts-ignore
		const i18nHandler = computed({
			get: () => {
				if (props.value && props.value[selectedLanguage.value.code]) {
					return props.value[selectedLanguage.value.code];
				}
				return '';
			},
			set: (update) => {
				console.log(update);
				updatedValue[selectedLanguage.value.code] = update;
				emit('input', {
					...props.value,
					...updatedValue,
				});
			},
		});

		return { languages, selectedLanguage, i18nHandler, updatedValue };
	},
});
</script>
