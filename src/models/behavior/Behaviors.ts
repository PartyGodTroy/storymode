import { ArcRotateCamera, BouncingBehavior, Camera, Node } from '@babylonjs/core'
import { Behavior, IBehaviorAware } from '@babylonjs/core/Behaviors/behavior'
import { Mesh, TransformNode } from '@babylonjs/core/Meshes'
import { Scene } from '@babylonjs/core/scene'
import { ICamera } from '@babylonjs/loaders/glTF/2.0'
import Utils from '../../Utils'
import store from '../../appstore'
import { AppState } from '../../states/AppState'
import { Store } from 'vuex'
import { Vector3 } from '@babylonjs/core/Maths'

export interface NodeRoute {
  sceneId: string;
  nodeId: string;
}

export interface BehaviorCreateOptions {
  name: string;
  id: string;
  type: string;
  /**
   * when passing behavior options it is benificial to pick a scene, and or node to use for the behavior
   */
  route?: NodeRoute;
  removeable?: boolean;

}

export interface BehaviorControl {
  name: string;
  data: any;
  type: string;
  id: string;
}

export abstract class SceneBehavior<T extends BehaviorCreateOptions> implements Behavior<TransformNode> {
  controls: BehaviorControl[] = []

  get removeable () {
    if (this.options.removeable) {
      return true
    }
    return false
  }

  get id () {
    return this.options.id
  }

  get name () {
    return this.options.name
  }

  set name (val: string) {
    this.options.name = val
  }

  readonly originalOptions: T

  options: T

  readonly type: string

  private _target!: TransformNode

  get target (): Node {
    return this._target
  }

  get $store (): Store<AppState> {
    return store
  }

  /**
   * Null until attached is called
   */
  protected get scene (): Scene {
    return this._target.getScene()
  }

  constructor (options: T, type: string) {
    this.originalOptions = this.options = options
    this.type = type
  }

  init () {
    console.log('init')
  }

  attach (target: TransformNode) {
    this._target = target
  }

  detach () {
    console.log('detach')
  }

  remove () {
    this.target.removeBehavior(this)
  }

  addControl (control: BehaviorControl): BehaviorControl {
    this.$store.dispatch('registerControl', control)
    this.controls.push(control)
    return control
  }
}
