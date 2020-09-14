<template>
	<div>
		<div style="text-align: right" v-if="languages != null && languages.length > 0 && selectedLanguage != null">
			<v-button
				v-for="language in languages"
				:key="language.code"
				@click="websitesStore.setLanguage(language)"
				x-small
				:secondary="selectedLanguage.code !== language.code"
				style="margin-right: 12px"
			>
				{{ language.label }}
			</v-button>
		</div>
		<block-display :blocksData="blockData" @edit="editBlock" @remove="removeBlock" />
		<block-editor
			v-model="modalState"
			:blockToEdit="blockToEdit"
			:availableBlocks="availableBlocks"
			@update="updateBlock"
			@create="createBlock"
			@close="blockToEdit = null"
		/>
		<v-button @click="modalState = true">Create new Block</v-button>
	</div>
</template>
<script lang="ts">
import { defineComponent, ref, computed, watchEffect } from '@vue/composition-api';
import { useWebsitesStore } from '@/stores';

import { Block } from './block';

import BlockDisplay from './components/block-display';
import BlockEditor from './components/block-editor';

export default defineComponent({
	props: {
		value: {
			default: null,
		},
	},
	components: {
		BlockEditor,
		BlockDisplay,
	},
	setup(props, { emit }) {
		// component data && init
		const websitesStore = useWebsitesStore();
		websitesStore.hydrate();

		const languages = computed(() => websitesStore.state.languages);
		const selectedLanguage = computed(() => websitesStore.state.selectedLanguage);

		const modalState = ref(false);
		const defaultBlocks = computed(() => websitesStore.state.defaultBlocks);

		//@ts-ignore
		const blockData = computed(() => {
			if (props.value != null) return props.value;

			console.log('Blocks data is not initialized, returning an empty array...');
			return [];
		});
		const blockToEdit = ref(null);

		function updateBlock(block) {
			const i = blockData.value.findIndex((b) => b.uuid === block.uuid);
			blockData.value.splice(i, 1, block);
			emit('input', blockData.value);
		}

		function createBlock(block) {
			blockData.value.push(block);
			emit('input', blockData.value);
		}

		function editBlock(block) {
			blockToEdit.value = block;
		}
		function removeBlock(block) {
			if (confirm('Are you sure you want to delete this block?')) {
				const i = blockData.value.findIndex((b) => b.uuid === block.uuid);
				blockData.value.splice(i, 1);
				emit('input', blockData.value);
			}
		}

		return {
			blockData,
			modalState,
			languages,
			selectedLanguage,
			websitesStore,
			availableBlocks: {
				defaultBlocks,
			},
			blockToEdit,
			updateBlock,
			createBlock,
			editBlock,
			removeBlock,
		};
	},
});
</script>
