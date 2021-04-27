<template>
    <div v-if="item" class="default select_item">
        <div class="lable select-lable">{{ item.title }}</div>
        <div class="content">
            <el-select
                v-model="value" 
                placeholder="请选择类型" 
                class="el-select-wrap" 
                size="mini"
                @change="onChangeFirstValue"
            >
                <el-option
                    v-for="it in item.selectObj"
                    :key="it.id"
                    :label="it.item"
                    :value="it.item">
                </el-option>
            </el-select>
        </div>
    </div>
</template>