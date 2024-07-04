import mongoose from '~/db.server'

export function getPipelineStagesToQueryDocumentsById(id: string | number, shopDomain: string) {
  return [
    {
      $match: {
        $and: [
          { shopDomain },
          {
            $or: [{ id }, { _id: mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : id }],
          },
        ],
      },
    },
  ]
}
