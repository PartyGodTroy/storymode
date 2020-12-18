<script lang="ts">
import { createPopper } from '@popperjs/core/lib/createPopper'
import { h } from 'vue'
import { Vue, Options } from 'vue-class-component'
import store from '../appstore'

@Options({

})
export default class ScriptPreview extends Vue {
  get script (): string {
    return this.$store.getters.scriptText
  }

  scriptClick (tagId: string): void {
    console.log(tagId)
  }

  render () {
    const children: Array<any> = []
    const words = this.script.split(' ')
    words.forEach((w, i) => {
      const isTag = w.startsWith('#')
      const tagText = isTag ? w.substring(1) : w
      const tagId = isTag ? `${tagText}${i}` : ''

      const word = h('span',
        {
          class: [{ keyword: isTag, 'simple-word': !isTag }],
          id: tagId,
          onClick: ($event: MouseEvent) => {
            this.scriptClick(tagId)
          },
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
