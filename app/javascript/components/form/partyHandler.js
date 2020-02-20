import { priceFormatter } from './priceFormatter'
import { discountHandler } from './discountHandler'

export const partyHandler = () => {
  $('.party-price').on({
    change: () => {
      let unitId = $('#unit-dropdown').val()
      if (!unitId) return

      const rates = {
        adultRate: 0,
        childRate: 0,
        infantRate: 0
      }

      if ([4484, 4967, 5143, 14425].includes(Number(unitId))) {
        // tents
        rates.adultRate = 1050
        rates.childRate = 250
        rates.infantRate = 0
      } else if ([4915, 22294].includes(Number(unitId))) {
        // caravans
        rates.adultRate = 400
        rates.childRate = 250
        rates.infantRate = 0
      }

      const adultNum = isNaN($('#adults').val()) ? 0 : $('#adults').val()
      const childNum = isNaN($('#children').val()) ? 0 : $('#children').val()
      const infantNum = isNaN($('#infants').val()) ? 0 : $('#infants').val()

      const adultPrice = rates.adultRate * adultNum
      const childPrice = rates.childRate * childNum
      const infantPrice = rates.infantRate * infantNum
      const total = (adultPrice + childPrice + infantPrice) * $('#nights').val()

      const formattedTotal = priceFormatter.format(total / 100)

      $('#party').val(total)
      $('#party_cents').val(total)
      $('#party').text(formattedTotal)
      discountHandler()
    }
  })
}
