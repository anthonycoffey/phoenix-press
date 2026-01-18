import React, { useState } from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CardHeader from '@mui/material/CardHeader';
import EventAvailable from '@mui/icons-material/EventAvailable';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Paper from '@mui/material/Paper';
import { lighten } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import InfoIcon from '@mui/icons-material/Info';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';

const QuoteStep = ({
  formData,
  quoteData,
  loading,
  error,
  tip,
  onTipChange,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const SURCHARGE_LABELS = ['luxury uplift', 'time surcharge'];

  const breakdown = quoteData?.breakdown || [];

  const surchargeItems = breakdown.filter((item) =>
    SURCHARGE_LABELS.some((label) => item.label?.toLowerCase().includes(label)),
  );

  const specialtyItems = breakdown.filter(
    (item) =>
      !SURCHARGE_LABELS.some((label) =>
        item.label?.toLowerCase().includes(label),
      ),
  );

  const totalSurcharges = surchargeItems.reduce(
    (acc, item) => acc + item.amount,
    0,
  );

  const totalSpecialty = specialtyItems.reduce(
    (acc, item) => acc + item.amount,
    0,
  );

  const basePrice = quoteData
    ? quoteData.quote - totalSurcharges - totalSpecialty
    : 0;

  return (
    <Stack spacing={2}>
      {loading && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            my: 4,
          }}
        >
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>
            Please wait... generating your quote.
          </Typography>
        </Box>
      )}

      {error && <Alert severity='error'>{error}</Alert>}
      {quoteData && (
        <>
          <CardHeader
            title={
              <Typography color='primary' component='span' variant='h6'>
                Confirm Your Booking
              </Typography>
            }
            avatar={<EventAvailable fontSize='large' color='primary' />}
            subheader={
              <>
                <Typography component='span' variant='h6' sx={{ mb: 1 }}>
                  {formData.location}
                </Typography>
                <Typography variant='subtitle1'>
                  {new Date(formData.service_time)
                    .toLocaleString()
                    .replace(', ', ' @ ')}
                </Typography>
                <Typography variant='body2' sx={{ fontWeight: 'bold' }}>
                  {`${formData.car_make} ${formData.car_model} ${formData.car_year}`}
                </Typography>
                <Typography variant='caption' color='text.secondary'>
                  {quoteData.vehicle_class}
                </Typography>
              </>
            }
            sx={{ px: 0 }}
          />

          <TableContainer component={Paper} elevation={0} variant='outlined'>
            <Table aria-label='invoice table'>
              <TableHead
                sx={{
                  bgcolor: (theme) =>
                    lighten(theme.palette.background.paper, 0.1),
                }}
              >
                <TableRow>
                  <TableCell>Description</TableCell>
                  <TableCell align='right'>Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* Specialty Services */}
                {specialtyItems.map((item, index) => (
                  <TableRow key={`specialty-${index}`}>
                    <TableCell component='th' scope='row'>
                      {item.label}
                    </TableCell>
                    <TableCell align='right'>
                      ${item.amount.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}

                {/* Additional Fees */}
                {totalSurcharges > 0 && (
                  <TableRow>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        Additional Fees
                        <IconButton
                          onClick={handlePopoverOpen}
                          size='small'
                          sx={{ ml: 1 }}
                        >
                          <InfoIcon fontSize='small' />
                        </IconButton>
                        <Popover
                          open={open}
                          anchorEl={anchorEl}
                          onClose={handlePopoverClose}
                          anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                          }}
                        >
                          <List dense sx={{ p: 1 }}>
                            {surchargeItems.map((item, index) => (
                              <ListItem key={index}>
                                <ListItemText
                                  primary={`$${item.amount.toFixed(2)}`}
                                  secondary={item.label}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </Popover>
                      </Box>
                    </TableCell>
                    <TableCell align='right'>
                      ${totalSurcharges.toFixed(2)}
                    </TableCell>
                  </TableRow>
                )}

                {/* Subtotal */}
                <TableRow sx={{ bgcolor: 'action.hover' }}>
                  <TableCell colSpan={1} sx={{ fontWeight: 'bold' }}>
                    Subtotal
                  </TableCell>
                  <TableCell align='right' sx={{ fontWeight: 'bold' }}>
                    ${quoteData.quote.toFixed(2)}
                  </TableCell>
                </TableRow>

                {/* Tip */}
                <TableRow>
                  <TableCell colSpan={2} sx={{ p: 2 }}>
                    <TextField
                      label='Tip (optional)'
                      type='number'
                      value={tip}
                      onChange={onTipChange}
                      fullWidth
                      variant='outlined'
                      size='small'
                      InputProps={{
                        startAdornment: (
                          <Typography sx={{ mr: 1 }}>$</Typography>
                        ),
                      }}
                    />
                  </TableCell>
                </TableRow>

                {/* Total */}
                <TableRow sx={{ bgcolor: 'action.selected' }}>
                  <TableCell
                    colSpan={1}
                    sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}
                  >
                    Total
                  </TableCell>
                  <TableCell
                    align='right'
                    sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}
                  >
                    ${(quoteData.quote + (parseFloat(tip) || 0)).toFixed(2)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          {specialtyItems.length > 0 && (
            <Typography variant='caption' color='text.secondary' sx={{ px: 1 }}>
              *Core services are flat-rate. Specialty Services require a
              deposit. The listed Specialty Service amount applies toward the
              final cost, which will be disclosed and approved before services are rendered.
            </Typography>
          )}
        </>
      )}
    </Stack>
  );
};

export default QuoteStep;
