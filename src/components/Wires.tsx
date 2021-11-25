import React from 'react'

import WireDesktop from './WireDesktop'
import WireTime from './WireTime'
import WireImages from './WireImages'

type Props = {
    imageZoom: boolean
}

const Wires = ({imageZoom}: Props) => {
    return (<>
        <WireDesktop />
        <WireTime />
        <WireImages imageZoom={imageZoom} />
    </>)
}

export default Wires