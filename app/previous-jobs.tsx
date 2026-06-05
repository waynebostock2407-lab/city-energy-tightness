import { Link } from 'expo-router'

import React, {
  useEffect,
  useState
} from 'react'

import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'

import {
  SafeAreaView
} from 'react-native-safe-area-context'

import AsyncStorage from '@react-native-async-storage/async-storage'

export default function PreviousJobs() {

  const [tests, setTests] =
    useState<any[]>([])

  useEffect(() => {

    loadTests()

  }, [])

  async function loadTests() {

    const storedTests =
      await AsyncStorage.getItem(
        'tightnessTests'
      )

    if (storedTests) {

      setTests(
        JSON.parse(storedTests)
      )

    }

  }

  return (

    <SafeAreaView style={styles.container}>

      <ScrollView>

        <View style={styles.header}>

          <Text style={styles.title}>
            Previous Jobs
          </Text>

          <Text style={styles.subtitle}>
            Saved Tightness Tests
          </Text>

        </View>

        {tests.map((test, index) => (

          <Link
  href={{
    pathname: '/jobs/[id]',
    params: {
      id: String(index)
    }
  }}
  asChild
  key={index}
>

  <TouchableOpacity style={styles.card}>

            <View style={styles.row}>

              <Text style={styles.label}>
                Result
              </Text>

              <Text
                style={[
                  styles.result,

                  test.result === 'PASS'
                    ? styles.pass
                    : test.result === 'INVESTIGATE'
                    ? styles.investigate
                    : styles.fail
                ]}
              >
                {test.result}
              </Text>

            </View>

            <View style={styles.row}>

              <Text style={styles.label}>
                Pressure
              </Text>

              <Text style={styles.value}>
                {test.pressure} mbar
              </Text>

            </View>

            <View style={styles.row}>

              <Text style={styles.label}>
                Gas
              </Text>

              <Text style={styles.value}>
                {test.gasType}
              </Text>

            </View>

            <View style={styles.row}>

              <Text style={styles.label}>
                Workflow
              </Text>

              <Text style={styles.value}>
                {test.installationType}
              </Text>

            </View>

            <Text style={styles.timestamp}>
              {new Date(
                test.timestamp
              ).toLocaleString()}
            </Text>

          </TouchableOpacity>

          </Link>

        ))}

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
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 24,
    padding: 24
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16
  },

  label: {
    fontSize: 16,
    color: '#6b7280'
  },

  value: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827'
  },

  result: {
    fontSize: 18,
    fontWeight: '800'
  },

  pass: {
    color: '#16a34a'
  },

  investigate: {
    color: '#f59e0b'
  },

  fail: {
    color: '#dc2626'
  },

  timestamp: {
    marginTop: 10,
    color: '#9ca3af',
    fontSize: 14
  }

})