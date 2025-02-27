import React from 'react'
import F from 'futil-js'
import { observable } from 'mobx'
import { storiesOf } from '@storybook/react'
import { useTheme } from '../utils/theme'
import decorator from './stories/decorator'

storiesOf('Components|GreyVest Library/Modal', module)
  .addDecorator(decorator)
  .addWithJSX('With open prop', () => {
    let open = observable.box(false)
    let { Modal, Button } = useTheme()
    return (
      <>
        <Button onClick={F.on(open)}>Open Modal</Button>
        <Modal open={open}>Some Modal Content</Modal>
      </>
    )
  })
  .addWithJSX('With isOpen/onClose props', () => {
    let [isOpen, setIsOpen] = React.useState(false)
    let { Modal, Button } = useTheme()
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          Some Modal Content
        </Modal>
      </>
    )
  })
