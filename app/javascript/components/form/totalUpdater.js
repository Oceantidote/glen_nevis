import { priceFormatter } from './priceFormatter'

export const totalUpdater = () => {
  $('#base').val(0)
  $('#party').val(0)
  $('#addon').val(0)
  $('#discount').val(0)
  $('.sums').on('DOMSubtreeModified',function(e){
    updateTotal()
  })
}

const updateTotal = () => {
  setTimeout(function(){
    //do what you need here
    let a = parseInt($('#base').val())
    let b = parseInt($('#party').val())
    let c = parseInt($('#addon').val())
    let d = -parseInt($('#discount').val())
    const values = [a,b,c,d]
    const sum = values.reduce((a, b) => a + b, 0)
    console.log(sum)
    $('#total').val(sum)
    document.getElementById('total').innerHTML = priceFormatter.format(sum/100)
  }, 50);
}
