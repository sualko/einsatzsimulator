import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import dynamic from 'next/dynamic';
import { Box, CardMedia, Skeleton } from '@mui/material';
import { AidState, LocationState } from 'lib/gameState';
import Victim from './Victim';
import Aid from "./Aid";

type Props = {
    aids: AidState[],
    location: LocationState,
}

const LocationOverview: React.FC<Props> = ({ location, aids }) => {
    const Map = React.useMemo(() => dynamic(
        () => import('./Map'),
        {
            loading: () => <Skeleton variant="rectangular" width={400} height={400} />,
            ssr: false
        }
    ), []);

    const victims = Object.values(location.victims);

    return (
        <Card sx={{ minWidth: 275, maxWidth: 400 }}>
            <CardMedia sx={{ overflow: 'hidden', borderRadius: '50%' }}>
                <Map longitude={location.longitude} latitude={location.latitude} withMarker={true} />
            </CardMedia>
            <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    Location #{location.id}
                </Typography>
                <Typography variant="h5" component="div">
                    {location.name}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    {aids.length} aids / {victims.length} victims
                </Typography>
                <Box>
                    {aids.filter(aid => aid.victimId === null).map(aid => <Aid key={aid.id} name={aid.name} qualification={aid.qualification} leader={aid.leader} />)}
                </Box>

                {victims.map(victim => (<Box key={victim.id}>
                    <Victim {...victim} />

                    {aids.filter(aid => aid.victimId === victim.id).map(aid => <Aid key={aid.id} name={aid.name} qualification={aid.qualification} leader={aid.leader} />)}
                </Box>))}
            </CardContent>
        </Card>
    )
}

export default LocationOverview;