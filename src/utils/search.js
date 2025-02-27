import F from 'futil-js'
import _ from 'lodash/fp'
import { defaultNodeProps } from './schema'

export let oppositeJoin = node =>
  F.getOrReturn('join', node) === 'and' ? 'or' : 'and'

export let randomString = () =>
  Math.random()
    .toString(36)
    .substring(7)

export let blankNode = () => ({ key: randomString() })

export let newNodeFromType = _.curry((type, fields, node) => ({
  type,
  ..._.pick(['key', 'field'], node),
  ...defaultNodeProps(node.field, fields, type),
}))

export let newNodeFromField = ({ field, fields, ...optionalNodeProps }) => {
  let type = _.get([field, 'typeDefault'], fields)
  return {
    type,
    field,
    ...defaultNodeProps(field, fields, type),
    ...optionalNodeProps,
  }
}

export let transformNodeFromField = args => node => ({
  ..._.pick('key', node),
  ...newNodeFromField(args),
})

export let indent = (Tree, parent, node, skipDefaultNode) => {
  // Reactors:
  //   OR -> And, nothing
  //   AND -> OR, others if has value
  //   to/from NOT, others if has value
  let key = randomString()
  Tree.wrapInGroup(_.toArray(node.path), {
    key,
    join: oppositeJoin((parent || node).join),
  })
  if (!skipDefaultNode)
    Tree.add(parent ? [...parent.path, key] : [key], blankNode())
  return Tree.getNode([...parent.path, key])
}

export let getTypeLabel = (tree, type) =>
  _.getOr(F.autoLabel(type), ['types', type, 'label'], tree)

export let getTypeLabelOptions = _.curry((tree, types) =>
  _.map(type => ({ label: getTypeLabel(tree, type), value: type }), types)
)
