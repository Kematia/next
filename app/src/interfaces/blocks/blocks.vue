<template>
	<div>
		{{ index }} - {{ modalIsActive }}

		<display :blocks="value" @edit="edit" @remove="remove" />

		<v-divider />

		{{ editor }}
		<v-divider />
		{{ update }}

		<v-button class="add-block" align="center" outlined large full-width @click="modalIsActive = true">
			<v-icon name="add" />
			{{ $t('add_block') }}
		</v-button>
		<v-modal
			v-model="modalIsActive"
			persistent
			title="Add Block"
			:subtitle="editor ? `Setup ${editor.blockType.label} block` : `Add a block`"
			@toggle="reset"
		>
			<template #sidebar v-if="editor == null">
				<v-tabs v-model="tabSelection" vertical>
					<v-tab>Default blocks</v-tab>
					<v-tab>Custom blocks</v-tab>
				</v-tabs>
			</template>

			<template v-if="editor == null">
				<template>
					<v-tabs-items v-model="tabSelection">
						<v-tab-item>
							<template v-for="blockType in defaultBlockTypes">
								<v-card class="block-card" :key="blockType.key">
									<v-card-title>
										{{ blockType.label }}
									</v-card-title>
									<v-card-text>
										{{ blockType.description }}
									</v-card-text>
									<v-card-actions>
										<v-button small secondary @click="create(blockType)">
											Add {{ blockType.label }}
										</v-button>
									</v-card-actions>
								</v-card>
							</template>
						</v-tab-item>
						<v-tab-item>
							<v-sheet style="text-align: center">
								<h2>No custom Block Types loaded.</h2>
							</v-sheet>
						</v-tab-item>
					</v-tabs-items>
				</template>
			</template>
			<template v-else>
				<v-form
					:fields="editor.blockType.fields"
					:primary-key="editor.uuid"
					:initial-values="editor"
					v-model="editor"
					@input="hasChanges = true"
				/>
			</template>

			<template #footer="{ close }">
				<div class="blocks-footer">
					<v-button v-if="editor != null" :disabled="!hasChanges" @click="save">
						{{ $t('save') }}
					</v-button>
					<v-button v-if="editor != null" @click="reset()" secondary>
						{{ $t('back') }}
					</v-button>
					<v-button @click="close" secondary>{{ $t('close') }}</v-button>
				</div>
			</template>
		</v-modal>
		<!-- <v-modal
			v-model="modalIsActive"
			title="Add Block"
			:subtitle="blockEditor ? `Setup ${blockEditor.blockType.label} block` : `Add a block`"
		>
			<template #activator="{ on }">
				<v-button class="add-block" align="center" outlined large full-width @click="on">
					<v-icon name="add" />
					{{ $t('add_block') }}
				</v-button>
			</template>
			<template #sidebar v-if="blockEditor == null">
				<v-tabs v-model="tabSelection" vertical>
					<v-tab>Default blocks</v-tab>
					<v-tab>Custom blocks</v-tab>
				</v-tabs>
			</template>
			<template v-if="blockEditor == null">
				<template>
					<v-tabs-items v-model="tabSelection">
						<v-tab-item>
							<template v-for="blockType in defaultBlockTypes">
								<v-card class="block-card" :key="blockType.key">
									<v-card-title>
										{{ blockType.label }}
									</v-card-title>
									<v-card-text>
										{{ blockType.description }}
									</v-card-text>
									<v-card-actions>
										<v-button small secondary @click="createNewBlock(blockType)">
											Add {{ blockType.label }}
										</v-button>
									</v-card-actions>
								</v-card>
							</template>
						</v-tab-item>
						<v-tab-item>
							<v-sheet style="text-align: center">
								<h2>No custom Block Types loaded.</h2>
							</v-sheet>
						</v-tab-item>
					</v-tabs-items>
				</template>
			</template>
			<template v-else>
				{{ blockEditor }}
				<hr />
				{{ blockIndex }}

				<hr />

				<v-form
					:fields="blockEditor.blockType.fields"
					:primary-key="blockEditor.uuid"
					:initial-values="blockEditor"
					v-model="blockEditor"
					@input="setupCompleted = true"
				/>
			</template>

			<template #footer="{ close }">
				<div class="blocks-footer">
					<v-button v-if="blockEditor != null" :disabled="!setupCompleted" @click="saveBlock()">
						{{ $t('save') }}
					</v-button>
					<v-button v-if="blockEditor != null" @click="setBlockEditor(null)" secondary>
						{{ $t('back') }}
					</v-button>
					<v-button @click="close" secondary>{{ $t('close') }}</v-button>
				</div>
			</template>
		</v-modal> -->
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { defineComponent, ref, reactive, computed, toRefs, watchEffect } from '@vue/composition-api';

import useItem from '@/composables/use-item';

import { defaultBlockTypes } from './data';
import { Block, BlockType } from './blocks';

import display from './display.vue';

export default defineComponent({
	components: { display },
	props: {
		value: {
			type: Array,
			default: null,
		},
	},
	setup(props, { emit }) {
		/** Modal data */
		const tabSelection = ref([]);
		const modalIsActive = ref(false);

		/** Editor data */
		const hasChanges = ref(false);
		const index = ref(null);
		const update = ref(null);

		// @ts-ignore
		const editor = computed({
			get: () => {
				console.log(props.value);
				if (props.value) {
					const selected = props.value[index.value];
					if (selected == null && update.value != null) return update.value;

					return selected;
				}

				initialize();
			},

			set: (u) => {
				update.value = u;
			},
		});

		function create(blockType) {
			editor.value = new Block(blockType);
		}

		function edit(i) {
			index.value = i;
		}
		function remove(index) {
			console.log(index);
			props.value.splice(index, 1);
			emit('input', props.value);
		}

		function save() {
			let found = false;
			const updated = props.value.map((v, i) => {
				if (i === index.value) {
					found = true;
					return update.value;
				}
				return v;
			});

			if (found) {
				console.log('Blocks updated correctly');
			} else {
				console.log('Adding block...');
				updated.push(update.value);
			}
			emit('input', updated);
			reset();
		}

		function reset() {
			index.value = null;
			update.value = null;
			editor.value = null;
			modalIsActive.value = false;
		}

		function initialize() {
			emit('input', []);
		}

		watchEffect(() => {
			if (index.value != null) modalIsActive.value = true;
		});

		return {
			tabSelection,
			modalIsActive,
			defaultBlockTypes,
			editor,
			hasChanges,
			index,
			create,
			update,
			save,
			edit,
			remove,
			reset,
		};
	},
});
</script>

<style lang="scss" scoped>
.add-block {
	--v-button-font-size: 14px;
	--v-button-background-color: var(--primary);
	--v-button-background-color-hover: var(--primary-125);

	margin-top: 12px;

	.v-icon {
		margin-right: 8px;
	}

	&.active {
		--v-button-background-color: var(--primary);
	}
}
.block-card {
	--v-card-background-color: red;
	--v-card-max-width: 200px;
}
.blocks-footer {
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
