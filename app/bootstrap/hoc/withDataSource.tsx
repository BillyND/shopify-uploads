import type { ComponentClass, FunctionComponent } from 'react'
import { ITEM_LIST_LIMITATION } from '~/constants'
import { useCallback, useEffect, useState } from 'react'
import { authenticatedFetch } from '~/shopify/fns.client'
import { useIndexResourceState, useSetIndexFiltersMode } from '@shopify/polaris'

export type WithDataSourceProps = {
  sort: string[]
  // The data key used for querying items that match a keyword
  queryKey: string
  // The URL for requesting data
  dataSource: string
  // And other properties as well
  [key: string]: any
}

export type WithDataSourceChildProps = {
  page: number
  items: any[]
  total: number
  limit?: number
  loading: boolean
  queryKey: string
  firstLoad: boolean
  selectable?: boolean
  showPagination?: number
  sort: string[] | undefined
  filterValues: { queryValue?: string; [key: string]: string | any[] | undefined }
  setPage: (page: number) => void
  setSort: (sort: string[]) => void
  setFilterValues: (filterValues: { queryValue: string; [key: string]: string | any[] | undefined }) => void
  /**
   * Object returned by calling the function `useSetIndexFiltersMode`
   *
   * @see useSetIndexFiltersMode
   */
  useSetIndexFiltersMode: any
  /**
   * Object returned by calling the function `useIndexResourceState`
   *
   * @see useIndexResourceState
   */
  useIndexResourceState: any
}

const timers: { [key: string]: any } = {}
const aborters: { [key: string]: AbortController } = {}

export default function withDataSource(
  Component: FunctionComponent<WithDataSourceChildProps> | ComponentClass<WithDataSourceChildProps>
) {
  return function WithDataSource(props: WithDataSourceProps) {
    const { queryKey, dataSource, sort: _sort, loading: _loading, limit, refresh, ...otherProps } = props

    // Define component state
    const [page, setPage] = useState<number>(1)
    const [items, setItems] = useState<any[]>([])
    const [total, setTotal] = useState<number>(0)
    const [sort, setSort] = useState<string[]>(_sort)
    const [loading, setLoading] = useState<boolean>(true)
    const [firstLoad, setFirstLoad] = useState<boolean>(true)
    const [filterValues, setFilterValues] = useState<{ [key: string]: any }>({})

    // Define function for fetching data
    const fetchData = useCallback(async () => {
      // Prevent sending multiple requests
      abortRequest(dataSource)

      // Set loading state
      setLoading(true)

      // Clear previous timer if necessary
      if (refresh && timers[dataSource]) {
        clearTimeout(timers[dataSource])
      }

      // Schedule requesting data after a timeout
      timers[dataSource] = setTimeout(async () => {
        const { queryValue, ...otherFilters } = filterValues

        // Generate search params
        const searchParams = [`limit=${limit || ITEM_LIST_LIMITATION}`]

        page > 1 && searchParams.push(`page=${page}`)
        queryValue && searchParams.push(`filter=${queryKey}|${queryValue}`)
        sort?.length && searchParams.push(`sort=${sort[0].toString().replace(' ', '|')}`)

        for (const filterOnKey in otherFilters) {
          if (otherFilters[filterOnKey] instanceof Array && otherFilters[filterOnKey].length) {
            searchParams.push(`filter=${filterOnKey}|${otherFilters[filterOnKey].join(',')}`)
          } else if (typeof otherFilters[filterOnKey] === 'string' && otherFilters[filterOnKey]) {
            searchParams.push(`filter=${filterOnKey}|${otherFilters[filterOnKey]}`)
          }
        }

        // Request data
        const queryString = searchParams.join('&')
        aborters[dataSource] = new AbortController()

        const { items = [], total = 0 }
          = (await authenticatedFetch(`${dataSource}${queryString ? `?${queryString}` : ''}`, {
            signal: aborters[dataSource].signal,
          })) || {}

        setItems(items)
        setTotal(total)
        setLoading(false)
        setFirstLoad(false)
      }, 100)
    }, [dataSource, filterValues, limit, page, queryKey, refresh, sort])

    useEffect(() => {
      fetchData()

      return () => abortRequest(dataSource)
    }, [dataSource, fetchData])

    // Implement ability to filter items
    const filters = useSetIndexFiltersMode()

    // Implement ability to select items
    const selection = useIndexResourceState(items)

    return (
      <Component
        {...otherProps}
        page={page}
        sort={sort}
        items={items}
        limit={limit}
        total={total}
        queryKey={queryKey}
        firstLoad={firstLoad}
        filterValues={filterValues}
        loading={loading || _loading}
        useIndexResourceState={filters}
        useSetIndexFiltersMode={selection}
        setPage={setPage}
        setSort={setSort}
        setFilterValues={setFilterValues}
      />
    )
  }
}

function abortRequest(dataSource: string) {
  aborters[dataSource] && aborters[dataSource].abort()
  timers[dataSource] && clearTimeout(timers[dataSource])
}
