export const formatXpValue = (xpValue) => {
  const absXp = Math.abs(xpValue)
  const formattedXp =
    absXp < 1000000
    ? `${(absXp / 1000).toFixed(1)} KB`
    :` ${(absXp / 1000000).toFixed(1)} MB`

  return xpValue < 0 ? formattedXp : formattedXp
}