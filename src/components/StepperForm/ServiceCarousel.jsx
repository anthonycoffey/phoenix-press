import { useState } from 'react';
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
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export default function ServiceCarousel({
  services,
  selectedServices,
  onServiceSelect,
}) {
  const [prevEl, setPrevEl] = useState(null);
  const [nextEl, setNextEl] = useState(null);

  const navBtnStyle = {
    color: 'primary.main',
    bgcolor: 'grey.900',
    border: '2px solid',
    borderColor: 'primary.main',
    width: 36,
    height: 36,
    borderRadius: '50%',
    padding: 0, // Ensure icon centering isn't affected by padding
    '&:hover': {
      bgcolor: 'grey.800',
    },
    '&.swiper-button-disabled': {
      opacity: 0.35,
      cursor: 'not-allowed',
      borderColor: 'action.disabled',
      color: 'action.disabled',
    },
  };

  return (
    <Box sx={{ my: 2 }}>
      {selectedServices.length > 0 && (
        <Stack
          direction='row'
          spacing={1}
          flexWrap='wrap'
          useFlexGap
          sx={{ mb: 1 }}
        >
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
        navigation={{
          prevEl,
          nextEl,
        }}
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
                height: 100,
                width: 100,
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
                  fontSize: '0.5rem',
                  // '&:last-child': { pb: 1 },
                }}
              >
                {service.icon}
                <Typography variant='body1' sx={{ mt: 1, fontSize: '0.75rem' }}>
                  {service.text}
                </Typography>
              </CardContent>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Controls */}
      <Stack direction='row' spacing={2} justifyContent='center' sx={{ mt: 1 }}>
        <IconButton ref={setPrevEl} sx={navBtnStyle} aria-label='Previous'>
          <ChevronLeftIcon />
        </IconButton>
        <IconButton ref={setNextEl} sx={navBtnStyle} aria-label='Next'>
          <ChevronRightIcon />
        </IconButton>
      </Stack>
    </Box>
  );
}
