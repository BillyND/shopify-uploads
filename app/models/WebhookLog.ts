import mongoose from '~/bootstrap/db/connect-db.server'
import { ONE_DAY_IN_MILLISECONDS } from '~/constants'

const WebhookLogSchema = new mongoose.Schema(
  {
    topic: {
      type: String,
      require: true,
      index: true,
    },
    payload: mongoose.SchemaTypes.Mixed,
    shopDomain: {
      type: String,
      index: true,
      required: true,
    },
    admin: {
      type: String,
      enum: ['AUTHENTICATED', 'UNAUTHENTICATED'],
    },
    expireAt: {
      type: Date,
      default: Date.now,
      expires: ONE_DAY_IN_MILLISECONDS / 1000,
    },
  },
  {
    timestamps: true,
  }
)

const WebhookLog = mongoose.models.WebhookLog || mongoose.model('WebhookLog', WebhookLogSchema, 'webhook_logs')

export default WebhookLog
