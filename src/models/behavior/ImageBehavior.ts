
import { ArcRotateCamera, Node, Scene, Texture } from '@babylonjs/core'
import { Vector3 } from '@babylonjs/core/Maths'
import { BehaviorCreateOptions, NodeRoute, SceneBehavior } from './Behaviors'
import { TransformNode } from '@babylonjs/core/Meshes'
import { Options } from 'vue-class-component'
import Utils from '@/Utils'

export type ImageBehaviorOptions = BehaviorCreateOptions

export default class ImageBehavior extends SceneBehavior<ImageBehaviorOptions> {
    static readonly OPTIONS = {

    }

    private _texture?: Texture | null | undefined

    get camera (): Texture| null | undefined {
      return this._texture
    }

    constructor (options: ImageBehaviorOptions) {
      super(options, 'ImageBehavior')
      this.options = options
    }

    attach (target: TransformNode) {
      super.attach(target)
    }

    detach () {
      super.detach()
      if (this._texture) {
        this._texture.dispose()
        this._texture = null
      }
    }
}
