<template>
	<div>
		{{ blockToEdit }}
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
		const websitesStore = useWebsitesStore();
		websitesStore.hydrate();

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
			console.log('updating', block);

			const i = blockData.value.findIndex((b) => b.uuid === block.uuid);
			blockData.value.splice(i, 1, block);
			emit('input', blockData.value);
		}

		function createBlock(block) {
			console.log('creating', block);

			blockData.value.push(block);
			emit('input', blockData.value);
		}

		function editBlock(block) {
			console.log('editing', block);
			blockToEdit.value = block;
		}
		function removeBlock(block) {
			console.log('remove', block);

			if (confirm('Are you sure you want to delete this block?')) {
				const i = blockData.value.findIndex((b) => b.uuid === block.uuid);
				blockData.value.splice(i, 1);
				emit('input', blockData.value);
			}
		}

		return {
			blockData,
			modalState,
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
