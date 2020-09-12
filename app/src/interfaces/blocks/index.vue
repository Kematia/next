<template>
	<h1>here be blocks</h1>
</template>
<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api';
import { useWebsitesStore } from '@/stores';

export default defineComponent({
	setup() {
		const websitesStore = useWebsitesStore();
		websitesStore.hydrate();

		console.log('blocks init');
	},
});
</script>
