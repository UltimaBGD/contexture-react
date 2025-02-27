import { storiesOf } from '@storybook/react'
import React from 'react'
import { Button, TextInput, Textarea, Select } from '..'
import decorator from './decorator'

let input
let select
let textArea

storiesOf('Components|GreyVest Library', module)
  .addDecorator(decorator)
  .addWithJSX('Refs', () => (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <TextInput ref={e => (input = e)} />
      <Textarea ref={e => (textArea = e)} />
      <Select ref={e => (select = e)} />
      <Button onClick={() => input.focus()}>Focus Input</Button>
      <Button onClick={() => textArea.focus()}>Focus Text Area</Button>
      <Button onClick={() => select.focus()}>Focus Select</Button>
    </div>
  ))
