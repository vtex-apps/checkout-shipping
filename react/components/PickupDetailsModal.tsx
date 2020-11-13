import React, { useState } from 'react'
import { TranslateEstimate } from 'vtex.shipping-estimate-translator'
import { FormattedPrice } from 'vtex.formatted-price'
import { PickupOption } from 'vtex.checkout-graphql'
import { IconDelete, ButtonPlain, Modal, Divider } from 'vtex.styleguide'

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
      title="Detalhes"
    >
      <div className="lh-copy">
        <Divider orientation="horizontal" />
        <div className="flex-column mt4">
          <div className="flex justify-between">
            <h2 className="fw6">{pickupOption.friendlyName}</h2>
            <div className="fw5 mt6">
              <FormattedPrice value={(pickupOption.price ?? 0) / 100} />
            </div>
          </div>

          <div className="fw5">
            <TranslateEstimate shippingEstimate={pickupOption.estimate ?? ''} />
          </div>

          <div>{pickupOption.storeDistance.toFixed(1)}km de distância</div>
        </div>

        <div className="flex mb4">
          <div className="flex-column">
            <span className="fw6 mb2">Endereço</span>
            <div>{`${pickupOption.address?.street}, ${pickupOption.address?.number}`}</div>
            <div>{`${pickupOption.address?.neighborhood} - ${pickupOption.address?.city} - ${pickupOption.address?.state}`}</div>
          </div>
        </div>

        <div className="flex-column mb4">
          <span className="fw6 mb2">Horário de funcionamento</span>
          <div className="flex justify-between mb2 mt2">
            <span>Segunda a Sexta-feira</span>
            <span>9h a 21h</span>
          </div>
          <Divider orientation="horizontal" />
          <div className="flex justify-between mb2 mt2">
            <span>Sábado</span>
            <span>9h a 21h</span>
          </div>
          <Divider orientation="horizontal" />
          <div className="flex justify-between mb2 mt2">
            <span>Domingo</span>
            <span>9h a 15h</span>
          </div>
          <Divider orientation="horizontal" />
        </div>

        <div className="flex-column">
          <div className="fw6 mb2">Itens disponíveis</div>
          <div>Todos os itens estão disponíveis nesta loja.</div>
        </div>
      </div>
    </Modal>
  )
}

export default PickupDetailsModal
