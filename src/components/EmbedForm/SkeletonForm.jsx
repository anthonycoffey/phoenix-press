import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';
import Skeleton from '@mui/material/Skeleton';

const SkeletonForm = () => {
	return (
		<section>
			<Card className="phoenix-form">
				<CardHeader
					title={<Skeleton width="80%" />}
					subheader={<Skeleton width="60%" />}
				/>
				<CardContent>
					<Stack spacing={4}>
						{Array.from(new Array(6)).map((_, index) => (
							<Box key={index}>
								<Skeleton variant="text" width="100%" />
								<Skeleton variant="rectangular" height={50} />
							</Box>
						))}
					</Stack>
					<Box mt={2}>
						<Skeleton variant="text" width="30%" />
					</Box>
				</CardContent>
			</Card>
		</section>
	);
};

export default SkeletonForm;
