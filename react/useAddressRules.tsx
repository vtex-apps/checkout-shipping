import { useMemo } from 'react'
import { useQuery } from 'react-apollo'
import { OrderShipping } from 'vtex.order-shipping'

import addressRulesQuery from './graphql/addressRulesQuery.gql'

const { useOrderShipping } = OrderShipping

const useAddressRules = () => {
  const { countries } = useOrderShipping()

  const { data } = useQuery(addressRulesQuery, { variables: { countries } })

  const addressRules = useMemo(
    () =>
      data?.countriesData.reduce(
        (rules: any, countryData: any) => ({
          ...rules,
          [countryData.countryISO]: {
            display: countryData.display,
            fields: countryData.addressFields,
            locationSelect: countryData.locationSelect,
          },
        }),
        {}
      ),
    [data]
  )

  return addressRules
}

export default useAddressRules
