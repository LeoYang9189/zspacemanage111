<template>
    <div v-show="modelValue">
        <div v-if="type == 'image'">
            <el-image-viewer v-if="previewLists.length" :url-list="previewLists" hide-on-click-modal
                @close="handleClose" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import useAppStore from '@/stores/modules/app'
const { getImageUrl } = useAppStore()
const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    url: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        default: 'image'
    }
})
const emit = defineEmits<{
    (event: 'update:modelValue', value: boolean): void
}>()

const playerRef = shallowRef()

const visible = computed({
    get() {
        return props.modelValue
    },

    set(value) {
        emit('update:modelValue', value)
    }
})

const handleClose = () => {
    emit('update:modelValue', false)
}

const previewLists = ref<any[]>([])

watch(
    () => props.modelValue,
    (value) => {
        if (value) {
            nextTick(() => {
                previewLists.value = [props.url]
                playerRef.value?.play()
            })
        } else {
            nextTick(() => {
                previewLists.value = []
                playerRef.value?.pause()
            })
        }
    }
)
</script>
