import React from 'react';
import ReactDOM from 'react-dom';
import EOS from 'eosjs';
require('isomorphic-fetch');
import ecc from 'eosjs-ecc'

// style import
import './stylesheet/app.css';

// Private key: 5JRLwTK2RBRkD6xdvFLAjWUtFGJugXGzHQPemMix1DNbrkBMLhg
// Public key: EOS7m2mn4pmm44WcDKLfaVxMqGPomYTPcddocddt48UcpwZHnpLqU

// var eos;

function sign_transaction(buf, transaction, wallet_url, public_keys, sign) {
  var params = [transaction,
                  // ["EOS6RZJw3hnLBvtS95HwvvfsRd2vJjKhQ9n4gxEkJrw2jewX4stbR"],
                  public_keys, 
                  ""];
  const body = JSON.stringify(params);
  // const body = JSON.stringify(transaction);
  console.log(body);

  const fetchConfiguration = {body, method: 'POST'}
  
  return fetch(wallet_url, fetchConfiguration).then(response => {
    // console.log(response.text());
    if (response.status >= 200 && response.status < 300) {
      return response.json().then(jsonResp => {
        console.log(jsonResp.signatures);
        var good_sigs = [sign(buf, "5KPDSi3xdfW1wUc26kqB838as4N8aWcCsC8dApkzTctzQ4HhJNY")];
        console.log(good_sigs);
        // return good_sigs;
        return jsonResp.signatures;
      });
    } else {
      return response.text().then(bodyResp => {
        const error = new Error(bodyResp)
        error.status = response.status
        error.statusText = response.statusText
        throw error
      })
    }
  })
}


function urlSignProvider() {
  return function (_ref) {
      var buf = _ref.buf,
          transaction = _ref.transaction,
          sign = _ref.sign,
          wallet_url = "http://127.0.0.1:8889/v1/wallet/sign_transaction";

      var eos = EOS.Localnet();
      return eos.getRequiredKeys(transaction, 
        ["EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV",
        "EOS6RZJw3hnLBvtS95HwvvfsRd2vJjKhQ9n4gxEkJrw2jewX4stbR"])
        .then(result => {
          console.log(result);
          // return result;
          return sign_transaction(buf, transaction, wallet_url, result.required_keys,sign);
      });
  }
}

const title = "My Minimal React Webpack Babel EOS WebApp Setup";
const EOS_CONFIG = {
  // can NOT use eosio to create account here.
  creator: "dice",
  initPublicKey: "EOS6RZJw3hnLBvtS95HwvvfsRd2vJjKhQ9n4gxEkJrw2jewX4stbR",
  contractName: "",
  contractSender: "",
  clientCongfig: {
    // keyProvider: [
    //   '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3',  // init pb wif
    //   '5JRLwTK2RBRkD6xdvFLAjWUtFGJugXGzHQPemMix1DNbrkBMLhg', 
    //   '5JPMf125tcqjp3DYfKssvsR1fESUML2dcPKt8cose33YriPUUvD'
    // ],

    httpEndpoint: 'http://192.168.1.194:8888',
    signProvider: urlSignProvider()
  }
};

class ContractDemo extends React.Component {
  constructor(props) {
    super(props)
    this.logConsole = this.logConsole.bind(this)
    this.state = {
      output: "Output:",
      block_num: 1,
      account_name: ''
    }
  }

  do_get_currency_stats() {
    let eosClient = EOS.Localnet(EOS_CONFIG.clientCongfig)
    eosClient.getCurrencyStats("eosio.token", "EOS")
      .then((supply) =>{
        this.logConsole(supply)
      })
      .catch((err) => {
        this.logConsole(err)
      })
  }

  do_get_account_balance() {
    let eosClient = EOS.Localnet(EOS_CONFIG.clientCongfig)
    eosClient.getCurrencyBalance("eosio.token", this.state.account_name, "EOS")
      .then((balance) => {
        this.logConsole(balance)
      }).catch((err) => {
        this.logConsole(err)
      })
  }

  do_get_account() {
    let eosClient = EOS.Localnet(EOS_CONFIG.clientCongfig)
    eosClient.getAccount(this.state.account_name)
      .then((account) => {
        this.logConsole(account)
      })
      .catch((err) => {
        this.logConsole(err)
      })
  }

  do_create_account() {
    let eosClient = EOS.Localnet(EOS_CONFIG.clientCongfig)
    // create user
    eosClient.newaccount({
      creator: EOS_CONFIG.creator,
      name: this.state.account_name,
      owner: EOS_CONFIG.initPublicKey,
      active: EOS_CONFIG.initPublicKey,
      recovery: EOS_CONFIG.creator
    }).then((trans) => {
      this.logConsole(trans)
    }).catch((err) => {
      this.logConsole(err)
    })
  }

  do_create_set_permission() {
    let eosClient = EOS.Localnet(EOS_CONFIG.clientCongfig)
    // set account permission.
    eosClient.updateauth({
      account: this.state.account_name,  // account_names
      permission: 'active', // permission
      parent: "owner", // parent
      data: {
              threshold: 1,
              keys: [
                { key: "EOS6RZJw3hnLBvtS95HwvvfsRd2vJjKhQ9n4gxEkJrw2jewX4stbR", weight: 1}
              ],
              accounts: [
              {
                permission: {actor: "dice",permission:"active"},
                weight:1
              }]
            },
      delay: 0 // delay
    }).then((trans) => {
      this.logConsole(trans)
    }).catch((err) => {
      this.logConsole(err)
    })

  }

  do_get_block() {
    let eosClient = EOS.Localnet(EOS_CONFIG.clientCongfig)
    eosClient.getBlock(this.state.block_num).then(result => {this.logConsole(result)})
  }

  do_issue_account() {
    let eosClient = EOS.Localnet(EOS_CONFIG.clientCongfig)

    eosClient.transaction({
      actions: [
        {
          account: 'eosio.token',
          name: 'issue',
          authorization: [{
            actor: 'eosio',
            permission: 'active'
          }],
          data: {
            to: this.state.account_name,
            quantity: '1000.0000 EOS',
            memo: 'issue to ' + this.state.account_name
          }
        }
      ]
    }).then((res) => {
        this.logConsole(res)
    }).catch((err) => {
        this.logConsole(err)
    })

    // eosClient.contract('eosio.token')
    //   .then((contract) => {
    //     contract.issue(this.state.account_name, '1000.0000 EOS', "")
    //       .then((res) => {
    //         this.logConsole(res)
    //       })
    //       .catch((err) => {
    //         this.logConsole(err)
    //       })
    //   })

    // eosClient.issue(this.state.account_name, "1000.000 EOS", "")
    //   .then((result) => {
    //     this.logConsole(result)
    //   })
    //   .catch((err) => {
    //     this.logConsole(err)
    //   })
  }

  do_deposit_action() {
    let eosClient = EOS.Localnet(EOS_CONFIG.clientCongfig)
    eosClient.contract('dice')
      .then((dice) => {
        dice.deposit(this.state.account_name, '100 EOS', { authorization: [this.state.account_name]})
          .then((resp) => { this.logConsole(resp)} )
          .catch((err) => { this.logConsole(err)} )
      })
  }

  do_contract_action() {
    let eosClient = EOS.Localnet(EOS_CONFIG.clientCongfig)

    // test of api
    // eosClient.getBlock(1).then(result => {this.logConsole(result)})

    eosClient.contract(EOS_CONFIG.contractName)
      .then((contract) => {
        contract.action(EOS_CONFIG.contractSender, { authorization: [EOS_CONFIG.contractSender ]})
          .then((res) => { /* do success web */})
          .catch((err) => { /* do error web */})
      })
  }

  handleChange(event) {
    this.setState({
      block_num: event.target.value
    });
  }

  handleAccountChange(event) {
    this.setState({
      account_name: event.target.value
    });
  }

  logConsole(jsonResult) {
    this.setState({
      output: JSON.stringify(jsonResult, null, 2)
    })
  }

  render() {
    return (
      <div>
        <div>{title}</div>
        <div>
          <button onClick={this.do_get_block.bind(this)}>获取Block</button>
          <input type="text" name="blockNum" value={this.state.block_num} onChange={this.handleChange.bind(this)}></input>
        </div>
        <div>
          <button onClick={this.do_get_account.bind(this)}>获取Account信息</button>
          <button onClick={this.do_get_account_balance.bind(this)}>获取Balance信息</button>
          <input type="text" name="account_name" value={this.state.account_name} onChange={this.handleAccountChange.bind(this)}></input>
          <button onClick={this.do_create_account.bind(this)}>--&lt;创建账号&gt;--</button>
          <button onClick={this.do_issue_account.bind(this)}>--&lt;账号发币&gt;--</button>
          <button onClick={this.do_create_set_permission.bind(this)}>--&lt;赋权Permission&gt;--</button>
          <button onClick={this.do_deposit_action.bind(this)}>--&lt;账号充值100EOS&gt;--</button>
          </div>
        <div>
          <button onClick={this.do_get_currency_stats.bind(this)}>获取Currency信息</button>
        </div>

        <textarea className="console" rows="10" cols="50" value={this.state.output} readOnly></textarea>
    </div>
    );
  }
}

ReactDOM.render(
  <ContractDemo />,
  document.getElementById('app')
);

module.hot.accept();
