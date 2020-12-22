import { Scene } from '@babylonjs/core/scene'
import { AssetsManager, Engine, Node } from '@babylonjs/core'
import Utils from '../Utils'
import VideoTextureConstraints from '../models/VideoTextureConstraints'
import { SceneBehavior, NodeRoute, BehaviorControl } from '../models/behavior/Behaviors'
import { TransformNode } from '@babylonjs/core/Meshes'

export class SceneState {
  engine!: Engine;
  /**
     * Available after setEngine
     */
  get defaultScene (): Scene {
    return this.scenes[0]
  }

  /**
     * Available after setEngine
     */
  get defaultNode (): Node {
    return this.defaultScene.getNodes()[0]
  }

  private _scenes: Scene[] = [];

  get scenes (): Scene[] {
    return this._scenes
  }

  assetManager!: AssetsManager;
  defaultSceneIsRendering = false;

  readonly allControls: BehaviorControl[] = []

  readonly behaviors: SceneBehavior<any>[] = [];
  readonly rootNodes: Node[] = [];

  videoTextureConstraints: Array<VideoTextureConstraints> = [
    { minHeight: 512, maxHeight: 512, minWidth: 512, maxWidth: 512, deviceId: '' }
  ];

  createScene (): Scene {
    const newScene = new Scene(this.engine)
    const nodeId = Utils.uuidv4()
    // Root nodes have to be transform nodes for the scene to pick them up
    const rootNode = new TransformNode(`Scene${this.scenes.length}`, newScene)
    rootNode.id = nodeId
    this.rootNodes.push(rootNode)
    this._scenes.push(newScene)
    return newScene
  }

  getScene (uid: string | undefined): Scene {
    return this.scenes.find(s => s.uid === uid) || this.defaultScene
  }

  routeBehaviorToTarget (route?: NodeRoute): { scene: Scene; node: Node } {
    // scene with the provided uid or the default scene
    const scene = this.getScene(route?.sceneId) || this.defaultScene

    const nodeId = route?.nodeId || this.defaultNode.id
    // node with provided id on the provided scene || default scene
    // if the node id was not found the behavior is added to the scenes default node
    const node = scene.getNodeByID(nodeId) || this.defaultNode
    return { scene, node }
  }
}
