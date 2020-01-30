export const initLabelPrinting = () => {
  $('#print-btn').click(() => {
    printTicket()
  })
}

const printTicket = () => {
  const e = document.getElementById('print_quantity')
  const print_quantity = e.value
  const i = 0
  const myLoop = () => {
    setTimeout(() => {
      console.log(i)
      printDiv('printableArea')
      i++
      if (i < print_quantity) {
        myLoop()
      }
    }, 200)
    //Wait then redirect
    setTimeout("location.href = '/';", 3000)
  }
  myLoop()
}

const printDiv = divName => {
  var printContents = document.getElementById(divName).innerHTML
  var originalContents = document.body.innerHTML
  document.body.innerHTML = printContents
  window.print()
  document.body.innerHTML = originalContents
}
