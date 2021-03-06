import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import './App.css'
import Pocket from 'components/Pocket/Pocket'
import {
  fetchRates,
  setExchangePocket,
  setExchangeInput,
  updateExchange,
  fetchPockets,
  setPocketBalance
} from 'actions/index'

const normalizeNumb = value => {
  switch (typeof value ) {
    case 'string':
      return parseFloat(value)
    case 'number':
      return value ? value : ''
    default:
      return null
  }
}

class App extends Component {

  state = {
    intervalID: '',
    exchangeFromInput: '',
    exchangeToInput: '',
    isBalanceAvailable: false
  }

  /**
   * start fetching rates (every 10 seconds) with assign base passed as argument
   * @param base USD | GBP | EUR
   */
  recursiveRatesFetch = base => {
    clearInterval(this.state.intervalID)

    this.props.fetchRates(base)
    
    this.setState({
      intervalID: setInterval(() => this.props.fetchRates(base), 10000)
    })
  }

  /**
   * on change dropdown selection
   * @param section from | to
   * @param e
   */
  onChangePocket = (section, e) => {
    this.props.setExchangePocket({
      section,
      pocket: this.props.pockets.find(p => p.currencyCode === e.target.value)
    })
    if (section === 'from') {
      this.recursiveRatesFetch(e.target.value)
    }
  }

  /**
   * triggered on exchange cta click
   * change balance in active pockets and update the view
   */
  onClickExchangeCta = () => {
    if (this.state.exchangeFromInput) {

      this.props.setPocketBalance({
        ...this.props.exchange.from,
        balance: (normalizeNumb(this.props.exchange.from.balance) - normalizeNumb(this.state.exchangeFromInput)).toFixed(2)
      })
      this.props.setPocketBalance({
        ...this.props.exchange.to,
        balance: (normalizeNumb(this.props.exchange.to.balance) + normalizeNumb(this.state.exchangeToInput)).toFixed(2)
      })
      // update balance view
      // next tick needed to have pockets updated
      setTimeout(() => {
        this.props.updateExchange([
          { ...this.props.pockets.find(p => (p.currencyCode === this.props.exchange.from.currencyCode)) },
          { ...this.props.pockets.find(p => (p.currencyCode === this.props.exchange.to.currencyCode)) }
        ])
      })
    }
  }

  /**
   * set input value in exchange store
   * @param section from | to
   * @param value - input value
   */
  onChangeInput = (section, value) => {
    this.props.setExchangeInput({
      section,
      value
    })
  }


  setComponentState = prevProps => {
    const { from, to } = this.props.exchange

    const rate = this.props.rates[to.currencyCode]
    const isSamePocket = (from.currencyCode === to.currencyCode)
    const isRateUpdated = prevProps.rates[to.currencyCode] !== rate

    let newState

    if ((this.state.exchangeFromInput !== from.inputValue) || isRateUpdated) {

      const change = normalizeNumb(from.inputValue * rate) || ''

      newState = {
        exchangeFromInput: from.inputValue,
        exchangeToInput: change,
        isBalanceAvailable: ((from.balance - normalizeNumb(from.inputValue)) >= 0) && !isSamePocket
      }
      this.onChangeInput('to', change)
    }

    if ((this.state.exchangeToInput !== to.inputValue) || isRateUpdated) {
      const change = normalizeNumb(to.inputValue / rate) || ''

      newState = {
        exchangeToInput: to.inputValue,
        exchangeFromInput: change,
        isBalanceAvailable: ((from.balance - change) >= 0) && !isSamePocket
      }

      this.onChangeInput('from', change)
    }
    this.setState(newState)
  }




  render () {
    const { exchange, rates, pockets } = this.props

    let sectionShowed = exchange.to ? (
      <section>
        <Pocket
          pockets={pockets}
          onChangeOption={e => this.onChangePocket('from', e)}
          onChangeInput={value => this.onChangeInput('from', value)}
          inputValue={this.state.exchangeFromInput}
          label={exchange.from.currencyCode}
          balance={exchange.from.balance}
          symbol={exchange.from.symbol}
        />
        <section className='wrapper__bottom'>
          <section className='wrapper__bottom__absolute'>
          <span className='wrapper__bottom__absolute__rate'>
            { `1 ${exchange.from.currencyCode} = ${rates[exchange.to.currencyCode]} ${exchange.to.currencyCode}` }
          </span>
          </section>
          <Pocket
            pockets={pockets}
            onChangeOption={e => this.onChangePocket('to', e)}
            onChangeInput={value => this.onChangeInput('to', value)}
            label={exchange.to.currencyCode}
            balance={exchange.to.balance}
            symbol={exchange.to.symbol}
            inputValue={this.state.exchangeToInput}
            className='wrapper__bottom__pocket'
          />
        </section>

        <section className='wrapper__cta_box'>
          <button
            onClick={this.onClickExchangeCta}
            disabled={!this.state.isBalanceAvailable}
            className='wrapper__cta_box__cta'
          >
            Exchange
          </button>
        </section>
      </section>
    ) : (
      <section>
        <div className='loader'>
        </div>
      </section>
    )

    return (
      <div className='wrapper'>
        { sectionShowed }
      </div>
    )
  }

  componentDidMount() {
    this.props.fetchPockets()
    this.recursiveRatesFetch()
    setTimeout(() => this.props.updateExchange(this.props.pockets))
  }

  componentDidUpdate(prevProps) {
    if (this.props.exchange.from) {
      this.setComponentState(prevProps)
    }
  }
}

App.propTypes = {
  exchange: PropTypes.object,
  pockets: PropTypes.array,
  rates: PropTypes.object,
  fetchPockets: PropTypes.func,
  fetchRates: PropTypes.func,
  updateExchange: PropTypes.func,
  setExchangeInput: PropTypes.func,
  setExchangePocket: PropTypes.func,
  setPocketBalance: PropTypes.func,
}

const mapStateToProps = ({ rates, exchange, pockets }) => ({ rates, exchange, pockets })

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchRates,
  setExchangePocket,
  setExchangeInput,
  updateExchange,
  fetchPockets,
  setPocketBalance
}, dispatch)


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
