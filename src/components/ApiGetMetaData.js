import React, { useEffect, useState } from 'react'
import MetaData from './MetaData'
import axios, { AxiosError } from 'axios'
import PropTypes from 'prop-types'

const severUrl = process.env.REACT_APP_SERVER_URL

const ApiGetMetaData = ({ slug, onSeoDataFetched }) => {
  const [page, setPage] = useState({})

  useEffect(() => {
    const fetchPage = async (slug) => {
      try {
        const apiUrl = `${severUrl}/api/v1/page/${slug}`
        const response = await axios.get(apiUrl)
        const isJson = response.headers.get('content-type')?.includes('application/json')
        if (!isJson) {
          throw new Error('Response is not JSON.')
        }
        setPage(response.data)
        onSeoDataFetched({ ...response.data, status: response.status })
      } catch (error) {
        console.error(error)
        let errorMessage = 'Unknown Error'
        let status = 424

        if (!error?.response) {
          errorMessage = 'No Server Response'
        } else if (error?.code === AxiosError.ERR_NETWORK) {
          errorMessage = 'Network Error'
        } else if (error.response?.status !== 200) {
          status = error.response?.status
        } else if (error?.code) {
          status = error.code
        }

        onSeoDataFetched({ error: errorMessage, status })
      }
    }
    fetchPage(slug)
  }, [slug])

  return (
        <div>
            <MetaData data={page}/>
        </div>
  )
}

ApiGetMetaData.propTypes = {
  slug: PropTypes.string.isRequired,
  onSeoDataFetched: PropTypes.func.isRequired
}

export default ApiGetMetaData
