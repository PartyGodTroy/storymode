<style lang="scss">
    .script-container{
        display:flex;
        justify-content: center;
    }
    .scripter{
        width:500px;
        height:300px;
        border: 2px dashed gray;
        text-align:start;
        font-size: 15px;
        display: inline-block;
    }
    .simple-word{
      &:before{
          content:' ';
        }
    }
    .keyword{
        color:dodgerblue;
        font-size: 20px;
        &:before{
          content:' ';
        }
        &.selected{
          background-color: lightblue;
        }
        cursor:pointer;
    }
</style>
<template>
<div class="script-container">
    <div @input="updateScript" class="scripter" contenteditable="true" ref="scripter">
    </div>
    <ScriptPreview></ScriptPreview>
</div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component'
import { createPopper } from '@popperjs/core'
import ScriptPreview from '@/components/ScriptPreview.vue'
@Options({
  components: {
    ScriptPreview
  }
})
export default class ScriptEditor extends Vue {
  scriptText = ''

  scripter!: HTMLDivElement
  scripterActions!: HTMLDivElement

  mounted () {
    this.scripter = this.$refs.scripter as HTMLDivElement
  }

  updateScript (e: InputEvent) {
    if (!this.scripter) {
      return
    }
    this.$store.commit('setScriptText', this.scripter.innerText)
  }

  /**
 * Unused
 */
  getCaretPosition (): { caretPos: number; range: Range } | null {
    const selection = window.getSelection()
    if (!selection) {
      return null
    }
    if (window.getSelection && selection.getRangeAt) {
      const range = selection.getRangeAt(0)
      const selectedObj = window.getSelection()

      if (!selectedObj) return null
      let rangeCount = 0

      if (!selectedObj.anchorNode || !selectedObj.anchorNode.parentNode) return null
      const childNodes = selectedObj.anchorNode.parentNode.childNodes

      for (let i = 0; i < childNodes.length; i++) {
        const aNode = childNodes[i] as HTMLElement
        if (aNode === selectedObj.anchorNode) {
          break
        }
        if (aNode.outerHTML) { rangeCount += aNode.outerHTML.length } else if (aNode.nodeType === 3) {
          rangeCount += aNode.textContent
            ? aNode.textContent.length
            : 0
        }
      }

      return { caretPos: range.startOffset + rangeCount, range }
    }
    return null
  }
}
</script>
