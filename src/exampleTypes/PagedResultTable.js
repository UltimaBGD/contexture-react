import React from 'react'
import { Flex } from '../greyVest'
import ResultPager from './ResultPager'
import ResultTable from './ResultTable'

let PagedResultTable = ({ tree, node, path, ...props }) => (
  <>
    <ResultTable {...{ tree, node, path, ...props }} />
    <Flex style={{ justifyContent: 'space-around', padding: '10px' }}>
      <ResultPager {...{ tree, node, path }} />
    </Flex>
  </>
)
export default PagedResultTable
