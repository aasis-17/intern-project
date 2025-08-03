import React, { useCallback, useMemo } from 'react'

const Notify = ({data}) => {
    
  return (
    <div>
        <p>{data.msg}</p>
    </div>
  )
}

export default Notify