import React from 'react';
import axios from 'axios';
import {_} from 'underscore';
import BankAccountSection from './BankAccountSection';
import StockSection from './StockSection';

// Peter Yeung: ReactJS used huge amount of syntax similar with lambda expression

export default class Portfolio extends React.Component {
  constructor (props) {
    super(props);
    this.state = { 
      user_id: 1,
      accountList: [],
      stockList: []
    };
  }

  // This function is a middle-man between different DOM.
  updateBankAccountList = (updatedAccountList) => {
    this.setState({accountList: updatedAccountList});
  }

  updateStockList = (updatedStockList) => {
    this.setState({stockList: updatedStockList});

    var grouppedStockCodeList = _(this.state.stockList).groupBy('code');
    var grouppedStockSharesList = _(grouppedStockCodeList).map(function(grouppedValue,key) {
      return {
        user_id: String(this.state.user_id),
        stock_code: String(key),
        stock_share: String(_(grouppedValue).reduce(function (m, x) { return m + x.shares; }, 0))
      };
    }, this);

    grouppedStockSharesList.forEach(function (item) {
      axios.post('http://143.89.19.10:3000/stocks/post', [item])
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
    });
  }

  // Rendering section
  render = () => {
    // get data from state, not from props
    const accountList = this.state.accountList;
    const stockList = this.state.stockList;
    const user_id = this.state.user_id;

    return (
      <div>
          <BankAccountSection user_id={user_id} accountList={accountList} updateParentAccountList={this.updateBankAccountList} />
          <StockSection user_id={user_id} stockList={stockList} updateParentStockList={this.updateStockList} />
      </div>
    );
  }
}
