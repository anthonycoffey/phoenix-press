import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export default function ServiceCarousel({
  services,
  selectedServices,
  onServiceSelect,
}) {
  return (
    <Box sx={{ my: 2 }}>
      <Swiper
        spaceBetween={16}
        slidesPerView={'auto'}
        freeMode={true}
        grabCursor={true}
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
