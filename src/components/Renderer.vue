<template>
  <canvas
    id="renderCanvas"
    :width="width"
    :height="height"
    ref="renderCanvas"
  ></canvas>
</template>
<style lang="scss" scoped>
#renderCanvas {
  border: 1px solid pink;
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
    this.$nextTick(() => {
      if (!this.canvas) {
        console.error('renderCanvas not available')
        return
      }
      this.$store.commit('setEngine', new Engine(this.canvas))
      this.$store.dispatch('addArcRotateCameraBehavior',
        {
          name: 'Main Camera',
          alpha: -Math.PI / 2,
          beta: Math.PI / 2,
          radius: 11,
          target: Vector3.Zero(),
          id: Utils.uuidv4()
        })
      this.$store.dispatch('addVideoPlaneBehavior', {
        id: Utils.uuidv4(),
        name: 'WebCam',
        width: 5,
        height: 5
      }).then(() => {
        console.log('Finished adding video plane')
      })
      // register the viewing canvas with the main store for recording purposes
      this.$store.commit('setCanvas', this.canvas)
    })
  }
}
</script>
