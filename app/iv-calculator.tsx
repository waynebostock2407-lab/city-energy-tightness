import React, { useMemo, useState } from 'react'

import { Picker } from '@react-native-picker/picker'

import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'

import { SafeAreaView } from 'react-native-safe-area-context'

const PIPE_SIZES = [
  { material: 'Copper', label: '15mm', volumePerMetre: 0.000154 },
  { material: 'Copper', label: '22mm', volumePerMetre: 0.000352 },
  { material: 'Copper', label: '28mm', volumePerMetre: 0.000594 },
  { material: 'Copper', label: '35mm', volumePerMetre: 0.000924 },
  { material: 'Steel', label: '½"', volumePerMetre: 0.000264 },
  { material: 'Steel', label: '¾"', volumePerMetre: 0.000506 },
  { material: 'Steel', label: '1"', volumePerMetre: 0.000704 },
  { material: 'Steel', label: '1¼"', volumePerMetre: 0.00121 }
]

const PERMISSIBLE_DROP_BANDS = [
  { minIV: 0, maxIV: 0.005, allowableDrop: 8 },
  { minIV: 0.005, maxIV: 0.010, allowableDrop: 4 },
  { minIV: 0.010, maxIV: 0.015, allowableDrop: 2.5 },
  { minIV: 0.015, maxIV: 0.035, allowableDrop: 1 }
]

const METERS = [
  { label: 'None', volume: 0 },
  { label: 'G4 / U6', volume: 0.008 },
  { label: 'E6', volume: 0.0024 },
  { label: 'U16', volume: 0.025 }
]

type PipeSection = {
  id: string
  material: string
  diameter: string
  length: number
  volume: number
}

export default function IVCalculator() {
  const [material, setMaterial] = useState('Copper')
  const [diameter, setDiameter] = useState('15mm')
  const [pipeLength, setPipeLength] = useState('')
  const [sections, setSections] = useState<PipeSection[]>([])
  const [selectedMeter, setSelectedMeter] = useState('None')

  const availablePipeSizes = useMemo(
    () => PIPE_SIZES.filter(pipe => pipe.material === material),
    [material]
  )

  const pipeworkIV = sections.reduce(
    (sum, section) => sum + section.volume,
    0
  )

  const meterIV =
    METERS.find(meter => meter.label === selectedMeter)?.volume || 0

  const totalIV = pipeworkIV + meterIV
  const purgeVolume = totalIV * 1.5

  const applicableBand = PERMISSIBLE_DROP_BANDS.find(
    band => totalIV > band.minIV && totalIV <= band.maxIV
  )

  function changeMaterial(value: string) {
    setMaterial(value)

    const firstSize = PIPE_SIZES.find(
      pipe => pipe.material === value
    )

    if (firstSize) {
      setDiameter(firstSize.label)
    }
  }

  function addSection() {
    const length = Number(pipeLength)

    if (!Number.isFinite(length) || length <= 0) {
      return
    }

    const matchingPipe = PIPE_SIZES.find(
      pipe =>
        pipe.material === material &&
        pipe.label === diameter
    )

    if (!matchingPipe) {
      return
    }

    const volume = length * matchingPipe.volumePerMetre

    setSections(current => [
      ...current,
      {
        id: `${Date.now()}-${Math.random()}`,
        material,
        diameter,
        length,
        volume
      }
    ])

    setPipeLength('')
  }

  function removeSection(id: string) {
    setSections(current =>
      current.filter(section => section.id !== id)
    )
  }

  function clearCalculator() {
    setSections([])
    setPipeLength('')
    setSelectedMeter('None')
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>IV Calculator</Text>
          <Text style={styles.subtitle}>
            Installation Volume & Purge Volume
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>PIPEWORK</Text>

          <Text style={styles.label}>Material</Text>
          <View style={styles.choiceRow}>
            {['Copper', 'Steel'].map(option => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.choiceButton,
                  material === option && styles.choiceButtonSelected
                ]}
                onPress={() => changeMaterial(option)}
              >
                <Text
                  style={[
                    styles.choiceText,
                    material === option && styles.choiceTextSelected
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Pipe Size</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={diameter}
              onValueChange={value => setDiameter(value)}
              dropdownIconColor="#ffffff"
              style={styles.picker}
            >
              {availablePipeSizes.map(pipe => (
                <Picker.Item
                  key={pipe.label}
                  label={pipe.label}
                  value={pipe.label}
                />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Pipe Length (m)</Text>
          <TextInput
            value={pipeLength}
            onChangeText={setPipeLength}
            keyboardType="decimal-pad"
            placeholder="Enter pipe length"
            placeholderTextColor="#6b7280"
            style={styles.input}
          />

          <TouchableOpacity
            style={styles.addButton}
            onPress={addSection}
          >
            <Text style={styles.addButtonText}>
              + Add Pipe Section
            </Text>
          </TouchableOpacity>
        </View>

        {sections.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>PIPE SECTIONS</Text>

            {sections.map(section => (
              <View key={section.id} style={styles.sectionRow}>
                <View style={styles.sectionInfo}>
                  <Text style={styles.sectionMainText}>
                    {section.material} {section.diameter}
                  </Text>
                  <Text style={styles.sectionSubText}>
                    {section.length}m · {section.volume.toFixed(5)} m³
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeSection(section.id)}
                >
                  <Text style={styles.removeButtonText}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>METER</Text>

          <Text style={styles.label}>Meter Type</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedMeter}
              onValueChange={value => setSelectedMeter(value)}
              dropdownIconColor="#ffffff"
              style={styles.picker}
            >
              {METERS.map(meter => (
                <Picker.Item
                  key={meter.label}
                  label={meter.label}
                  value={meter.label}
                />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.resultCard}>
          <Text style={styles.resultLabel}>INSTALLATION VOLUME</Text>
          <Text style={styles.resultValue}>
            {totalIV.toFixed(5)}
          </Text>
          <Text style={styles.resultUnit}>m³</Text>

          <View style={styles.breakdown}>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Pipework</Text>
              <Text style={styles.breakdownValue}>
                {pipeworkIV.toFixed(5)} m³
              </Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Meter</Text>
              <Text style={styles.breakdownValue}>
                {meterIV.toFixed(5)} m³
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.referenceCard}>
          <Text style={styles.referenceTitle}>PERMISSIBLE PRESSURE DROP</Text>
          <Text style={styles.referenceNote}>
            Installation Volume banding reference
          </Text>

          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.ivColumn]}>IV (m³)</Text>
            <Text style={styles.tableHeaderText}>MAX DROP</Text>
          </View>

          {PERMISSIBLE_DROP_BANDS.map((band, index) => {
            const isApplicable = applicableBand === band
            const range =
              index === 0
                ? `≤ ${band.maxIV.toFixed(3)}`
                : `> ${band.minIV.toFixed(3)} – ${band.maxIV.toFixed(3)}`

            return (
              <View
                key={`${band.minIV}-${band.maxIV}`}
                style={[
                  styles.tableRow,
                  isApplicable && styles.tableRowSelected
                ]}
              >
                <Text
                  style={[
                    styles.tableCell,
                    styles.ivColumn,
                    isApplicable && styles.tableCellSelected
                  ]}
                >
                  {range}
                </Text>
                <Text
                  style={[
                    styles.tableCell,
                    isApplicable && styles.tableCellSelected
                  ]}
                >
                  {band.allowableDrop} mbar
                </Text>
              </View>
            )
          })}

          {applicableBand ? (
            <View style={styles.applicableBox}>
              <Text style={styles.applicableLabel}>YOUR IV BAND</Text>
              <Text style={styles.applicableValue}>
                Maximum permissible drop: {applicableBand.allowableDrop} mbar
              </Text>
            </View>
          ) : (
            <Text style={styles.outsideNote}>
              IV above 0.035 m³ — this table does not apply.
            </Text>
          )}

          <View style={styles.perceptibleBox}>
            <Text style={styles.perceptibleTitle}>PERCEPTIBLE MOVEMENT</Text>
            <View style={styles.perceptibleRow}>
              <Text style={styles.perceptibleLabel}>Fluid gauge</Text>
              <Text style={styles.perceptibleValue}>0.25 mbar</Text>
            </View>
            <View style={styles.perceptibleRow}>
              <Text style={styles.perceptibleLabel}>Electronic gauge</Text>
              <Text style={styles.perceptibleValue}>0.20 mbar</Text>
            </View>
          </View>

          <Text style={styles.referenceFooter}>
            Reference only. Use Tightness Test for pressure-drop assessment.
          </Text>
        </View>

        <View style={styles.purgeCard}>
          <Text style={styles.purgeLabel}>PURGE VOLUME</Text>
          <Text style={styles.purgeValue}>
            {purgeVolume.toFixed(5)}
          </Text>
          <Text style={styles.purgeUnit}>m³</Text>
          <Text style={styles.purgeNote}>
            1.5 × Installation Volume
          </Text>
        </View>

        {sections.length > 0 || selectedMeter !== 'None' ? (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={clearCalculator}
          >
            <Text style={styles.clearButtonText}>
              Clear Calculator
            </Text>
          </TouchableOpacity>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1220'
  },
  scrollContent: {
    paddingBottom: 80
  },
  header: {
    paddingTop: 28,
    paddingHorizontal: 20,
    paddingBottom: 18
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#ffffff'
  },
  subtitle: {
    fontSize: 15,
    color: '#9ca3af',
    marginTop: 6
  },
  card: {
    backgroundColor: '#151f2b',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)'
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1.2,
    color: '#7fb343',
    marginBottom: 18
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 10,
    marginTop: 4
  },
  choiceRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18
  },
  choiceButton: {
    flex: 1,
    backgroundColor: '#1e293b',
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)'
  },
  choiceButtonSelected: {
    backgroundColor: '#7fb343',
    borderColor: '#7fb343'
  },
  choiceText: {
    color: '#ffffff',
    fontWeight: '800'
  },
  choiceTextSelected: {
    color: '#ffffff'
  },
  pickerContainer: {
    backgroundColor: '#111827',
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 18
  },
  picker: {
    color: '#ffffff',
    height: 54
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    borderRadius: 15,
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontSize: 17,
    color: '#ffffff',
    backgroundColor: '#111827',
    marginBottom: 14
  },
  addButton: {
    backgroundColor: '#7fb343',
    paddingVertical: 17,
    borderRadius: 17,
    alignItems: 'center'
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800'
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10
  },
  sectionInfo: {
    flex: 1
  },
  sectionMainText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800'
  },
  sectionSubText: {
    color: '#9ca3af',
    fontSize: 13,
    marginTop: 4
  },
  removeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#fee2e2',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10
  },
  removeButtonText: {
    color: '#dc2626',
    fontSize: 23,
    fontWeight: '700',
    lineHeight: 27
  },
  resultCard: {
    backgroundColor: '#151f2b',
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(127,179,67,0.25)'
  },
  resultLabel: {
    color: '#9ca3af',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.2
  },
  resultValue: {
    color: '#ffffff',
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: -2,
    marginTop: 8
  },
  resultUnit: {
    color: '#d1d5db',
    fontSize: 17,
    fontWeight: '700'
  },
  breakdown: {
    width: '100%',
    marginTop: 22
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)'
  },
  breakdownLabel: {
    color: '#9ca3af',
    fontSize: 14
  },
  breakdownValue: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800'
  },
  referenceCard: {
    backgroundColor: '#151f2b',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)'
  },
  referenceTitle: {
    color: '#7fb343',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1.2
  },
  referenceNote: {
    color: '#9ca3af',
    fontSize: 13,
    marginTop: 6,
    marginBottom: 16
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 9,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.10)'
  },
  tableHeaderText: {
    flex: 1,
    color: '#9ca3af',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.8
  },
  ivColumn: {
    flex: 1.4
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)'
  },
  tableRowSelected: {
    backgroundColor: 'rgba(127,179,67,0.14)',
    marginHorizontal: -10,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderBottomColor: 'transparent'
  },
  tableCell: {
    flex: 1,
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700'
  },
  tableCellSelected: {
    color: '#7fb343',
    fontWeight: '900'
  },
  applicableBox: {
    backgroundColor: '#111827',
    borderRadius: 14,
    padding: 14,
    marginTop: 14,
    borderWidth: 1,
    borderColor: 'rgba(127,179,67,0.25)'
  },
  applicableLabel: {
    color: '#7fb343',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.8
  },
  applicableValue: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 5
  },
  outsideNote: {
    color: '#f59e0b',
    fontSize: 13,
    marginTop: 14,
    lineHeight: 19
  },
  perceptibleBox: {
    backgroundColor: '#111827',
    borderRadius: 14,
    padding: 14,
    marginTop: 16
  },
  perceptibleTitle: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.8,
    marginBottom: 8
  },
  perceptibleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5
  },
  perceptibleLabel: {
    color: '#9ca3af',
    fontSize: 14
  },
  perceptibleValue: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800'
  },
  referenceFooter: {
    color: '#6b7280',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 14
  },
  purgeCard: {
    backgroundColor: '#111827',
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(127,179,67,0.25)'
  },
  purgeLabel: {
    color: '#9ca3af',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.2
  },
  purgeValue: {
    color: '#7fb343',
    fontSize: 40,
    fontWeight: '900',
    marginTop: 8
  },
  purgeUnit: {
    color: '#d1d5db',
    fontSize: 16,
    fontWeight: '700'
  },
  purgeNote: {
    color: '#6b7280',
    fontSize: 13,
    marginTop: 8
  },
  clearButton: {
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingVertical: 16,
    borderRadius: 17,
    alignItems: 'center'
  },
  clearButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700'
  }
})
