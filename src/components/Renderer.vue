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
import { Color3, Color4, Vector3 } from '@babylonjs/core/Maths'
import { MeshBuilder, TransformNode } from '@babylonjs/core/Meshes'
import { Scene } from '@babylonjs/core/scene'
import store from '../appstore'

export default class Renderer extends Vue {
  private _engine!: Engine;
  private _scenes!: Scene[];
  private _defaultScene!: Scene

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
      window.addEventListener('resize', this.onResize)

      this._scenes = []
      this._engine = new Engine(this.canvas)
      this.createDefaultScene()
      this._engine.runRenderLoop(() => {
        this._defaultScene.render()
      })

      // register the viewing canvas
      this.$store.commit('setCanvas', this.canvas)

      console.log('mounted')
    })
  }

  onResize () {
    this._engine.resize()
    console.log('Resizing')
  }

  createScene (): Scene {
    const newScene = new Scene(this._engine)
    this._scenes.push(newScene)
    return newScene
  }

  private createDefaultScene () {
    const scene = this._defaultScene = this.createScene()
    scene.clearColor = new Color4(0, 1, 1, 1)
    const camera = new ArcRotateCamera(
      '',
      -Math.PI / 2,
      Math.PI / 2,
      11,
      new Vector3(0, 0, 0),
      scene
    )

    camera.fov = Math.PI / 2
    camera.minZ = 1e-4

    camera.attachControl(this.canvas, true)
    const mat = new StandardMaterial('mat1', scene)
    mat.emissiveColor = Color3.Blue()
    mat.diffuseColor = Color3.Blue()

    const box = MeshBuilder.CreateBox('box', { size: 5 }, scene)
    box.material = mat
  }
}
</script>
