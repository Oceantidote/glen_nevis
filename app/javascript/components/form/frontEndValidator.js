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
    let email = false
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(document.getElementById('email').value)) {
      email = true
    }
    const gdpr = document.getElementById('gdpr').value == "true"
    if (gdpr && blank.length == 0 && email) {
      $('#quick_book').trigger('submit')
    } else {
      if (!email) {
        document.getElementById('email-error').innerHTML = "Invalid email format"
      }
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
