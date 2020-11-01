import React from 'react'
import styled, {
  createGlobalStyle,
  keyframes,
  ThemeProvider,
} from 'styled-components'
import moment from 'moment'
import Humanize from 'humanize-plus'
import Big from 'big.js'
import { withCookies, Cookies } from 'react-cookie'

import 'typeface-work-sans'

import { ReactComponent as Logo } from '../assets/logo.svg'
import { ReactComponent as LogoDark } from '../assets/logo-dark.svg'
import { ReactComponent as IconKeep } from '../assets/icon-keep.svg'
import { ReactComponent as IconLock } from '../assets/icon-lock.svg'
import { ReactComponent as IconTBTC } from '../assets/icon-tbtc.svg'

import StatSingleCard from './StatSingleCard'
import StatTableCard from './StatTableCard'
import StatTableItem from './StatTableItem'

const ETHPLORER_KEY = 'EK-nMxV5-HK1sNWU-5NQh7'

const KEEP_ADDRESS = '0x85Eee30c52B0b379b046Fb0F85F4f3Dc3009aFEC'

const urlToFetchKeepToken = `https://api.ethplorer.io/getTokenInfo/${KEEP_ADDRESS}?apiKey=${ETHPLORER_KEY}`

const QUERY_TBTCTOKENS = `
{
  tbtctokens {
    currentTokenHolders
    totalMint
    totalBurn
    totalSupply
  }
}`

const QUERY_TOTAL_BONDED_ECDSA_KEEPS = `
{
  totalBondedECDSAKeeps {
    id
    totalAvailable
    totalBonded
    totalKeepActive
    totalKeepOpened
  }
}`

const QUERY_TOKEN_STAKINGS = `
{
  tokenStakings {
    contractAddress
    totalStaker
    totalTokenStaking
    totalTokenSlash
    members(first: 5, where: {stakingState: STAKED}, orderBy: amount, orderDirection: desc) {
      id
      amount
    }
  }
}`

const QUERY_ACTIVE_DEPOSITS = `
{
  stats: statsRecord(id: "current") { btcInActiveDeposits }  
}`

const initForQuery = (query) => ({
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ query, variables: {} }),
})

const THEMES = {
  dark: {
    bodyBg: '#1d1d1d',
    cardBg: '#444444',
    cardLoadingBg: '#262626',
    labelColor: '#aaaaaa',
    valueColor: '#ffffff',
  },
  light: {
    bodyBg: '#f4f4f4',
    cardBg: '#ffffff',
    cardLoadingBg: '#F8F8F8',
    labelColor: '#8c8c8c',
    valueColor: '#000000',
  },
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dark: !!props.cookies.get('dark'),
      ready: false, // initial fetch complete
      updating: false,
      updateTime: null,
      data: {
        ethPrice: 0,
        btcPrice: 0,
        keepMarketCap: 0,
        keepSupply: 0,
        keepCirculating: 0,
        keepPrice: 0,
        keepETHPrice: 0,
        keepBTCPrice: 0,
        keepHolders: 0,
        tbtcSupply: 0,
        tbtcMint: 0,
        tbtcBurn: 0,
        tbtcHolders: 0,
        deposits: 0,
        depositedBTC: 0,
        depositValue: 0,
        bondedEth: 0,
        bondedEthValue: 0,
        unbondedEth: 0,
        unbondedEthValue: 0,
        stakedKeep: 0,
        stakedKeepValue: 0,
        TVL: 0,
      },
    }
  }

  toggleDark = () => {
    const toggledDark = !this.state.dark
    this.props.cookies.set('dark', toggledDark, { path: '/' })
    this.setState({ dark: toggledDark })
  }

  fetchAllData = async () => {
    const results = await Promise.all([
      fetch(urlToFetchKeepToken),
      fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
      ),
      fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'
      ),
      fetch(
        'https://api.thegraph.com/subgraphs/name/suntzu93/tbtc',
        initForQuery(QUERY_TBTCTOKENS)
      ),
      fetch(
        'https://api.thegraph.com/subgraphs/name/suntzu93/tbtc',
        initForQuery(QUERY_TOTAL_BONDED_ECDSA_KEEPS)
      ),
      fetch(
        'https://api.thegraph.com/subgraphs/name/suntzu93/keepnetwork',
        initForQuery(QUERY_TOKEN_STAKINGS)
      ),
      fetch('https://api.coingecko.com/api/v3/coins/keep-network'),
      fetch(
        'https://api.thegraph.com/subgraphs/name/miracle2k/all-the-keeps',
        initForQuery(QUERY_ACTIVE_DEPOSITS)
      ),
    ])

    const resultsJson = Promise.all(
      results.map(async (result) => result.json())
    )

    console.log(results)
    return resultsJson
  }

  updateData = async () => {
    console.log('updateData')
    if (this.state.updating) {
      return
    }
    this.setState({
      updating: true,
    })
    try {
      const results = await this.fetchAllData()
      console.log(results)
      const data = {
        ethPrice: results[1].ethereum.usd,
        btcPrice: results[2].bitcoin.usd,
        keepMarketCap: results[6].market_data.market_cap.usd,
        keepSupply: results[6].market_data.total_supply,
        keepCirculating: results[6].market_data.circulating_supply,
        keepPrice: results[0].price.rate,
        keepETHPrice: results[6].market_data.current_price.eth,
        keepBTCPrice: results[6].market_data.current_price.btc,
        keepHolders: results[0].holdersCount,
        tbtcSupply: results[3].data.tbtctokens[0].totalSupply,
        tbtcMint: results[3].data.tbtctokens[0].totalMint,
        tbtcBurn: results[3].data.tbtctokens[0].totalBurn,
        tbtcHolders: results[3].data.tbtctokens[0].currentTokenHolders,
        deposits: results[4].data.totalBondedECDSAKeeps[0].totalKeepActive,
        depositedBTC: Big(results[7].data.stats.btcInActiveDeposits)
          .div(10 ** 8)
          .toFixed(2),
        depositValue: 0,
        bondedEth: results[4].data.totalBondedECDSAKeeps[0].totalBonded,
        bondedEthValue: 0,
        unbondedEth: results[4].data.totalBondedECDSAKeeps[0].totalAvailable,
        unbondedEthValue: 0,
        stakedKeep: results[5].data.tokenStakings[0].totalTokenStaking,
        stakedKeepValue: 0,
        TVL: 0,
      }

      data.depositValue = data.depositedBTC * data.btcPrice
      data.stakedKeepValue = data.stakedKeep * data.keepPrice
      data.bondedEthValue = data.bondedEth * data.ethPrice
      data.unbondedEthValue = data.unbondedEth * data.ethPrice
      data.TVL =
        data.bondedEthValue +
        data.unbondedEthValue +
        data.stakedKeepValue +
        data.depositValue

      console.log(data)

      this.setState({
        data,
        ready: true,
        updating: false,
        updateTime: moment(),
        error: null,
      })
    } catch (e) {
      console.log('err', e)
      this.setState({
        updating: false,
        error: e,
      })
    }
  }

  async componentDidMount() {
    await this.updateData()
    this.timerID = setInterval(this.updateData, 60 * 1000)
  }

  componentWillUnmount() {
    clearInterval(this.timerID)
  }

  render() {
    const { ready, updating, updateTime, data, error, dark } = this.state
    return (
      <ThemeProvider theme={THEMES[dark ? 'dark' : 'light']}>
        <Layout>
          <GlobalStyle dark={dark} />
          <Header>
            <a href="/">{dark ? <LogoDark /> : <Logo />}</a>
            <UpdateStatus>
              {updating && <LoadingIndicator />}
              <UpdateLink href="/" error={error}>
                {error && 'API Error'}
                {!error && !ready && 'Loading'}
                {!error &&
                  ready &&
                  `Updated ${updateTime.format(
                    'h:mm'
                  )}\u00A0${updateTime.format('A')}`}
              </UpdateLink>
            </UpdateStatus>
          </Header>
          <Cards>
            <StatSingleCard
              iconColor="#0A0806"
              label="TBTC Supply"
              value={Humanize.formatNumber(data.tbtcSupply, 2)}
              valueSmall="TBTC"
              ready={ready}
            >
              <IconTBTC />
            </StatSingleCard>
            <StatSingleCard
              iconColor="#7850CD"
              label="Total Value Locked"
              value={`$${Humanize.compactInteger(data.TVL, 2)}`}
              valueSmall="USD"
              ready={ready}
            >
              <IconLock />
            </StatSingleCard>
            <StatSingleCard
              iconColor="#48DBB4"
              label="KEEP Token Price"
              value={`$${Humanize.formatNumber(data.keepPrice, 2)}`}
              valueSmall="USD"
              ready={ready}
            >
              <IconKeep />
            </StatSingleCard>
          </Cards>
          <Cards>
            <StatTableCard label="tBTC System Stats" ready={ready}>
              <StatTableItem
                label="TBTC Minted"
                value={Humanize.formatNumber(data.tbtcMint, 2)}
                valueSmall="TBTC"
              />
              <StatTableItem
                label="TBTC Burned"
                value={Humanize.formatNumber(data.tbtcBurn, 2)}
                valueSmall="TBTC"
              />
              <StatTableItem
                label="TBTC Holders"
                value={Humanize.formatNumber(data.tbtcHolders)}
                valueSmall=""
              />
              <StatTableItem
                label="Deposits"
                value={Humanize.formatNumber(data.deposits)}
                valueSmall=""
              />
              <StatTableItem
                label="Deposited"
                value={Humanize.formatNumber(data.depositedBTC, 2)}
                valueSmall="BTC"
              />
              <StatTableItem
                label="Deposited Value"
                value={`$${Humanize.compactInteger(data.depositValue, 2)}`}
                valueSmall="USD"
                divider={false}
              />
            </StatTableCard>
            <StatTableCard label="Staking and Bonding" ready={ready}>
              <StatTableItem
                label="Staked"
                value={Humanize.compactInteger(data.stakedKeep, 2)}
                valueSmall="KEEP"
              />
              <StatTableItem
                label="Staked Value"
                value={`$${Humanize.compactInteger(data.stakedKeepValue, 2)}`}
                valueSmall="USD"
              />
              <StatTableItem
                label="Bonded"
                value={Humanize.compactInteger(data.bondedEth, 2)}
                valueSmall="ETH"
              />
              <StatTableItem
                label="Bonded Value"
                value={`$${Humanize.compactInteger(data.bondedEthValue, 2)}`}
                valueSmall="USD"
              />
              <StatTableItem
                label="Unbonded"
                value={Humanize.compactInteger(data.unbondedEth, 2)}
                valueSmall="ETH"
              />
              <StatTableItem
                label="Unbonded Value"
                value={`$${Humanize.compactInteger(data.unbondedEthValue, 2)}`}
                valueSmall="USD"
                divider={false}
              />
            </StatTableCard>
            <StatTableCard label="Keep Stats" ready={ready}>
              <StatTableItem
                label="Market Cap"
                value={`$${Humanize.compactInteger(data.keepMarketCap, 2)}`}
                valueSmall="USD"
              />
              <StatTableItem
                label="Circulating"
                value={Humanize.compactInteger(data.keepCirculating, 2)}
                valueSmall="KEEP"
              />
              <StatTableItem
                label="Total Supply"
                value={Humanize.compactInteger(data.keepSupply, 2)}
                valueSmall="KEEP"
              />
              <StatTableItem
                label="KEEP Holders"
                value={Humanize.formatNumber(data.keepHolders)}
                valueSmall=""
              />
              <StatTableItem
                label="KEEP/BTC Price"
                value={Humanize.formatNumber(data.keepBTCPrice, 8)}
                valueSmall=""
              />
              <StatTableItem
                label="KEEP/ETH Price"
                value={Humanize.formatNumber(data.keepETHPrice, 8)}
                valueSmall=""
                divider={false}
              />
            </StatTableCard>
          </Cards>
          <Footer>
            <DarkLightToggle onClick={this.toggleDark} dark={dark}>
              <DarkLightToggleIndicator />
            </DarkLightToggle>
            <FooterA onClick={this.toggleDark}>Light/Dark</FooterA>{' '}
            &nbsp;&middot;&nbsp;{' '}
            <FooterA
              href="https://github.com/kferretcrypto/keep-stats"
              target="_blank"
            >
              GitHub
            </FooterA>{' '}
            &nbsp;&middot;&nbsp; Data Sources:{' '}
            <FooterA href="https://coingecko.com" target="_blank">
              CoinGecko
            </FooterA>
            ,{' '}
            <FooterA href="https://ethplorer.io" target="_blank">
              Ethplorer
            </FooterA>
            , The Graph (
            <FooterA
              href="https://thegraph.com/explorer/subgraph/suntzu93/keepnetwork"
              target="_blank"
            >
              suntzu93/keepnetwork
            </FooterA>
            ,{' '}
            <FooterA
              href="https://thegraph.com/explorer/subgraph/suntzu93/tbtc"
              target="_blank"
            >
              suntzu93/tbtc
            </FooterA>
            ,{' '}
            <FooterA
              href="https://thegraph.com/explorer/subgraph/miracle2k/all-the-keeps"
              target="_blank"
            >
              miracle2k/all-the-keeps
            </FooterA>
            )
          </Footer>
        </Layout>
      </ThemeProvider>
    )
  }
}

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${(props) => props.theme.bodyBg};
    font-family: Work Sans;
  }
`

const Layout = styled.div`
  margin: 0 auto;
  padding: 10px 16px;

  display: flex;

  flex-direction: column;

  @media only screen and (min-width: 960px) {
    padding: 30px 16px;
    width: 900px;
  }
`

const Header = styled.div`
  display: flex;

  align-items: center;

  margin-bottom: 10px;

  @media only screen and (min-width: 960px) {
    margin-bottom: 30px;
  }
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

  color: ${(props) => (props.error ? '#ff0000' : '#888888')};
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
  margin-left: 16px;
  width: 14px;
  height: 14px;
  border-radius: 10px;
  border: 2px solid #888888;
  border-color: #888888 transparent #888888 transparent;
  animation: ${rotate} 2s linear infinite;
`

const Cards = styled.div`
  display: grid;
  margin-bottom: 10px;

  align-items: start;
  grid-gap: 10px;
  grid-template-columns: 1fr;

  @media only screen and (min-width: 960px) {
    margin-bottom: 30px;
    grid-gap: 30px;
    grid-template-columns: repeat(auto-fit, 280px);
  }
`

const Footer = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;

  font-size: 12px;
  color: #aaa;

  @media only screen and (min-width: 960px) {
    margin-bottom: 30px;
  }
`

const DarkLightToggle = styled.div`
  display: inline-block;
  position: relative;
  top: 2px;
  cursor: pointer;
  margin-right: 6px;
  border: 1px solid #aaa;
  border-radius: 12px;
  height: 12px;
  width: 24px;
  text-align: ${(props) => (props.dark ? 'right' : 'left')};
`

const DarkLightToggleIndicator = styled.div`
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 10px;
  background-color: #aaa;
  margin: 1px 1px;
`

const FooterA = styled.a`
  color: #aaa;
`
export default withCookies(App)
