import React from 'react'
import styled from 'styled-components'

function StatTableItem(props) {
  return (
    <StyledStatTableItem divider={props.divider}>
      <StatLabel>{props.label}</StatLabel>
      <StatValue>
        <StatValueLarge>{props.value}</StatValueLarge>
        <StatValueSmall>{props.valueSmall}</StatValueSmall>
      </StatValue>
    </StyledStatTableItem>
  )
}

const StyledStatTableItem = styled.div`
  display: flex;
  width: 100%;
  height: 40px;
  align-items: center;
  border-bottom: ${(props) =>
    props.divider === false ? 'none' : '1px solid #ECECEC'};
`

const StatLabel = styled.div`
  flex: 1;
  font-weight: 500;
  font-size: 14px;
  color: ${(props) => props.theme.labelColor};
  padding-top: 1px;
`

const StatValue = styled.div`
  flex: 1;
  font-weight: 500;
  font-size: 18px;
  color: ${(props) => props.theme.valueColor};

  padding-left: 74px;
  @media only screen and (min-width: 960px) {
    padding-left: 0;
  }
`

const StatValueLarge = styled.div`
  display: inline;
  margin-right: 2px;
`

const StatValueSmall = styled.div`
  display: inline;
  font-size: 14px;
`

export default StatTableItem
