<template>
	<div v-if="blocksData == null || blocksData.length === 0">
		<v-sheet style="text-align: center">
			<h3>no blocks present!</h3>
		</v-sheet>
	</div>
	<div v-else>
		<template v-for="block in blocksData">
			<v-sheet class="block-display" :key="block.uuid">
				<div class="block-display__header">
					<h4>{{ block.type }} - {{ block.uuid }}</h4>
					<!-- <span class="block-display__meta-note">{{ block.meta.note }}</span> -->
					<div class="block-display__button-group">
						<v-button class="block-display__button" x-small secondary outline @click="emit('edit', block)">
							Edit
						</v-button>
						<v-button
							class="block-display__button"
							x-small
							secondary
							outline
							@click="emit('remove', block)"
						>
							Delete
						</v-button>
					</div>
				</div>
				<v-divider />
				{{ block }}
			</v-sheet>
		</template>
	</div>
</template>
<script lang="ts">
import Vue from 'vue';
import { defineComponent, ref, reactive, computed, toRefs } from '@vue/composition-api';

export default defineComponent({
	props: {
		blocksData: {
			type: Array,
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
