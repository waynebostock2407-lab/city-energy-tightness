import React from 'react'

import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native'

type Props = {
  label: string
  value: boolean | null
  onChange: (value: boolean) => void
}

export default function QuestionToggle({
  label,
  value,
  onChange
}: Props) {

  return (

    <>

      <Text style={styles.label}>
        {label}
      </Text>

      <View style={styles.container}>

        <TouchableOpacity
          style={[
            styles.button,
            value === true &&
            styles.selected
          ]}
          onPress={() =>
            onChange(true)
          }
        >

          <Text
            style={[
              styles.buttonText,
              value === true &&
              styles.selectedText
            ]}
          >
            YES
          </Text>

        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            value === false &&
            styles.selected
          ]}
          onPress={() =>
            onChange(false)
          }
        >

          <Text
            style={[
              styles.buttonText,
              value === false &&
              styles.selectedText
            ]}
          >
            NO
          </Text>

        </TouchableOpacity>

      </View>

    </>

  )
}

const styles = StyleSheet.create({

  label: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12
  },

  container: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 30
  },

  button: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16
  },

  selected: {
    backgroundColor: '#7fb343'
  },

  buttonText: {
    color: '#111827',
    fontWeight: '700'
  },

  selectedText: {
    color: '#ffffff'
  }

})