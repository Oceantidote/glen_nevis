export const frontEndValidator = () => {
  document.getElementById('quick_book').addEventListener("submit", (e) => {
    e.preventDefault()
    const req = document.querySelectorAll('.req')
    const blank = []
    req.forEach((element) => {
      if (element.value == "") {
        blank.push(element)
      }
    })
    const gdpr = document.getElementById('gdpr').value == "true"
    if (gdpr && blank.length == 0) {
      $('#quick_book').trigger('submit')
    } else {
      blank.forEach((ele) => {
        let error = document.getElementById(ele.dataset.error)
        error.innerHTML = "Can't be blank"
      })
      if (!gdpr) {
        document.getElementById('gdpr-error').innerHTML = "Must be accepted"
      }
    }
  })
}
