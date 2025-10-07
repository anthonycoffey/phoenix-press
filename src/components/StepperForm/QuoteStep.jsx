import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import Garage from '@mui/icons-material/Garage';
import Receipt from '@mui/icons-material/Receipt';
import MoreTime from '@mui/icons-material/MoreTime';
import AttachMoney from '@mui/icons-material/AttachMoney';
import { List, ListItem, ListItemText, ListItemIcon } from '@mui/material';

export default function QuoteStep({ quoteData, loading, error }) {
  if (loading) {
    return <LinearProgress />;
  }

  if (error) {
    return <Alert severity='error'>{error}</Alert>;
  }

  return (
    <Box>
      {quoteData && (
        <>
          {/* <Chip label='Quote' color='primary' /> */}
          <List>
            <ListItem>
              <ListItemIcon>
                <Garage color="primary" size="medium" />
                
              </ListItemIcon>
              <ListItemText
                primary={`Vehicle Class`}
                secondary={quoteData.vehicle_class}
              />
            </ListItem>

            <ListItem>
              <ListItemIcon>
                <Receipt color="primary" size="medium" />
                
              </ListItemIcon>
              <ListItemText primary={`Total`} secondary={`$${quoteData.quote}`} />
            </ListItem>

            {quoteData.breakdown.map((item, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  {item.label.includes('surcharge') ? (<MoreTime color="primary" size="medium" />) : (<AttachMoney color="primary" size="medium" />)}
                </ListItemIcon>

                <ListItemText
                  primary={`${item.label}`}
                  secondary={`$${item.amount}`}
                />
              </ListItem>
            ))}
          </List>

          {quoteData.notes && (
            <Typography style={{ marginTop: '10px' }}>
              Notes: {quoteData.notes}
            </Typography>
          )}
        </>
      )}
    </Box>
  );
}
