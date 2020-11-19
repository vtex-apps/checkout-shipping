import React, { useState } from 'react'
import { TranslateEstimate } from 'vtex.shipping-estimate-translator'
import { FormattedPrice } from 'vtex.formatted-price'
import { PickupOption, BusinessHour } from 'vtex.checkout-graphql'
import { Modal, Divider } from 'vtex.styleguide'
import { FormattedMessage, defineMessages, FormattedTime } from 'react-intl'

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
            <div className="fw6 f3">{pickupOption.friendlyName}</div>
            <div className="fw5 f5">
              <FormattedPrice value={(pickupOption.price ?? 0) / 100} />
            </div>
          </div>

          <div className="fw5 f5 c-muted-1">
            <TranslateEstimate shippingEstimate={pickupOption.estimate ?? ''} />
          </div>

          <div className="fw4 f6 c-muted-1">
            <FormattedMessage
              id="store/checkout.shipping.distance"
              values={{
                distanceValue: pickupOption.storeDistance.toFixed(1),
              }}
            />
          </div>
        </div>

        <div className="flex-column mb4">
          <span className="fw6 mb2">
            <FormattedMessage id="store/checkout.shipping.pickupPointsModal.address" />
          </span>
          <div>{`${pickupOption.address?.street}, ${pickupOption.address?.number}`}</div>
          <div>{`${pickupOption.address?.neighborhood} - ${pickupOption.address?.city} - ${pickupOption.address?.state}`}</div>
        </div>

        <div className="flex-column mb4">
          <span className="fw6 mb2">
            <FormattedMessage id="store/checkout.shipping.pickupPointsModal.businessHours" />
          </span>
          {pickupOption.businessHours.map((businessHour: BusinessHour) => (
            <>
              <div className="flex justify-between mb2 mt2">
                <FormattedMessage
                  id={`store/checkout.shipping.pickupPointsModal.weekDay${businessHour.dayNumber}`}
                />
                <div>
                  {businessHour.closed ? (
                    <FormattedMessage id="store/checkout.shipping.pickupPointsModal.closed" />
                  ) : (
                    <div>
                      <FormattedMessage
                        id="store/checkout.shipping.pickupPointsModal.hourFromTo"
                        values={{
                          openingTime: formatHour(businessHour.openingTime),
                          closingTime: formatHour(businessHour.closingTime),
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
              <Divider orientation="horizontal" />
            </>
          ))}
        </div>

        <div className="flex-column">
          <div className="fw6 mb2">
            <FormattedMessage id="store/checkout.shipping.pickupPointsModal.availableItems" />
          </div>
          <div>
            <FormattedMessage id="store/checkout.shipping.pickupPointsModal.allItemsAvailable" />
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default PickupDetailsModal
