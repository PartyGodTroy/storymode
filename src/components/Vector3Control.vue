<template>
  <form v-if="pos">
    <div class="form-group">
      <div class="container-fluid">
        <div class="row">
          <strong>
            {{ name }} <small>{{ type }}</small>
         </strong>
        </div>
        <div class="row">
          <div class="col-sm-4 p-0">
            <div class="input-group input-group-sm">
              <div class="input-group-prepend">
                <span class="input-group-text" id="basic-addon1">X</span>
              </div>
              <input
                type="number"
                class="form-control"
                v-model="pos.x"
                @change="update"
              />
            </div>
          </div>
          <div class="col-sm-4 p-0">
            <div class="input-group input-group-sm">
              <div class="input-group-prepend">
                <span class="input-group-text" id="basic-addon1">Y</span>
              </div>
              <input
                type="number"
                class="form-control"
                v-model="pos.y"
                @change="update"
              />
            </div>
          </div>
          <div class="col-sm-4 p-0">
            <div class="input-group input-group-sm">
              <div class="input-group-prepend">
                <span class="input-group-text" id="basic-addon1">Z</span>
              </div>
              <input
                type="number"
                class="form-control"
                v-model="pos.z"
                @change="update"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>
<script lang="ts">
import { Vue, Options } from 'vue-class-component'
import { Vector3 } from '@babylonjs/core/Maths'
import { BehaviorControl } from '../models/behavior/Behaviors'
import Utils from '../Utils'

@Options({
  props: {
    controlId: ''
  },
  data: () => {
    return {
      control: null
    }
  }
})
export default class Vector3Control extends Vue {
  controlId?: string;
  private pos: {
    x: number;
    y: number;
    z: number;
  } = { x: 0, y: 0, z: 0 };

  control!: BehaviorControl;

  get type (): string {
    return this.control?.type || ''
  }

  get name (): string {
    return this.control?.name || ''
  }

  mounted () {
    this.$store
      .dispatch('getControl', this.controlId)
      .then((ctrl: BehaviorControl) => {
        this.control = ctrl
        const data = ctrl.data
        this.pos = {
          x: data.x,
          y: data.y,
          z: data.z
        }
      })
  }

  update () {
    this.control.data.x = this.pos.x
    this.control.data.y = this.pos.y
    this.control.data.z = this.pos.z
  }
}
</script>
