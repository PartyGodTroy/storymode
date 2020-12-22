export default class Utils {
  static uuidv4 () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0; const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }

  static componentToHex (c: number) {
    const hex = c.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }

  static rgbToHex (r: number, g: number, b: number) {
    return '#' + Utils.componentToHex(r) + Utils.componentToHex(g) + Utils.componentToHex(b)
  }

  static hexToRgb (hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }
}
