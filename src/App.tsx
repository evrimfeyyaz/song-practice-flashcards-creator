import { steps } from './constants/steps';
import { SongProvider } from './context/SongProvider';
import { useSongContext } from './context/useSongContext';

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
    <SongProvider>
      <AppContent />
    </SongProvider>
  );
}

export default App;
