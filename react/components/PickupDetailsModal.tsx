import React from 'react'
import { TranslateEstimate } from 'vtex.shipping-estimate-translator'
import { FormattedPrice } from 'vtex.formatted-price'
import type { PickupOption, BusinessHour } from 'vtex.checkout-graphql'
import { Divider } from 'vtex.styleguide'
import { PlaceDetails } from 'vtex.place-components'
import { AddressContext } from 'vtex.address-context'
import { Modal } from 'vtex.checkout-components'
import { FormattedMessage, defineMessages, FormattedTime } from 'react-intl'

const { useAddressContext } = AddressContext

const messages = defineMessages({
  details: {
    defaultMessage: 'Details',
    id: 'store/checkout.shipping.pickupPointsModal.details',
  },
  weekDay0: {
    defaultMessage: 'Sunday',
    id: 'store/checkout.shipping.pickupPointsModal.weekDay0',
  },
  weekDay1: {
    defaultMessage: 'Monday',
    id: 'store/checkout.shipping.pickupPointsModal.weekDay1',
  },
  weekDay2: {
    defaultMessage: 'Tuesday',
    id: 'store/checkout.shipping.pickupPointsModal.weekDay2',
  },
  weekDay3: {
    defaultMessage: 'Wednesday',
    id: 'store/checkout.shipping.pickupPointsModal.weekDay3',
  },
  weekDay4: {
    defaultMessage: 'Thursday',
    id: 'store/checkout.shipping.pickupPointsModal.weekDay4',
  },
  weekDay5: {
    defaultMessage: 'Friday',
    id: 'store/checkout.shipping.pickupPointsModal.weekDay5',
  },
  weekDay6: {
    defaultMessage: 'Saturday',
    id: 'store/checkout.shipping.pickupPointsModal.weekDay6',
  },
  weekDay1to5: {
    defaultMessage: 'Monday to Friday',
    id: 'store/checkout.shipping.pickupPointsModal.weekDay1to5',
  },
})

const formatHour = (hour: string) => {
  const hoursNumbers = hour.split(':').map((t) => parseInt(t, 10))
  // eslint-disable-next-line prefer-spread
  const time = new Date().setHours.apply(new Date(), hoursNumbers)

  return <FormattedTime value={time} hour="numeric" />
}

interface Props {
  pickupOption: PickupOption
  setShowPickupModal: (showPickupModal: boolean) => void
  showPickupModal: boolean
}

const PickupDetailsModal: React.VFC<Props> = ({
  pickupOption,
  showPickupModal,
  setShowPickupModal,
}) => {
  const { countries, rules } = useAddressContext()

  return (
    <Modal
      isOpen={showPickupModal}
      onClose={() => setShowPickupModal(false)}
      title={<FormattedMessage {...messages.details} />}
    >
      <div className="lh-copy">
        <Divider orientation="horizontal" />
        <div className="flex-column mt4 mb4">
          <div className="flex justify-between mb0">
            <p className="fw6 f3 mv0">{pickupOption.friendlyName}</p>
            <span className="fw5 f5 flex items-center">
              <FormattedPrice value={(pickupOption.price ?? 0) / 100} />
            </span>
          </div>

          <p className="fw5 f5 c-muted-1 mv0">
            <TranslateEstimate shippingEstimate={pickupOption.estimate ?? ''} />
          </p>

          <p className="fw4 f6 c-muted-1 mv0">
            <FormattedMessage
              id="store/checkout.shipping.distance"
              values={{
                distanceValue: pickupOption.storeDistance?.toFixed(1),
              }}
            />
          </p>
        </div>

        <div className="flex-column mb4">
          <p className="fw6 mb2 mt0">
            <FormattedMessage id="store/checkout.shipping.pickupPointsModal.address" />
          </p>

          <AddressContext.AddressContextProvider
            address={pickupOption.address}
            countries={countries}
            rules={rules}
          >
            <PlaceDetails />
          </AddressContext.AddressContextProvider>
        </div>

        <div className="flex-column mb4">
          <p className="fw6 mb2 mt0">
            <FormattedMessage id="store/checkout.shipping.pickupPointsModal.businessHours" />
          </p>

          <table className="dt--fixed">
            <tbody>
              {pickupOption.businessHours.map((businessHour: BusinessHour) => (
                <tr
                  key={businessHour.dayNumber}
                  className="flex justify-between bb b--light-gray mt2"
                >
                  <td>
                    <FormattedMessage
                      id={`store/checkout.shipping.pickupPointsModal.weekDay${businessHour.dayNumber}`}
                    />
                  </td>

                  <td>
                    {businessHour.closed ? (
                      <FormattedMessage id="store/checkout.shipping.pickupPointsModal.closed" />
                    ) : (
                      <FormattedMessage
                        id="store/checkout.shipping.pickupPointsModal.hourFromTo"
                        values={{
                          openingTime: formatHour(businessHour.openingTime),
                          closingTime: formatHour(businessHour.closingTime),
                        }}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex-column">
          <p className="fw6 mb2 mt0">
            <FormattedMessage id="store/checkout.shipping.pickupPointsModal.availableItems" />
          </p>
          <p className="mv0">
            <FormattedMessage id="store/checkout.shipping.pickupPointsModal.allItemsAvailable" />
          </p>
        </div>
      </div>
    </Modal>
  )
}

export default PickupDetailsModal
