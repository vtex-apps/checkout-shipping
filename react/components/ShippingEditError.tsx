import React from 'react'
import { Alert } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'

import ShippingHeader from '../ShippingHeader'

interface Props {
  onEditAddress: () => void
  onTryAgain: () => void
}

const ShippingEditError: React.VFC<Props> = ({ onEditAddress, onTryAgain }) => {
  return (
    <>
      <ShippingHeader onEditAddress={onEditAddress} />

      <Alert
        type="warning"
        action={{
          onClick: onTryAgain,
          label: (
            <span className="f5 ttn">
              <FormattedMessage id="store/checkout.shipping.tryAgainButton" />
            </span>
          ),
        }}
      >
        <FormattedMessage id="store/checkout.shipping.unknownErrorMessage" />
      </Alert>
    </>
  )
}

export default ShippingEditError
