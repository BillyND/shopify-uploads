import type { ConnectionArguments } from '~/shopify/graphql/types'
import type { SubscriptionDraftInput } from '~/shopify/graphql/subscription-contracts/types'
import type { AdminApiContext } from 'node_modules/@shopify/shopify-app-remix/dist/ts/server/clients'
import type { GraphQLResponse } from 'node_modules/@shopify/shopify-app-remix/dist/ts/server/clients/types'
import type { SellingPlanGroupInput, SellingPlanGroupResources } from '~/shopify/graphql/selling-plan-groups/types'
import type { SubscriptionBillingCycleConnectionArguments } from '~/shopify/graphql/subscription-billing-cycles/types'
import { getObjectByKeyPath } from '~/bootstrap/fns/misc'
import { queryForOrderById } from '~/shopify/graphql/orders/query.server'
import { queryForCustomer } from '~/shopify/graphql/customers/query.server'
import { flattenGraphQLConnectionResults, getIdNumberFromIdString } from '../fns'
import { queryForProductVariants, queryForProducts } from '~/shopify/graphql/products/query.server'
import { queryForSubscriptionContractById } from '~/shopify/graphql/subscription-contracts/query.server'
import { queryForSubscriptionBillingCycles } from '~/shopify/graphql/subscription-billing-cycles/query.server'
import { queryForSubscriptionBillingAttempts } from '~/shopify/graphql/subscription-billing-attempts/query.server'
import {
  mutationCreateSellingPlanGroup,
  mutationSellingPlanGroupDelete,
  mutationSellingPlanGroupUpdate,
  mutationSellingPlanGroupAddProducts,
  mutationSellingPlanGroupRemoveProducts,
  mutationSellingPlanGroupAddProductVariants,
  mutationSellingPlanGroupRemoveProductVariants,
} from '~/shopify/graphql/selling-plan-groups/mutation.server'
import {
  mutationSubscriptionDraftUpdate,
  mutationSubscriptionDraftCommit,
  mutationSubscriptionContractUpdate,
  mutationSubscriptionContractActivate,
  mutationSubscriptionContractCancel,
  mutationSubscriptionContractExpire,
  mutationSubscriptionContractFail,
  mutationSubscriptionContractPause,
} from '~/shopify/graphql/subscription-contracts/mutation.server'
import {
  mutationCustomerPaymentMethodGetUpdateUrl,
  mutationSendCustomerPaymentUpdateEmail,
} from './customers/mutation.server'

export class ShopifyApiClient {
  admin: AdminApiContext

  constructor(admin: AdminApiContext) {
    this.admin = admin
  }

  async getProductsByIds(productIds: string[]): Promise<any[]> {
    if (!productIds.length) {
      return []
    }

    return flattenGraphQLConnectionResults(
      await this.verifyResponse(
        await this.admin.graphql(queryForProducts({ query: convertIdsToQuery(productIds) })),
        'products.nodes'
      ),
      ['variants']
    )
  }

  async getProductVariantsByIds(productVariantIds: string[]): Promise<any[]> {
    if (!productVariantIds.length) {
      return []
    }

    return this.verifyResponse(
      await this.admin.graphql(queryForProductVariants({ query: convertIdsToQuery(productVariantIds) })),
      'productVariants.nodes'
    )
  }

  async getSubscriptionContractById(subscriptionContractId: string): Promise<any> {
    if (!subscriptionContractId) {
      return null
    }

    const contract = await this.verifyResponse(
      await this.admin.graphql(queryForSubscriptionContractById, { variables: { subscriptionContractId } }),
      'subscriptionContract'
    )

    contract.originOrder.lineItems = contract.originOrder.lineItems.nodes

    return contract
  }

  async getOrderById(orderId: string): Promise<any> {
    if (!orderId) {
      return null
    }

    const order = await this.verifyResponse(await this.admin.graphql(queryForOrderById(orderId)), 'node')

    order.lineItems = order.lineItems.nodes

    return order
  }

  async getCustomerById(customerId: string): Promise<any> {
    if (!customerId) {
      return null
    }

    const customer = await this.verifyResponse(await this.admin.graphql(queryForCustomer(customerId)), 'node')

    customer.paymentMethods = customer.paymentMethods.nodes

    return customer
  }

  async getSubscriptionBillingAttempts(params: ConnectionArguments = {}) {
    return this.verifyResponse(
      await this.admin.graphql(queryForSubscriptionBillingAttempts(params)),
      'subscriptionBillingAttempts'
    )
  }

  async getSubscriptionBillingCycles(params: SubscriptionBillingCycleConnectionArguments = {}) {
    return this.verifyResponse(
      await this.admin.graphql(queryForSubscriptionBillingCycles(params)),
      'subscriptionBillingCycles'
    )
  }

  async createSellingPlanGroup(input: SellingPlanGroupInput, resources: SellingPlanGroupResources = {}) {
    return this.verifyResponse(
      await this.admin.graphql(mutationCreateSellingPlanGroup, {
        variables: { input: { ...input, appId: process.env.SHOPIFY_APP_ID }, resources },
      }),
      'sellingPlanGroupCreate'
    )
  }

  async updateSellingPlanGroup(id: string, input: SellingPlanGroupInput) {
    return this.verifyResponse(
      await this.admin.graphql(mutationSellingPlanGroupUpdate, {
        variables: { id, input: { ...input, appId: process.env.SHOPIFY_APP_ID } },
      }),
      'sellingPlanGroupUpdate'
    )
  }

  async deleteSellingPlanGroup(id: string) {
    return this.verifyResponse(
      await this.admin.graphql(mutationSellingPlanGroupDelete, { variables: { id } }),
      'sellingPlanGroupDelete'
    )
  }

  async addProductsToSellingPlanGroup(id: string, productIds: string[]) {
    return this.verifyResponse(
      await this.admin.graphql(mutationSellingPlanGroupAddProducts, { variables: { id, productIds } }),
      'sellingPlanGroupAddProducts'
    )
  }

  async addProductVariantsToSellingPlanGroup(id: string, productVariantIds: string[]) {
    return this.verifyResponse(
      await this.admin.graphql(mutationSellingPlanGroupAddProductVariants, {
        variables: { id, productVariantIds },
      }),
      'sellingPlanGroupAddProductVariants'
    )
  }

  async removeProductsFromSellingPlanGroup(id: string, productIds: string[]) {
    return this.verifyResponse(
      await this.admin.graphql(mutationSellingPlanGroupRemoveProducts, {
        variables: { id, productIds },
      }),
      'sellingPlanGroupRemoveProducts'
    )
  }

  async removeProductVariantsFromSellingPlanGroup(id: string, productVariantIds: string[]) {
    return this.verifyResponse(
      await this.admin.graphql(mutationSellingPlanGroupRemoveProductVariants, {
        variables: { id, productVariantIds },
      }),
      'sellingPlanGroupRemoveProductVariants'
    )
  }

  async updateSubscriptionContract(contractId: string) {
    return this.verifyResponse(
      await this.admin.graphql(mutationSubscriptionContractUpdate, { variables: { contractId } }),
      'subscriptionContractUpdate'
    )
  }

  async updateSubscriptionDraft(draftId: string, input: SubscriptionDraftInput) {
    return this.verifyResponse(
      await this.admin.graphql(mutationSubscriptionDraftUpdate, { variables: { draftId, input } }),
      'subscriptionDraftUpdate'
    )
  }

  async commitSubscriptionContract(draftId: string) {
    return this.verifyResponse(
      await this.admin.graphql(mutationSubscriptionDraftCommit, { variables: { draftId } }),
      'subscriptionDraftCommit'
    )
  }

  async activateSubscriptionContract(subscriptionContractId: string) {
    return this.verifyResponse(
      await this.admin.graphql(mutationSubscriptionContractActivate, { variables: { subscriptionContractId } }),
      'subscriptionContractActivate'
    )
  }

  async cancelSubscriptionContract(subscriptionContractId: string) {
    return this.verifyResponse(
      await this.admin.graphql(mutationSubscriptionContractCancel, { variables: { subscriptionContractId } }),
      'subscriptionContractCancel'
    )
  }

  async expireSubscriptionContract(subscriptionContractId: string) {
    return this.verifyResponse(
      await this.admin.graphql(mutationSubscriptionContractExpire, { variables: { subscriptionContractId } }),
      'subscriptionContractExpire'
    )
  }

  async failSubscriptionContract(subscriptionContractId: string) {
    return this.verifyResponse(
      await this.admin.graphql(mutationSubscriptionContractFail, { variables: { subscriptionContractId } }),
      'subscriptionContractFail'
    )
  }

  async pauseSubscriptionContract(subscriptionContractId: string) {
    return this.verifyResponse(
      await this.admin.graphql(mutationSubscriptionContractPause, { variables: { subscriptionContractId } }),
      'subscriptionContractPause'
    )
  }

  async sendCustomerPaymentUpdateEmail(customerPaymentMethodId: string) {
    return this.verifyResponse(
      await this.admin.graphql(mutationSendCustomerPaymentUpdateEmail, { variables: { customerPaymentMethodId } }),
      'customerPaymentMethodSendUpdateEmail'
    )
  }

  async getCustomerPaymentMethodUpdateUrl(customerPaymentMethodId: string) {
    return this.verifyResponse(
      await this.admin.graphql(mutationCustomerPaymentMethodGetUpdateUrl, { variables: { customerPaymentMethodId } }),
      'customerPaymentMethodGetUpdateUrl'
    )
  }

  async verifyResponse(result: GraphQLResponse<any, any>, dataKeyPath?: string) {
    const _result = await result.json()
    const data = dataKeyPath ? getObjectByKeyPath(_result, `data.${dataKeyPath}`) : _result.data

    if (!data || data?.userErrors?.length) {
      throw new Error(data?.userErrors?.[0]?.message || 'UNKNOWN')
    }

    return data
  }
}

export function convertIdsToQuery(ids: string[]): string {
  try {
    // Extract the numeric ID from each GID and format them into the desired query format
    return ids?.map(id => `(id:${getIdNumberFromIdString(id)})`).join(' OR ')
  } catch (e) {
    console.error(e)
    return ''
  }
}
