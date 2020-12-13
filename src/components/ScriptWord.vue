<template>
    <span></span>
</template>

<style lang="scss" scoped>

</style>
<script lang="ts">
import { Vue, Options } from 'vue-class-component'

@Options({

})
export default class ScriptWord extends Vue {
  updateScript (e: InputEvent) {
    console.log(e.data)
  }
}
</script>
