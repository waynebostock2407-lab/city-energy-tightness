export function evaluateTightnessTest(
  pressure: number,
  ecvClosed: boolean | null,
letByObserved: boolean | null
) {

  if (ecvClosed === false) {

    if (letByObserved === true) {

  return {
    result: 'INVESTIGATE',
    guidance:
      'Potential let-by condition detected. Appliance isolation and further investigation may be required.'
  }
}

    return {
      result: 'FAIL',
      guidance:
        'ECV must be confirmed closed before testing can proceed.'
    }
  }

  if (pressure >= 19) {

    return {
      result: 'PASS',
      guidance:
        'No uncontrolled gas escape detected. Proceed with commissioning.'
    }
  }

  if (pressure >= 15) {

    return {
      result: 'INVESTIGATE',
      guidance:
        'Pressure lower than expected. Recheck installation pipework and meter connections.'
    }
  }

  return {
    result: 'FAIL',
    guidance:
      'Unsafe pressure condition detected. Do not proceed until installation integrity has been verified.'
  }
}