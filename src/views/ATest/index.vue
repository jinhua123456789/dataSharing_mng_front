<template>
    <div class="g-container">
        <component 
            v-for="(item, number) in freedomConfig" 
            :key="item.name"
            :is="item.type" 
            :item="item" 
            :number="number" 
            @changeComponent="changeComponentHandle"
        ></component>
    </div>
</template>

<script>
    import * as itemElements from '../../components/itemElement'
    
    export default {
        components: itemElements,
    }
</script>