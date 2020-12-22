<template>
  <form v-if="color">
    <div class="form-group">
      <div class="container-fluid">
        <div class="row">
          <strong>
            {{ name }} <small>{{ type }}</small>
         </strong>
        </div>
        <div class="row">
          <input type="color" @input="colorPickerUpdate" ref="colorPicker"/>
        </div>
        <div class="row">
          <div class="col-sm-4 p-0">
            <div class="input-group input-group-sm">
              <div class="input-group-prepend">
                <span class="input-group-text" id="basic-addon1">R</span>
              </div>
              <input
                type="number"
                class="form-control"
                min="0"
                max="1"
                step="0.1"
                v-model="color.r"
                @change="update"
              />
            </div>
          </div>
          <div class="col-sm-4 p-0">
            <div class="input-group input-group-sm">
              <div class="input-group-prepend">
                <span class="input-group-text" id="basic-addon1">G</span>
              </div>
              <input
                type="number"
                min="0"
                max="1"
                step="0.1"
                class="form-control"
                v-model="color.g"
                @change="update"
              />
            </div>
          </div>
          <div class="col-sm-4 p-0">
            <div class="input-group input-group-sm">
              <div class="input-group-prepend">
                <span class="input-group-text" id="basic-addon1">B</span>
              </div>
              <input
                type="number"
                min="0"
                max="1"
                step="0.1"
                class="form-control"
                v-model="color.b"
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
export default class Color3Control extends Vue {
  controlId?: string;
  private color: {
    r: number;
    g: number;
    b: number;

  } = { r: 0, g: 0, b: 0 };

  control!: BehaviorControl;

  get type (): string {
    return this.control?.type || ''
  }

  get name (): string {
    return this.control?.name || ''
  }

  get colorPicker (): HTMLInputElement {
    return this.$refs.colorPicker as HTMLInputElement
  }

  mounted () {
    this.$store
      .dispatch('getControl', this.controlId)
      .then((ctrl: BehaviorControl) => {
        this.control = ctrl
        const data = ctrl.data
        this.color = {
          r: data.r,
          g: data.g,
          b: data.b
        }
        this.colorPicker.value = Utils.rgbToHex(data.r, data.g, data.b)
      })
  }

  colorPickerUpdate (e: any) {
    const color = Utils.hexToRgb(e.target.value)
    if (color) {
      this.control.data.r = color.r / 255
      this.control.data.g = color.g / 255
      this.control.data.b = color.b / 255

      this.color.r = color.r / 255
      this.color.g = color.g / 255
      this.color.b = color.b / 255
    }
  }

  update () {
    this.control.data.r = this.color.r
    this.control.data.g = this.color.g
    this.control.data.b = this.color.b
  }
}
</script>
