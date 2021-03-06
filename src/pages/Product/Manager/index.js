import React, { useCallback, useEffect, useState } from 'react'
import { map } from 'ramda'

import { buildDataSource, buildQueryProduct } from './specs'
import {
  getProdutos,
} from '../../../services/produto'
import ManagerContainer from '../../../containers/Product/Manage'

const Manager = ({ history }) => {
  const [dataSource, setDataSource] = useState([])
  const [page, setPage] = useState(1)
  const [queryProduct, setQueryProduct] = useState({})
  const [total, setTotal] = useState(10)
  const [visibleSearch, setVisibleSearch] = useState()

  const getAllProducts = useCallback(() => {
    const { product, category, brand, type } = queryProduct
    const query = {
      filters: {
        product: {
          specific: {
            name: product,
            category,
          },
        },
        mark:{
          specific: {
            mark: brand
          }
        },
        equipType:{
          specific: {
            type
          }
        }
      },
      page,
      paranoid: true,
      required: true,
      total: 10,
    }

    getProdutos(query).then(({ data: { rows, count: total } }) => {
      setDataSource(map(buildDataSource, rows))

      setTotal(total)
    })
  }, [page, queryProduct])

  const handleOnChangeTable = ({ current }) => setPage(current)

  const handleOnClickEdit = (row) => {
    history.push(`edit/${row.id}`)
  }

  const handleOnClickNewProduct = () => {
    history.push('/logged/product/add')
  }

  const handleProductSearch = (productSearchFormData) => {
    setQueryProduct(buildQueryProduct(productSearchFormData))
  }

  useEffect(() => {
    getAllProducts()
  }, [getAllProducts])

  return (
    <ManagerContainer
      dataSource={dataSource}
      handleOnChangeTable={handleOnChangeTable}
      handleOnClickCloseSearchForm={() => setVisibleSearch(false)}
      handleOnClickEdit={handleOnClickEdit}
      handleOnClickNewProduct={handleOnClickNewProduct}
      handleOnClickOpenSearchForm={() => setVisibleSearch(true)}
      handleOnSearch={handleProductSearch}
      pagination={{ total }}
      visibleSearch={visibleSearch}
    />
  )
}

export default Manager
