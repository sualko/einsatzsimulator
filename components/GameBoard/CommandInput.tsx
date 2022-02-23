import { FormControl, Input, InputAdornment, IconButton, Box, SxProps } from "@mui/material";
import SendIcon from "@mui/icons-material/Send"
import SuccessIcon from "@mui/icons-material/Check"
import FailureIcon from "@mui/icons-material/Cancel"
import React, { FormEventHandler, useState } from 'react';

type Props = {
    sx: SxProps
    onSubmit: (command: string) => Promise<boolean>
}

const CommandInput: React.FC<Props> = ({ sx, onSubmit }) => {
    const [command, setCommand] = useState('');
    const [result, setResult] = useState<boolean | null>(null);
    const [isProcessing, setProcessing] = useState(false);

    const onSubmitHandler: FormEventHandler = (ev) => {
        ev.preventDefault();

        setProcessing(true);

        onSubmit(command).then(success => {
            setResult(success);

            setTimeout(() => setResult(null), 3000);
        }).finally(() => {
            setProcessing(false);
            setCommand('');
        });
    }

    const icon = result === null ? <SendIcon /> : (result ? <SuccessIcon color="success" /> : <FailureIcon color="error" />);

    return (
        <Box sx={{ backgroundColor: '#fff', paddingTop: 1, paddingRight: 2, paddingBottom: 1, paddingLeft: 2, borderRadius: 8, ...(sx || {}) }}>
            <form onSubmit={onSubmitHandler}>
                <FormControl variant="outlined" fullWidth>
                    <Input
                        id="outlined-adornment-action"
                        disabled={isProcessing}
                        type="text"
                        sx={{ border: 0 }}
                        value={command}
                        onChange={(ev) => setCommand(ev.target.value)}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    disabled={isProcessing}
                                    type="submit"
                                    aria-label="submit action"
                                    edge="end"
                                >
                                    {icon}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </FormControl>
            </form>
        </Box>
    )
}

export default CommandInput;