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
      <div className="pv3">
        <DeviceCoordinates onSuccess={onAddressCreated} />
      </div>
      <div className="w-100 mw6">
        <LocationCountry className="mt6" />
      </div>
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
