import React from 'react';
import dynamic from 'next/dynamic';
import { Skeleton } from "@mui/material";
import { Box } from "@mui/system";

type Props = {
    longitude: number,
    latitude: number,
}

const PlayerLocation: React.FC<Props> = ({ longitude, latitude }) => {
    const Map = React.useMemo(() => dynamic(
        () => import('./Map'),
        {
            loading: () => <Skeleton variant="rectangular" width={400} height={400} />,
            ssr: false
        }
    ), []);

    return (
        <Box p={4}>
            <Box sx={{ overflow: 'hidden', borderRadius: '50%', boxShadow: '0 0 10px rgb(0 0 0 / 20%)' }}>
                <Map longitude={longitude} latitude={latitude} size={200} withMarker={true} />
            </Box>
        </Box>
    )
}

export default PlayerLocation;