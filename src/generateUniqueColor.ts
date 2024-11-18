export function generateUniqueColor(key: string, fallBackColor = '#224160', colorMap: Record<string, string> = {}): string {
    if (key.length === 0) return fallBackColor
    if (key in colorMap) {
        return colorMap[key]
    }
    let hash = 0
    key.split('').forEach((char) => {
      hash = char.charCodeAt(0) + ((hash << 5) - hash)
    })
    let hashToNum = Math.abs(hash)
    const color =
      'hsl(' +
      (hashToNum % 330) +
      ',' +
      (25 + (hashToNum % 70)) +
      '%,' +
      (50 + (hashToNum % 10)) +
      '%)'
    return color
}