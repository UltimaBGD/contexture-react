import F from 'futil-js'
import { expandProp } from '../utils/react'

export let openBinding = (...lens) => ({
  isOpen: F.view(...lens),
  onClose: F.off(...lens),
})

export let bindOpenLens = expandProp('open', openBinding)
