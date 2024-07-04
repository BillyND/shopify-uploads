import mongoose from '~/db.server'

const ShopSchema = new mongoose.Schema(
  {
    shopDomain: {
      type: String,
      index: true,
      unique: true,
      required: true,
    },
    appConfig: mongoose.Schema.Types.Mixed,
    shopConfig: mongoose.Schema.Types.Mixed,
    uninstalledAt: {
      type: Date,
      index: true,
    },
  },
  { timestamps: true }
)

const Shop = mongoose.models.Shop || mongoose.model('Shop', ShopSchema)

export default Shop
