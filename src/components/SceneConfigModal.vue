<template>
    <div class="modal">
        <div class="scene-form">
            <header>Scene Config<header>
            <div class="input-group">
                <label>
                    <span>Clear Color<span>
                    <input type="color" @input="setSceneColor" />
                </label>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
    .modal {
        width:100vw;
        height:100vh;
        position: absolute;
        left: 0;
        top: 0;
        display: none;
        justify-content: center;
        align-items: center;
        background-color: rgba(0, 0, 0, 0.2);
        &.opened{
            display:flex;
        }
    }
    .scene-form {
        width:80%;
        height:40%;
    }
</style>
<script lang="ts">
import { Vue, Options } from 'vue-class-component'

@Options({
})
export default class SceneConfigModal extends Vue {
  setSceneColor (e: InputEvent) {
    console.log(e.data)
  }
}
</script>
