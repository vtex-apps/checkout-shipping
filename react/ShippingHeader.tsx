import React from 'react'
import { ButtonPlain } from 'vtex.styleguide'
import { PlaceDetails } from 'vtex.place-components'
import { FormattedMessage } from 'react-intl'

interface Props {
  onEditAddress?: () => void
}

const ShippingHeader: React.VFC<Props> = ({ onEditAddress }) => {
  return (
    <>
      <p className="t-body fw6 mv0">
        <FormattedMessage id="store/checkout.shipping.shippingOptionsForAddressLabel" />
      </p>
      <div className="flex items-center mt2 mb6">
        <div className="lh-copy">
          <PlaceDetails display="minimal" />
        </div>
        <div className="ml3">
          <ButtonPlain onClick={onEditAddress}>
            <FormattedMessage id="store/checkout.shipping.changeAddressLabel" />
          </ButtonPlain>
        </div>
      </div>
    </>
  )
}

export default ShippingHeader
