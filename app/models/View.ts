import mongoose from '~/bootstrap/db/connect-db.server'

const ViewSchema = new mongoose.Schema(
  {
    path: {
      type: String,
      require: true,
      index: true,
    },
    name: {
      type: String,
      require: true,
      index: true,
    },
    shopDomain: {
      type: String,
      index: true,
      required: true,
    },
    filters: Object,
  },
  {
    timestamps: true,
  }
)

const View = mongoose.models.View || mongoose.model('View', ViewSchema)

export default View
