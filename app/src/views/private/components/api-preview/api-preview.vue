<template>
	<v-modal title="Preview API Request" :subtitle="path">
		<template #activator="{ on }">
			<v-sheet style="text-align: center">
				<v-button small outlined @click="on">Preview API Response</v-button>
			</v-sheet>
		</template>

		<v-form v-model="formModel" :fields="fields" primaryKey="preview" @input="previewApiResponse()" />

		<interface-code
			v-bind="{ readOnly: true, language: 'json' }"
			class="response-editor"
			:value="JSON.stringify(responseModel, null, 5)"
		/>

		<template #footer="{ close }">
			<v-button @click="close">Close</v-button>
		</template>
	</v-modal>
</template>

<style lang="scss" scoped>
.response-editor {
	padding-top: 20px;
}
</style>

<script lang="ts">
import { AxiosRequestConfig } from 'axios';
import { defineComponent, ref, reactive, computed, watch, watchEffect } from '@vue/composition-api';
import router from '@/router';
import api from '@/api';

export default defineComponent({
	setup(props, { root }) {
		const { path, params } = root.$route;
		const generateChoices = computed(() => {
			const choices = [
				{
					text: 'All Items',
					value: `items/${params.collection}`,
				},
				{
					text: 'Collection Data',
					value: `collections/${params.collection}`,
				},
			];

			if (params.primaryKey) {
				choices.unshift({
					text: 'Current Item',
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
			const requestPath = formModel.value['preview-kind'];

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
				const { data } = await api.get(requestPath, config);
				responseModel.value.data = data.data;
			} catch (error) {
				delete error.stack;
				responseModel.value.error = error;
			}
		}

		previewApiResponse();

		return {
			path,
			fields,
			formModel,
			responseModel,
			previewApiResponse,
		};
	},
});
</script>
