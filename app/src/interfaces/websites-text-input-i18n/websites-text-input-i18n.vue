<template>
	<v-notice v-if="languages == null || languages.length === 0" type="warning">No languages provided!</v-notice>
	<v-notice v-else-if="selectedLanguage == null" type="warning">No selected language provided!</v-notice>
	<v-input
		:value="parsedValue"
		:placeholder="placeholder"
		:disabled="disabled"
		:type="masked ? 'password' : 'text'"
		:class="font"
		:maxlength="length"
		@input="updateValue"
		v-else
	>
		<template v-if="iconLeft" #prepend><v-icon :name="iconLeft" /></template>
		<template #append>
			<span
				v-if="percentageRemaining <= 20"
				class="remaining"
				:class="{
					warning: percentageRemaining < 10,
					danger: percentageRemaining < 5,
				}"
			>
				{{ charsRemaining }}
			</span>
			<v-icon
				:class="{ hide: percentageRemaining !== false && percentageRemaining <= 20 }"
				v-if="iconRight"
				:name="iconRight"
			/>
		</template>
	</v-input>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from '@vue/composition-api';
import { useWebsitesStore } from '@/stores';

export default defineComponent({
	props: {
		value: {
			type: Object,
			default: null,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		placeholder: {
			type: String,
			default: null,
		},
		masked: {
			type: Boolean,
			default: false,
		},
		iconLeft: {
			type: String,
			default: null,
		},
		iconRight: {
			type: String,
			default: null,
		},
		trim: {
			type: Boolean,
			default: true,
		},
		font: {
			type: String as PropType<'sans-serif' | 'serif' | 'monospace'>,
			default: 'sans-serif',
		},
		length: {
			type: [Number, String],
			default: null,
		},
	},
	setup(props, { emit }) {
		const websitesStore = useWebsitesStore();

		const languages = computed(() => websitesStore.state.languages);
		const selectedLanguage = computed(() => websitesStore.state.selectedLanguage);

		const charsRemaining = computed(() => {
			if (!props.length) return null;
			if (!props.value) return null;
			return +props.length - props.value.length;
		});

		const percentageRemaining = computed(() => {
			if (!props.length) return false;
			if (!props.value) return false;
			return 100 - (props.value.length / +props.length) * 100;
		});

		const parsedValue = computed(() => {
			if (props.value == null) return;

			return props.value[selectedLanguage.value.code];
		});

		function updateValue(update) {
			console.log(update);
			emit('input', {
				...props.value,
				[selectedLanguage.value.code]: update,
			});
		}

		// $listeners.input

		return { charsRemaining, percentageRemaining, languages, selectedLanguage, updateValue, parsedValue };
	},
});
</script>

<style lang="scss" scoped>
.v-input {
	&.monospace {
		--v-input-font-family: var(--family-monospace);
	}

	&.serif {
		--v-input-font-family: var(--family-serif);
	}

	&.sans-serif {
		--v-input-font-family: var(--family-sans-serif);
	}
}

.remaining {
	display: none;
	width: 24px;
	color: var(--foreground-subdued);
	font-weight: 600;
	text-align: right;
	vertical-align: middle;
	font-feature-settings: 'tnum';
}

.v-input:focus-within .remaining {
	display: block;
}

.v-input:focus-within .hide {
	display: none;
}

.warning {
	color: var(--warning);
}

.danger {
	color: var(--danger);
}
</style>
