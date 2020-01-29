export const clearFormHandler = () => {
  $('#clear_form').click(e => {
    e.preventDefault()
    e.currentTarget.closest('form').reset()
  })
}
