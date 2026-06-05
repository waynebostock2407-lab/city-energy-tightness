import React, { useState } from 'react'

import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native'

const PIPE_SIZES = {
  '15mm': 0.0136,
  '22mm': 0.0202,
  '28mm': 0.0262
}

export default function IVCalculator() {

  const [selectedSize, setSelectedSize] =
    useState<'15mm' | '22mm' | '28mm'>('15mm')

  const [pipeLength, setPipeLength] =
    useState('')

  const [sections, setSections] =
    useState<any[]>([])

  function addSection() {

    const length = Number(pipeLength)

    if (!length) return

    const diameter =
      PIPE_SIZES[selectedSize]

    const radius = diameter / 2

    const volume =
      Math.PI *
      radius *
      radius *
      length

    const newSection = {
      size: selectedSize,
      length,
      volume
    }

    setSections([
      ...sections,
      newSection
    ])

    setPipeLength('')
  }

  const totalIV =
    sections.reduce(
      (sum, section) =>
        sum + section.volume,
      0
    )

  return (

    <SafeAreaView style={styles.container}>

      <ScrollView
  contentContainerStyle={{
    paddingBottom: 120
  }}
>

        <View style={styles.header}>

          <Text style={styles.title}>
            IV Calculator
          </Text>

          <Text style={styles.subtitle}>
            Installation Volume Calculation
          </Text>

        </View>

        <View style={styles.card}>

          <Text style={styles.label}>
            Pipe Size
          </Text>

          <View style={styles.sizeContainer}>

            {Object.keys(PIPE_SIZES).map(
              size => (

              <TouchableOpacity
                key={size}
                style={[
                  styles.sizeButton,
                  selectedSize === size &&
                  styles.selectedSize
                ]}
                onPress={() =>
                  setSelectedSize(
                    size as any
                  )
                }
              >

                <Text
                  style={[
                    styles.sizeText,
                    selectedSize === size &&
                    styles.selectedText
                  ]}
                >
                  {size}
                </Text>

              </TouchableOpacity>

            ))}

          </View>

          <Text style={styles.label}>
            Pipe Length (m)
          </Text>

          <TextInput
            value={pipeLength}
            onChangeText={setPipeLength}
            keyboardType="numeric"
            placeholder="Enter pipe length"
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

        <View style={styles.sectionCard}>

          <Text style={styles.sectionTitle}>
            Pipe Sections
          </Text>

          {sections.map((section, index) => (

            <View
              key={index}
              style={styles.sectionRow}
            >

              <Text style={styles.sectionText}>
                {section.size}
              </Text>

              <Text style={styles.sectionText}>
                {section.length}m
              </Text>

              <Text style={styles.sectionText}>
                {section.volume.toFixed(5)}
              </Text>

            </View>

          ))}

        </View>

        <View style={styles.totalCard}>

          <Text style={styles.totalLabel}>
            TOTAL IV
          </Text>

          <Text style={styles.totalValue}>
            {totalIV.toFixed(5)} m³
          </Text>

        </View>

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
    marginBottom: 12,
    color: '#111827'
  },

  sizeContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24
  },

  sizeButton: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14
  },

  selectedSize: {
    backgroundColor: '#7fb343'
  },

  sizeText: {
    color: '#111827',
    fontWeight: '700'
  },

  selectedText: {
    color: '#ffffff'
  },

  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 16,
    padding: 16,
    fontSize: 18,
    marginBottom: 20,
    backgroundColor: '#ffffff'
  },

  addButton: {
    backgroundColor: '#7fb343',
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: 'center'
  },

  addButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700'
  },

  sectionCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 20
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 20
  },

  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14
  },

  sectionText: {
    fontSize: 16,
    color: '#374151'
  },

  totalCard: {
    backgroundColor: '#7fb343',
    margin: 20,
    marginBottom: 120,
    borderRadius: 24,
    padding: 30,
    alignItems: 'center'
  },

  totalLabel: {
    color: '#ffffff',
    fontSize: 18,
    marginBottom: 10
  },

  totalValue: {
    color: '#ffffff',
    fontSize: 40,
    fontWeight: '800'
  }

})