import { Modal, Text } from '@shopify/polaris'
import { useTranslation } from 'react-i18next'
import { useModal } from '~/bootstrap/hooks/useModal'
import { KEY_MODAL } from '~/constants/keys-modal'

export default function ConfirmModal({ onConfirm }: { onConfirm: (status: any) => void }) {
  const { t } = useTranslation()
  const { state: stateModal, closeModal } = useModal()

  const { confirmButtonContent, tone, status, active, title, content } = stateModal?.[KEY_MODAL?.CONFIRM_MODAL] || {}

  return (
    <Modal
      open={active}
      onClose={() => closeModal(KEY_MODAL.CONFIRM_MODAL)}
      title={title}
      primaryAction={{
        content: confirmButtonContent || t('yes'),
        destructive: tone === 'critical',
        onAction: () => onConfirm(status),
      }}
      secondaryActions={[
        {
          content: t('cancel'),
          onAction: () => closeModal(KEY_MODAL?.CONFIRM_MODAL),
        },
      ]}
    >
      <Modal.Section>
        <Text variant="bodyMd" as="p">
          {content}
        </Text>
      </Modal.Section>
    </Modal>
  )
}
