import {
  dateHandler,
  clearFormHandler,
  postcodeSearchHandler,
  unitSelectHandler
} from './form'

export const initForm = () => {
  const form = document.getElementById('quick_book')
  if (!form) {
    return
  }

  dateHandler()
  clearFormHandler()
  postcodeSearchHandler()
  unitSelectHandler()
}
