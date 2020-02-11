export const errorRemover = () => {
  document.querySelectorAll('.req').forEach(ele => {
    ele.addEventListener("change", (e) => {
      document.getElementById(e.currentTarget.dataset.error).remove()
    })
  })
  document.querySelectorAll('.dep').forEach(ele => {
    ele.addEventListener("change", (e) => {
      document.getElementById("departure-error").remove()
    })
  })
}
