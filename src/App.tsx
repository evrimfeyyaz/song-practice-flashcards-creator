import { steps } from './constants/steps';
import { SongProvider } from './context/SongProvider';
import { useSongContext } from './context/useSongContext';
import { ErrorBoundary } from './components/ErrorBoundary';

function AppContent() {
  const { currentStep } = useSongContext();
  const StepComponent = steps[currentStep];

  return (
    <div className="container mx-auto">
      <StepComponent />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <SongProvider>
        <AppContent />
      </SongProvider>
    </ErrorBoundary>
  );
}

export default App;
