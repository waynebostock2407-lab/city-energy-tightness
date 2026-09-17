import React from 'react'

import {
  Calculator,
  ClipboardCheck,
  Gauge,
  ChevronRight,
  ArrowLeft
} from 'lucide-react-native'

import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'

import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'

export default function NewTest() {

  return (
    <SafeAreaView style={styles.container}>

      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={22} color="#ffffff" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>

          <Image
            source={require('../assets/images/IVAssistHeader.png')}
            style={styles.brandHeader}
            resizeMode="cover"
          />
        </View>

        <View style={styles.content}>

          <Text style={styles.title}>New Test</Text>
          <Text style={styles.subtitle}>
            Select what you need to do
          </Text>

          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => router.push('/edition4-check')}
            activeOpacity={0.85}
          >
            <View style={styles.iconBox}>
              <ClipboardCheck size={34} color="#84cc16" strokeWidth={1.8} />
            </View>

            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>Meter Exchange</Text>
              <Text style={styles.optionDescription}>
                Guided Edition 4 workflow for a meter exchange
              </Text>
            </View>

            <ChevronRight size={24} color="#7fb343" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => router.push('/tightness-test')}
            activeOpacity={0.85}
          >
            <View style={styles.iconBox}>
              <Gauge size={34} color="#84cc16" strokeWidth={1.8} />
            </View>

            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>Tightness Test</Text>
              <Text style={styles.optionDescription}>
                Assess pressure drop against the applicable Edition 4 limits
              </Text>
            </View>

            <ChevronRight size={24} color="#7fb343" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => router.push('/iv-calculator')}
            activeOpacity={0.85}
          >
            <View style={styles.iconBox}>
              <Calculator size={34} color="#84cc16" strokeWidth={1.8} />
            </View>

            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>Calculator</Text>
              <Text style={styles.optionDescription}>
                Calculate Installation Volume and Purge Volume
              </Text>
            </View>

            <ChevronRight size={24} color="#7fb343" />
          </TouchableOpacity>

        </View>

      </ScrollView>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827'
  },

  header: {
    backgroundColor: '#0f1720',
    paddingBottom: 0,
    overflow: 'hidden'
  },

  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4
  },

  backText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600'
  },

  brandHeader: {
    width: '100%',
    height: 145
  },

  content: {
    padding: 22,
    paddingBottom: 80
  },

  title: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 6
  },

  subtitle: {
    color: '#9ca3af',
    fontSize: 16,
    marginBottom: 24
  },

  optionCard: {
    backgroundColor: '#151f2b',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center'
  },

  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: 'rgba(127,179,67,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16
  },

  optionText: {
    flex: 1,
    paddingRight: 12
  },

  optionTitle: {
    color: '#ffffff',
    fontSize: 19,
    fontWeight: '800',
    marginBottom: 5
  },

  optionDescription: {
    color: '#9ca3af',
    fontSize: 14,
    lineHeight: 20
  }
})
