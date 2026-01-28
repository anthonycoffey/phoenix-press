import CarCrash from '@mui/icons-material/CarCrash';
import VpnKey from '@mui/icons-material/VpnKey';
import TireRepair from '@mui/icons-material/TireRepair';
import BatteryChargingFull from '@mui/icons-material/BatteryChargingFull';
import LocalGasStation from '@mui/icons-material/LocalGasStation';
import HelpOutline from '@mui/icons-material/HelpOutline';
import NoCrash from '@mui/icons-material/NoCrash';

const services = [
  // Lockout Services
  {
    text: 'Automotive Unlocking',
    value: 'Automotive Unlocking',
    id: 1,
    icon: <NoCrash fontSize='large' color='primary' />,
  },

  // Key Services
  {
    text: 'Key Programming*',
    value: 'Key Programming',
    id: 25,
    icon: <VpnKey fontSize='large' color='primary' />,
  },
  {
    text: 'New Key*',
    value: 'New Key',
    id: 16,
    icon: <VpnKey fontSize='large' color='primary' />,
  },

  // Tire Services
  {
    text: 'Flat Tire Changing',
    value: 'Flat Tire Changing',
    id: 4,
    icon: <TireRepair fontSize='large' color='primary' />,
  },
  {
    text: 'Tire Repair*',
    value: 'Tire Repair',
    id: 27,
    icon: <TireRepair fontSize='large' color='primary' />,
  },
  {
    text: 'Tire Replacement*',
    value: 'Tire Replacement',
    id: 32,
    icon: <TireRepair fontSize='large' color='primary' />,
  },
  {
    text: 'Tire Inflation',
    value: 'Tire Inflation',
    id: 19,
    icon: <TireRepair fontSize='large' color='primary' />,
  },

  // Battery Services
  {
    text: 'Dead Battery Jump-Start',
    value: 'Dead Battery Jump-Start',
    id: 3,
    icon: <BatteryChargingFull fontSize='large' color='primary' />,
  },
  {
    text: 'Vehicle Battery Replacement*',
    value: 'Vehicle Battery Replacement',
    id: 6,
    icon: <BatteryChargingFull fontSize='large' color='primary' />,
  },
  {
    text: 'Car Battery Install*',
    value: 'Car Battery Install',
    id: 12,
    icon: <BatteryChargingFull fontSize='large' color='primary' />,
  },
  {
    text: 'Battery/Starter Testing',
    value: 'Battery/Starter Testing',
    id: 5,
    icon: <BatteryChargingFull fontSize='large' color='primary' />,
  },

  // Fuel Services
  {
    text: 'Fuel Delivery',
    value: 'Fuel Delivery',
    id: 14,
    icon: <LocalGasStation fontSize='large' color='primary' />,
  },

  // Towing Services
  {
    text: 'Towing*',
    value: 'Towing',
    id: 11,
    icon: <CarCrash fontSize='large' color='primary' />,
  },
  {
    text: 'Other*',
    value: 'Other',
    id: 35,
    icon: <HelpOutline fontSize='large' color='primary' />,
  },
];

export default services;
