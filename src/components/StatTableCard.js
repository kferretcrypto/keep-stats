import React from 'react'
import styled, { createGlobalStyle } from 'styled-components'

import Card from './Card'

function StatTableCard(props) {
  return (
    <Card direction="column" ready={props.ready}>
      <TableLabel>{props.label}</TableLabel>
      {props.children}
    </Card>
  )
}

const TableLabel = styled.div`
  font-size: 20px;
`

export default StatTableCard
