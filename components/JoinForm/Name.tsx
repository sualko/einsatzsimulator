import { Box, Button, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

type Props = {
    name: string,
    setName: (name: string) => void,
}

const Name: React.FC<Props> = ({ name, setName }) => {
    const [nameValue, setNameValue] = useState(name);

    useEffect(() => {
        if (!name) {
            setNameValue(localStorage.getItem('name') || '');
        }
    }, [name]);

    const onSubmit = (ev: React.FormEvent) => {
        ev.preventDefault();

        if (!nameValue) {
            return;
        }

        localStorage.setItem('name', nameValue);

        setName(nameValue);
    }

    return (
        <form onSubmit={onSubmit}>
            <Typography gutterBottom={true}>Please enter your display name which is shown to all other players.</Typography>
            <Box sx={{ display: 'flex' }}>
                <TextField sx={{ flexGrow: 1, marginRight: 3 }} required label="Name" value={nameValue} onChange={(ev) => setNameValue(ev.target.value)} size="small" />
                <Button disabled={!nameValue} variant="contained" type="submit">Weiter</Button>
            </Box>
        </form>
    )
}

export default Name;