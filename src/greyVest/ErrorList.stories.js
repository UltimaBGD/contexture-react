import React from 'react'
import { storiesOf } from '@storybook/react'
import { Flex, Box, ErrorList, TextInput } from '.'
import decorator from './stories/decorator'

storiesOf('Components|GreyVest Library/Error', module)
  .addDecorator(decorator)
  .addWithJSX('Text', () => <ErrorList>I am an error</ErrorList>)
  .addWithJSX('Block', () => (
    <ErrorList block>
      {['Error 1', 'Error 2', ['Error 3A', 'Error 3B']]}
    </ErrorList>
  ))
  .addWithJSX('Form Demo', () => (
    <Box>
      <h1 style={{ margin: '15px 0' }}>Header</h1>
      <ErrorList block>Block error</ErrorList>
      <Flex column style={{ marginBottom: 25 }}>
        <Flex as="label" column style={{ flex: 1 }}>
          <div className="filter-field-label" style={{ marginBottom: 14 }}>
            Label
          </div>
          <TextInput style={{ borderColor: '#D75050' }} />
        </Flex>
        <ErrorList>Text error</ErrorList>
      </Flex>
    </Box>
  ))
