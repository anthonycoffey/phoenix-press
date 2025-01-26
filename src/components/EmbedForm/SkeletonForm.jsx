const Box = MaterialUI.Box;
const Card = MaterialUI.Card;
const CardContent = MaterialUI.CardContent;
const Stack = MaterialUI.Stack;
const CardHeader = MaterialUI.CardHeader;
const Skeleton = MaterialUI.Skeleton;

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
