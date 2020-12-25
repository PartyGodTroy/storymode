<template>
  <canvas
    id="renderCanvas"
    ref="renderCanvas"
  ></canvas>
</template>
<style lang="scss" scoped>
#renderCanvas {
  border: 1px solid pink;
  width:100%;
  height:100%;
  max-width: 1024px;

}
</style>
<script lang="ts">
import { Vue, Options } from 'vue-class-component'
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera'
import { TouchCamera } from '@babylonjs/core/Cameras/touchCamera'
import { Engine } from '@babylonjs/core/Engines'
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight'
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial'
import { Color3, Color4, Space, Vector3 } from '@babylonjs/core/Maths'
import { MeshBuilder, TransformNode } from '@babylonjs/core/Meshes'
import { Scene } from '@babylonjs/core/scene'
import { AssetContainer, AssetsManager, VideoTexture } from '@babylonjs/core'
import Utils from '@/Utils'

export default class Renderer extends Vue {
  get canvas (): HTMLCanvasElement {
    return this.$refs.renderCanvas as HTMLCanvasElement
  }

  get width (): number {
    return this.$store.state.width
  }

  get height (): number {
    return this.$store.state.height
  }

  mounted () {
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(function (stream) {
          stream.getTracks().forEach(t => t.stop())
        })
        .catch(function (err0r) {
          console.log('Something went wrong!')
        })
    }

    this.$nextTick(() => {
      if (!this.canvas) {
        console.error('renderCanvas not available')
        return
      }
      this.$store.commit('setEngine', new Engine(this.canvas))
      this.$store.dispatch('addArcRotateCameraBehavior',
        {
          name: 'Main Camera', // this name is special
          alpha: -Math.PI / 2,
          beta: Math.PI / 2,
          radius: 11,
          target: Vector3.Zero(),
          id: Utils.uuidv4(),
          removeable: false
        })
      this.$store.dispatch('addVideoPlaneBehavior', {
        id: Utils.uuidv4(),
        name: 'WebCam',
        width: 5,
        height: 5,
        removeable: true
      }).then(() => {
        console.log('Finished adding video plane')
      })
      // register the viewing canvas with the main store for recording purposes
      this.$store.commit('setCanvas', this.canvas)
    })
  }
}
</script>
