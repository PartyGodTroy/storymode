import { Store } from 'vuex'
import { Scene } from '@babylonjs/core/scene'

export interface StoryCommand {
    id: string;
    onActivate: (scene: Scene) => void;
    activationPhrase: string;
}
export class CommandState {
    commandPallete: Array<StoryCommand> = []
}

const commandStore = new Store<CommandState>({
  state: () => new CommandState(),
  actions: {

  },
  /**
     * Mutations
     */
  mutations: {

  },
  getters: {

  }

})

export default commandStore
