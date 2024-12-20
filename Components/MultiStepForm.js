import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { globalStyles } from '../Utils/globalStyles';


const MultiStepFormComponent = ({ steps, onComplete, validateStep }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = steps.length;

  const handleNext = () => {
    if (!validateStep || validateStep[currentStep]()) {
      if (currentStep < totalSteps - 1) {
        setCurrentStep(prevStep => prevStep + 1);
      } else {
        // Validación del último paso
        onComplete && onComplete();
      }
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
          <TouchableOpacity onPress={handlePrevious} style={[globalStyles.backbutton, { flex: 1, marginRight: 10 }]}>
            <Text style={globalStyles.backbuttonText}>Atrás</Text>
          </TouchableOpacity>
        )}
        {currentStep < totalSteps - 1 ? (
          <TouchableOpacity onPress={handleNext} style={[globalStyles.button, { flex: 1 }]}>
            <Text style={globalStyles.buttonText}>Siguiente</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleNext} style={[globalStyles.button, { flex: 1 }]}>
            <Text style={globalStyles.buttonText}>Aceptar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    paddingTop: 20,
    backgroundColor: '#F9F9F4',
    alignItems: 'center',
    justifyContent: 'center',
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
    borderColor: '#525252',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeStep: {
    borderColor: '#4c669f',
    backgroundColor: '#4c669f',
  },
  stepText: {
    color: '#6e6e6e',
    fontWeight: 'bold',
    fontSize: 16,
  },
  activeStepText: {
    color: 'white',
  },
  line: {
    width: 20,
    height: 2,
    backgroundColor: '#6e6e6e',
    marginHorizontal: 10,
  },
  activeLine: {
    backgroundColor: '#4c669f',
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    backgroundColor: '#E7E7E7',
    marginRight: 10,
  },
  backButtonText: {
    color: 'gray',
    fontWeight: 'bold',
  },
  nextButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  button: {
    flex: 1,
    height: 50,
    backgroundColor: '#285583',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginVertical: 10,
    marginHorizontal: 5,
    padding: 15,

  },
  buttonText: {
    color: '#white',
    fontWeight: 'bold',

  },

});

export default MultiStepFormComponent;