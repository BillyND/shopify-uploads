import { Modal, Text } from '@shopify/polaris'
import { useTranslation } from 'react-i18next'
import { KEY_MODAL } from '~/constants/keys-modal'
import { useModal } from '~/bootstrap/hooks/useModal'

export default function DeleteModal({ onOk }: { onOk: () => {} }) {
  const { state: stateModal, closeModal } = useModal()
  const { t } = useTranslation()

  return (
    <Modal
      open={stateModal[KEY_MODAL.DELETE_MODAL]?.active}
      onClose={() => closeModal(KEY_MODAL.DELETE_MODAL)}
      title={stateModal[KEY_MODAL.DELETE_MODAL]?.title}
      primaryAction={{
        content: t('delete'),
        destructive: true,
        onAction: onOk,
      }}
      secondaryActions={[
        {
          content: t('cancel'),
          onAction: () => closeModal(KEY_MODAL.DELETE_MODAL),
        },
      ]}
    >
      <Modal.Section>
        <Text variant="bodyMd" as="p">
          {t(`This can't be undone. Do you still wish to continue?`)}
        </Text>
      </Modal.Section>
    </Modal>
  )
}
