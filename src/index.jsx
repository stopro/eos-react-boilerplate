import React from 'react';
import ReactDOM from 'react-dom';
import EOS from 'eosjs';

const title = "My Minimal React Webpack Babel EOS WebApp Setup";
const EOS_CONFIG = {
  contractName: "",
  contractSender: "",
  clientCongfig: {
    keyProvider: ['private_key'],
    httpEndpoint: 'http://127.0.0.1:8888'
  }
};

class ContractDemo extends React.Component {
  constructor(props) {
    super(props)
  }

  do_contract_action() {
    let eosClient = EOS.Localnet(EOS_CONFIG.clientCongfig)

    eosClient.contract(EOS_CONFIG.contractName)
      .then((contract) => {
        contract.action(EOS_CONFIG.contractSender, { authorization: [EOS_CONFIG.contractSender ]})
          .then((res) => { /* do success web */})
          .catch((err) => { /* do error web */})
      })
  }

  render() {
    return (
      <div>{title}</div>
    );
  }
}

ReactDOM.render(
  <ContractDemo />,
  document.getElementById('app')
);

module.hot.accept();
