<template>
	<v-modal title="Preview API Request" :subtitle="path">
		<template #activator="{ on }">
			<v-sheet style="text-align: center">
				<v-button small outlined @click="on">Preview API Response</v-button>
			</v-sheet>
		</template>

		<v-form v-model="formModel" :fields="fields" primaryKey="preview" @input="previewApiResponse()" />

		<div class="response--container">
			<interface-code
				v-bind="{ readOnly: true, language: 'json' }"
				class="response--editor"
				:value="JSON.stringify(responseModel, null, 5)"
			/>
		</div>

		<template #footer="{ close }">
			<v-button @click="close">Close</v-button>
		</template>
	</v-modal>
</template>

<style lang="scss" scoped>
.response--container {
	margin-top: 20px;
}
.response--tabs,
.response--label,
.response--editor {
	margin: 10px 0;
}
.response--title {
	font-family: var(--family-monospace);
}
</style>

<script lang="ts">
import { AxiosRequestConfig } from 'axios';
import { defineComponent, ref, reactive, computed, watch, watchEffect } from '@vue/composition-api';
import router from '@/router';
import api from '@/api';

/**
 *
 * TODO: add a v-if to render the component only when safe to do so
 * TODO: when in settings request the actual items? so you can check it while building
 * TODO: display the sdk/axios code to generate this request?
 */

export default defineComponent({
	setup(props, { root }) {
		const { path, params } = root.$route;

		const selectedTab = ref([]);

		const generateChoices = computed(() => {
			const choices = [
				{
					text: `All Items - items/${params.collection}`,
					value: `items/${params.collection}`,
				},
				{
					text: `Collection Data - collections/${params.collection}`,
					value: `collections/${params.collection}`,
				},
			];

			if (params.primaryKey) {
				choices.unshift({
					text: `Current Item - items/${params.collection}/${params.primaryKey}`,
					value: `items/${params.collection}/${params.primaryKey}`,
				});
			}

			return choices;
		});
		const fields = [
			{
				field: 'preview-role',
				name: 'Role to Preview',
				type: 'string',
				meta: {
					width: 'half',
					interface: 'dropdown',
					options: {
						choices: [
							{
								text: 'Current Role',
								value: 'current-role',
							},
							{
								text: 'Public',
								value: 'public-role',
							},
						],
					},
				},
			},
			{
				field: 'preview-kind',
				name: 'Data to Preview',
				type: 'string',
				meta: {
					width: 'half',
					interface: 'dropdown',
					options: {
						choices: generateChoices.value,
					},
				},
			},
		];

		const formModel = ref({
			'preview-role': 'current-role',
			'preview-kind': generateChoices.value[0].value,
		});

		const responseModel = ref({
			data: null,
			error: null,
		});

		async function previewApiResponse() {
			let config: AxiosRequestConfig | undefined;

			responseModel.value.data = null;
			responseModel.value.error = null;

			/**
			 * If the user selected the public role, we perform the request overwriting the stored Bearer token,
			 * otherwise we use it. I don't know at the moment how to handle mocking request for other roles?
			 */
			if (formModel.value['preview-role'] === 'public-role') {
				console.log('Preview API request as Public Role');
				config = {
					headers: { Authorization: '' },
				};
			} else {
				console.log('Preview API request as Current Role');
			}
			try {
				const { data } = await api.get(formModel.value['preview-kind'], config);
				responseModel.value.data = data.data;
			} catch (error) {
				delete error.stack;
				responseModel.value.error = error;
			}
		}

		previewApiResponse();

		return {
			selectedTab,
			path,
			fields,
			formModel,
			responseModel,
			previewApiResponse,
		};
	},
});
</script>
