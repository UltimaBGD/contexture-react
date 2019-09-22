import React from 'react'
import _ from 'lodash/fp'
import F from 'futil-js'
import { Flex } from '../greyVest'

let ErrorText = ({ children }) => (
  <div className="gv-text-error">{children}</div>
)

let ErrorBlock = ({ children, ...props }) => (
  <Flex className="gv-block-error" alignItems="center" {...props}>
    <i className="material-icons" style={{ marginRight: 8 }}>
      warning
    </i>
    <div>
      <ErrorList>{children}</ErrorList>
    </div>
  </Flex>
)

let ErrorList = ({ block = false, children }) => {
  let Component = block ? ErrorBlock : ErrorText
  return F.mapIndexed(
    (e, i) => <Component key={i}>{e}</Component>,
    _.castArray(children)
  )
}

export default ErrorList
