import React from 'react';
import dynamic from 'next/dynamic';
import { Box } from "@mui/material";

type Props = {
    longitude: number,
    latitude: number,
}

const Board: React.FC<Props> = (props) => {
    const Map = React.useMemo(() => dynamic(
        () => import('./Map'),
        {
            loading: () => <>Loading</>,
            ssr: false
        }
    ), []);
    return (
        <Box sx={{ minHeight: '100vh', width: '100%' }}>
            <Box sx={{ position: 'fixed', width: '100%', overflow: 'hidden', zIndex: -10, filter: 'blur(20px)' }}>
                <Map longitude={props.longitude} latitude={props.latitude} size="fullsize" />
            </Box>
            {props.children}
        </Box>
    )
}

export default Board;