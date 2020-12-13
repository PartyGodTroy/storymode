<style lang="scss" scoped>
    .scripter{
        width:300px;
        height:300px;
        border: 2px dashed gray;
        text-align:start;
        font-size: 15px;
    }
    span.keyword{
        color:dodgerblue;
        font-size: 20px;
    }
</style>
<template>
    <div @input="updateScript" class="scripter" contenteditable="true" ref="scripter">
    </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component'

@Options({

})
export default class ScriptEditor extends Vue {
  scriptText = ''

  scripter!: HTMLDivElement

  mounted () {
    this.scripter = this.$refs.scripter as HTMLDivElement
  }

  updateScript (e: InputEvent) {
    if (!this.scripter) {
      return
    }
    // Stash this to store
    // const rawScript = this.scripter.innerHTML
    const noTags = this.scripter.innerHTML.replace(/(<([^>]+)>)/ig, '')
    const words = noTags.split(' ')
    const templateWordSpan = (word: string) => {
      return `<span class="keyword">${word}</span>`
    }
    let newInnerHtml = ''

    words.forEach(w => {
      newInnerHtml += ' ' + templateWordSpan(w)
    })
    this.scripter.innerHTML = newInnerHtml
    const caretPos = this.getCaretPosition()
    const selection = window.getSelection()
    if (!caretPos || !selection) {
      return // No Selection or something else went wrong
    }
    const range = document.createRange()
    range.setStart(this.scripter, caretPos.caretPos)
    selection.removeAllRanges()
    selection.addRange(range)
  }

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
