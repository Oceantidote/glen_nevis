export const errorRemover = () => {
  document.querySelectorAll('.req').forEach(ele => {
    ele.addEventListener("change", (e) => {
      let error = document.getElementById(e.currentTarget.dataset.error)
      if (error) {
        error.remove()
      }
    })
  })
  document.querySelectorAll('.dep').forEach(ele => {
    ele.addEventListener("change", (e) => {
      let error = document.getElementById("departure-error")
      if (error) {
        error.remove()
      }
    })
  })
}
