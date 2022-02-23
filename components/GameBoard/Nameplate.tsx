import { Typography } from "@mui/material";
import React from 'react';

type Props = {
    name: string,
    size?: string | number,
}

const Nameplate: React.FC<Props> = (props) => {
    const size = props.size || '1.2rem';

    return (
        <Typography sx={{
            color: '#bfbfbf',
            backgroundColor: '#545454',
            fontSize: size,
            fontWeight: 'bold',
            border: '0.3em solid #646464',
            textAlign: 'center',
            lineHeight: '1.6em',
            textTransform: 'uppercase',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        }}>{props.name}</Typography>
    )
}

export default Nameplate;