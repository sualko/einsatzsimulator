import React from 'react';
import { Box, Typography } from '@mui/material';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import { TriageColor } from 'lib/triage';
import { VictimState } from "lib/gameState";

type Props = VictimState & {

}

const TriageTag: React.FC<Props> = (state) => {
    return (
        <Box sx={{
            minWidth: '600px',
            maxWidth: '700px',
            padding: 1,
            border: '1px solid black',
            '& h1': {
                fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
                textAlign: 'center',
                margin: '8px 0',
                fontSize: '1.6em',
                '& + em': {
                    textAlign: 'center',
                    marginBottom: 1,
                }
            },
            '& table': {
                width: '100%',
                borderCollapse: 'collapse',
                fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
                marginBottom: 2,
                '&.person-data': {
                    marginBottom: 0,
                    '& tr td:first-child': {
                        borderLeft: 0,
                    },
                    '& tr td:last-child': {
                        borderRight: 0,
                    },
                },
            },
            '& strong, & em': {
                display: 'block',
            },
            '& em': {
                fontSize: '0.8em',
            },
            '& td': {
                border: '1px solid black',
                padding: 0.5,
                verticalAlign: 'top',
            },
            '& p': {
                fontFamily: 'cursive',
                textAlign: 'center',
                fontSize: '2em',
                flexGrow: '1',
            }
        }}>
            <h1>Anhängekarte für Verletzte/Kranke</h1>
            <em>Registration card for injured/sick persons - Fiche d&apos;enregistrement pur blesseés/malades</em>
            <table className="person-data">
                <tr>
                    <td>
                        <Box display="flex" alignItems="center">
                            <Box>
                                <strong>Name</strong>
                                <em>Name</em>
                                <em>Nom</em>
                            </Box>
                            <Typography>{state.name}</Typography>
                        </Box>
                    </td>
                    <td rowSpan={2} colSpan={2} style={{ border: '2px solid red' }}>
                        <Typography>{state.identifier}</Typography>
                    </td>
                </tr>
                <tr>
                    <td>
                    <Box display="flex" alignItems="center">
                            <Box>
                                <strong>Vorname</strong>
                                <em>First name</em>
                                <em>Prénom</em>
                            </Box>
                            <Typography>{state.name}</Typography>
                        </Box>
                    </td>
                </tr>
                <tr>
                    <td>
                    <Box display="flex" alignItems="center">
                            <Box>
                                <strong>Geburtsdatum/~Alter</strong>
                                <em>Date of birth/~age</em>
                                <em>Date de naissance/~áge</em>
                            </Box>
                            <Typography>{state.age}</Typography>
                        </Box>
                        </td>
                    <td><MaleIcon /> m</td>
                    <td><FemaleIcon />f</td>
                </tr>
                <tr>
                    <td>
                    <Box display="flex" alignItems="center">
                            <Box>
                                <strong>Nationalität</strong>
                                <em>Nationality</em>
                                <em>Nationalité</em>
                            </Box>
                            <Typography></Typography>
                        </Box>
                        </td>
                    <td colSpan={2}>
                    <Box display="flex" alignItems="center">
                            <Box>
                                <strong>Datum</strong>
                                <em>Date</em>
                            </Box>
                            <Typography></Typography>
                        </Box>
                        </td>
                </tr>
            </table>

            <table>
                <tr>
                    <td><strong>Sichtung</strong><em>Sorting/Triage</em></td>
                    <td><strong>1. Sichtung</strong></td>
                    <td><strong>2. Sichtung</strong></td>
                    <td><strong>3. Sichtung</strong></td>
                    <td><strong>4. Sichtung</strong></td>
                </tr>
                <tr>
                    <td><strong>Kategorie</strong><em>Category</em><em>Catégorie</em></td>
                    <td><strong>Uhrzeit/Name</strong><em>Time/Name</em><em>Heure/Nom</em></td>
                    <td><strong>Uhrzeit/Name</strong></td>
                    <td><strong>Uhrzeit/Name</strong></td>
                    <td><strong>Uhrzeit/Name</strong></td>
                </tr>
                <tr>
                    <td>I</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>II</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>III</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>IV</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>D</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            </table>

            <table>
                <tr>
                    <td>Transportmittel</td>
                    <td>Transportziel</td>
                </tr>
            </table>

            <table>
                <tr>
                    <td>Transport</td>
                    <td>liegend</td>
                    <td>sitzend</td>
                    <td>mit Notarzt</td>
                    <td>isoliert</td>
                    <td>Priorität</td>
                </tr>
            </table>

            <table>
                <tr>
                    <td colSpan={2}>Innenliegende Suchdienstkarte</td>
                </tr>
                <tr>
                    <td>1. Ausfertigung</td>
                    <td>weitergeleitet</td>
                </tr>
                <tr>
                    <td>2. Ausfertigung</td>
                    <td>weitergeleitet</td>
                </tr>
            </table>

            <Box sx={{ minWidth: 40, paddingTop: '30%', backgroundColor: TriageColor[state.priority] }}></Box>
        </Box>
    )
}

export default TriageTag;