
import { ArcRotateCamera, Node, Scene } from '@babylonjs/core'
import { Vector3 } from '@babylonjs/core/Maths'
import { BehaviorCreateOptions, NodeRoute, SceneBehavior } from './Behaviors'
import { TransformNode } from '@babylonjs/core/Meshes'
import { Options } from 'vue-class-component'
import Utils from '@/Utils'

export interface ArcRotateCameraOptions extends BehaviorCreateOptions {
  alpha: number;
  beta: number;
  radius: number;
  target: Vector3;
  fov?: number;
  minZ?: number;
  route?: NodeRoute;
}

export default class ArcRotateCameraBehavior extends SceneBehavior<ArcRotateCameraOptions> {
    static readonly OPTIONS = {
      name: 'Main Camera',
      alpha: -Math.PI / 2,
      beta: Math.PI / 2,
      radius: 11,
      target: Vector3.Zero(),
      id: Utils.uuidv4()
    }

    private _camera?: ArcRotateCamera | null | undefined

    get camera (): ArcRotateCamera | null | undefined {
      return this._camera
    }

    constructor (options: ArcRotateCameraOptions) {
      super(options, 'ArcRotateCamera')
      this.options = options
    }

    attach (target: TransformNode) {
      super.attach(target)
      this._camera = new ArcRotateCamera(
        this.options.name,
        this.options.alpha,
        this.options.beta,
        this.options.radius,
        this.options.target,
        this.scene
      )
      if (this.options.fov) {
        this._camera.fov = this.options.fov
      }
      if (this.options.minZ) {
        this._camera.minZ = this.options.minZ
      }
      this._camera.parent = target
    }

    detach () {
      super.detach()
      if (this._camera) {
        this._camera.dispose()
        this._camera = null
      }
    }
}
