import React, {
  useState
} from 'react'

import { Picker } from '@react-native-picker/picker'

import {
  CheckCircle2,
  ChevronRight,
  Flame,
  Gauge,
  TriangleAlert,
  Workflow,
  Wrench
} from 'lucide-react-native'

import {
  Alert,
  Image,
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

import AsyncStorage from '@react-native-async-storage/async-storage'

import {
  router
} from 'expo-router'

import {
  edition4Matrix,
  evaluateEdition4
} from '../logic/edition4Rules'

const pipeSizes = [

  // COPPER

  {
    material: 'Copper',
    label: '15mm',
    volumePerMetre: 0.000154
  },

  {
    material: 'Copper',
    label: '22mm',
    volumePerMetre: 0.000352
  },

  {
    material: 'Copper',
    label: '28mm',
    volumePerMetre: 0.000594
  },

  {
    material: 'Copper',
    label: '35mm',
    volumePerMetre: 0.000924
  },

  // STEEL

  {
    material: 'Steel',
    label: '½"',
    volumePerMetre: 0.000264
  },

  {
    material: 'Steel',
    label: '¾"',
    volumePerMetre: 0.000506
  },

  {
    material: 'Steel',
    label: '1"',
    volumePerMetre: 0.000704
  },

  {
    material: 'Steel',
    label: '1¼"',
    volumePerMetre: 0.00121
  }

]

const meters = [
  {
    label: 'None',
    volume: 0
  },
  {
    label: 'G4 / U6',
    volume: 0.008
  },
  {
    label: 'E6',
    volume: 0.0024
  },
  {
    label: 'U16',
    volume: 0.025
  }
]

export default function Edition4Check() {

  const [
    propertyReference,
    setPropertyReference
  ] = useState('')

  const [
    postcode,
    setPostcode
  ] = useState('')

  const [
    pressureDrop,
    setPressureDrop
  ] = useState('')

  const [
    notes,
    setNotes
  ] = useState('')

  const [
  gaugeType,
  setGaugeType
] = useState('Fluid')

type TestStage =
  | 'preExchange'
  | 'postExchange'
  | 'pipeworkRetest'
  | 'finalTest'

const [
  testStage,
  setTestStage
] = useState<TestStage>('preExchange')

const [
  preExchangePressureDrop,
  setPreExchangePressureDrop
] = useState('')

const [
  postExchangePressureDrop,
  setPostExchangePressureDrop
] = useState('')

const [
  pipeworkRetestPressureDrop,
  setPipeworkRetestPressureDrop
] = useState('')

const [
  finalTestPressureDrop,
  setFinalTestPressureDrop
] = useState('')

const [
  meterExchanged,
  setMeterExchanged
] = useState(false)

  const [
    selectedMeter,
    setSelectedMeter
  ] = useState('G4 / U6')

  const [
    pipeSegments,
    setPipeSegments
  ] = useState([
    {
  id: Date.now().toString(),
  material: 'Copper',
  diameter: '15mm',
  length: ''
}
  ])

  const [
  existingMeter,
  setExistingMeter
] = useState('G4 / U6')

const [
  existingPipeSegments,
  setExistingPipeSegments
] = useState<typeof pipeSegments>([])

const [
  newMeter,
  setNewMeter
] = useState('')

const [
  newPipeSegments,
  setNewPipeSegments
] = useState([
  {
    id: Date.now().toString(),
    material: 'Copper',
    diameter: '15mm',
    length: ''
  }
])

const [
  preExchangeIV,
  setPreExchangeIV
] = useState(0)

  const [
    result,
    setResult
  ] = useState('')

  const [
    actions,
    setActions
  ] = useState<string[]>([])

  const [
    allowableDrop,
    setAllowableDrop
  ] = useState(0)

  const [
    bandText,
    setBandText
  ] = useState('')

  function addPipeSegment() {

  setPipeSegments(current => [

    ...current,

    {
  id: Date.now().toString(),
  material: 'Copper',
  diameter: '15mm',
  length: ''
}

  ])

}

  function updatePipeSegment(
    index: number,
    field: string,
    value: string
  ) {

    const updated = [...pipeSegments]

    updated[index] = {
      ...updated[index],
      [field]: value
    }

    setPipeSegments(updated)
  
  }

  function addNewPipeSegment() {
  setNewPipeSegments(current => [
    ...current,
    {
      id: Date.now().toString(),
      material: 'Copper',
      diameter: '15mm',
      length: ''
    }
  ])
}

function updateNewPipeSegment(
  index: number,
  field: string,
  value: string
) {
  const updated = [...newPipeSegments]

  updated[index] = {
    ...updated[index],
    [field]: value
  }

  setNewPipeSegments(updated)
}

  let pipeworkIV = 0

pipeSegments.forEach(segment => {

  const matchingPipe =
    pipeSizes.find(
      pipe =>
        pipe.label === segment.diameter &&
pipe.material === segment.material
    )

  if (matchingPipe) {

    pipeworkIV +=
      Number(segment.length) *
      matchingPipe.volumePerMetre

  }

})

const meterIV =
  meters.find(
    meter =>
      meter.label ===
      selectedMeter
  )?.volume || 0

const iv =
  pipeworkIV +
  meterIV

const purgeVolume =
  iv * 1.5

let newPipeworkIV = 0

newPipeSegments.forEach(segment => {
  const matchingPipe =
    pipeSizes.find(
      pipe =>
        pipe.label === segment.diameter &&
        pipe.material === segment.material
    )

  if (matchingPipe) {
    newPipeworkIV +=
      Number(segment.length) *
      matchingPipe.volumePerMetre
  }
})

const newMeterIV =
  meters.find(
    meter =>
      meter.label === newMeter
  )?.volume || 0

const postExchangeIV =
  pipeworkIV +
  newPipeworkIV +
  newMeterIV

const postExchangePurgeVolume =
  postExchangeIV * 1.5  

const assessmentIV =
  testStage === 'preExchange'
    ? iv
    : postExchangeIV

const assessmentPurgeVolume =
  assessmentIV * 1.5

const matchingBand =
  edition4Matrix.NG.find(
    band =>
      assessmentIV > band.minIV &&
      assessmentIV <= band.maxIV
  )

  async function runAssessment() {

  let currentPressureDrop = ''

  if (testStage === 'preExchange') {
    currentPressureDrop = preExchangePressureDrop
  }

  if (testStage === 'postExchange') {
    currentPressureDrop = postExchangePressureDrop
  }

  if (testStage === 'pipeworkRetest') {
    currentPressureDrop = pipeworkRetestPressureDrop
  }

  if (testStage === 'finalTest') {
    currentPressureDrop = finalTestPressureDrop
  }

  if (!currentPressureDrop) {

    Alert.alert(
      'Missing Information',
      'Enter pressure drop.'
    )

    return
  }

  setPressureDrop(currentPressureDrop)

  /*
   * PRE-EXCHANGE TEST
   */

  if (testStage === 'preExchange') {

    setExistingMeter(selectedMeter)
    setExistingPipeSegments(
      pipeSegments.map(segment => ({
        ...segment
      }))
    )
    setPreExchangeIV(iv)

    setResult('PRE-EXCHANGE TEST RECORDED')

    setActions([
      'Pre-exchange tightness test recorded',
      'Proceed with meter exchange',
      'After meter exchange, carry out the post-exchange tightness test'
    ])

    return
  }

  /*
   * POST-EXCHANGE TEST
   */

  if (testStage === 'postExchange') {

    if (!newMeter) {
      Alert.alert(
        'New Meter Required',
        'Select the new meter installed during the exchange before running the post-exchange assessment.'
      )
      return
    }

    const evaluation =
      evaluateEdition4(
        assessmentIV,
        Number(currentPressureDrop),
        true,
        gaugeType
      )

    setResult(evaluation.result)

    setActions(
      evaluation.result === 'RETEST REQUIRED'
        ? [
            'Pressure drop detected following meter exchange',
            'Check the meter installation and all disturbed connections',
            'Check washers and disturbed joints',
            'Isolate all appliances',
            'Repeat the tightness test on pipework only'
          ]
        : evaluation.result === 'PASS'
          ? [
              'No pressure drop detected following meter exchange',
              'Complete job as BAU',
              'Refer to Calculator for Purge Volume'
            ]
          : evaluation.actions
    )

    setAllowableDrop(
      evaluation.allowableDrop
    )

    setBandText(
      `${evaluation.bandMin.toFixed(3)} - ${evaluation.bandMax.toFixed(3)} m³`
    )

    return
  }

  /*
   * PIPEWORK-ONLY RETEST
   */

  if (testStage === 'pipeworkRetest') {

    const evaluation =
      evaluateEdition4(
        assessmentIV,
        Number(currentPressureDrop),
        false,
        gaugeType
      )

    setResult(evaluation.result)

    setActions(
      evaluation.result === 'PASS'
        ? [
            'Final tightness test satisfactory',
            'Apply LDF to all isolation valves',
            'Complete job as BAU',
            'Refer to Calculator for Purge Volume'
          ]
        : evaluation.actions
    )

    setAllowableDrop(
      evaluation.allowableDrop
    )

    setBandText(
      `${evaluation.bandMin.toFixed(3)} - ${evaluation.bandMax.toFixed(3)} m³`
    )

    return
  }

  /*
   * FINAL TEST AFTER APPLIANCES ARE REINSTATED
   */

  if (testStage === 'finalTest') {

    const evaluation =
      evaluateEdition4(
        assessmentIV,
        Number(currentPressureDrop),
        true,
        gaugeType
      )

    setResult(evaluation.result)

    setActions(evaluation.actions)

    setAllowableDrop(
      evaluation.allowableDrop
    )

    setBandText(
      `${evaluation.bandMin.toFixed(3)} - ${evaluation.bandMax.toFixed(3)} m³`
    )

    return
  }

}

  async function saveAssessment() {

    const assessment = {

      propertyReference,

      postcode,

      pressureDrop,

preExchangePressureDrop,
postExchangePressureDrop,
pipeworkRetestPressureDrop,
finalTestPressureDrop,

testStage,
meterExchanged,

notes,

      installationVolume:
        iv.toFixed(4),
      
      purgeVolume:
    purgeVolume.toFixed(4),

      preExchangeIV,
preExchangePipeworkIV: pipeworkIV,
preExchangeMeterIV: meterIV,
existingMeter,
existingPipeSegments,

postExchangeIV,
postExchangePipeworkIV:
  pipeworkIV + newPipeworkIV,
postExchangeMeterIV: newMeterIV,
newMeter,
newPipeSegments,

gaugeType,

      result,

      actions,

      allowableDrop,

      timestamp:
        new Date().toISOString()

    }

    const stored =
      await AsyncStorage.getItem(
        'assessments'
      )

    const existing =
      stored
        ? JSON.parse(stored)
        : []

    existing.unshift(assessment)

    await AsyncStorage.setItem(
      'assessments',
      JSON.stringify(existing)
    )

    Alert.alert(
      'Assessment Saved'
    )

    router.replace(
      '/saved-assessments'
    )

  }

  function clearAssessment() {

    setPropertyReference('')

    setPostcode('')

    setPressureDrop('')

    setNotes('')

    setResult('')

    setActions([])

    setAllowableDrop(0)

    setBandText('')

    setSelectedMeter('G4 / U6')

    setGaugeType('Fluid')

    setTestStage('preExchange')
setPreExchangePressureDrop('')
setPostExchangePressureDrop('')
setPipeworkRetestPressureDrop('')
setFinalTestPressureDrop('')
setMeterExchanged(false)

setExistingMeter('G4 / U6')
setExistingPipeSegments([])
setNewMeter('')
setNewPipeSegments([
  {
    id: Date.now().toString(),
    material: 'Copper',
    diameter: '15mm',
    length: ''
  }
])
setPreExchangeIV(0)

    setPipeSegments([
      {
  id: Date.now().toString(),
  material: 'Copper',
  diameter: '15mm',
  length: ''
}
    ])

  }

  return (

    <SafeAreaView style={styles.container}>

      <ScrollView
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.header}>

  <Image

    source={
      require('../assets/images/IVAssistHeader.png')
    }

    style={styles.brandHeader}

    resizeMode="cover"

  />

</View>

        <View style={styles.card}>

          <TextInput
            placeholder="First line of address"
            placeholderTextColor="#9ca3af"
            value={propertyReference}
            onChangeText={setPropertyReference}
            style={styles.input}
          />

          <TextInput
            placeholder="Postcode"
            placeholderTextColor="#9ca3af"
            value={postcode}
            onChangeText={text =>
              setPostcode(
                text.toUpperCase()
              )
            }
            autoCapitalize="characters"
            style={styles.input}
          />

        </View>

        <View style={styles.card}>

          <View style={styles.sectionHeader}>

  <Workflow
    size={22}
    color="#7fb343"
    style={{ marginRight: 10 }}
  />

  <Text style={styles.sectionTitle}>
    Pipework
  </Text>

</View>

<Text style={styles.pipeworkNote}>
  *Fittings volume automatically calculated based on pipe segments added*
</Text>

          {pipeSegments.map(
            (segment, index) => (

              <View
  key={segment.id}
  style={styles.segmentRowCompact}
>

  <View style={styles.segmentTopRow}>

    <Picker

      selectedValue={segment.material}

      style={styles.materialPicker}

      mode="dropdown"

      dropdownIconColor="#ffffff"

      onValueChange={value => {

  const updated = [...pipeSegments]

  updated[index] = {

    ...updated[index],

    material: value,

    diameter:
      value === 'Copper'
        ? '15mm'
        : '½"'

  }

  setPipeSegments(updated)

}}

    >

      <Picker.Item
        label="Copper"
        value="Copper"
      />

      <Picker.Item
        label="Steel"
        value="Steel"
      />

    </Picker>

    <Picker

      selectedValue={segment.diameter}

      style={styles.pipePicker}

      mode="dropdown"

      dropdownIconColor="#ffffff"

      onValueChange={value =>

        updatePipeSegment(
          index,
          'diameter',
          value
        )

      }

    >

      {
        pipeSizes
          .filter(

            pipe =>

              pipe.material ===
              segment.material

          )
          .map(pipe => (

            <Picker.Item
              key={pipe.label}
              label={pipe.label}
              value={pipe.label}
            />

          ))
      }

    </Picker>

  </View>

  <View style={styles.segmentBottomRow}>

    <TextInput

      value={segment.length}

      onChangeText={text =>
        updatePipeSegment(
          index,
          'length',
          text
        )
      }

      style={styles.lengthInputFull}

      placeholder="Length (m)"

      placeholderTextColor="#9ca3af"

      keyboardType="numeric"

    />

    <TouchableOpacity

      style={styles.removeCompact}

      onPress={() => {

        const updated =
          pipeSegments.filter(
            (_, pipeIndex) =>
              pipeIndex !== index
          )

        setPipeSegments(updated)

      }}

    >

      <Text style={styles.removeCompactText}>
        ✕
      </Text>

    </TouchableOpacity>

  </View>

</View>

            )
          )}

          <TouchableOpacity
            style={styles.addButton}
            onPress={addPipeSegment}
          >

            <Text style={styles.addButtonText}>
              Add Pipe Segment
            </Text>

          </TouchableOpacity>

        </View>

        <View style={styles.card}>

          <Text style={styles.sectionTitle}>
            Meter Type
          </Text>

          {meters.map(meter => (

            <TouchableOpacity
              key={meter.label}
              disabled={testStage !== 'preExchange'}
              style={[
                styles.meterButton,
                selectedMeter === meter.label &&
                styles.selectedMeterButton,
                testStage !== 'preExchange' && {
                  opacity: 0.55
                }
              ]}
              onPress={() =>
                setSelectedMeter(
                  meter.label
                )
              }
            >

              <Text
                style={[
                  styles.meterButtonText,
                  selectedMeter === meter.label && {
                    color: '#ffffff'
                  }
                ]}
              >
                {meter.label}
              </Text>

            </TouchableOpacity>

          ))}

        </View>

        {testStage !== 'preExchange' && (

          <View style={styles.card}>

            <Text style={styles.sectionTitle}>
              Meter Exchange
            </Text>

            <View style={styles.infoCard}>

              <Text style={styles.infoText}>
                Existing Meter: {existingMeter}
              </Text>

              <Text style={styles.infoText}>
                Pre-Exchange Installation Volume:
                {' '}
                {preExchangeIV.toFixed(4)} m³
              </Text>

            </View>

            <Text style={styles.sectionTitle}>
              New Meter
            </Text>

            {meters.map(meter => (

              <TouchableOpacity
                key={meter.label}
                style={[
                  styles.meterButton,
                  newMeter === meter.label &&
                  styles.selectedMeterButton
                ]}
                onPress={() =>
                  setNewMeter(meter.label)
                }
              >

                <Text
                  style={[
                    styles.meterButtonText,
                    newMeter === meter.label && {
                      color: '#ffffff'
                    }
                  ]}
                >
                  {meter.label}
                </Text>

              </TouchableOpacity>

            ))}

            <Text
              style={[
                styles.sectionTitle,
                { marginTop: 20 }
              ]}
            >
              New Pipework Installed
            </Text>

            <Text style={styles.pipeworkNote}>
              Add only pipework installed during the meter exchange.
            </Text>

            {newPipeSegments.map(
              (segment, index) => (

                <View
                  key={segment.id}
                  style={styles.segmentRowCompact}
                >

                  <View style={styles.segmentTopRow}>

                    <Picker
                      selectedValue={segment.material}
                      style={styles.materialPicker}
                      mode="dropdown"
                      dropdownIconColor="#ffffff"
                      onValueChange={value => {

                        const updated =
                          [...newPipeSegments]

                        updated[index] = {
                          ...updated[index],
                          material: value,
                          diameter:
                            value === 'Copper'
                              ? '15mm'
                              : '½"'
                        }

                        setNewPipeSegments(updated)
                      }}
                    >

                      <Picker.Item
                        label="Copper"
                        value="Copper"
                      />

                      <Picker.Item
                        label="Steel"
                        value="Steel"
                      />

                    </Picker>

                    <Picker
                      selectedValue={segment.diameter}
                      style={styles.pipePicker}
                      mode="dropdown"
                      dropdownIconColor="#ffffff"
                      onValueChange={value =>
                        updateNewPipeSegment(
                          index,
                          'diameter',
                          value
                        )
                      }
                    >

                      {pipeSizes
                        .filter(
                          pipe =>
                            pipe.material ===
                            segment.material
                        )
                        .map(pipe => (

                          <Picker.Item
                            key={pipe.label}
                            label={pipe.label}
                            value={pipe.label}
                          />

                        ))}

                    </Picker>

                  </View>

                  <View style={styles.segmentBottomRow}>

                    <TextInput
                      value={segment.length}
                      onChangeText={text =>
                        updateNewPipeSegment(
                          index,
                          'length',
                          text
                        )
                      }
                      style={styles.lengthInputFull}
                      placeholder="Length (m)"
                      placeholderTextColor="#9ca3af"
                      keyboardType="numeric"
                    />

                    <TouchableOpacity
                      style={styles.removeCompact}
                      onPress={() => {

                        const updated =
                          newPipeSegments.filter(
                            (_, pipeIndex) =>
                              pipeIndex !== index
                          )

                        setNewPipeSegments(updated)
                      }}
                    >

                      <Text style={styles.removeCompactText}>
                        ✕
                      </Text>

                    </TouchableOpacity>

                  </View>

                </View>

              )
            )}

            <TouchableOpacity
              style={styles.addButton}
              onPress={addNewPipeSegment}
            >

              <Text style={styles.addButtonText}>
                Add New Pipe Segment
              </Text>

            </TouchableOpacity>

            <View style={styles.totalCard}>

              <Text style={styles.totalCardLabel}>
                POST-EXCHANGE INSTALLATION VOLUME
              </Text>

              <Text style={styles.totalCardValue}>
                {postExchangeIV.toFixed(4)}
              </Text>

              <Text style={styles.totalCardUnit}>
                m³
              </Text>

            </View>

            <View style={styles.purgeCard}>

              <Text style={styles.purgeCardLabel}>
                POST-EXCHANGE PURGE VOLUME
              </Text>

              <Text style={styles.purgeCardValue}>
                {postExchangePurgeVolume.toFixed(4)}
              </Text>

              <Text style={styles.purgeCardUnit}>
                m³
              </Text>

            </View>

          </View>

        )}

          <View style={styles.cardInner}>

            <View style={styles.sectionHeader}>

              <Gauge
                size={22}
                color="#7fb343"
                style={{ marginRight: 10 }}
              />

              <Text style={styles.sectionTitle}>
                Installation Volume
              </Text>

            </View>

            {testStage === 'preExchange' ? (

              <>
                <View style={styles.breakdownRow}>

                  <Text style={styles.breakdownLabel}>
                    Pipework
                  </Text>

                  <Text style={styles.breakdownValue}>
                    {pipeworkIV.toFixed(4)} m³
                  </Text>

                </View>

                <View style={styles.breakdownRow}>

                  <Text style={styles.breakdownLabel}>
                    Meter
                  </Text>

                  <Text style={styles.breakdownValue}>
                    {meterIV.toFixed(4)} m³
                  </Text>

                </View>
              </>

            ) : (

              <>
                <View style={styles.breakdownRow}>

                  <Text style={styles.breakdownLabel}>
                    Existing Pipework
                  </Text>

                  <Text style={styles.breakdownValue}>
                    {pipeworkIV.toFixed(4)} m³
                  </Text>

                </View>

                <View style={styles.breakdownRow}>

                  <Text style={styles.breakdownLabel}>
                    New Pipework
                  </Text>

                  <Text style={styles.breakdownValue}>
                    {newPipeworkIV.toFixed(4)} m³
                  </Text>

                </View>

                <View style={styles.breakdownRow}>

                  <Text style={styles.breakdownLabel}>
                    New Meter
                  </Text>

                  <Text style={styles.breakdownValue}>
                    {newMeterIV.toFixed(4)} m³
                  </Text>

                </View>
              </>

            )}

            <View style={styles.totalCard}>

              <Text style={styles.totalCardLabel}>
                {testStage === 'preExchange'
                  ? 'TOTAL INSTALLATION VOLUME'
                  : 'CURRENT INSTALLATION VOLUME'}
              </Text>

              <Text style={styles.totalCardValue}>
                {assessmentIV.toFixed(4)}
              </Text>

              <Text style={styles.totalCardUnit}>
                m³
              </Text>

            </View>

            <View style={styles.purgeCard}>

              <Text style={styles.purgeCardLabel}>
                PURGE VOLUME REQUIRED
              </Text>

              <Text style={styles.purgeCardValue}>
                {assessmentPurgeVolume.toFixed(4)}
              </Text>

              <Text style={styles.purgeCardUnit}>
                m³
              </Text>

            </View>

          <View style={styles.permissibleCard}>

  <Text style={styles.permissibleTitle}>
    Permissible Movement
  </Text>

  {testStage === 'pipeworkRetest' ? (

    <Text style={styles.permissibleWarning}>
      Pipework-only test:
      Maximum permissible movement is 0.25 mbar (Fluid)
      or 0.2 mbar (Electronic)
    </Text>

  ) : (

    matchingBand ? (

      <Text
        style={[
          styles.permissibleValue,
          result === 'PASS'
            ? styles.permissiblePass
            : result === 'RETEST REQUIRED'
              ? styles.permissibleRetest
              : styles.permissibleFail
        ]}
      >
        Allowed Drop:
        {' '}
        {matchingBand.allowableDrop}
        mbar
      </Text>

    ) : (

      <Text style={styles.permissibleWarning}>
        IV outside supported range
      </Text>

    )

  )}

</View>

</View>

          <Text style={styles.sectionTitle}>
            Gauge Type
          </Text>

          <View style={styles.gaugeContainer}>

            <TouchableOpacity
              style={[
                styles.gaugeButton,
                gaugeType === 'Fluid' &&
                styles.selectedGaugeButton
              ]}
              onPress={() =>
                setGaugeType('Fluid')
              }
            >

              <Text
                style={[
                  styles.gaugeButtonText,
                  gaugeType === 'Fluid' && {
                    color: '#ffffff'
                  }
                ]}
              >
                Fluid Gauge
              </Text>

            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.gaugeButton,
                gaugeType === 'Electronic' &&
                styles.selectedGaugeButton
              ]}
              onPress={() =>
                setGaugeType('Electronic')
              }
            >

              <Text
                style={[
                  styles.gaugeButtonText,
                  gaugeType === 'Electronic' && {
                    color: '#ffffff'
                  }
                ]}
              >
                Electronic 1dp
              </Text>

            </TouchableOpacity>

          </View>

        <View style={styles.card}>

          <View style={styles.sectionHeader}>

  <Flame
    size={22}
    color="#7fb343"
    style={{ marginRight: 10 }}
  />

  <Text style={styles.pressureLabel}>

  {testStage === 'preExchange'
    ? 'Pre-Exchange Tightness Test'
    : testStage === 'postExchange'
      ? 'Post-Exchange Tightness Test'
      : testStage === 'pipeworkRetest'
        ? 'Pipework-Only Tightness Test'
        : 'Final Tightness Test'}

</Text>

</View>

<View style={styles.pressureInputContainer}>

  <TextInput
  placeholder="0.0"

  value={
    testStage === 'preExchange'
      ? preExchangePressureDrop
      : testStage === 'postExchange'
        ? postExchangePressureDrop
        : testStage === 'pipeworkRetest'
          ? pipeworkRetestPressureDrop
          : finalTestPressureDrop
  }

  onChangeText={text => {

    if (testStage === 'preExchange') {
      setPreExchangePressureDrop(text)
    }

    if (testStage === 'postExchange') {
      setPostExchangePressureDrop(text)
    }

    if (testStage === 'pipeworkRetest') {
      setPipeworkRetestPressureDrop(text)
    }

    if (testStage === 'finalTest') {
      setFinalTestPressureDrop(text)
    }

  }}

  style={styles.pressureInput}

  keyboardType="numeric"

  placeholderTextColor="#9ca3af"
/>

  <Text style={styles.pressureUnit}>
    mbar
  </Text>

</View>

          <TouchableOpacity
  style={styles.calculateButton}
  onPress={runAssessment}
>
  <Text style={styles.calculateButtonText}>

    {testStage === 'preExchange'
      ? 'Record Pre-Exchange Test'
      : testStage === 'postExchange'
        ? 'Run Post-Exchange Assessment'
        : testStage === 'pipeworkRetest'
          ? 'Run Pipework-Only Test'
          : 'Run Final Tightness Test'}

  </Text>
</TouchableOpacity>

        </View>

        {testStage === 'postExchange' &&
  result === 'RETEST REQUIRED' && (

  <TouchableOpacity
    style={styles.retestButton}
    onPress={() => {

      setTestStage('pipeworkRetest')
      setPipeworkRetestPressureDrop('')
      setResult('')
      setActions([])
      setAllowableDrop(0)
      setBandText('')

      Alert.alert(
        'Pipework-Only Retest',
        'Check the meter installation and disturbed connections, isolate all appliances, then carry out the pipework-only tightness test.'
      )

    }}
  >

    <Text style={styles.retestButtonText}>
      Start Pipework-Only Retest
    </Text>

  </TouchableOpacity>

)}

{testStage === 'pipeworkRetest' &&
  result === 'PASS' && (

  <TouchableOpacity
    style={styles.calculateButton}
    onPress={() => {

      setTestStage('finalTest')
      setFinalTestPressureDrop('')
      setResult('')
      setActions([])
      setAllowableDrop(0)
      setBandText('')

    }}
  >

    <Text style={styles.calculateButtonText}>
      Appliances Reinstated — Start Final Test
    </Text>

  </TouchableOpacity>

)}

{testStage === 'preExchange' &&
  result === 'PRE-EXCHANGE TEST RECORDED' && (

  <TouchableOpacity
    style={styles.retestButton}
    onPress={() => {
      setMeterExchanged(true)
      setNewMeter('')
      setNewPipeSegments([
        {
          id: Date.now().toString(),
          material: 'Copper',
          diameter: '15mm',
          length: ''
        }
      ])
      setTestStage('postExchange')
      setPostExchangePressureDrop('')
      setResult('')
      setActions([])
      setAllowableDrop(0)
      setBandText('')
    }}
  >
    <Text style={styles.retestButtonText}>
      Meter Exchanged — Enter New Installation Details
    </Text>
  </TouchableOpacity>

)}

        {result !== '' && (

          <View
            style={[

  styles.card,

  result === 'PASS'

    ? styles.resultCardPass

    : result === 'RETEST REQUIRED'

      ? styles.resultCardRetest

      : styles.resultCardFail

]}
          >

            <View style={styles.resultHeader}>

  {

    result === 'PASS'

      ? (

        <CheckCircle2
          size={34}
          color="#16a34a"
          style={{ marginRight: 10 }}
        />

      )

      : result === 'RETEST REQUIRED'

        ? (

          <Wrench
            size={34}
            color="#d97706"
            style={{ marginRight: 10 }}
          />

        )

        : (

          <TriangleAlert
            size={34}
            color="#dc2626"
            style={{ marginRight: 10 }}
          />

        )

  }

  <View style={{ flex: 1, minWidth: 0 }}>

    <Text
      style={[

        styles.resultText,

        result === 'FAIL'

          ? styles.failText

          : result === 'RETEST REQUIRED'

            ? styles.retestText

            : styles.passText

      ]}
    >

      {result}

    </Text>

    <View
      style={[

        styles.statusPill,

        result === 'PASS'

          ? styles.statusPillPass

          : result === 'RETEST REQUIRED'

            ? styles.statusPillRetest

            : styles.statusPillFail

      ]}
    >

      <Text style={styles.statusPillText}>

        {

          result === 'PASS'

            ? 'Installation Sound'

            : result === 'RETEST REQUIRED'

              ? 'Retest Required'

              : 'Pressure Loss Exceeds Limits'

        }

      </Text>

    </View>

  </View>

</View>

            {allowableDrop > 0 && (

              <View style={styles.infoCard}>

                <Text style={styles.infoText}>
                  Permissible Limit: {allowableDrop} mbar
                </Text>

                <Text style={styles.infoText}>
                  IV Band: {bandText}
                </Text>

              </View>

            )}

            <View style={styles.actionsCard}>

              {actions.map(

  (action, index) => (

    <View
      key={index}
      style={styles.actionRow}
    >

      <View style={styles.actionIcon}>

        <ChevronRight
          size={18}
          color="#7fb343"
          style={{ marginRight: 10 }}
        />

      </View>

      <Text style={styles.actionText}>
        {action}
      </Text>

    </View>

  )

)}

            </View>

            <View style={styles.cardInner}>

              <Text style={styles.sectionTitle}>
                Notes
              </Text>

              <TextInput
                placeholder="Optional notes..."
                placeholderTextColor="#9ca3af"
                value={notes}
                onChangeText={setNotes}
                style={styles.notesInput}
                multiline
              />

            </View>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={saveAssessment}
            >

              <Text style={styles.saveButtonText}>
                Save Assessment
              </Text>

            </TouchableOpacity>

            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => {

                Alert.alert(
                  'Clear Assessment',
                  'Reset all assessment data?',
                  [
                    {
                      text: 'Cancel',
                      style: 'cancel'
                    },
                    {
                      text: 'Clear',
                      style: 'destructive',
                      onPress: clearAssessment
                    }
                  ]
                )

              }}
            >

              <Text style={styles.clearButtonText}>
                Clear Assessment
              </Text>

            </TouchableOpacity>

          </View>

        )}

      </ScrollView>

    </SafeAreaView>

  )

}

const styles = StyleSheet.create({

  materialPicker: {

  flex: 1.2,

  minHeight: 55,

  backgroundColor: '#111827',

  borderRadius: 14,

  color: '#ffffff',

  marginRight: 10

},

  container: {
    flex: 1,
    backgroundColor: '#0f1720'
  },

  header: {

  backgroundColor: '#0f1720',

  paddingTop: 0,

  paddingBottom: 0,

  paddingHorizontal: 0,

  marginBottom: -30,

  overflow: 'hidden'

},

  title: {

  fontSize: 34,

  fontWeight: '900',

  color: '#ffffff',

  letterSpacing: -1

},

  subtitle: {

  marginTop: 6,

  fontSize: 16,

  color: '#ecfccb',

  fontWeight: '500'

},

  card: {
    borderWidth: 1,
borderColor: 'rgba(255,255,255,0.06)',
  backgroundColor: '#151f2b',
  marginHorizontal: 18,
  marginBottom: 20,
  borderRadius: 24,
  padding: 22,

  shadowColor: '#000',
  shadowOpacity: 0.03,
  shadowRadius: 16,
  shadowOffset: {
    width: 0,
    height: 4
  },

  elevation: 3
},

  cardInner: {
    backgroundColor: '#151f2b',
    borderRadius: 20,
    padding: 20,
    marginTop: 20
  },

  sectionTitle: {
  fontSize: 20,
  fontWeight: '800',
  color: '#ffffff',
  marginBottom: 22,
  letterSpacing: -0.3
},

pipeworkNote: {

  color: '#d1d5db',

  fontSize: 14,

  lineHeight: 22,

  marginTop: -10,

  marginBottom: 18

},

  input: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    color: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    fontSize: 16
  },

  segmentRowCompact: {

  backgroundColor: '#1e293b',

  borderRadius: 22,

  padding: 14,

  marginBottom: 16,

  borderWidth: 1,

  borderColor: 'rgba(255,255,255,0.06)'

},

  pipePicker: {
  flex: 1.1,
  minHeight: 55,
  backgroundColor: '#111827',
  borderRadius: 14,
  color: '#ffffff',
},

  removeCompact: {

  width: 32,

  height: 32,

  borderRadius: 16,

  backgroundColor: '#fee2e2',

  alignItems: 'center',

  justifyContent: 'center',

  marginLeft: 6,

  borderWidth: 1,

  borderColor: '#fecaca'

},

  removeCompactText: {

  color: '#dc2626',

  fontSize: 16,

  fontWeight: '900',

  marginTop: -1

},

  addButton: {
    backgroundColor: '#1e293b',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 10
  },

  addButtonText: {
    fontWeight: '700',
    color: '#ffffff'
  },

  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },

  toggleText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
    width: '65%'
  },

  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  switchValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#ffffff',
    minWidth: 40,
    marginRight: 12
  },

  meterButton: {
    backgroundColor: '#1e293b',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12
  },

  selectedMeterButton: {
    backgroundColor: '#7fb343'
  },

  meterButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff'
  },

  gaugeContainer: {
    flexDirection: 'row',
    marginTop: 10
  },

  gaugeButton: {
    flex: 1,
    backgroundColor: '#1e293b',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginRight: 10
  },

  selectedGaugeButton: {
    backgroundColor: '#7fb343'
  },

  gaugeButtonText: {
    fontWeight: '700',
    color: '#ffffff'
  },

  calculateButton: {

  backgroundColor: '#7fb343',

  paddingVertical: 22,

  borderRadius: 24,

  alignItems: 'center',

  marginTop: 14,

  shadowColor: '#7fb343',

  shadowOpacity: 0.25,

  shadowRadius: 12,

  shadowOffset: {
    width: 0,
    height: 5
  },

  elevation: 5
},

  calculateButtonText: {

  color: '#ffffff',

  fontSize: 17,

  fontWeight: '800',

  letterSpacing: -0.3,

  textAlign: 'center',

  flexShrink: 1,

  paddingHorizontal: 16,

  lineHeight: 22

},

  retestButton: {
    backgroundColor: '#d97706',
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    minHeight: 56
  },

  retestButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    flexShrink: 1,
    lineHeight: 21
  },

  resultCard: {
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 24,
    padding: 24
  },

  passCard: {
    backgroundColor: '#ecfdf5'
  },

  retestCard: {
    backgroundColor: '#fffbeb'
  },

  failCard: {
    backgroundColor: '#fef2f2'
  },

  resultText: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.5,
    flexShrink: 1,
    lineHeight: 29
  },

  passText: {
    color: '#16a34a'
  },

  retestText: {
    color: '#d97706'
  },

  failText: {
    color: '#dc2626'
  },

  infoCard: {
    backgroundColor: '#151f2b',
    borderRadius: 18,
    padding: 18,
    marginBottom: 20
  },

  infoText: {
    fontSize: 15,
    color: '#ffffff',
    marginBottom: 8
  },

  actionsCard: {

  backgroundColor: '#151f2b',

  borderRadius: 22,

  padding: 20,

  borderWidth: 1,

  borderColor: 'rgba(255,255,255,0.06)'

},

  actionText: {

  flex: 1,

  flexShrink: 1,

  fontSize: 15,

  color: '#ffffff',

  lineHeight: 24,

  fontWeight: '500'

},

  breakdownRow: {

  flexDirection: 'row',

  justifyContent: 'space-between',

  alignItems: 'center',

  backgroundColor: '#111827',

  borderRadius: 16,

  paddingVertical: 14,

  paddingHorizontal: 16,

  marginBottom: 12

},

  breakdownLabel: {

  fontSize: 15,

  color: '#6b7280',

  fontWeight: '600'

},

  breakdownValue: {

  fontSize: 16,

  fontWeight: '800',

  color: '#ffffff'

},

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb'
  },

  totalLabel: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827'
  },

  totalValue: {
  fontSize: 34,
  fontWeight: '900',
  color: '#111827',
  letterSpacing: -1
},

  notesInput: {
    borderWidth: 1,
    backgroundColor: '#111827',
color: '#ffffff',
borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    fontSize: 16
  },

  saveButton: {
    backgroundColor: '#111827',
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 24
  },

  saveButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700'
  },

  clearButton: {
    backgroundColor: '#1e293b',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 16
  },

  clearButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700'
  },

  pressureLabel: {
  fontSize: 18,
  fontWeight: '800',
  color: '#ffffff',
  marginBottom: 16
},

pressureInputContainer: {
  flexDirection: 'row',
  alignItems: 'center',

  borderWidth: 2,
  borderColor: '#7fb343',

  borderRadius: 24,

  paddingHorizontal: 22,
  paddingVertical: 8,

  marginBottom: 24,

  backgroundColor: '#111827'
},

pressureInput: {
  flex: 1,
  fontSize: 34,
  fontWeight: '800',
  color: '#ffffff',
  paddingVertical: 12
},

pressureUnit: {
  fontSize: 18,
  fontWeight: '700',
  color: '#6b7280'
},

permissibleCard: {
  marginTop: 24,
  backgroundColor: '#111827',
  borderRadius: 18,
  padding: 18
},

permissibleTitle: {
  fontSize: 16,
  fontWeight: '800',
  color: '#ffffff',
  marginBottom: 10
},

permissibleValue: {
  fontSize: 18,
  fontWeight: '800',
  color: '#d97706'
},

permissibleWarning: {
  fontSize: 15,
  fontWeight: '700',
  color: '#dc2626',
  lineHeight: 22
},

resultCardPass: {
  backgroundColor: '#ecfdf3',
  borderWidth: 2,
  borderColor: '#16a34a'
},

resultCardRetest: {
  backgroundColor: '#fff7ed',
  borderWidth: 2,
  borderColor: '#d97706'
},

resultCardFail: {
  backgroundColor: '#fef2f2',
  borderWidth: 2,
  borderColor: '#dc2626'
},

totalCard: {

  backgroundColor: '#111827',

  borderRadius: 24,

  paddingVertical: 30,

  alignItems: 'center',

  marginTop: 24

},

totalCardLabel: {

  color: '#9ca3af',

  fontSize: 13,

  fontWeight: '700',

  letterSpacing: 1.2,

  marginBottom: 12

},

totalCardValue: {

  color: '#ffffff',

  fontSize: 48,

  fontWeight: '900',

  letterSpacing: -2

},

totalCardUnit: {

  color: '#d1d5db',

  fontSize: 18,

  fontWeight: '700',

  marginTop: 4

},

purgeCard: {

  backgroundColor: '#111827',

  borderRadius: 24,

  paddingVertical: 24,

  alignItems: 'center',

  marginTop: 12,

  borderWidth: 1,

  borderColor: 'rgba(127,179,67,0.25)'

},

purgeCardLabel: {

  color: '#9ca3af',

  fontSize: 13,

  fontWeight: '700',

  letterSpacing: 1.2,

  marginBottom: 10

},

purgeCardValue: {

  color: '#7fb343',

  fontSize: 40,

  fontWeight: '900',

  letterSpacing: -1.5

},

purgeCardUnit: {

  color: '#d1d5db',

  fontSize: 16,

  fontWeight: '700',

  marginTop: 4

},

sectionHeader: {

  flexDirection: 'row',

  alignItems: 'center',

  marginBottom: 20

},

resultHeader: {

  flexDirection: 'row',

  alignItems: 'center',

  marginBottom: 24

},

statusPill: {

  paddingHorizontal: 16,

  paddingVertical: 8,

  borderRadius: 999,

  alignSelf: 'flex-start',

  marginTop: 8

},

statusPillPass: {
  backgroundColor: '#dcfce7'
},

statusPillRetest: {
  backgroundColor: '#fed7aa'
},

statusPillFail: {
  backgroundColor: '#fecaca'
},

statusPillText: {

  fontSize: 13,

  fontWeight: '800',

  letterSpacing: 0.3,

  color: '#111827'

},

actionRow: {

  flexDirection: 'row',

  alignItems: 'flex-start',

  backgroundColor: '#111827',

  borderRadius: 18,

  padding: 16,

  marginBottom: 14

},

actionIcon: {

  width: 26,

  height: 26,

  borderRadius: 15,

  backgroundColor: '#ecfdf3',

  alignItems: 'center',

  justifyContent: 'center',

  marginRight: 14,

  marginTop: 2

},

permissiblePass: {
  color: '#16a34a'
},

permissibleRetest: {
  color: '#d97706'
},

permissibleFail: {
  color: '#dc2626'
},

brandHeader: {

  width: '112%',

  height: 260,

  alignSelf: 'center',

  marginLeft: -12

},

segmentTopRow: {

  flexDirection: 'row',

  marginBottom: 12

},

segmentBottomRow: {

  flexDirection: 'row',

  alignItems: 'center'

},

lengthInputFull: {

  flex: 1,

  borderWidth: 1,

  borderColor: 'rgba(255,255,255,0.08)',

  borderRadius: 12,

  paddingHorizontal: 14,

  paddingVertical: 12,

  fontSize: 15,

  backgroundColor: '#111827',

  color: '#ffffff',

  marginRight: 10

},

})
