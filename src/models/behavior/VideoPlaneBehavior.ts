
import { ArcRotateCamera, Material, Node, Scene, VideoTexture } from '@babylonjs/core'
import { Color3, Plane, Vector3 } from '@babylonjs/core/Maths'
import { BehaviorCreateOptions, NodeRoute, SceneBehavior } from './Behaviors'
import { TransformNode, Mesh, MeshBuilder } from '@babylonjs/core/Meshes'
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial'
import { Options } from 'vue-class-component'
import Utils from '../../Utils'

export interface VideoPlaneOptions extends BehaviorCreateOptions {
  width: number;
  height: number;
}

export default class VideoPlaneBehavior extends SceneBehavior<VideoPlaneOptions> {
    private plane: Mesh | null | undefined
    private material!: StandardMaterial
    constructor (options: VideoPlaneOptions) {
      super(options, 'VideoPlane')
      this.options = options
    }

    attach (target: TransformNode) {
      super.attach(target)
      this.plane = MeshBuilder.CreatePlane('', {
        width: this.options.width,
        height: this.options.height
      })
      this.plane.rotation.z = Math.PI
      this.plane.position = new Vector3(0, 0, 10)
      this.plane.parent = target

      this.material = new StandardMaterial('', this.scene)
      this.plane.material = this.material
      this.addControl({ name: 'Position', data: this.plane.position, type: 'vector3', id: Utils.uuidv4() })
      this.addControl({ name: 'Rotation', data: this.plane.rotation, type: 'vector3', id: Utils.uuidv4() })
      this.material.emissiveColor = Color3.White()
      this.addControl({ name: 'Emissive', data: this.material.emissiveColor, type: 'color3', id: Utils.uuidv4() })

      VideoTexture.CreateFromWebCam(this.scene, (vTex) => {
        if (this.plane) {
          this.material.diffuseTexture = vTex
        }
      }, this.$store.state.sceneState.videoTextureConstraints[0])
    }

    detach () {
      super.detach()
      if (this.plane) {
        if (this.plane.material) {
          this.plane.material.dispose()
        }
        this.plane.dispose()
        this.plane = null
      }
    }
}
