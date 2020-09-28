import React from 'react'
import styled, { createGlobalStyle, keyframes } from 'styled-components'
import moment from 'moment'

import 'typeface-work-sans'

import { ReactComponent as Logo } from '../assets/logo.svg'
import { ReactComponent as IconKeep } from '../assets/icon-keep.svg'
import { ReactComponent as IconLock } from '../assets/icon-lock.svg'
import { ReactComponent as IconTBTC } from '../assets/icon-tbtc.svg'

import StatSingleCard from './StatSingleCard'
import StatTableCard from './StatTableCard'
import StatTableItem from './StatTableItem'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ready: false, // initial fetch complete
      updating: true,
      updateTime: null,
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        ready: true,
        updating: false,
        updateTime: moment(),
      })
    }, 1000)
  }

  render() {
    const { ready, updating, updateTime } = this.state
    return (
      <Layout>
        <GlobalStyle />
        <Header>
          <a href="/">
            <Logo />
          </a>
          <UpdateStatus>
            {updating && <LoadingIndicator />}
            <UpdateLink href="/">
              {!ready && 'Loading'}
              {ready &&
                `Updated ${updateTime.format('h:mm')}\u00A0${updateTime.format(
                  'A'
                )}`}
            </UpdateLink>
          </UpdateStatus>
        </Header>
        <Cards>
          <StatSingleCard
            iconColor="#0A0806"
            label="TBTC Supply"
            value="13.57"
            valueSmall="TBTC"
            ready={ready}
          >
            <IconTBTC />
          </StatSingleCard>
          <StatSingleCard
            iconColor="#7850CD"
            label="Total Value Locked"
            value="$25.71M"
            valueSmall="USD"
            ready={ready}
          >
            <IconLock />
          </StatSingleCard>
          <StatSingleCard
            iconColor="#48DBB4"
            label="KEEP Token Price"
            value="$1.33"
            valueSmall="USD"
            ready={ready}
          >
            <IconKeep />
          </StatSingleCard>
        </Cards>
        <Cards>
          <StatTableCard label="tBTC System Stats" ready={ready}>
            <StatTableItem label="TBTC Minted" value="39" valueSmall="TBTC" />
            <StatTableItem label="TBTC Burned" value="0.2" valueSmall="TBTC" />
            <StatTableItem label="TBTC Holders" value="39" valueSmall="" />
            <StatTableItem label="Deposits" value="25" valueSmall="" />
            <StatTableItem label="Deposited" value="13.57" valueSmall="BTC" />
            <StatTableItem
              label="Deposited Value"
              value="$0.15M"
              valueSmall="USD"
              divider={false}
            />
          </StatTableCard>
          <StatTableCard label="Staking and Bonding" ready={ready}>
            <StatTableItem label="Staked" value="24.71M" valueSmall="KEEP" />
            <StatTableItem
              label="Staked Value"
              value="$24.54M"
              valueSmall="USD"
            />
            <StatTableItem label="Bonded" value="43.84" valueSmall="ETH" />
            <StatTableItem
              label="Bonded Value"
              value="$16,396"
              valueSmall="USD"
            />
            <StatTableItem label="Unbonded" value="2,882.50" valueSmall="ETH" />
            <StatTableItem
              label="Unbonded Value"
              value="$1.04M"
              valueSmall="USD"
              divider={false}
            />
          </StatTableCard>
          <StatTableCard label="Keep Stats" ready={ready}>
            <StatTableItem label="Market Cap" value="$1.22B" valueSmall="USD" />
            <StatTableItem
              label="Circulating"
              value="0.24B"
              valueSmall="KEEP"
            />
            <StatTableItem
              label="Total Supply"
              value="1.00B"
              valueSmall="KEEP"
            />
            <StatTableItem label="KEEP Holders" value="1,597" valueSmall="" />
            <StatTableItem
              label="KEEP/BTC Price"
              value="0.00009"
              valueSmall="BTC"
            />
            <StatTableItem
              label="KEEP/ETH Price"
              value="0.0026"
              valueSmall="ETH"
              divider={false}
            />
          </StatTableCard>
        </Cards>
      </Layout>
    )
  }
}

const GlobalStyle = createGlobalStyle`
  body {
    background-color: #F4F4F4;
    font-family: Work Sans;
  }
`

const Layout = styled.div`
  margin: 0 auto;
  padding: 30px 10px;

  display: flex;

  flex-direction: column;

  @media only screen and (min-width: 960px) {
    width: 900px;
  }
`

const Header = styled.div`
  display: flex;

  align-items: center;

  margin-bottom: 30px;
`

const UpdateStatus = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  text-align: right;
`

const UpdateLink = styled.a`
  margin-left: 10px;

  color: #888888;
  text-decoration: none;
  font-size: 14px;

  &:hover {
    text-decoration: underline;
  }
`

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const LoadingIndicator = styled.div`
  width: 14px;
  height: 14px;
  border-radius: 10px;
  border: 2px solid #888888;
  border-color: #888888 transparent #888888 transparent;
  animation: ${rotate} 2s linear infinite;
`

const Cards = styled.div`
  display: grid;
  margin-bottom: 30px;

  align-items: start;
  grid-gap: 30px;
  grid-template-columns: 1fr;

  @media only screen and (min-width: 960px) {
    grid-template-columns: repeat(auto-fit, 280px);
  }
`

export default App
