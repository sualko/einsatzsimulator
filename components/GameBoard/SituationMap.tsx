import { Box, Skeleton } from "@mui/material";
import { Scenario, Location } from "@prisma/client";
import dynamic from "next/dynamic";
import React from 'react';

type Props = {
    scenario: Scenario,
    locations: Location[],
}

const SituationMap: React.FC<Props> = ({scenario, locations}) => {
    const Map = React.useMemo(() => dynamic(
        () => import('./Map'),
        {
            loading: () => <Skeleton variant="rectangular" width="100%" height={400} />,
            ssr: false
        }
    ), []);

    const marker = locations.map(location => ({
        latitude: location.latitude,
        longitude: location.longitude,
        label: location.name,
    }));

    return (
       <Box>
           <Map
            latitude={scenario.latitude}
            longitude={scenario.longitude}
            size={{width: '100%', height: 400}}
            marker={marker}
            dragging={true} />
       </Box>
    )
}

export default SituationMap;