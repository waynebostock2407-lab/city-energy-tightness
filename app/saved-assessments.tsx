import React, {
  useEffect,
  useState
} from 'react'

import {
  FlatList,
  RefreshControl,
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
  ChevronRight,
  Clock3,
  FolderOpen,
  Home,
  Search,
} from 'lucide-react-native'

export default function SavedAssessments() {

  const [
    assessments,
    setAssessments
  ] = useState<any[]>([])

  const [
    filteredAssessments,
    setFilteredAssessments
  ] = useState<any[]>([])

  const [
    search,
    setSearch
  ] = useState('')

  const [
    refreshing,
    setRefreshing
  ] = useState(false)

  useEffect(() => {

    loadAssessments()

  }, [])

  useEffect(() => {

    const filtered = assessments.filter(

      assessment =>

        assessment.propertyReference
          ?.toLowerCase()
          .includes(search.toLowerCase())

        ||

        assessment.postcode
          ?.toLowerCase()
          .includes(search.toLowerCase())

    )

    setFilteredAssessments(filtered)

  }, [search, assessments])

  async function loadAssessments() {

    const stored =
      await AsyncStorage.getItem(
        'assessments'
      )

    if (stored) {

      const parsed =
        JSON.parse(stored)

      setAssessments(parsed)

      setFilteredAssessments(parsed)

    }

  }

  async function refreshAssessments() {

    setRefreshing(true)

    await loadAssessments()

    setRefreshing(false)

  }

  function formatDate(timestamp: string) {

    return new Date(timestamp)
      .toLocaleDateString(
        'en-GB',
        {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }
      )

  }

  return (

    <SafeAreaView style={styles.container}>

      <View style={styles.header}>

  <View style={styles.headerRow}>

    <FolderOpen
      size={30}
      color="#ffffff"
      style={{ marginRight: 12 }}
    />

    <View>

      <Text style={styles.title}>
        Saved Assessments
      </Text>

      <Text style={styles.subtitle}>
        Previous tightness test records
      </Text>

    </View>

  </View>

  <TouchableOpacity
    style={styles.homeButton}
    onPress={() => router.replace('/')}
  >

    <Home
      size={18}
      color="#111827"
      style={{ marginRight: 6 }}
    />

    <Text style={styles.homeButtonText}>
      Home
    </Text>

  </TouchableOpacity>

</View>

      <View style={styles.searchContainer}>

        <Search
          size={20}
          color="#6b7280"
          style={{ marginRight: 10 }}
        />

        <TextInput
          placeholder="Search by property or postcode"
          placeholderTextColor="#9ca3af"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />

      </View>

      <FlatList

        data={filteredAssessments}

        keyExtractor={(_, index) =>
          index.toString()
        }

        contentContainerStyle={{
          paddingHorizontal: 18,
          paddingBottom: 40
        }}

        refreshControl={

          <RefreshControl

            refreshing={refreshing}

            onRefresh={refreshAssessments}

            tintColor="#7fb343"

          />

        }

        renderItem={({ item, index }) => (

          <TouchableOpacity

            style={styles.assessmentCard}

            onPress={() =>

              router.push(

                `/assessment-details?index=${index}`

              )

            }
          >

            <View style={styles.cardTop}>

              <View>

                <Text style={styles.property}>
                  {item.propertyReference}
                </Text>

                <Text style={styles.postcode}>
                  {item.postcode}
                </Text>

              </View>

              <ChevronRight
                size={22}
                color="#9ca3af"
              />

            </View>

            <View style={styles.cardBottom}>

              <View style={styles.dateRow}>

                <Clock3
                  size={16}
                  color="#6b7280"
                  style={{ marginRight: 6 }}
                />

                <Text style={styles.dateText}>
                  {formatDate(item.timestamp)}
                </Text>

              </View>

              <View style={styles.resultBadge}>

                <View
                  style={[

                    styles.resultDot,

                    item.result === 'FAIL'

                      ? styles.failDot

                      : item.result === 'RETEST REQUIRED'

                        ? styles.retestDot

                        : styles.passDot

                  ]}
                />

                <Text
                  style={[

                    styles.resultText,

                    item.result === 'FAIL'

                      ? styles.failText

                      : item.result === 'RETEST REQUIRED'

                        ? styles.retestText

                        : styles.passText

                  ]}
                >

                  {item.result}

                </Text>

              </View>

            </View>

          </TouchableOpacity>

        )}

        ListEmptyComponent={

          <View style={styles.emptyContainer}>

            <FolderOpen
              size={44}
              color="#9ca3af"
            />

            <Text style={styles.emptyTitle}>
              No Saved Assessments
            </Text>

            <Text style={styles.emptySubtitle}>
              Completed assessments will appear here.
            </Text>

          </View>

        }

      />

    </SafeAreaView>

  )

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#f3f6f4'
  },

  header: {

    backgroundColor: '#7fb343',

    paddingTop: 56,

    paddingBottom: 34,

    paddingHorizontal: 24,

    borderBottomLeftRadius: 36,

    borderBottomRightRadius: 36,

    marginBottom: 24,

    shadowColor: '#7fb343',

    shadowOpacity: 0.18,

    shadowRadius: 12,

    shadowOffset: {
      width: 0,
      height: 6
    },

    elevation: 6

  },

  headerRow: {

    flexDirection: 'row',

    alignItems: 'center'

  },

  title: {

    fontSize: 30,

    fontWeight: '900',

    color: '#ffffff',

    letterSpacing: -1

  },

  subtitle: {

    marginTop: 4,

    fontSize: 15,

    color: '#ecfccb',

    fontWeight: '500'

  },

  searchContainer: {

    flexDirection: 'row',

    alignItems: 'center',

    backgroundColor: '#ffffff',

    marginHorizontal: 18,

    marginBottom: 20,

    borderRadius: 22,

    paddingHorizontal: 18,

    paddingVertical: 16,

    borderWidth: 1,

    borderColor: '#e5e7eb'

  },

  searchInput: {

    flex: 1,

    fontSize: 16,

    color: '#111827'

  },

  assessmentCard: {

    backgroundColor: '#ffffff',

    borderRadius: 26,

    padding: 22,

    marginBottom: 18,

    shadowColor: '#000',

    shadowOpacity: 0.05,

    shadowRadius: 12,

    shadowOffset: {
      width: 0,
      height: 4
    },

    elevation: 3

  },

  cardTop: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

    marginBottom: 18

  },

  property: {

    fontSize: 18,

    fontWeight: '800',

    color: '#111827'

  },

  postcode: {

    marginTop: 6,

    fontSize: 14,

    color: '#6b7280'

  },

  cardBottom: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center'

  },

  dateRow: {

    flexDirection: 'row',

    alignItems: 'center'

  },

  dateText: {

    fontSize: 14,

    color: '#6b7280',

    fontWeight: '500'

  },

  resultBadge: {

    flexDirection: 'row',

    alignItems: 'center',

    backgroundColor: '#f9fafb',

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

  resultText: {

    fontSize: 13,

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

  emptyContainer: {

    alignItems: 'center',

    marginTop: 80

  },

  emptyTitle: {

    marginTop: 20,

    fontSize: 20,

    fontWeight: '800',

    color: '#111827'

  },

  emptySubtitle: {

    marginTop: 8,

    fontSize: 15,

    color: '#6b7280'

  },

  headerTopRow: {

  flexDirection: 'row',

  justifyContent: 'space-between',

  alignItems: 'center'

},

homeButton: {

  flexDirection: 'row',

  alignSelf: 'flex-end',

  alignItems: 'center',

  backgroundColor: '#ffffff',

  paddingHorizontal: 14,

  height: 42,

  borderRadius: 21,

  marginTop: 16

},

homeButtonText: {

  color: '#111827',

  fontSize: 14,

  fontWeight: '700'

},

})