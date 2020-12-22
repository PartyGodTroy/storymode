<template>
  <div class="display-list">
      <h3>Display List</h3>
      <select class="form-control">
        <option></option>
        <option>New Camera</option>
        <option>New WebCam</option>
      </select>
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
            </div>
          </div>
          <div class="card-footer">
            <button class="btn btn-danger" @click="removeBehavior(behavior.id)">remove</button>
          </div>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import Vector3Control from './Vector3Control.vue'
import Color3Control from './Color3Control.vue'

@Options({
  components: {
    Vector3Control,
    Color3Control
  }
})
export default class DisplayList extends Vue {
  help () {
    console.log(this.$store.state.sceneState.rootNodes[0].behaviors)
  }

  removeBehavior (behaviorId: string) {
    this.$store.commit('removeBehaviorById', behaviorId)
  }
}
</script>
