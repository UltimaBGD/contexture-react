import React from 'react'
import _ from 'lodash/fp'
import * as F from 'futil-js'
import { observable } from 'mobx'
import { fromPromise } from 'mobx-utils'
import { observer } from 'mobx-react'

import {
  QueryBuilder,
  FilterList,
  Awaiter,
  Flex,
  componentForType,
  FilterAdder,
} from '../../'
import { TextInput, ClampedHTML } from '../DemoControls'
import { ResultCount, PagedResultTable, TypeMap } from '../../exampleTypes'

import Contexture, { updateClient } from './contexture'

let state = observable({
  url: '',
  schemas: null,
  tree: {},
  savedSearch: '',
  showDebug: false,
  overrides: {},
})
let save = () => {
  state.savedSearch = JSON.stringify(state.tree.serialize(), null, 2)
}
let load = () => {
  state.tree = Contexture(JSON.parse(state.savedSearch))
  state.tree.refresh()
  state.schemas.then(schemas => {
    F.mergeOn(schemas, overrideLookups(state.overrides))
  })
}

let changeSchema = schema => {
  state.tree = Contexture({
    key: 'root',
    type: 'group',
    join: 'and',
    schema,
    children: [
      {
        key: 'criteria',
        type: 'group',
        join: 'and',
        children: [],
      },
      {
        key: 'results',
        type: 'results',
        page: 1,
      },
    ],
  })
}

let lookups = {
  display: {
    ClampedHTML,
  },
}
let overrideLookups = _.each(schema => {
  _.each(field => {
    F.eachIndexed((prop, propName) => {
      let override = _.get([propName, prop], lookups)
      field[propName] = override || prop
    }, field)
  }, schema.fields)
})

let updateEs = host => {
  state.url = host
  state.schemas = fromPromise(
    updateClient({ host }).then(x => {
      changeSchema(_.keys(x)[0])
      return x
    })
  )
}

updateEs('https://public-es-demo.smartprocure.us/')

let Debug = ({ value }) => <pre>{JSON.stringify(value, null, 2)}</pre>

let blueBar = {
  background: '#2a4466',
  boxShadow: '0 0 4px rgba(0,0,0,.14), 0 4px 8px rgba(0,0,0,.28)',
  padding: '10px',
}
let whiteBox = {
  boxShadow: '0 1px 3px 0 rgba(0,0,0,.08)',
  background: '#fff',
  padding: '15px',
  margin: '15px',
}

let Story = observer(() => {
  let { tree, schemas } = state
  return (
    <div style={{ background: '#f4f4f4' }}>
      <TextInput value={state.url} onChange={e => updateEs(e.target.value)} />
      {schemas && (
        <Awaiter promise={schemas}>
          {schemas =>
            _.get('tree.schema', tree) && (
              <div>
                <div style={blueBar}>
                  <select
                    value={tree.schema}
                    onChange={e => changeSchema(e.target.value)}
                  >
                    {_.map(
                      x => (
                        <option key={x}>{x}</option>
                      ),
                      _.sortBy(_.identity, _.keys(schemas))
                    )}
                  </select>
                  <button onClick={save}>Save</button>
                  <button onClick={load}>Load</button>
                  <button onClick={F.flip(F.lensProp('showDebug', state))}>
                    {state.showDebug ? 'Hide' : 'Show'} Dev Panel
                  </button>
                </div>
                {state.showDebug && (
                  <div>
                    <Flex>
                      <textarea
                        style={{ width: '50%' }}
                        value={state.savedSearch}
                        onChange={e => {
                          state.savedSearch = e.target.value
                        }}
                      />
                      <Debug style={{ width: '50%' }} value={tree} />
                    </Flex>
                    Overrides:
                    <textarea
                      value={JSON.stringify(state.overrides)}
                      onChange={e => {
                        state.overrides = JSON.parse(e.target.value)
                      }}
                    />
                    <QueryBuilder
                      tree={tree}
                      mapNodeToProps={componentForType(TypeMap)}
                      fields={schemas[tree.tree.schema].fields}
                      path={['root', 'criteria']}
                    />
                  </div>
                )}
                <div>
                  <Flex>
                    <div style={{ flex: 1, ...whiteBox }}>
                      <FilterList
                        tree={tree}
                        path={['root', 'criteria']}
                        mapNodeToProps={componentForType(TypeMap)}
                        fields={schemas[tree.tree.schema].fields}
                      />
                      <FilterAdder
                        tree={tree}
                        path={['root', 'criteria']}
                        fields={schemas[tree.tree.schema].fields}
                        uniqueFields
                      />
                    </div>
                    <div style={{ flex: 4, maxWidth: '80%', ...whiteBox }}>
                      <ResultCount tree={tree} path={['root', 'results']} />
                      <div style={{ overflowX: 'auto' }}>
                        <PagedResultTable
                          tree={tree}
                          path={['root', 'results']}
                          fields={schemas[tree.tree.schema].fields}
                        />
                      </div>
                    </div>
                  </Flex>
                </div>
              </div>
            )
          }
        </Awaiter>
      )}
    </div>
  )
})

export default () => <Story />
