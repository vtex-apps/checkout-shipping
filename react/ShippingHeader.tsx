import React from 'react'
import { ButtonPlain } from 'vtex.styleguide'
import { PlaceDetails } from 'vtex.place-components'
import { FormattedMessage } from 'react-intl'
import { AddressContext } from 'vtex.address-context'
import { OrderForm } from 'vtex.order-manager'
import { Query, QueryInstalledAppArgs } from 'vtex.apps-graphql'
import { useQuery } from 'react-apollo'

import installedApp from './graphql/installedApp.gql'

interface Props {
  onEditAddress?: () => void
}

const { useAddressContext } = AddressContext
const { useOrderForm } = OrderForm

const ShippingHeader: React.VFC<Props> = ({ onEditAddress }) => {
  const { address, invalidFields } = useAddressContext()

  const { data, error } = useQuery<Query, QueryInstalledAppArgs>(installedApp, {
    ssr: false,
    variables: {
      slug: 'vtex.geolocation-graphql-interface',
    },
  })

  if (error) {
    console.error(error)
  }

  const {
    orderForm: { canEditData },
  } = useOrderForm()

  const isAddressEditable = canEditData || address?.isDisposable
  const isPostalCodeInvalid = invalidFields.includes('postalCode')

  if (!address?.postalCode || (isAddressEditable && isPostalCodeInvalid)) {
    return (
      <p className="t-body mt0 mb6">
        <FormattedMessage id="store/checkout.shipping.informAddress" />
      </p>
    )
  }

  return (
    <>
      <p className="t-body fw6 mv0">
        <FormattedMessage id="store/checkout.shipping.shippingOptionsForAddressLabel" />{' '}
      </p>
      <div className="flex items-center mt2 mb6">
        <div className="lh-copy">
          {data?.installedApp?.source === 'none' ? (
            <PlaceDetails display="minimal" />
          ) : (
            <PlaceDetails display="brief" />
          )}
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
