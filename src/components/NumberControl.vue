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
                <span class="input-group-text" id="basic-addon1">value</span>
              </div>
              <input
                type="number"
                class="form-control"
                v-model="num.val"
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
export default class NumberControl extends Vue {
  controlId?: string;
  private num: {
    val: number;
  } = { val: 0 };

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
        this.num = {
          val: data.val
        }
      })
  }

  update () {
    this.control.data.val = this.num.val
  }
}
</script>
