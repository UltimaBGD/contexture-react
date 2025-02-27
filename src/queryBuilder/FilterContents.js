import * as F from 'futil-js'
import _ from 'lodash/fp'
import React from 'react'
import { observer } from 'mobx-react'
import { Dynamic, Grid } from '../greyVest/'
import { ModalPicker } from '../purgatory'
import { fieldsToOptions } from '../FilterAdder'
import { get } from '../utils/mobx-utils'
import {
  newNodeFromType,
  transformNodeFromField,
  getTypeLabelOptions,
} from '../utils/search'
import { withTheme } from '../utils/theme'

let FilterContents = ({
  node,
  tree,
  fields,
  mapNodeToProps = _.noop,
  theme: { Select, UnmappedNodeComponent },
}) => {
  // `get` allows us to create a mobx dependency on field before we know it
  // exists (because the client will only add it if it's a type that uses it
  // as it wouldn't make sense for something like `results`)
  let nodeField = get(node, 'field')
  let typeOptions = _.get([nodeField, 'typeOptions'], fields) || []
  if (node.type && !_.includes(node.type, typeOptions))
    typeOptions = [...typeOptions, node.type]
  let nodeLabel = _.get([nodeField, 'label'], fields) || nodeField
  return (
    <Grid columns="auto auto minmax(0, 1fr)" style={{ width: '100%' }}>
      <ModalPicker
        label={nodeField ? nodeLabel : 'Pick a Field'}
        options={fieldsToOptions(fields)}
        onChange={field =>
          tree.replace(node.path, transformNodeFromField({ field, fields }))
        }
      />
      {nodeField && (
        <div style={{ margin: '0 5px' }}>
          <Select
            onChange={({ target: { value: type } }) => {
              tree.replace(node.path, newNodeFromType(type, fields, node))
            }}
            placeholder="Select Type"
            value={F.when(_.isNil, undefined)(node.type)} // fix null value issue...
            options={getTypeLabelOptions(tree, typeOptions)}
          />
        </div>
      )}
      {node.type && (
        <div
          style={{
            display: 'inline-block',
            verticalAlign: 'top',
            width: '100%',
            marginRight: '5px',
          }}
        >
          <Dynamic
            {...{
              component: UnmappedNodeComponent,
              tree,
              node,
              ...mapNodeToProps(node, fields),
            }}
          />
        </div>
      )}
    </Grid>
  )
}

export default _.flow(
  observer,
  withTheme
)(FilterContents)
