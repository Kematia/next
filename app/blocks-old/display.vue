<template>
	<div v-if="blocks == null || blocks.length === 0">
		<v-sheet style="text-align: center">
			<h3>no blocks present!</h3>
		</v-sheet>
	</div>
	<div v-else>
		<template v-for="(block, blockIndex) in blocks">
			<v-sheet class="block-display" :key="block.uuid">
				<div class="block-display__header">
					<h4>{{ block.blockType.label }}</h4>
					<span class="block-display__meta-note">{{ block.blockType.description }}</span>
					<div class="block-display__button-group">
						<v-button
							class="block-display__button"
							x-small
							secondary
							outline
							@click="emit('edit', blockIndex)"
						>
							Edit
						</v-button>
						<v-button
							class="block-display__button"
							x-small
							secondary
							outline
							@click="emit('remove', blockIndex)"
						>
							Delete
						</v-button>
					</div>
				</div>
				<v-divider />
				<template v-for="field in block.blockType.fields">
					<template v-if="field.display && block[field.field]">
						<div class="block-display__field" :key="field.field">
							<template v-if="selectedLanguage">
								<component
									v-if="block[field.field][selectedLanguage.code]"
									:is="field.display.tag"
									:class="field.display.class"
								>
									{{ block[field.field][selectedLanguage.code] }}
								</component>
								<v-notice v-else type="warning">
									Missing content for {{ block.blockType.label }} in {{ selectedLanguage.label }}
								</v-notice>
							</template>
							<template v-else>
								<component :is="field.display.tag" :class="field.display.class">
									{{ block[field.field] }}
								</component>
							</template>
						</div>
					</template>
					<template v-else-if="field.display == null">
						no display! {{ field.field }}: {{ block[field.field] }}
					</template>
				</template>
			</v-sheet>
		</template>
	</div>
</template>
<script lang="ts">
import Vue from 'vue';
import { defineComponent, ref, reactive, computed, toRefs } from '@vue/composition-api';

export default defineComponent({
	props: {
		blocks: {
			type: Array,
			default: null,
		},
		selectedLanguage: {
			type: Object,
			default: null,
		},
	},
	setup(props, { emit }) {
		return { emit };
	},
});
</script>
<style lang="scss" scoped>
.block-display {
	padding: 1rem;
}
.block-display__header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 6px;
}
.block-display__button-group {
	text-align: right;

	.block-display__button {
		margin-left: 12px;
	}
}

.block-display__field {
	margin-top: 12px;
}
.block-display__meta-note {
	opacity: 0.8;
}
.block-display__default-title {
	font-weight: 700;
	font-size: 24px;
}
.block-display__html_id {
	background-color: yellow;
}
</style>
