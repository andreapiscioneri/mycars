import { useI18n } from 'vue-i18n'

export const useCarTranslations = () => {
  const { t } = useI18n()

  const translatePowerSource = (value) => {
    if (!value) return value
    const key = `category.values.powerSource.${value.toLowerCase()}`
    const translated = t(key)
    return translated !== key ? translated : value
  }

  const translateSeller = (value) => {
    if (!value) return value
    const key = `category.values.seller.${value.toLowerCase()}`
    const translated = t(key)
    return translated !== key ? translated : value
  }

  const translateColor = (value) => {
    if (!value) return value
    const key = `category.values.color.${value.toLowerCase()}`
    const translated = t(key)
    return translated !== key ? translated : value
  }

  return {
    translatePowerSource,
    translateSeller,
    translateColor
  }
}
