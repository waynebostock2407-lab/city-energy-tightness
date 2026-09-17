import React, { useState } from 'react'

import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'
import { ArrowLeft, CheckCircle2, Gauge, TriangleAlert } from 'lucide-react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { edition4Matrix } from '../logic/edition4Rules'

export default function TightnessTest() {

  const [propertyReference, setPropertyReference] = useState('')
  const [postcode, setPostcode] = useState('')
  const [iv, setIv] = useState('')
  const [pressureDrop, setPressureDrop] = useState('')
  const [gaugeType, setGaugeType] = useState('Fluid')
  const [result, setResult] = useState('')
  const [actions, setActions] = useState<string[]>([])
  const [allowableDrop, setAllowableDrop] = useState<number | null>(null)
  const [saved, setSaved] = useState(false)

  const perceptibleMovement =
    gaugeType === 'Electronic' ? 0.20 : 0.25

  const installationVolume = Number(iv)
  const measuredDrop = Number(pressureDrop)

  const matchingBand =
    edition4Matrix.NG.find(
      band =>
        installationVolume > band.minIV &&
        installationVolume <= band.maxIV
    )

  function runAssessment() {

    if (!iv || !pressureDrop) {
      Alert.alert(
        'Missing Information',
        'Enter the Installation Volume and pressure drop.'
      )
      return
    }

    if (
      Number.isNaN(installationVolume) ||
      Number.isNaN(measuredDrop)
    ) {
      Alert.alert(
        'Invalid Information',
        'Enter valid numerical values.'
      )
      return
    }

    if (measuredDrop < 0) {
      Alert.alert(
        'Invalid Pressure Drop',
        'Pressure drop cannot be negative.'
      )
      return
    }

    if (measuredDrop <= perceptibleMovement) {
      setResult('PASS')
      setAllowableDrop(0)
      setActions([
        'No perceptible movement detected',
        `Perceptible movement threshold: ${perceptibleMovement.toFixed(2)} mbar`,
        'Installation considered gas tight'
      ])
      return
    }

    if (!matchingBand) {
      setResult('FAIL')
      setAllowableDrop(null)
      setActions([
        'Installation Volume is outside the supported Edition 4 range',
        'Verify the Installation Volume calculation',
        'Do not rely on this assessment until the Installation Volume has been verified'
      ])
      return
    }

    setAllowableDrop(matchingBand.allowableDrop)

    if (measuredDrop <= matchingBand.allowableDrop) {
      setResult('WITHIN PERMISSIBLE LIMIT')
      setActions([
        'Pressure movement is above the perceptible movement threshold',
        `Perceptible movement threshold: ${perceptibleMovement.toFixed(2)} mbar`,
        'Pressure drop is within the applicable Installation Volume limit'
      ])
      return
    }

    setResult('FAIL')
    setActions([
      'Pressure drop exceeds the applicable permissible limit',
      'Trace and investigate the gas escape in accordance with the applicable procedure',
      'Do not treat the installation as satisfactory'
    ])
  }

  async function saveTest() {

    if (!result) {
      Alert.alert('No Result', 'Run the assessment before saving.')
      return
    }

    const assessment = {
      propertyReference,
      postcode,
      testType: 'Tightness Test',
      installationVolume: installationVolume.toFixed(4),
      purgeVolume: (installationVolume * 1.5).toFixed(4),
      pressureDrop: measuredDrop,
      gaugeType,
      result,
      actions,
      allowableDrop: allowableDrop ?? 0,
      timestamp: new Date().toISOString()
    }

    const stored = await AsyncStorage.getItem('assessments')
    const existing = stored ? JSON.parse(stored) : []

    existing.unshift(assessment)

    await AsyncStorage.setItem(
      'assessments',
      JSON.stringify(existing)
    )

    setSaved(true)

    Alert.alert('Test Saved')
  }

  return (
    <SafeAreaView style={styles.container}>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={22} color="#ffffff" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>

          <View style={styles.headerTitleRow}>
            <Gauge size={28} color="#84cc16" />
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>Tightness Test</Text>
              <Text style={styles.subtitle}>Edition 4 Pressure Drop Assessment</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>

          <Text style={styles.sectionTitle}>Property</Text>

          <Text style={styles.label}>Property Reference</Text>
          <TextInput
            value={propertyReference}
            onChangeText={setPropertyReference}
            placeholder="Enter property reference"
            placeholderTextColor="#6b7280"
            style={styles.input}
          />

          <Text style={styles.label}>Postcode</Text>
          <TextInput
            value={postcode}
            onChangeText={setPostcode}
            placeholder="Enter postcode"
            placeholderTextColor="#6b7280"
            style={styles.input}
            autoCapitalize="characters"
          />

        </View>

        <View style={styles.card}>

          <Text style={styles.sectionTitle}>Test Information</Text>

          <Text style={styles.label}>Installation Volume (m³)</Text>
          <TextInput
            value={iv}
            onChangeText={setIv}
            keyboardType="decimal-pad"
            placeholder="Enter Installation Volume"
            placeholderTextColor="#6b7280"
            style={styles.input}
          />

          <Text style={styles.label}>Pressure Drop (mbar)</Text>
          <TextInput
            value={pressureDrop}
            onChangeText={setPressureDrop}
            keyboardType="decimal-pad"
            placeholder="Enter pressure drop"
            placeholderTextColor="#6b7280"
            style={styles.input}
          />

          <Text style={styles.label}>Gauge Type</Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[
                styles.choiceButton,
                gaugeType === 'Fluid' && styles.choiceButtonSelected
              ]}
              onPress={() => setGaugeType('Fluid')}
            >
              <Text style={[
                styles.choiceText,
                gaugeType === 'Fluid' && styles.choiceTextSelected
              ]}>
                Fluid
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.choiceButton,
                gaugeType === 'Electronic' && styles.choiceButtonSelected
              ]}
              onPress={() => setGaugeType('Electronic')}
            >
              <Text style={[
                styles.choiceText,
                gaugeType === 'Electronic' && styles.choiceTextSelected
              ]}>
                Electronic
              </Text>
            </TouchableOpacity>
          </View>

        </View>

        <View style={styles.thresholdCard}>
          <Text style={styles.thresholdTitle}>PERCEPTIBLE MOVEMENT</Text>
          <Text style={styles.thresholdValue}>
            {perceptibleMovement.toFixed(2)} mbar
          </Text>
          <Text style={styles.thresholdText}>
            {gaugeType === 'Fluid'
              ? 'Maximum movement before perceptible movement is recorded for a Fluid gauge.'
              : 'Maximum movement before perceptible movement is recorded for an Electronic gauge.'}
          </Text>
        </View>

        {result !== '' && (
          <View style={[
            styles.resultCard,
            result === 'PASS'
              ? styles.resultPass
              : result === 'WITHIN PERMISSIBLE LIMIT'
                ? styles.resultRetest
                : styles.resultFail
          ]}>
            {result === 'FAIL'
              ? <TriangleAlert size={30} color="#ef4444" />
              : <CheckCircle2 size={30} color="#84cc16" />
            }

            <View style={styles.resultContent}>
              <Text style={styles.resultTitle}>{result}</Text>

              {allowableDrop !== null && allowableDrop > 0 && (
                <Text style={styles.resultMetric}>
                  Applicable permissible limit: {allowableDrop} mbar
                </Text>
              )}
            </View>
          </View>
        )}

        {actions.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Assessment</Text>

            {actions.map((action, index) => (
              <View key={index} style={styles.actionRow}>
                <View style={styles.actionDot} />
                <Text style={styles.actionText}>{action}</Text>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={runAssessment}
        >
          <Text style={styles.primaryButtonText}>Assess Pressure Drop</Text>
        </TouchableOpacity>

        {result !== '' && (
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={saveTest}
          >
            <Text style={styles.secondaryButtonText}>
              {saved ? 'Test Saved' : 'Save Test'}
            </Text>
          </TouchableOpacity>
        )}

      </ScrollView>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827'
  },

  scrollContent: {
    paddingBottom: 80
  },

  header: {
    backgroundColor: '#0f1720',
    paddingHorizontal: 20,
    paddingBottom: 22
  },

  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 12,
    paddingBottom: 18
  },

  backText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600'
  },

  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14
  },

  title: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '800'
  },

  subtitle: {
    color: '#9ca3af',
    fontSize: 14,
    marginTop: 4
  },

  card: {
    backgroundColor: '#151f2b',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    marginHorizontal: 18,
    marginTop: 18,
    padding: 20,
    borderRadius: 24
  },

  sectionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 18
  },

  label: {
    color: '#d1d5db',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 6
  },

  input: {
    backgroundColor: '#0f1720',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 14
  },

  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 2
  },

  choiceButton: {
    flex: 1,
    backgroundColor: '#0f1720',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center'
  },

  choiceButtonSelected: {
    backgroundColor: '#7fb343',
    borderColor: '#7fb343'
  },

  choiceText: {
    color: '#d1d5db',
    fontSize: 15,
    fontWeight: '700'
  },

  choiceTextSelected: {
    color: '#ffffff'
  },

  thresholdCard: {
    marginHorizontal: 18,
    marginTop: 18,
    padding: 20,
    borderRadius: 24,
    backgroundColor: 'rgba(127,179,67,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(127,179,67,0.35)'
  },

  thresholdTitle: {
    color: '#9ca3af',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1
  },

  thresholdValue: {
    color: '#84cc16',
    fontSize: 30,
    fontWeight: '900',
    marginTop: 5
  },

  thresholdText: {
    color: '#d1d5db',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 5
  },

  resultCard: {
    marginHorizontal: 18,
    marginTop: 18,
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14
  },

  resultPass: {
    backgroundColor: 'rgba(127,179,67,0.12)',
    borderColor: 'rgba(127,179,67,0.35)'
  },

  resultRetest: {
    backgroundColor: 'rgba(234,179,8,0.10)',
    borderColor: 'rgba(234,179,8,0.35)'
  },

  resultFail: {
    backgroundColor: 'rgba(239,68,68,0.10)',
    borderColor: 'rgba(239,68,68,0.35)'
  },

  resultContent: {
    flex: 1
  },

  resultTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '900'
  },

  resultMetric: {
    color: '#d1d5db',
    fontSize: 14,
    marginTop: 5
  },

  actionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12
  },

  actionDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#84cc16',
    marginTop: 7,
    marginRight: 10
  },

  actionText: {
    flex: 1,
    color: '#d1d5db',
    fontSize: 14,
    lineHeight: 21
  },

  primaryButton: {
    backgroundColor: '#7fb343',
    marginHorizontal: 18,
    marginTop: 20,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center'
  },

  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800'
  },

  secondaryButton: {
    backgroundColor: '#151f2b',
    borderWidth: 1,
    borderColor: '#7fb343',
    marginHorizontal: 18,
    marginTop: 12,
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: 'center'
  },

  secondaryButtonText: {
    color: '#84cc16',
    fontSize: 16,
    fontWeight: '800'
  }
})
