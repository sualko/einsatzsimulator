import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { Button, StepContent, Typography } from '@mui/material';
import Name from './Name';
import RoleSelection from './RoleSelection';
import { GameState } from 'lib/gameState';
import { Action, updateAidId, updateUserName, userIsReady } from 'lib/gameState/actions';
import { Scenario, Location } from "@prisma/client";
import MapIcon from '@mui/icons-material/Map';
import SituationMap from "components/GameBoard/SituationMap";

type Props = {
    state: GameState,
    dispatch: React.Dispatch<Action>,
    scenario: Scenario,
    locations: Location[],
}

const JoinForm: React.FC<Props> = ({ state, dispatch, scenario, locations }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [name, setName] = useState('');

    useEffect(() => {
        setName(localStorage.getItem('name') || '');
    }, []);

    const onNameChange = (name: string) => {
        localStorage.setItem('name', name);

        dispatch(updateUserName(state, name));

        setActiveStep(1);
    }

    const onCharacterIdChange = (id: number) => {
        dispatch(updateAidId(state, id));

        setActiveStep(2);
    }

    const onReady = () => {
        dispatch(userIsReady());
    }

    return (
        <Box>
            {activeStep < 3 && <Stepper activeStep={activeStep} orientation="vertical">
                <Step>
                    <StepLabel>Wie heißt du?</StepLabel>
                    <StepContent>
                        <Name name={name} setName={onNameChange} />
                    </StepContent>
                </Step>
                <Step>
                    <StepLabel>Wähle deine Rolle</StepLabel>
                    <StepContent>
                        <RoleSelection
                            aids={Object.values(state.aids)}
                            setCharacterId={onCharacterIdChange}
                            player={state.users}
                            goBack={() => setActiveStep(activeStep - 1)}
                            userId={state.userId} />
                    </StepContent>
                </Step>
                <Step>
                    <StepLabel>Briefing</StepLabel>
                    <StepContent>
                        <Box sx={{ mb: 2 }}>
                            <div>
                                <Button
                                    variant="contained"
                                    onClick={() => setActiveStep(activeStep + 1)}
                                    sx={{ mt: 1, mr: 1 }}
                                >
                                    Zur Einweisung
                                </Button>
                                <Button
                                    onClick={() => setActiveStep(activeStep - 1)}
                                    sx={{ mt: 1, mr: 1 }}
                                >
                                    Zurück
                                </Button>
                            </div>
                        </Box>
                    </StepContent>
                </Step>
            </Stepper>}

            {activeStep >= 3 && <Box>
                <Typography variant="subtitle1">{scenario.description}</Typography>
                <Typography variant="caption" gutterBottom><MapIcon sx={{ fontSize: '1em' }} /> {scenario.latitude} {scenario.longitude}</Typography>

                <SituationMap {...{ scenario, locations }} />

                <Typography gutterBottom>Bitte bedenke, dass nicht beliebe Kräfte nach alarmiert werden können
                und das Hauptaugenmerk dieser Übung auf dem Ablauf und der Kommunikation zwischen den Helfern vor Ort liegt.</Typography>

                <Box sx={{ mb: 2 }}>
                    <div>
                        <Button
                            variant="contained"
                            onClick={() => onReady()}
                            sx={{ mt: 1, mr: 1 }}
                        >
                            Bin bereit
                        </Button>
                        <Button
                            onClick={() => setActiveStep(activeStep - 1)}
                            sx={{ mt: 1, mr: 1 }}
                        >
                            Zurück
                        </Button>
                    </div>
                </Box>
            </Box>}
        </Box>
    )
}

export default JoinForm;