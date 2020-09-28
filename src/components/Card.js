import React from 'react'
import styled, { createGlobalStyle } from 'styled-components'

function Card(props) {
  return <StyledCard direction={props.direction}>{props.children}</StyledCard>
}

const StyledCard = styled.div`
  display: flex;

  flex-direction: ${(props) => props.direction || 'column'};
  align-items: ${(props) =>
    props.direction === 'column' ? 'flex-start' : 'center'};

  padding: 20px;

  background: #ffffff;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.15);
  border-radius: 20px;
`

export default Card
