import { InputAdornment, IconButton, FormControl, Input, TextField } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from 'react';
import ClipboardIcon from '@mui/icons-material/ContentCopy';
import { grey } from "@mui/material/colors";

type Props = {

}

const CopyUrlToClipboard: React.FC<Props> = () => {
    const router = useRouter();
    const [origin, setOrigin] = useState('');
    const textInput = useRef<HTMLInputElement>(null);

    const url = origin + router.asPath;

    useEffect(() => {
        if (window) {
            setOrigin(window.location.origin);
        }
    }, []);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(url);
    }

    return (
        <TextField
            variant="outlined"
            size="small"
            sx={{ backgroundColor: grey[100] }}
            margin="none"
            value={url}
            onClick={() => {textInput.current?.select(); copyToClipboard()}}
            inputRef={textInput}
            InputProps={{
                endAdornment: <InputAdornment position="end">
                    <IconButton
                        aria-label="copy to clipboard"
                        edge="end"
                        onClick={copyToClipboard}
                    >
                        <ClipboardIcon />
                    </IconButton>
                </InputAdornment>,
                readOnly: true
            }} />
    )
}

export default CopyUrlToClipboard;