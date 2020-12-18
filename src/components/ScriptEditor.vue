<style lang="scss">
    .script-container{
        display:flex;
        justify-content: center;
    }
    .scripter{
        width:300px;
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
    // Stash this to store
    // const rawScript = this.scripter.innerHTML
    // const noTags = this.scripter.innerHTML.replace(/(<([^>]+)>)/ig, '')
    // const words = noTags.split(' ')
    // const templateWordSpan = (word: string, id: number) => {
    //   const isHash = word.startsWith('#')
    //   const isBrackets = word.startsWith('[') && word.endsWith(']')
    //   let wordNoSyntax = ''
    //   if (isHash) {
    //     wordNoSyntax = word.substring(1)
    //     return `<span id="${wordNoSyntax + id}" class="keyword" @click="sample">${wordNoSyntax}</span>`
    //   } else if (isBrackets) {
    //     wordNoSyntax = word.substring(1, word.length - 1)
    //     return `<span id="${wordNoSyntax + id}" class="keyword">${wordNoSyntax}</span>`
    //   } else {
    //     return word
    //   }
    // }
    // let newInnerHtml = ''

    // words.forEach((w, i) => {
    //   newInnerHtml += ' ' + templateWordSpan(w, i)
    // })
    // this.scripterActions.innerHTML = newInnerHtml
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
