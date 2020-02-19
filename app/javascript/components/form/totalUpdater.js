import { priceFormatter } from './priceFormatter'

export const totalUpdater = () => {
  $('#base').val(0)
  $('#party').val(0)
  $('#addon').val(0)
  $('#discount').val(0)
  $('.sums').on('DOMSubtreeModified', function(e) {
    updateTotal()
  })
}

const updateTotal = () => {
  setTimeout(function() {
    let a = parseInt($('#base').val())
    let b = parseInt($('#party').val())
    let c = parseInt($('#addon').val())
    let d = parseInt($('#discount_cents').val())
    const sum = a + b + c - d
    $('#total').val(sum)
    document.getElementById('total').innerHTML = priceFormatter.format(
      sum / 100
    )
    $('#price_cents').val(sum)
  }, 50)
}
