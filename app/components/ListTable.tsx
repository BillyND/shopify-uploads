import type { TFunction } from 'i18next'
import type { IndexFiltersProps, TabProps } from '@shopify/polaris'
import type { NonEmptyArray } from '@shopify/polaris/build/ts/src/types'
import type { WithDataSourceChildProps } from '~/bootstrap/hoc/withDataSource'
import type { ComponentProps, ComponentState, ErrorInfo, ReactNode } from 'react'
import type { BulkActionsProps } from '@shopify/polaris/build/ts/src/components/BulkActions'
import type { IndexTableHeading } from '@shopify/polaris/build/ts/src/components/IndexTable'
import lodash from 'lodash'
import BarLoading from '~/components/loading/BarLoading'
import withDataSource from '~/bootstrap/hoc/withDataSource'
import BlockLoading from '~/components/loading/BlockLoading'
import { PureComponent } from 'react'
import { ITEM_LIST_LIMITATION } from '~/constants'
import { ErrorBoundary } from '~/components/ErrorBoundary'
import { VIEW_ACTIONS } from '~/routes/api.views/constants'
import { BlockStack, Box, Card, Divider, IndexFilters, IndexTable, InlineStack, Pagination } from '@shopify/polaris'

export type ListTableView = {
  name: string
  filters: {
    queryValue: string
    [key: string]: any
  }
}

export type ListTableFilter = {
  key: string
  label: string
  shortcut: boolean
  filter: ReactNode | any
}

export type ListTableProps = WithDataSourceChildProps &
  ComponentProps<any> & {
    t: TFunction
    limit?: number
    selectable?: boolean
    showBorder?: boolean
    showFilter?: boolean
    showPagination?: boolean
    condensed?: boolean
    emptyState?: ReactNode
    views?: ListTableView[]
    filters?: ListTableFilter[]
    bulkActions?: BulkActionsProps['actions']
    headings: NonEmptyArray<IndexTableHeading>
    sortOptions?: IndexFiltersProps['sortOptions']
    promotedBulkActions?: BulkActionsProps['promotedActions']
    renderRowMarkup: (item: any, idx: number) => ReactNode
    renderFilterLabel?: (key: string, value: string | any[]) => string
    resourceName?: {
      singular: string
      plural: string
    }
  }

export type ListTableState = ComponentState & {
  error?: Error
  selected: number
  errorInfo?: ErrorInfo
  views: ListTableView[]
}

export class ListTableComponent<P, S> extends PureComponent<P & ListTableProps, S & ListTableState> {
  state: S & ListTableState = {
    views: [],
    selected: 0,
  }

  constructor(props: P & ListTableProps) {
    super(props)

    if (props.error) {
      this.state.error = props.error
    }
  }

  render(): ReactNode {
    // Extract current state
    const { error } = this.state
    const { showBorder = true, EmptyState, total, filterValues, loading } = this.props
    const showEmptyState = lodash.isEmpty(filterValues) && !total && !loading

    return error ? (
      <ErrorBoundary error={error} />
    ) : (
      <>
        <BarLoading loading={loading} />

        {showEmptyState ? (
          EmptyState
        ) : showBorder ? (
          <Card padding="0" roundedAbove="sm">
            {this.renderFilters()}
            {this.renderTable()}
          </Card>
        ) : (
          <BlockStack>
            {this.renderFilters()}
            {this.renderTable()}
          </BlockStack>
        )}
      </>
    )
  }

  renderFilters(): ReactNode {
    // Extract props
    const {
      t,
      sort,
      loading,
      setSort,
      firstLoad,
      sortOptions,
      filterValues: { queryValue },
      useIndexResourceState: { mode, setMode },
      showFilter = true,
    } = this.props

    // Extract current state
    const { selected } = this.state

    // Generate tabs for saved views
    const tabs = this.generateTabsForViews()

    // Generate filters.
    const filters = this.generateFilters()

    // Generate applied filters.
    const appliedFilters = this.generateAppliedFilters()

    // Generate primary action for filters
    const primaryAction = this.generatePrimaryActionForFilters()

    return (
      <>
        {showFilter && !firstLoad && (
          <IndexFilters
            canCreateNewView
            mode={mode}
            tabs={tabs}
            filters={filters}
            loading={loading}
            selected={selected}
            sortSelected={sort}
            queryValue={queryValue}
            sortOptions={sortOptions}
            primaryAction={primaryAction}
            appliedFilters={appliedFilters}
            queryPlaceholder={t('searching-in-all')}
            onSort={setSort}
            setMode={setMode}
            onSelect={this.setSelectedView}
            onQueryClear={this.onQueryClear}
            onCreateNewView={this.createView}
            onQueryChange={this.onQueryChange}
            onClearAll={this.clearAllAppliedFilters}
            cancelAction={{
              onAction: this.cancelFilters,
              disabled: false,
              loading: false,
            }}
          />
        )}
      </>
    )
  }

  renderTable(): ReactNode {
    // Extract props
    const {
      limit = ITEM_LIST_LIMITATION,
      page,
      items,
      total,
      setPage,
      headings,
      condensed,
      firstLoad,
      bulkActions,
      selectable,
      resourceName,
      showPagination = true,
      renderRowMarkup,
      promotedBulkActions,
      useSetIndexFiltersMode: { selectedResources, allResourcesSelected, handleSelectionChange },
    } = this.props

    // Generate empty state
    const emptyState = firstLoad ? <BlockLoading /> : undefined

    const limitList = limit || ITEM_LIST_LIMITATION

    const clearAllSelection = () => {
      handleSelectionChange('page', false)
    }

    return (
      <BlockStack>
        <IndexTable
          selectable={selectable}
          headings={headings}
          condensed={condensed}
          emptyState={emptyState}
          itemCount={items?.length}
          bulkActions={bulkActions}
          resourceName={resourceName}
          onSelectionChange={handleSelectionChange}
          promotedBulkActions={promotedBulkActions}
          selectedItemsCount={allResourcesSelected ? 'All' : selectedResources?.length}
        >
          {items.map((item: any, index: number) => renderRowMarkup(item, index, selectedResources, clearAllSelection))}
        </IndexTable>

        <Divider />

        {showPagination && !firstLoad && (
          <Box padding={'400'}>
            <InlineStack gap={'500'} blockAlign="center">
              <Pagination
                hasNext={(page - 1) * (limit || ITEM_LIST_LIMITATION) + items?.length < total}
                hasPrevious={page > 1}
                onNext={() => setPage && setPage(page + 1)}
                onPrevious={() => setPage && setPage(page - 1)}
              />

              {`${page}-${Math.ceil(total / limitList)} of ${Math.ceil(total / limitList)}`}
            </InlineStack>
          </Box>
        )}
      </BlockStack>
    )
  }

  generateFilters(): ListTableFilter[] {
    const { filters, filterValues, setFilterValues } = this.props

    return filters?.map((def: ListTableFilter) => {
      const _def = { ...def }
      const { Component, props } = def.filter

      if (Component && props) {
        _def.filter = (
          <Component
            {...props}
            {...(props.value ? { value: filterValues[def.key] } : {})}
            {...(props.choices ? { selected: filterValues[def.key] || [] } : {})}
            onChange={(value: any) => setFilterValues({ ...filterValues, [def.key]: value })}
          />
        )

        return _def
      }

      return def
    })
  }

  generateAppliedFilters(): IndexFiltersProps['appliedFilters'] {
    const filters = this.generateFilters()
    const { queryKey, filterValues, renderFilterLabel } = this.props

    // Generate applied filters from current filter values
    const appliedFilters: IndexFiltersProps['appliedFilters'] = []

    for (const key in filterValues) {
      if (key !== queryKey && filterValues[key]?.length) {
        const filter = filters?.find((filter: ListTableFilter) => filter.key === key)

        if (filter) {
          appliedFilters.push({
            key,
            label: renderFilterLabel ? renderFilterLabel(key, this.state[key] || filterValues[key]) : filter.label,
            onRemove: () => this.removeAppliedFilter(key),
          })
        }
      }
    }

    return appliedFilters
  }

  generatePrimaryActionForFilters(): any {
    const { views, selected } = this.state
    const { filterValues: newFilters } = this.props
    const currentFilters = [...views][selected]?.filters || {}
    const disabled = lodash.isEqual(currentFilters, newFilters)

    return selected === 0
      ? {
          type: 'save-as',
          onAction: this.createView,
          disabled,
          loading: false,
        }
      : {
          type: 'save',
          onAction: this.updateView,
          disabled,
          loading: false,
        }
  }

  generateTabsForViews(): TabProps[] {
    const { setFilterValues } = this.props
    const { views } = this.state

    return (
      views?.map((item: any, index: number) => ({
        index,
        content: item.name,
        // The default view should be locked on the first position
        isLocked: index === 0,
        id: `${index}-${item.name}`,
        key: `${index}-${item.name}`,
        onAction: () => setFilterValues(views[index].filters || {}),
        actions:
          // The default view should not be customizable
          index === 0
            ? []
            : [
                {
                  type: 'rename',
                  onPrimaryAction: async (value: string): Promise<boolean> => {
                    this.renameView(value, index)
                    return true
                  },
                },
                {
                  type: 'duplicate',
                  onPrimaryAction: async (value: string): Promise<boolean> => {
                    this.duplicateView(value, index)
                    return true
                  },
                },
                {
                  type: 'delete',
                  onPrimaryAction: async (): Promise<boolean> => {
                    this.deleteView(index)
                    return true
                  },
                },
              ],
      })) || []
    )
  }

  createView = async (value: string): Promise<boolean> => {
    const { filterValues } = this.props
    const { views } = this.state

    // Create view
    fetch(`/api/views?path=${location.pathname}&action=${VIEW_ACTIONS.CREATE}&name=${value}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filterValues),
    }).catch(console.error)

    this.setState({
      selected: views.length,
      views: [...views, { name: value, filters: filterValues }],
    })

    return true
  }

  renameView = (value: string, index: number) => {
    const { views } = this.state

    const newViews = views.map((item: any, idx: number) => {
      if (idx === index) {
        // Rename view
        fetch(
          `/api/views?path=${location.pathname}&action=${VIEW_ACTIONS.RENAME}&oldName=${item.name}&newName=${value}`
        ).catch(console.error)

        item.name = value
      }

      return item
    })

    this.setState({ views: newViews })
  }

  updateView = async () => {
    const { filterValues } = this.props
    const { views, selected } = this.state
    const newViews = [...views].map((view, index) => (index === selected ? { ...view, filters: filterValues } : view))

    // Update view
    fetch(`/api/views?path=${location.pathname}&action=${VIEW_ACTIONS.UPDATE}&name=${views[selected].name}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filterValues),
    }).catch(console.error)

    this.setState({ views: newViews })
    return true
  }

  duplicateView = (name: string, index: number) => {
    const { views } = this.state
    const newFilters = views[index]?.filters

    // Duplicate view
    fetch(`/api/views?path=${location.pathname}&action=${VIEW_ACTIONS.CREATE}&name=${name}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newFilters),
    }).catch(console.error)

    this.setState({
      selected: views.length,
      views: [...views, { name, filters: newFilters }],
    })
  }

  deleteView = (index: number) => {
    const { views } = this.state
    const newViews = [...views]
    const name = newViews.splice(index, 1)[0]?.name

    // Delete view
    fetch(`/api/views?path=${location.pathname}&action=${VIEW_ACTIONS.DELETE}&name=${name}`).catch(console.error)

    this.setState({
      selected: 0,
      views: newViews,
    })

    // Clear all filter after select tab 0 (All)
    this.clearAllAppliedFilters()
  }

  setSelectedView = (selected: number) => this.setState({ selected })

  onQueryChange = (queryValue: string) => {
    const { filterValues, setFilterValues } = this.props

    setFilterValues({ ...filterValues, queryValue })
  }

  onQueryClear = () => this.onQueryChange('')

  removeAppliedFilter = (key: string): void => {
    const { filterValues, setFilterValues } = this.props

    setFilterValues({ ...filterValues, [key]: undefined })
  }

  clearAllAppliedFilters = () => {
    const { setFilterValues } = this.props

    setFilterValues({})
  }

  cancelFilters = () => {
    const { views, selected } = this.state
    const { setFilterValues } = this.props

    setFilterValues({ ...(views[selected]?.filters || {}) })
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ error, errorInfo })
  }

  componentDidMount(): void {
    const { views } = this.props

    if (views === undefined) {
      // Fetch saved views
      fetch(`/api/views?path=${location.pathname}`)
        .then(res => res.json())
        .then(({ items }) => this.setState({ views: [{ name: 'All' }, ...items] }))
        .catch(console.error)
    } else {
      this.setState({ views: [{ name: 'All' }, ...views] })
    }
  }
}

const ListTable = withDataSource(ListTableComponent)

export default ListTable
