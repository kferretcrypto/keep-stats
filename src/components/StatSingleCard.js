import React from 'react'
import styled, { createGlobalStyle } from 'styled-components'

import Card from './Card'

function StatSingleCard(props) {
  return (
    <Card direction="row">
      <Icon color={props.iconColor} />
      <Stat>
        <StatLabel>{props.label}</StatLabel>
        <StatValue>
          <StatValueLarge>{props.value}</StatValueLarge>
          <StatValueSmall>{props.valueSmall}</StatValueSmall>
        </StatValue>
      </Stat>
    </Card>
  )
}

const Icon = styled.div`
  width: 54px;
  height: 54px;
  border-radius: 12px;
  background-color: ${(props) => props.color};
  margin-right: 20px;
`

const Stat = styled.div`
  display: flex;
  flex: 1;
  align-items: center;

  @media only screen and (min-width: 960px) {
    grid-template-columns: repeat(auto-fit, 280px);
    flex-direction: column;
    align-items: flex-start;
  }
`

const StatLabel = styled.div`
  flex: 1;
  font-weight: 500;
  font-size: 14px;
  color: #8c8c8c;
  text-transform: uppercase;
`

const StatValue = styled.div`
  flex: 1;
  font-size: 30px;
`

const StatValueLarge = styled.div`
  display: inline;
  margin-right: 4px;
`

const StatValueSmall = styled.div`
  display: inline;
  font-size: 18px;
`

export default StatSingleCard
