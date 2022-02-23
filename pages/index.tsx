import { Avatar, Box, Button, CircularProgress, Container, List, ListItemAvatar, ListItemButton, ListItemText, Skeleton, Typography } from "@mui/material"
import { useScenarios } from "lib/swr"
import Image from 'next/image'
import SubmitIcon from '@mui/icons-material/Send'
import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

export default function Home() {
  const { scenarios, createGame } = useScenarios();
  const [selectedScenarioId, setSelectedScenarioId] = useState<number>();
  const [isCreating, setCreating] = useState(false);
  const router = useRouter();

  const Map = useMemo(() => dynamic(
    () => import('../components/GameBoard/Map'),
    {
      loading: () => <Skeleton variant="rectangular" width={40} height={40} />,
      ssr: false
    }
  ), []);

  const onCreateGame = async () => {
    if (typeof selectedScenarioId !== 'number') {
      return;
    }

    setCreating(true);

    const gameId = await createGame(selectedScenarioId);

    router.push('/game/' + gameId);
  }

  return (
    <Container fixed maxWidth="md">
      <Box display="flex" justifyContent="flex-end" alignItems="flex-start">
        <Box flexGrow={1}></Box>
        <Box>
          <Image src="/einsatzsimulator-logo.svg" alt="Logo Einsatzsimulator" height={120} width={270} />
        </Box>
      </Box>

      <Typography variant="h4" gutterBottom>Scenarios</Typography>
      <Typography>Hier kannst du zwischen verschiedenen Scenarios wählen um eine neue Übung zu starten.</Typography>
      <List sx={{ margin: 2 }}>
        {scenarios?.map(scenario => (
          <ListItemButton
            key={scenario.id}
            selected={selectedScenarioId === scenario.id}
            onClick={() => setSelectedScenarioId(scenario.id)}>
            <ListItemAvatar>
              <Avatar>
                <Map latitude={scenario.latitude} longitude={scenario.longitude} size={40} />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={scenario.name} secondary={scenario.description} />
          </ListItemButton>
        ))}
      </List>
      <Button
        disabled={!selectedScenarioId || isCreating}
        variant="contained"
        onClick={onCreateGame}
        startIcon={isCreating ? <CircularProgress sx={{ color: 'inherit' }} size="1em" /> : <SubmitIcon />}>Neue Übung erstellen</Button>
    </Container>
  )
}
