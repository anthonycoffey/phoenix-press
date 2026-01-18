import { lazy, Suspense, createRoot } from '@wordpress/element';
import SkeletonForm from './components/EmbedForm/SkeletonForm';
import { GlobalStateProvider } from './state';
import LinearProgress from '@mui/material/LinearProgress';
import './styles.css';

const EmbedForm = lazy(() => import('./components/EmbedForm'));
const ConversationalForm = lazy(
	() => import('./components/ConversationalForm')
);
const StepperForm = lazy(() => import('./components/StepperForm'));

document.addEventListener('DOMContentLoaded', () => {
	const chat = document.getElementById('phoenix-form-root');
	if (chat) {
		const root = createRoot(chat);
		root.render(
			<GlobalStateProvider>
				<Suspense fallback={<LinearProgress />}>
					<ConversationalForm splitTestVariant="conversational" />
				</Suspense>
			</GlobalStateProvider>
		);
	}

	const roots = document.querySelectorAll('.phoenix-form-embed-root');
	roots.forEach((el) => {
		const wrapper = el.closest('.phoenix-split-test-wrapper');
		const splitTestVariant = wrapper
			? wrapper.dataset.splitTestVariant
			: null;

		createRoot(el).render(
			<Suspense fallback={<SkeletonForm />}>
				<EmbedForm splitTestVariant={splitTestVariant} />
			</Suspense>
		);
	});

	const stepperFormRoot = document.getElementById(
		'phoenix-stepper-form-root'
	);
	if (stepperFormRoot) {
		const wrapper = stepperFormRoot.closest('.phoenix-split-test-wrapper');
		const splitTestVariant = wrapper
			? wrapper.dataset.splitTestVariant
			: null;

		const root = createRoot(stepperFormRoot);
		root.render(
			<Suspense fallback={<LinearProgress />}>
				<StepperForm splitTestVariant={splitTestVariant} />
			</Suspense>
		);
	}
});
