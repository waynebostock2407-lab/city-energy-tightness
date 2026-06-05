import React, {
    useEffect,
    useState
} from 'react'

import {
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native'

import {
    SafeAreaView
} from 'react-native-safe-area-context'

import AsyncStorage from '@react-native-async-storage/async-storage'

import {
    useLocalSearchParams
} from 'expo-router'

export default function JobDetail() {

  const { id } =
    useLocalSearchParams()

  const [job, setJob] =
    useState<any>(null)

  useEffect(() => {

    loadJob()

  }, [])

  async function loadJob() {

    const storedTests =
      await AsyncStorage.getItem(
        'tightnessTests'
      )

    if (!storedTests) return

    const parsed =
      JSON.parse(storedTests)

    const selectedJob =
      parsed[Number(id)]

    setJob(selectedJob)

  }

  if (!job) {

    return null

  }

  return (

    <SafeAreaView style={styles.container}>

      <ScrollView>

        <View style={styles.header}>

          <Text style={styles.title}>
            Job Detail
          </Text>

          <Text style={styles.subtitle}>
            Saved Workflow Record
          </Text>

        </View>

        <View style={styles.card}>

          <DetailRow
            label="Result"
            value={job.result}
          />

          <DetailRow
            label="Pressure"
            value={`${job.pressure} mbar`}
          />

          <DetailRow
            label="Gas Type"
            value={job.gasType}
          />

          <DetailRow
            label="Installation"
            value={job.installationType}
          />

          <DetailRow
            label="Guidance"
            value={job.guidance}
          />

          <DetailRow
            label="Timestamp"
            value={
              new Date(
                job.timestamp
              ).toLocaleString()
            }
          />

        </View>

      </ScrollView>

    </SafeAreaView>

  )
}

function DetailRow({
  label,
  value
}: any) {

  return (

    <View style={styles.row}>

      <Text style={styles.label}>
        {label}
      </Text>

      <Text style={styles.value}>
        {value}
      </Text>

    </View>

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
    borderRadius: 24,
    padding: 24
  },

  row: {
    marginBottom: 20
  },

  label: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 6
  },

  value: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827'
  }

})