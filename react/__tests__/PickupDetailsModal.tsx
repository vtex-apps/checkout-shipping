import React from 'react'
import { render, screen } from '@vtex/test-tools/react'
import { AddressContext } from 'vtex.address-context'
import type { PickupOption } from 'vtex.checkout-graphql'

import PickupDetailsModal from '../components/PickupDetailsModal'

describe('PickupDetailsModal', () => {
  it('should display pickup address instead of user address', async () => {
    render(
      <AddressContext.AddressContextProvider
        address={{
          street: 'User fake street',
        }}
        countries={[]}
        rules={{}}
      >
        <PickupDetailsModal
          pickupOption={
            {
              address: {
                street: 'Pickup fake street',
              },
              businessHours: [] as PickupOption['businessHours'],
            } as PickupOption
          }
          showPickupModal
          setShowPickupModal={() => {}}
        />
      </AddressContext.AddressContextProvider>
    )

    expect(screen.queryByText(/Pickup fake street/i)).toBeInTheDocument()
    expect(screen.queryByText(/User fake street/i)).not.toBeInTheDocument()
  })
})
