import {
	FormControl,
	FormControlLabel,
	FormGroup,
	Checkbox,
	Box,
	CircularProgress,
	FormLabel,
} from '@mui/material';
import { useEffect, useState } from 'react';
import services from '../../utils/services';

export default function Services({ input, handleBlur }) {
	const [selectedServices, setSelectedServices] = useState([]);

	const handleCheckboxChange = (event) => {
		const { value, checked } = event.target;
		setSelectedServices((prev) =>
			checked
				? [...prev, value]
				: prev.filter((service) => service !== value)
		);
		handleBlur();
	};

	useEffect(() => {
		if (services && selectedServices.length > 0) {
			const matchedServices = services.filter((service) =>
				selectedServices.includes(service.value)
			);
			input.value = matchedServices.map((service) => ({
				value: service.value,
				id: service.id,
			}));
		}
	}, [selectedServices]);

	return (
		<FormControl component="fieldset" fullWidth margin="dense">
			<FormLabel component="legend">Select desired service(s)</FormLabel>
			<FormGroup>
				<Box
					sx={{
						display: 'grid',
						gridTemplateColumns: 'repeat(2, 1fr)',
						gap: 1,
						padding: 0,
					}}
				>
					{services &&
						services?.map((service) => (
							<FormControlLabel
								sx={{ margin: 0 }}
								control={
									<Checkbox
										value={service.value}
										checked={selectedServices.includes(
											service.value
										)}
										onChange={handleCheckboxChange}
										name={service.name}
										size="small"
									/>
								}
								label={service.text}
							/>
						))}
				</Box>
			</FormGroup>
		</FormControl>
	);
}
