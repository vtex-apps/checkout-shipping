import React, { useState } from 'react'
import { OrderShipping } from 'vtex.order-shipping'
import { Button, Input } from 'vtex.styleguide'

interface Props {
  onReceiverInfoSave?: () => void
}

const ReceiverInfoForm: React.FC<Props> = ({
  onReceiverInfoSave = () => {},
}) => {
  const {
    selectedAddress,
    updateSelectedAddress,
  } = OrderShipping.useOrderShipping()

  const [name, setName] = useState(selectedAddress.receiverName)
  const [submitLoading, setSubmitLoading] = useState(false)

  const handleNameChange: React.ChangeEventHandler<HTMLInputElement> = evt => {
    setName(evt.target.value)
  }

  const handleSubmit: React.FormEventHandler = async evt => {
    evt.preventDefault()

    setSubmitLoading(true)

    try {
      await updateSelectedAddress({
        ...selectedAddress,
        receiverName: name,
      })

      onReceiverInfoSave()
    } finally {
      setSubmitLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <span className="fw6 dib mb6">Person who will receive the order</span>

      <div className="mb7">
        <Input label="Name" onChange={handleNameChange} value={name} />
      </div>

      <Button
        type="submit"
        isLoading={submitLoading}
        disabled={submitLoading}
        size="large"
        block
      >
        <span className="f5">Continue</span>
      </Button>
    </form>
  )
}

export default ReceiverInfoForm
