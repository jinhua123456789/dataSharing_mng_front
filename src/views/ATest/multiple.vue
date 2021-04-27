<template>
    <div v-if="item"  class="default multiple">
        <div class="lable">{{ item.title }}</div>
        <template>
            <textarea
                rows="3" 
                :placeholder="item.prompt_msg" 
                v-model="value" 
                :value="it.item">
        </template>
    </div>
</template>