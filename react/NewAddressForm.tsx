import React, { Fragment } from 'react'
import { useQuery } from 'react-apollo'
import {
  DeviceCoordinates,
  LocationInput,
  LocationCountry,
  LocationSearch,
} from 'vtex.place-components'
import { Address } from 'vtex.places-graphql'
import { Query, QueryInstalledAppArgs } from 'vtex.apps-graphql'
import { FormattedMessage } from 'react-intl'

import installedApp from './graphql/installedApp.gql'

interface Props {
  onAddressCreated: (address: Address) => void
}

const NewAddressForm: React.FC<Props> = ({ onAddressCreated }) => {
  const { data, error } = useQuery<Query, QueryInstalledAppArgs>(installedApp, {
    ssr: false,
    variables: {
      slug: 'vtex.geolocation-graphql-interface',
    },
  })

  if (error) {
    console.error(error)
  }

  return (
    <Fragment>
      <p className="t-body mt0 mb6">
        <FormattedMessage id="store/checkout.shipping.informAddress" />
      </p>

      <div>
        <DeviceCoordinates onSuccess={onAddressCreated} />
      </div>

      <LocationCountry className="w-100 mw6 mt6" />

      {data?.installedApp?.source === 'none' ? (
        <div className="mt6 w-100 mw5">
          <LocationInput onSuccess={onAddressCreated} variation="primary" />
        </div>
      ) : (
        <div className="mt6 w-100 mw6">
          <LocationSearch onSelectAddress={onAddressCreated} />
        </div>
      )}
    </Fragment>
  )
}

export default NewAddressForm
