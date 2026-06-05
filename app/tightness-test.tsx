import React, {
  useEffect,
  useState
} from 'react'

import {
  evaluateTightnessTest
} from '../logic/tightnessRules'

import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'

import {
  SafeAreaView
} from 'react-native-safe-area-context'

import QuestionToggle from '../components/QuestionToggle'

import AsyncStorage from '@react-native-async-storage/async-storage'

export default function TightnessTest() {

  const [pressure, setPressure] =
    useState('')

  const [gasType, setGasType] =
    useState('Natural Gas')

  const [result, setResult] =
    useState('')

  const [guidance, setGuidance] =
  useState('')

  const [currentStep, setCurrentStep] =
  useState(1)

  const [ecvClosed, setEcvClosed] =
  useState<boolean | null>(null)

  const [installationType, setInstallationType] =
  useState('Meter Exchange')

  const [appliancesConnected, setAppliancesConnected] =
  useState<boolean | null>(null)

  const [letByObserved, setLetByObserved] =
  useState<boolean | null>(null)

  const [timerRunning, setTimerRunning] =
  useState(false)

const [timeRemaining, setTimeRemaining] =
  useState(60)

useEffect(() => {

  let interval: any

  if (
    timerRunning &&
    timeRemaining > 0
  ) {

    interval = setInterval(() => {

      setTimeRemaining(prev => prev - 1)

    }, 1000)

  }

  if (timeRemaining === 0) {

    setTimerRunning(false)

  }

  return () => clearInterval(interval)

}, [timerRunning, timeRemaining])

  function evaluateTest() {

  async function saveTest() {

  const testRecord = {

    installationType,
    gasType,
    pressure,
    result,
    guidance,
    letByObserved,
    appliancesConnected,
    timestamp:
      new Date().toISOString()

  }

  const existingTests =
    await AsyncStorage.getItem(
      'tightnessTests'
    )

  const parsedTests =
    existingTests
      ? JSON.parse(existingTests)
      : []

  parsedTests.unshift(testRecord)

  await AsyncStorage.setItem(
    'tightnessTests',
    JSON.stringify(parsedTests)
  )

}

  const pressureValue =
    Number(pressure)

  const evaluation =
    evaluateTightnessTest(
      pressureValue,
      ecvClosed,
      letByObserved
    )

  setResult(evaluation.result)

  setGuidance(evaluation.guidance)

  saveTest()

  if (
  evaluation.result === 'FAIL'
) {

  setCurrentStep(4)

} else if (
  letByObserved === true
) {

  setCurrentStep(3)

} else {

  setCurrentStep(4)

}

}

return (

    <SafeAreaView style={styles.container}>

      <ScrollView
        contentContainerStyle={{
          paddingBottom: 120
        }}
      >

        <View style={styles.header}>

          <View style={styles.stepWrapper}>

  <View style={styles.stepContainer}>

    <View
      style={[
        styles.step,
        currentStep >= 1 &&
        styles.activeStep
      ]}
    />

    <View
      style={[
        styles.step,
        currentStep >= 2 &&
        styles.activeStep
      ]}
    />

    <View
      style={[
        styles.step,
        currentStep >= 3 &&
        styles.activeStep
      ]}
    />

    <View
      style={[
        styles.step,
        currentStep >= 4 &&
        styles.activeStep
      ]}
    />

  </View>

  <View style={styles.stepLabelRow}>

    <Text style={styles.stepLabel}>
      Checks
    </Text>

    <Text style={styles.stepLabel}>
      Pressure
    </Text>

    <Text style={styles.stepLabel}>
      Evaluate
    </Text>

    <Text style={styles.stepLabel}>
      Result
    </Text>

  </View>

</View>

          <Text style={styles.title}>
            Tightness Test
          </Text>

          <Text style={styles.subtitle}>
            IGEM/UP/1B Guided Workflow
          </Text>

        </View>

        <View style={styles.card}>
          
          {currentStep === 1 && (

  <View style={styles.card}>

    <Text style={styles.label}>
      Installation Type
    </Text>

    <View style={styles.gasContainer}>

      <TouchableOpacity
        style={[
          styles.gasButton,
          installationType === 'Meter Exchange' &&
          styles.selectedGas
        ]}
        onPress={() =>
          setInstallationType('Meter Exchange')
        }
      >

        <Text
          style={[
            styles.gasText,
            installationType === 'Meter Exchange' &&
            styles.selectedGasText
          ]}
        >
          Exchange
        </Text>

      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.gasButton,
          installationType === 'New Install' &&
          styles.selectedGas
        ]}
        onPress={() =>
          setInstallationType('New Install')
        }
      >

        <Text
          style={[
            styles.gasText,
            installationType === 'New Install' &&
            styles.selectedGasText
          ]}
        >
          New
        </Text>

      </TouchableOpacity>

    </View>

    <QuestionToggle
  label="Appliances Connected?"
  value={appliancesConnected}
  onChange={setAppliancesConnected}
/>

    <TouchableOpacity
  style={[
    styles.button,

    appliancesConnected === null &&
    styles.disabledButton
  ]}
  disabled={
    appliancesConnected === null
  }
  onPress={() =>
    setCurrentStep(2)
  }
>

      <Text style={styles.buttonText}>
        Continue
      </Text>

    </TouchableOpacity>

  </View>

)}

          {currentStep === 2 && (
            <>

          <View style={styles.timerCard}>

  <Text style={styles.timerTitle}>
    Stabilisation Timer
  </Text>

  <Text style={styles.timerValue}>
    {timeRemaining}s
  </Text>

  <TouchableOpacity
    style={styles.button}
    onPress={() =>
      setTimerRunning(true)
    }
  >

    <Text style={styles.buttonText}>
      Start Timer
    </Text>

  </TouchableOpacity>

</View>

          <Text style={styles.label}>
            Operating Pressure (mbar)
          </Text>

          <TextInput
            value={pressure}
            onChangeText={setPressure}
            keyboardType="numeric"
            placeholder="Enter pressure"
            style={styles.input}
          />

          <Text style={styles.label}>
  ECV Confirmed Closed?
</Text>

<View style={styles.gasContainer}>

  <TouchableOpacity
    style={[
      styles.gasButton,
      ecvClosed === true &&
      styles.selectedGas
    ]}
    onPress={() =>
      setEcvClosed(true)
    }
  >

    <Text
      style={[
        styles.gasText,
        ecvClosed === true &&
        styles.selectedGasText
      ]}
    >
      YES
    </Text>

  </TouchableOpacity>

  <TouchableOpacity
    style={[
      styles.gasButton,
      ecvClosed === false &&
      styles.selectedGas
    ]}
    onPress={() =>
      setEcvClosed(false)
    }
  >

    <Text
      style={[
        styles.gasText,
        ecvClosed === false &&
        styles.selectedGasText
      ]}
    >
      NO
    </Text>

  </TouchableOpacity>

</View>

          <Text style={styles.label}>
  Let-by Observed?
</Text>

<View style={styles.gasContainer}>

  <TouchableOpacity
    style={[
      styles.gasButton,
      letByObserved === true &&
      styles.selectedGas
    ]}
    onPress={() =>
      setLetByObserved(true)
    }
  >

    <Text
      style={[
        styles.gasText,
        letByObserved === true &&
        styles.selectedGasText
      ]}
    >
      YES
    </Text>

  </TouchableOpacity>

  <TouchableOpacity
    style={[
      styles.gasButton,
      letByObserved === false &&
      styles.selectedGas
    ]}
    onPress={() =>
      setLetByObserved(false)
    }
  >

    <Text
      style={[
        styles.gasText,
        letByObserved === false &&
        styles.selectedGasText
      ]}
    >
      NO
    </Text>

  </TouchableOpacity>

</View>

          <Text style={styles.label}>
            Gas Type
          </Text>

          <View style={styles.gasContainer}>

            <TouchableOpacity
              style={[
                styles.gasButton,
                gasType === 'Natural Gas' &&
                styles.selectedGas
              ]}
              onPress={() =>
                setGasType('Natural Gas')
              }
            >

              <Text
                style={[
                  styles.gasText,
                  gasType === 'Natural Gas' &&
                  styles.selectedGasText
                ]}
              >
                NG
              </Text>

            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.gasButton,
                gasType === 'LPG' &&
                styles.selectedGas
              ]}
              onPress={() =>
                setGasType('LPG')
              }
            >

              <Text
                style={[
                  styles.gasText,
                  gasType === 'LPG' &&
                  styles.selectedGasText
                ]}
              >
                LPG
              </Text>

            </TouchableOpacity>

          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={evaluateTest}
          >

            <Text style={styles.buttonText}>
              Evaluate Test
            </Text>

          </TouchableOpacity>

            </>

              )}

        </View>

        {ecvClosed === false && (

  <View style={styles.criticalCard}>

    <Text style={styles.criticalTitle}>
      CRITICAL CHECK FAILED
    </Text>

    <Text style={styles.criticalText}>
      Tightness testing cannot proceed until the ECV has been confirmed closed.
    </Text>

  </View>

)}

        <View style={styles.contextCard}>

  <Text style={styles.contextTitle}>
    Active Workflow
  </Text>

  <Text style={styles.contextValue}>
    {installationType}
  </Text>

</View>

        {appliancesConnected === true && (

  <View style={styles.contextCard}>

    <Text style={styles.contextTitle}>
      Appliance Consideration
    </Text>

    <Text style={styles.contextValue}>
      Additional appliance isolation and let-by considerations may apply.
    </Text>

  </View>

)}

{currentStep === 3 && (

  <View style={styles.criticalCard}>

    <Text style={styles.criticalTitle}>
      Investigation Required
    </Text>

    <Text style={styles.criticalText}>
      Potential let-by detected. Appliance isolation and additional integrity checks are recommended before proceeding.
    </Text>

    <TouchableOpacity
      style={styles.button}
      onPress={() =>
        setCurrentStep(4)
      }
    >

      <Text style={styles.buttonText}>
        Continue Investigation
      </Text>

    </TouchableOpacity>

  </View>

)}

{result !== '' && (

  <View style={styles.summaryCard}>

    <Text style={styles.summaryTitle}>
      Test Summary
    </Text>

    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>
        Installation
      </Text>

      <Text style={styles.summaryValue}>
        {installationType}
      </Text>
    </View>

    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>
        Gas Type
      </Text>

      <Text style={styles.summaryValue}>
        {gasType}
      </Text>
    </View>

    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>
        Pressure
      </Text>

      <Text style={styles.summaryValue}>
        {pressure} mbar
      </Text>
    </View>

    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>
        Let-by
      </Text>

      <Text style={styles.summaryValue}>
        {letByObserved ? 'YES' : 'NO'}
      </Text>
    </View>

  </View>

)}

        {result !== '' && (

          <View style={styles.resultCard}>

            <Text style={styles.resultLabel}>
              RESULT
            </Text>

            <Text
  style={[
    styles.resultValue,

    result === 'PASS'
      ? styles.passResult
      : result === 'INVESTIGATE'
      ? styles.investigateResult
      : styles.failResult

  ]}
>
  {result}
</Text>

            <Text style={styles.guidanceText}>
  {guidance}
</Text>
          </View>

        )}

      </ScrollView>

    </SafeAreaView>

  )
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#eef2f0'
  },

  header: {
    paddingTop: 40,
    paddingHorizontal: 24,
    paddingBottom: 20
  },

  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#7fb343'
  },

  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 8
  },

  card: {
    backgroundColor: '#ffffff',
    margin: 20,
    padding: 20,
    borderRadius: 24
  },

  label: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12
  },

  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    fontSize: 18
  },

  gasContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 30
  },

  gasButton: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16
  },

  selectedGas: {
    backgroundColor: '#7fb343'
  },

  gasText: {
    color: '#111827',
    fontWeight: '700'
  },

  selectedGasText: {
    color: '#ffffff'
  },

  button: {
    backgroundColor: '#7fb343',
    paddingVertical: 20,
    borderRadius: 20,
    alignItems: 'center'
  },

  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700'
  },

  resultCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 30,
    alignItems: 'center'
  },

  resultLabel: {
    fontSize: 18,
    color: '#6b7280',
    marginBottom: 10
  },

  resultValue: {
    fontSize: 40,
    fontWeight: '800',
    color: '#7fb343'
  },

  guidanceText: {
  marginTop: 20,
  fontSize: 16,
  color: '#374151',
  textAlign: 'center',
  lineHeight: 24
},

passResult: {
  color: '#16a34a'
},

investigateResult: {
  color: '#f59e0b'
},

failResult: {
  color: '#dc2626'
},

criticalCard: {
  backgroundColor: '#dc2626',
  marginHorizontal: 20,
  marginTop: 20,
  borderRadius: 24,
  padding: 24
},

criticalTitle: {
  color: '#ffffff',
  fontSize: 24,
  fontWeight: '800',
  marginBottom: 12
},

criticalText: {
  color: '#ffffff',
  fontSize: 16,
  lineHeight: 24
},

stepContainer: {
  flexDirection: 'row',
  gap: 10,
  marginBottom: 20
},

stepWrapper: {
  marginBottom: 24
},

stepLabelRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 10
},

step: {
  flex: 1,
  height: 8,
  backgroundColor: '#d1d5db',
  borderRadius: 20
},

activeStep: {
  backgroundColor: '#7fb343'
},

stepLabel: {
  flex: 1,
  fontSize: 11,
  color: '#6b7280',
  textAlign: 'center'
},

contextCard: {
  backgroundColor: '#ffffff',
  marginHorizontal: 20,
  marginTop: 20,
  borderRadius: 24,
  padding: 20
},

contextTitle: {
  fontSize: 16,
  color: '#6b7280',
  marginBottom: 10
},

contextValue: {
  fontSize: 24,
  fontWeight: '700',
  color: '#7fb343'
},

timerCard: {
  backgroundColor: '#ffffff',
  marginBottom: 24,
  borderRadius: 24,
  padding: 20,
  alignItems: 'center'
},

timerTitle: {
  fontSize: 18,
  fontWeight: '700',
  marginBottom: 12
},

timerValue: {
  fontSize: 48,
  fontWeight: '800',
  color: '#7fb343',
  marginBottom: 20
},

summaryCard: {
  backgroundColor: '#ffffff',
  marginHorizontal: 20,
  marginTop: 20,
  borderRadius: 24,
  padding: 24
},

summaryTitle: {
  fontSize: 24,
  fontWeight: '800',
  marginBottom: 20,
  color: '#111827'
},

summaryRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 16
},

summaryLabel: {
  fontSize: 16,
  color: '#6b7280'
},

summaryValue: {
  fontSize: 16,
  fontWeight: '700',
  color: '#111827'
},

disabledButton: {
  opacity: 0.4
},

})