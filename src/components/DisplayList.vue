<template>
  <div :class="displayStyle">
    <h6 style="width:100%; padding:0 0 0 0; text-align:left; margin:0 0 0 0; background-color:white">Display List</h6>
    <button @click="closeDisplayList" style="position:absolute; top:0; right:0; z-index:1">❌</button>
    <div class="container-fluid">
      <div v-if="$store.state.sceneState.defaultSceneIsRendering">
        <div
          v-for="behavior in $store.state.sceneState.behaviors"
          :key="behavior.id"
          class="row">
        <div class="card" style="width:100%">
          <div class="card-header">
            {{behavior.name}}
          </div>
          <div class="card-body">
            <div v-for="control in behavior.controls" :key="control.id">
              <Vector3Control v-if="control.type === 'vector3'" :controlId="control.id"></Vector3Control>
              <Color3Control  v-if="control.type === 'color3'" :controlId="control.id"></Color3Control>
              <NumberControl  v-if="control.type === 'number'" :controlId="control.id"></NumberControl>
            </div>
          </div>
          <div v-if="behavior.removeable" class="card-footer">
            <button class="btn btn-danger" @click="removeBehavior(behavior.id)">remove</button>
          </div>
        </div>
        </div>
      </div>
    </div>
    <div style="height:50px"></div>
  </div>
</template>
<style lang="scss">
.display-list{
  height:100vh;
  overflow: hidden scroll;
  position:absolute;
  right:0;
  top:0;
}

.no-pointer{
  pointer-events: none;
}
</style>
<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import Vector3Control from './Vector3Control.vue'
import Color3Control from './Color3Control.vue'
import NumberControl from './NumberControl.vue'
import store from '../appstore'

@Options({
  components: {
    Vector3Control,
    Color3Control,
    NumberControl
  }
})
export default class DisplayList extends Vue {
  help () {
    console.log(this.$store.state.sceneState.rootNodes[0].behaviors)
  }

  removeBehavior (behaviorId: string) {
    this.$store.commit('removeBehaviorById', behaviorId)
  }

  get displayStyle (): string {
    return this.$store.state.displayListOpened
      ? 'display-list animate__animated animate__fadeInRight'
      : 'display-list animate__animated animate__fadeOutRight no-pointer'
  }

  closeDisplayList () {
    this.$store.commit('setDisplayListIsOpened', false)
  }
}
</script>
