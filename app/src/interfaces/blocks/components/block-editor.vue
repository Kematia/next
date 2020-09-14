<template>
	<v-modal
		v-model="modalState"
		persistent
		:title="isNewBlock ? 'Create new Block' : 'Edit Block'"
		:subtitle="isNewBlock ? 'Adding new block' : 'Editing block'"
	>
		<template #sidebar>
			<v-tabs v-model="tabBlockSelection" vertical v-if="updatedBlock == null">
				<v-tab>Default blocks</v-tab>
			</v-tabs>
			<v-tabs v-model="currentConfigurationCategory" vertical v-else-if="getConfigurationCategories != null">
				<v-tab v-for="(category, index) in getConfigurationCategories" :key="index">
					{{ category.label }} - {{ index }}
				</v-tab>
			</v-tabs>
		</template>

		<template #default>
			<!-- BLOCK TYPE SELECTION VIEW -->
			<v-tabs-items v-model="tabBlockSelection" v-if="updatedBlock == null">
				<v-tab-item>
					<template v-for="{ type, meta } in availableBlocks.defaultBlocks">
						<v-card class="block-card" :key="type">
							<v-card-title>
								{{ type }}
							</v-card-title>
							<v-card-text>
								{{ meta.note }}
							</v-card-text>
							<v-card-actions>
								<v-button small secondary @click="create(type)">Add {{ type }}</v-button>
							</v-card-actions>
						</v-card>
					</template>
				</v-tab-item>
			</v-tabs-items>
			<template v-else-if="getConfigurationCategories[currentConfigurationCategory].fields">
				<template v-for="category in getConfigurationCategories">
					<v-form
						v-show="getConfigurationCategories[currentConfigurationCategory].key === category.key"
						:key="category.key"
						@input="hasChanges = true"
						:fields="category.fields"
						:primary-key="updatedBlock.uuid"
						v-model="formEdits"
						:initial-values="updatedBlock"
					/>
				</template>
			</template>
		</template>

		<template #footer>
			<div class="footer">
				<v-button v-if="updatedBlock != null" @click="save" :disabled="!hasChanges">
					{{ $t('save') }}
				</v-button>
				<v-button v-if="updatedBlock != null && isNewBlock" @click="updatedBlock = null" secondary>
					{{ $t('back') }}
				</v-button>
				<v-button @click="closeModal" secondary>{{ $t('close') }}</v-button>
			</div>
		</template>
	</v-modal>
</template>
<script lang="ts">
import { defineComponent, ref, computed, watchEffect } from '@vue/composition-api';

import { Block } from '../block';

export default defineComponent({
	props: {
		value: {
			default: null,
		},
		blockToEdit: {
			default: null,
		},
		availableBlocks: {
			type: Object,
		},
	},
	setup(props, { emit }) {
		/** Modal && data setup */

		// @ts-ignore
		const modalState = computed({
			get: () => props.value,
			set: (update) => emit('input', update),
		});
		const tabBlockSelection = ref([]);
		const currentConfigurationCategory = ref([0]);

		function closeModal() {
			updatedBlock.value = null;
			modalState.value = false;
			hasChanges.value = false;
			formEdits.value = null;
			emit('close');
		}

		const hasChanges = ref(false);

		/** FIELDS */
		const getTypeData = computed(() => {
			if (updatedBlock != null) {
				return props.availableBlocks.defaultBlocks.find((b) => updatedBlock.value.type === b.type);
			}
		});

		/** extracts the categories from the field names */
		const getConfigurationCategories = computed(() => {
			const configurationCategories = [
				{
					key: 'content',
					label: 'Block Content',
					fields: [],
				},
				{
					key: 'display',
					label: 'Display Options',
					fields: [],
				},
				{
					key: 'other',
					label: 'Other',
					fields: [],
				},
			];
			if (getTypeData.value) {
				getTypeData.value.fields.map((field) => {
					if (field.field.startsWith('content')) configurationCategories[0].fields.push(field);
					else if (field.field.startsWith('display')) configurationCategories[1].fields.push(field);
					else configurationCategories[2].fields.push(field);
				});
			}

			return configurationCategories;
		});

		/** Blocks CRUD */

		const updatedBlock = ref(null);
		/** If we are not passed a block, we know we're creating a new one */
		const isNewBlock = computed(() => {
			return props.blockToEdit == null;
		});

		function create(type) {
			updatedBlock.value = new Block(type);
		}

		function save() {
			if (isNewBlock.value) emit('create', { ...updatedBlock.value, ...formEdits.value });
			else emit('update', { ...updatedBlock.value, ...formEdits.value });
			closeModal();
		}

		/** Handle existing block editing */
		watchEffect(() => {
			if (props.blockToEdit != null) {
				updatedBlock.value = props.blockToEdit;
				modalState.value = true;
			}
		});

		const formEdits = ref(null);

		return {
			modalState,
			closeModal,
			tabBlockSelection,
			isNewBlock,
			getTypeData,
			currentConfigurationCategory,
			getConfigurationCategories,
			hasChanges,
			updatedBlock,
			create,
			save,
			formEdits,
		};
	},
});
</script>
<style lang="scss" scoped>
.footer {
	display: flex;
	flex-direction: row-reverse;
	width: 100%;
	.v-button {
		margin-left: 1rem;
		&:last-child {
			margin-right: auto;
			margin-left: 0;
		}
	}
}
</style>
