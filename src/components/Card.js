import React from 'react'
import styled, { createGlobalStyle } from 'styled-components'

function Card(props) {
  return (
    <StyledCard direction={props.direction} ready={props.ready}>
      {props.children}
    </StyledCard>
  )
}

const StyledCard = styled.div`
  display: flex;

  flex-direction: ${(props) => props.direction || 'column'};
  align-items: ${(props) =>
    props.direction === 'column' ? 'flex-start' : 'center'};

  padding: 20px;

  background: ${(props) => (props.ready ? '#FFFFFF' : '#F8F8F8')};
  box-shadow: 0 ${(props) => (props.ready ? '1px' : '-1px')} 0
    rgba(0, 0, 0, 0.15);
  transition: background 0.5s, box-shadow 0.5s;
  border-radius: 20px;

  & > * {
    opacity: ${(props) => (props.ready ? '1' : '0')};
    transition: opacity 0.5s;
  }
`

export default Card
