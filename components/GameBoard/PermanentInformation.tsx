import { List, ListItem, ListItemText, SxProps, Theme } from "@mui/material";
import React from 'react';

type Props = {
    sx?: SxProps<Theme>
}

const PermanentInformation: React.FC<Props> = ({ sx }) => {
    return (
        <List sx={sx}>
            <ListItem>
                <ListItemText>Sonnig, 25 °C</ListItemText>
            </ListItem>
            <ListItem>
                <ListItemText>Starker find von Osten</ListItemText>
            </ListItem>
        </List>
    )
}

export default PermanentInformation;