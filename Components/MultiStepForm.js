import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const MultiStepFormComponent = ({ steps, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = steps.length;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prevStep => prevStep + 1);
    } else {
      onComplete && onComplete(); // Si llega al final, llama la función onComplete
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prevStep => prevStep - 1);
    }
  };

  const renderStepIndicator = () => {
    const indicators = [];
    for (let i = 0; i < totalSteps; i++) {
      indicators.push(
        <View key={i} style={styles.stepContainer}>
          <View style={[styles.stepIndicator, i <= currentStep && styles.activeStep]}>
            <Text style={[styles.stepText, i <= currentStep && styles.activeStepText]}>{i + 1}</Text>
          </View>
          {i < totalSteps - 1 && <View style={[styles.line, i < currentStep && styles.activeLine]} />}
        </View>
      );
    }
    return <View style={styles.indicatorContainer}>{indicators}</View>;
  };

  return (
    <View style={styles.container}>
      {renderStepIndicator()}

      <View style={styles.contentContainer}>
        {steps[currentStep]}
      </View>

      <View style={styles.buttonContainer}>
        {currentStep > 0 && (
          <TouchableOpacity onPress={handlePrevious} style={[styles.button, styles.backButton]}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        )}
        {currentStep < totalSteps - 1 ? (
          <TouchableOpacity onPress={handleNext} style={[styles.button, styles.nextButton]}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={onComplete} style={[styles.button, styles.nextButton]}>
            <Text style={styles.nextButtonText}>Done</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  indicatorContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepIndicator: {
    width: 35,
    height: 35,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#E7E7E7',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeStep: {
    borderColor: 'pink',
    backgroundColor: 'pink',
  },
  stepText: {
    color: '#E7E7E7',
    fontWeight: 'bold',
    fontSize: 16,
  },
  activeStepText: {
    color: 'white',
  },
  line: {
    width: 20,
    height: 2,
    backgroundColor: '#E7E7E7',
    marginHorizontal: 10,
  },
  activeLine: {
    backgroundColor: 'pink',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  backButton: {
    backgroundColor: '#E7E7E7',
    marginRight: 10,
  },
  backButtonText: {
    color: 'gray',
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: 'pink',
  },
  nextButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default MultiStepFormComponent;