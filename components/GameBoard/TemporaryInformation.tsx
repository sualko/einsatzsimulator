import { Alert, Box, LinearProgress, Stack } from "@mui/material";
import React from 'react';

type Props = {

}

const TemporaryInformation: React.FC<Props> = () => {
    return (
        <Box p={3}>
            <Stack direction="column" spacing={1}>
            <Alert severity="info" sx={{ position: 'relative' }}>Feuerwehrmann berichtet von mindestens 30 weiteren Personen
                    <LinearProgress variant="determinate" value={10} color="info" sx={{ position: 'absolute', left: 0, bottom: 0, right: 0 }} />
                </Alert>
                <Alert severity="info" sx={{ position: 'relative' }}>MTW eingetroffen
                    <LinearProgress variant="determinate" value={90} color="info" sx={{ position: 'absolute', left: 0, bottom: 0, right: 0 }} />
                </Alert>
                <Alert severity="warning" sx={{ position: 'relative' }}>Lauter Knall
                    <LinearProgress variant="determinate" value={70} color="warning" sx={{ position: 'absolute', left: 0, bottom: 0, right: 0 }} />
                </Alert>
            </Stack>
        </Box>
    )
}

export default TemporaryInformation;