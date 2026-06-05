import React, {
  useEffect,
  useState
} from 'react'

import {
  Image,
  RefreshControl,
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

import {
  router
} from 'expo-router'

import {
  ClipboardCheck,
  Clock3,
  FolderOpen,
  Workflow
} from 'lucide-react-native'

export default function HomeScreen() {

  const [
    assessments,
    setAssessments
  ] = useState<any[]>([])

  const [
    refreshing,
    setRefreshing
  ] = useState(false)

  useEffect(() => {

    loadAssessments()

  }, [])

  async function loadAssessments() {

    const stored =
      await AsyncStorage.getItem(
        'assessments'
      )

    if (stored) {

      setAssessments(
        JSON.parse(stored)
      )

    }

  }

  async function refreshDashboard() {

    setRefreshing(true)

    await loadAssessments()

    setRefreshing(false)

  }

  return (

    <SafeAreaView style={styles.container}>

      <ScrollView

        showsVerticalScrollIndicator={false}

        refreshControl={

          <RefreshControl

            refreshing={refreshing}

            onRefresh={refreshDashboard}

            tintColor="#0f1720"

          />

        }

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

        <View style={styles.headerAccent} />

        <View style={styles.card}>

          <View style={styles.sectionHeader}>

  <Workflow
    size={22}
    color="#7fb343"
    style={{ marginRight: 10 }}
  />

  <Text style={styles.sectionTitle}>
    Quick Actions
  </Text>

</View>

        <View style={styles.quickActionsContainer}>

  <TouchableOpacity
    style={styles.actionCard}
    onPress={() =>
      router.push('/edition4-check')
    }
  >

    <ClipboardCheck
      size={46}
      color="#84cc16"
      strokeWidth={1.8}
    />

    <Text style={styles.actionCardText}>
      New Assessment
    </Text>

  </TouchableOpacity>

  <TouchableOpacity
    style={styles.actionCard}
    onPress={() =>
      router.push('/saved-assessments')
    }
  >

    <FolderOpen
      size={46}
      color="#84cc16"
      strokeWidth={1.8}
    />

    <Text style={styles.actionCardText}>
      Saved Assessments
    </Text>

  </TouchableOpacity>

</View>  

        </View>

        <View style={styles.card}>

          <View style={styles.sectionHeader}>

            <Clock3
              size={22}
              color="#7fb343"
              style={{ marginRight: 10 }}
            />

            <Text style={styles.sectionTitle}>
              Recent Assessments
            </Text>

          </View>

          {assessments
            .slice(0, 3)
            .map((assessment, index) => (

            <TouchableOpacity
              key={index}
              style={styles.recentCard}
              onPress={() =>

                router.push(

                  `/assessment-details?index=${index}`

                )

              }
            >

              <View>

                <Text style={styles.recentProperty}>
                  {assessment.propertyReference}
                </Text>

                <Text style={styles.recentPostcode}>
                  {assessment.postcode}
                </Text>

              </View>

              <View style={styles.resultBadge}>

                <View
                  style={[

                    styles.resultDot,

                    assessment.result === 'FAIL'

                      ? styles.failDot

                      : assessment.result === 'RETEST REQUIRED'

                        ? styles.retestDot

                        : styles.passDot

                  ]}
                />

                <Text
                  style={[

                    styles.recentResult,

                    assessment.result === 'FAIL'

                      ? styles.failText

                      : assessment.result ===
                        'RETEST REQUIRED'

                        ? styles.retestText

                        : styles.passText

                  ]}
                >

                  {assessment.result}

                </Text>

              </View>

            </TouchableOpacity>

          ))}

          {assessments.length === 0 && (

            <Text style={styles.emptyText}>
              No assessments saved yet.
            </Text>

          )}

        </View>

        <View style={styles.footer}>

          <Text style={styles.footerText}>
            IV Assist by Laver Group
          </Text>

          <Text style={styles.footerSubtext}>
            Installation Volume & Tightness Workflow
          </Text>

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

  paddingTop: 0,

  paddingBottom: 0,

  paddingHorizontal: 0,

  marginBottom: -75,

  overflow: 'hidden'

},

  card: {

    backgroundColor: '#151f2b',

    borderWidth: 1,

    borderColor: 'rgba(255,255,255,0.06)',

    marginHorizontal: 18,

    marginBottom: 20,

    borderRadius: 28,

    padding: 22,

    shadowColor: '#000',

    shadowOpacity: 0.06,

    shadowRadius: 16,

    shadowOffset: {
      width: 0,
      height: 4
    },

    elevation: 3

  },

  quickActionsContainer: {

  flexDirection: 'row',

  gap: 16

},

actionCard: {

  flex: 1,

  backgroundColor: '#162133',

  borderWidth: 1,

  borderColor: 'rgba(255,255,255,0.05)',

  borderRadius: 26,

  paddingVertical: 28,

  alignItems: 'center',

  justifyContent: 'center',

  shadowColor: '#000',

  shadowOpacity: 0.14,

  shadowRadius: 14,

  shadowOffset: {
    width: 0,
    height: 4
  },

  elevation: 5

},

actionCardText: {

  marginTop: 18,

  fontSize: 16,

  fontWeight: '700',

  color: '#ffffff',

  textAlign: 'center'

},

  sectionHeader: {

    flexDirection: 'row',

    alignItems: 'center',

    marginBottom: 20

  },

  sectionTitle: {

    fontSize: 20,

    fontWeight: '800',

    color: '#ffffff',

    letterSpacing: -0.3

  },

  recentCard: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

    backgroundColor: '#1e293b',

    borderRadius: 22,

    padding: 18,

    marginBottom: 16,

    borderWidth: 1,

    borderColor: '#e5e7eb'

  },

  recentProperty: {

    fontSize: 16,

    fontWeight: '700',

    color: '#ffffff'

  },

  recentPostcode: {

    marginTop: 4,

    fontSize: 14,

    color: '#9ca3af'

  },

  resultBadge: {

    flexDirection: 'row',

    alignItems: 'center',

    backgroundColor: '#111827',

    paddingHorizontal: 14,

    paddingVertical: 10,

    borderRadius: 999

  },

  resultDot: {

    width: 10,

    height: 10,

    borderRadius: 5,

    marginRight: 10

  },

  passDot: {
    backgroundColor: '#16a34a'
  },

  retestDot: {
    backgroundColor: '#d97706'
  },

  failDot: {
    backgroundColor: '#dc2626'
  },

  recentResult: {

    fontSize: 14,

    fontWeight: '900',

    letterSpacing: 0.4

  },

  passText: {
    color: '#16a34a'
  },

  failText: {
    color: '#dc2626'
  },

  retestText: {
    color: '#d97706'
  },

  emptyText: {

    fontSize: 15,

    color: '#6b7280',

    textAlign: 'center'

  },

  footer: {

    alignItems: 'center',

    paddingVertical: 40

  },

  footerText: {

    fontSize: 16,

    fontWeight: '700',

    color: '#ffffff'

  },

  footerSubtext: {

    marginTop: 8,

    fontSize: 13,

    color: '#6b7280'

  },

  headerAccent: {

  width: 80,

  height: 4,

  borderRadius: 2,

  backgroundColor: '#0f1720',

  marginTop: 18

},

brandHeader: {

  width: '112%',

  height: 260,

  alignSelf: 'center',

  marginLeft: -12

},



})