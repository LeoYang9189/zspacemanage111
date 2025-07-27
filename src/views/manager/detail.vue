<template>
    <div>
        <el-card class="!border-none" shadow="never">
            <el-page-header content="用户详情" @back="$router.back()" />
        </el-card>
        <el-card class="mt-4 !border-none" header="基本资料" shadow="never">
            <el-form ref="formRef" class="ls-form" :model="formData" label-width="120px">
                <div class="bg-page py-5 pl-20 mb-10">
                    <div class="mb-3 text-tx-regular">用户头像</div>
                    <el-avatar :src="formData.avatar" :size="58" />
                </div>
                <el-form-item label="用户编号："> {{ formData.id }} </el-form-item>
                <el-form-item label="用户昵称：">
                    {{ formData.nickname }}
                    <popover-input class="ml-[10px]" :limit="32" @confirm="handleEdit($event, 'nickname')">
                        <el-button type="primary" link v-perms="['user:edit']">
                            <icon name="el-icon-EditPen" />
                        </el-button>
                    </popover-input>
                </el-form-item>
                <el-form-item label="用户名：">
                    {{ formData.username }}
                    <popover-input class="ml-[10px]" :limit="32" @confirm="handleEdit($event, 'username')">
                        <el-button type="primary" link v-perms="['user:edit']">
                            <icon name="el-icon-EditPen" />
                        </el-button>
                    </popover-input>
                </el-form-item>
                <el-form-item label="真实姓名：">
                    {{ formData.idCardName || '-' }}
                    <popover-input class="ml-[10px]" :limit="32" @confirm="handleEdit($event, 'idCardName')">
                        <el-button type="primary" link v-perms="['user:edit']">
                            <icon name="el-icon-EditPen" />
                        </el-button>
                    </popover-input>
                </el-form-item>
                <el-form-item label="状态：">
                    {{ formData.status }}
                    <popover-input class="ml-[10px]" type="select" :options="[
                        {
                            label: '启用',
                            value: true
                        },
                        {
                            label: '禁用',
                            value: false
                        }
                    ]" @confirm="handleEdit($event, 'status')">
                        <el-button type="primary" link v-perms="['user:edit']">
                            <icon name="el-icon-EditPen" />
                        </el-button>
                    </popover-input>
                </el-form-item>
                <el-form-item label="联系电话：">
                    {{ formData.phone || '-' }}
                    <popover-input class="ml-[10px]" type="number" @confirm="handleEdit($event, 'phone')">
                        <el-button type="primary" link v-perms="['user:edit']">
                            <icon name="el-icon-EditPen" />
                        </el-button>
                    </popover-input>
                </el-form-item>
                <el-form-item label="注册时间："> {{ formData.createdTime }} </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script lang="ts" setup name="consumerDetail">
import type { FormInstance } from 'element-plus'
import { getManagerDetail, managerEdit } from '@/api/manager'
import feedback from '@/utils/feedback'
import { isEmpty } from '@/utils/util'

const route = useRoute()
const formData = reactive({
    avatar: '',
    id: '',
    username: '',
    nickname: '',
    phone: '',
    status: false,
    authenticationFlag: false,
    idCardName: '',
    idCardNumber: '',
    createdTime: '',
})

const formRef = shallowRef<FormInstance>()

const getDetails = async () => {
    const data = await getManagerDetail({
        id: route.query.id
    })
    Object.keys(formData).forEach((key) => {
        //@ts-ignore
        formData[key] = data[key]
    })
}

const handleEdit = async (value: string, field: string) => {
    if (isEmpty(value)) return
    await managerEdit({
        id: route.query.id,
        field,
        value
    })
    feedback.msgSuccess('编辑成功')
    getDetails()
}

getDetails()
</script>
