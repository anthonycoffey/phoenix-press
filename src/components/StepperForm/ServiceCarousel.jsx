import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

export default function ServiceCarousel({
  services,
  selectedServices,
  onServiceSelect,
}) {
  return (
    <Box
      sx={{
        my: 2,
        // Custom styling for Swiper navigation buttons to match MUI theme
        '& .swiper-button-next, & .swiper-button-prev': {
          color: 'primary.main',
          bgcolor: 'background.paper',
          width: 36,
          height: 36,
          borderRadius: '50%',
          boxShadow: 2,
          '&:after': {
            fontSize: '1.2rem',
            fontWeight: 'bold',
          },
          '&:hover': {
            bgcolor: 'action.hover',
          },
        },
        '& .swiper-button-disabled': {
          opacity: 0.35,
          cursor: 'not-allowed',
        },
      }}
    >
      {selectedServices.length > 0 && (
        <Stack direction='row' spacing={1} flexWrap='wrap' sx={{ mb: 2 }}>
          {selectedServices.map((service) => (
            <Chip
              key={service.id}
              label={service.text}
              onDelete={() => onServiceSelect(service)}
              color='primary'
              variant='filled'
            />
          ))}
        </Stack>
      )}

      <Swiper
        modules={[Navigation]}
        navigation={true}
        spaceBetween={16}
        slidesPerView={'auto'}
        freeMode={true}
        grabCursor={true}
        style={{ padding: '4px' }}
      >
        {services.map((service) => (
          <SwiperSlide key={service.id} style={{ width: 'auto' }}>
            <Card
              onClick={() => onServiceSelect(service)}
              sx={{
                cursor: 'pointer',
                border: selectedServices.some((s) => s.id === service.id)
                  ? '2px solid'
                  : '2px solid transparent',
                borderColor: selectedServices.some((s) => s.id === service.id)
                  ? 'primary.main'
                  : 'transparent',
                transition: 'border-color 0.3s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: 120,
                width: 120,
              }}
            >
              <CardContent
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  p: 1,
                  '&:last-child': { pb: 1 },
                }}
              >
                {service.icon}
                <Typography variant='body2' sx={{ mt: 1 }}>
                  {service.text}
                </Typography>
              </CardContent>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}
