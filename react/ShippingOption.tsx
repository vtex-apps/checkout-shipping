import React, { useState } from 'react'
import classnames from 'classnames'
import { TranslateEstimate } from 'vtex.shipping-estimate-translator'
import { FormattedPrice } from 'vtex.formatted-price'
import { GroupOption } from 'vtex.checkout-components'
import { DeliveryOption, PickupOption } from 'vtex.checkout-graphql'
import { IconDelete, ButtonPlain, Modal, Divider } from 'vtex.styleguide'

interface EstimateDeliveryOption {
  shippingEstimate: string
  price: number
}

interface Props {
  onSelectDeliveryOption?: () => void
  onDeselectDeliveryOption?: () => void
  deliveryOption: any
  isSelected?: boolean
  fastestOption?: EstimateDeliveryOption
  cheapestOption?: EstimateDeliveryOption
}

const getName = (shippingOption: any ) => {
  return shippingOption.channel === 'pickup-in-point' ? shippingOption.friendlyName : shippingOption.id 
}

const ShippingOption: React.VFC<Props> = ({
  onSelectDeliveryOption,
  onDeselectDeliveryOption,
  deliveryOption,
  fastestOption,
  cheapestOption,
  isSelected = false,
}) => {
  const [showPickupModal, setShowPickupModal] = useState(false)

  const content = (
    <div className="flex w-100">
      <div className="flex flex-column w-100">
        <span className="c-on-base fw5">{getName(deliveryOption)}</span>
        <span
          className={classnames('dib mt2 fw5', {
            'c-muted-1':
              deliveryOption.estimate !== fastestOption?.shippingEstimate,
            'c-success':
              deliveryOption.estimate === fastestOption?.shippingEstimate,
          })}
        >
          <TranslateEstimate shippingEstimate={deliveryOption.estimate ?? ''} />
        </span>
        <div>
        <ButtonPlain size="small" onClick={() => setShowPickupModal(true)}>Ver Detalhes</ButtonPlain>
        <Modal
          isOpen={showPickupModal}
          onClose={() => setShowPickupModal(false)}
          title={'Detalhes'}
        >
          <Divider orientation="horizontal" />
          <div className="flex-column mb4 mt4">
            <h2 className="fw5">{getName(deliveryOption)}</h2>
            <p className="c-on-base">
              <TranslateEstimate shippingEstimate={deliveryOption.estimate ?? ''} />
            </p>
          </div>

          <div className="flex mb4">
            <div className="flex-column">
              <span className="fw5 mb2">Endereço</span>
              <div className="c-on-base">{`${deliveryOption.address?.street}, ${deliveryOption.address?.number}`}</div>
              <div className="c-on-base">{`${deliveryOption.address?.neighborhood} - ${deliveryOption.address?.city} - ${deliveryOption.address?.state}`}</div>
            </div>
          </div>

          <div className="flex-column mb4">
            <span className="fw5 mb2 mt2">Horário de funcionamento</span>
            <div className="flex-row justify-around c-on-base mb2 mt2">
              <span>Segunda a Sexta-feira</span>
              <span>9h a 21h</span>
            </div>
            <Divider orientation="horizontal" />
            <div className="flex-row c-on-base mb2 mt2">
              <span>Sábado</span>
              <span>9h a 21h</span>
            </div>
            <Divider orientation="horizontal" />
            <div className="flex-row c-on-base mb2 mt2">
              <span>Domingo</span>
              <span>9h a 15h</span>
            </div>
            <Divider orientation="horizontal" />
          </div>

          <div className="flex-column mb4">
            <div className="fw5 mb2">Itens disponíveis</div>
            <div>Todos os itens estão disponíveis nesta loja.</div>
          </div>
        </Modal>
        </div>
      </div>
      <div
        className={classnames('fw4', {
          'c-success fw5': deliveryOption.price === cheapestOption?.price,
        })}
      >
        <FormattedPrice value={(deliveryOption.price ?? 0) / 100} />
      </div>
    </div>
  )

  return isSelected ? (
    <div className="bg-muted-5 pa5 flex items-start lh-copy">
      {content}
      <button
        className="flex-shrink-0 c-muted-1 ml5 pa2 flex items-center bg-transparent bn pointer"
        onClick={onDeselectDeliveryOption}
        role="option"
        aria-selected
      >
        <IconDelete />
      </button>
    </div>
  ) : (
    <GroupOption
      onClick={onSelectDeliveryOption}
      selected={deliveryOption.isSelected}
    >
      {content}
    </GroupOption>
  )
}

export default ShippingOption
