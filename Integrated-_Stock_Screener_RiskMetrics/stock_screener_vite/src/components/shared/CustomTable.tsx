import * as React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { IHistoricalDataResponse, RiskMetrics } from '@/pages/Portfolio.page';
import { LinearProgress } from '@mui/material';


function CustomTable({ riskMetrics }: RiskMetrics) {

    // const tableHeaders = historicalData.length ? Object.keys(historicalData[0].data[0]).slice(0, -1) : [];
    // const tickerData = historicalData.length ? historicalData[0].data : [];
    const [loading, setLoading] = React.useState(true);

    const tableHeaders = riskMetrics ? Object.keys(riskMetrics) : [];
    // const tickerData = historicalData.length ? historicalData[0].data : [];


    // eslint-disable-next-line react-hooks/exhaustive-deps
    React.useEffect(() => setLoading(riskMetrics == null));



    return (
        <div>
            {loading ?
                <div className="pt-2">
                    < LinearProgress sx={{}} />
                </div> : (
                    <Box sx={{ margin: 1 }}>
                        <Typography variant="h6" gutterBottom component="div">
                            Risk Metrics
                        </Typography>
                        <TableContainer component={Paper} sx={{ maxHeight: 350 }}>
                            <Table size="small"  >
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: 'rgb(212 212 216)' }}>
                                        {tableHeaders.map((header, index) => (
                                            <TableCell key={index}>{header}</TableCell>
                                        ))}

                                    </TableRow>
                                </TableHead>
                                <TableBody sx={{ maxHeight: '15%' }}>
                                    {riskMetrics ? Object.keys(riskMetrics).map((metrics, index) => (
                                        <TableRow key={index}>
                                            <TableCell align="right">{riskMetrics.mean}</TableCell>
                                            <TableCell align="right">{riskMetrics.sample_std}</TableCell>
                                            <TableCell>{riskMetrics.skew}</TableCell>
                                            <TableCell align="right">{riskMetrics.kurt}</TableCell>
                                            <TableCell component="th" scope="row">
                                                {riskMetrics.annualized_return}
                                            </TableCell>
                                            <TableCell align="right">{riskMetrics.m_squared}</TableCell>
                                            <TableCell>{riskMetrics.beta}</TableCell>
                                            <TableCell align="right">{riskMetrics.minrisk_weights}</TableCell>

                                        </TableRow>
                                    )) : null}
                                </TableBody>
                            </Table>
                        </TableContainer >
                    </Box>)}
        </div>
    )
}

export default CustomTable