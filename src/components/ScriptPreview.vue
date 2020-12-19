<script lang="ts">
import { createPopper } from '@popperjs/core/lib/createPopper'
import { h } from 'vue'
import { Vue, Options } from 'vue-class-component'
import store from '../appstore'
import Utils from '../Utils'

@Options({})
export default class ScriptPreview extends Vue {
  selectedTagId = 'none'
  myKey = Utils.uuidv4()
  get script (): string {
    return this.$store.getters.scriptText
  }

  scriptClick (tagId: string): void {
    // add this to state later
    this.selectedTagId = tagId
    console.log(tagId + 'selected')
    this.myKey = Utils.uuidv4()
  }

  render () {
    const children: Array<any> = []
    const lexicon: any = {

    }
    const words = this.script.split(' ')

    console.log('rendering')
    words.forEach((w, i) => {
      const isTag = w.startsWith('#')
      const tagText = isTag ? w.substring(1) : w
      const tagId = isTag ? `${tagText}${i}` : ''

      const word = h('span',
        {
          class:
          [
            {
              keyword: isTag,
              'simple-word': !isTag,
              selected: tagId === this.selectedTagId
            }
          ],
          id: tagId,
          onClick: ($event: MouseEvent) => {
            this.scriptClick(tagId)
          },
          key: this.myKey + tagId,
          ref: tagId
        },
        [tagText]
      )
      children.push(word)
    })
    const render = h('div', { className: ['scripter'] }, children)
    return render
  }
}
</script>
