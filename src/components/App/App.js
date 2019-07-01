import React, { Component } from 'react';
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
      return parseFloat(value).toFixed(2)
    case 'number':
      return value ? value.toFixed(2) : ''
    default:
      return null
  }
}

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      intervalID: '',
      exchangeFromInput: '',
      exchangeToInput: '',
      isBalanceAvailable: false
    }
    this.recursiveRatesFetch = this.recursiveRatesFetch.bind(this)
    this.onChangePocket = this.onChangePocket.bind(this)
    this.onChangeInput = this.onChangeInput.bind(this)
    this.setComponentState = this.setComponentState.bind(this)
    this.onClickExchangeCta = this.onClickExchangeCta.bind(this)
    this.setInputState = this.setInputState.bind(this)
  }

  /**
   * start fetching rates (every 10 seconds) with assign base passed as argument
   * @param base USD | GBP | EUR
   */
  recursiveRatesFetch(base) {
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
  onChangePocket(section, e) {
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
  onClickExchangeCta () {
    if (this.state.exchangeFromInput) {
      this.props.setPocketBalance({
        ...this.props.exchange.from,
        balance: normalizeNumb(this.props.exchange.from.balance - parseFloat(this.state.exchangeFromInput))
      })
      this.props.setPocketBalance({
        ...this.props.exchange.to,
        balance: normalizeNumb(this.props.exchange.to.balance + parseFloat(this.state.exchangeToInput))
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
  onChangeInput(section, value) {
    this.props.setExchangeInput({
      section,
      value
    })
  }

  setInputState (section, value, rate) {
    const isFrom = section === 'from'
    const change = normalizeNumb((isFrom ? (value * rate) : (value / rate))) || ''

    this.onChangeInput(section, change)

    return {
      exchangeFromInput: isFrom ? value : change,
      exchangeToInput: !isFrom ? value : change,
    }
  }

  /**
   *
   */
  setComponentState () {
    const from = this.props.exchange.from
    const to = this.props.exchange.to
    const rate = this.props.rates[to.currencyCode]
    let newState

    const isSamePocket = (from.currencyCode === to.currencyCode)

    if (this.state.exchangeFromInput !== from.inputValue) {
      const change = normalizeNumb(from.inputValue * rate) || ''
      newState = {
        exchangeFromInput: from.inputValue,
        exchangeToInput: change,
        isBalanceAvailable: ((from.balance - normalizeNumb(from.inputValue)) >= 0) && !isSamePocket
      }
      this.onChangeInput('to', change)
    }
    if (this.state.exchangeToInput !== to.inputValue) {
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

  componentDidUpdate() {
    if (this.props.exchange.from) {
      this.setComponentState()
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

const mapStateToProps = ({rates, exchange, pockets }) => ({ rates, exchange, pockets })
const mapDispatchToProps = (dispatch) => bindActionCreators({
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
