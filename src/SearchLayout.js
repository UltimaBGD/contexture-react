import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'

let styles = mode => ({
  display: 'grid',
  gridGap: 40,
  margin: '0 40px',
  marginBottom: 50,
  gridTemplateColumns:
    mode === 'basic' ? 'minmax(250px, 400px) minmax(0, 1fr)' : 'minmax(0, 1fr)',
})

let SearchLayout = ({ mode, style, className, ...props }) => (
  <div
    className={`search-layout search-layout-${mode} ${className}`}
    style={{ ...styles(mode), ...style }}
    {...props}
  />
)

SearchLayout.propTypes = {
  mode: PropTypes.oneOf(['basic', 'builder', 'resultsOnly']),
}

export default observer(SearchLayout)
