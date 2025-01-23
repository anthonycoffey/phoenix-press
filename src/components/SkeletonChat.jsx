import React from 'react';
import { Box, Skeleton, LinearProgress } from '@mui/material';

export default function SkeletonChat() {
  return (
    <Box display="flex" flexDirection="column" gap={2} minWidth={320} p={4}>
      <Box display="flex" alignItems="center" gap={2}>
        <Skeleton variant="circular" width={50} height={40} />
        <Skeleton variant="rounded" width="100%" height={40} />
      </Box>
      <Skeleton variant="rounded" width="100%" height={40} />
      <LinearProgress />
    </Box>
  );
}
