import { dateHandler } from './form/dateHandler'
import { clearFormHandler } from './form/clearFormHandler'

export const initForm = () => {
  const form = document.getElementById('quick_book')
  if (!form) {
    return
  }
  dateHandler()
  clearFormHandler()
}
