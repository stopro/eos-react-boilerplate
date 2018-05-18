
require('isomorphic-fetch');
import EOS from 'eosjs';

function urlSignProvider() {
  return function (_ref) {
      var buf = _ref.buf,
          transaction = _ref.transaction,
          wallet_url = "http://127.0.0.1:8889/v1/wallet/sign_transaction";

      var pks = eos.getRequiredKeys(transaction, []);
      console.log(pks);


      const body = JSON.stringify(params)
      if (debug && logger.debug) {
        logger.debug('api >', url, body)
      }
      const fetchConfiguration = {body, method: 'POST'}
      Object.assign(fetchConfiguration, config.fetchConfiguration)

      fetch(url, fetchConfiguration).then(response => {
        if (response.status >= 200 && response.status < 300) {
          return response.json()
        } else {
          return response.text().then(bodyResp => {
            const error = new Error(bodyResp)
            error.status = response.status
            error.statusText = response.statusText
            throw error
          })
        }
      }).then(objectResp => {
        if (debug && logger.debug) {
          logger.debug('api <', objectResp)
        }
        try {
          callback(null, objectResp)
        } catch(callbackError) {
          if(logger.error) {
            logger.error(callbackError)
          }
        }
      })
  }
}
