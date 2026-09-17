export type Edition4Result = {
  result: string
  actions: string[]
  allowableDrop: number
  bandMin: number
  bandMax: number
  requiresRetest: boolean
}

type RuleBand = {
  minIV: number
  maxIV: number
  allowableDrop: number
}

export const edition4Matrix = {
  NG: [
    {
      minIV: 0,
      maxIV: 0.005,
      allowableDrop: 8
    },
    {
      minIV: 0.005,
      maxIV: 0.010,
      allowableDrop: 4
    },
    {
      minIV: 0.010,
      maxIV: 0.015,
      allowableDrop: 2.5
    },
    {
      minIV: 0.015,
      maxIV: 0.035,
      allowableDrop: 1
    }
  ]
}

export function evaluateEdition4(
  iv: number,
  pressureDrop: number,
  appliancesConnected: boolean,
  gaugeType: string
): Edition4Result {

  const perceptibleMovement =
    gaugeType === 'Electronic'
      ? 0.2
      : 0.25

  /*
   * NO DROP / NO PERCEPTIBLE MOVEMENT
   *
   * Pipework-only branch:
   * Re-instate appliances -> Tightness Test ->
   * Apply LDF to all isolation valves.
   */
  if (pressureDrop <= perceptibleMovement) {

    if (!appliancesConnected) {
      return {
        result: 'PASS',
        allowableDrop: 0,
        bandMin: 0,
        bandMax: 0,
        requiresRetest: false,
        actions: [
          'No pressure drop detected on pipework-only test',
          'Re-instate appliances',
          'Carry out final tightness test',
          'Apply LDF to all isolation valves'
        ]
      }
    }

    return {
      result: 'PASS',
      allowableDrop: 0,
      bandMin: 0,
      bandMax: 0,
      requiresRetest: false,
      actions: [
        'No perceptible movement detected',
        'Installation considered gas tight'
      ]
    }
  }

  /*
   * PIPEWORK-ONLY TEST
   *
   * Any perceptible movement is a failure.
   * The supplied flow chart directs the engineer to:
   * CAP OFF INSTALLATION.
   */
  if (!appliancesConnected) {
    return {
      result: 'FAIL',
      allowableDrop: 0,
      bandMin: 0,
      bandMax: 0,
      requiresRetest: false,
      actions: [
        'Pressure drop detected on pipework-only test',
        'Cap off installation',
        'Do not reinstate appliances'
      ]
    }
  }

  const matchingBand =
    edition4Matrix.NG.find(
      band =>
        iv > band.minIV &&
        iv <= band.maxIV
    )

  if (!matchingBand) {
    return {
      result: 'FAIL',
      allowableDrop: 0,
      bandMin: 0,
      bandMax: 0,
      requiresRetest: false,
      actions: [
        'Installation Volume outside supported range',
        'Cap off installation'
      ]
    }
  }

  /*
   * POST-EXCHANGE / EXISTING-APPLIANCE TEST
   *
   * DROP within the permissible IV-based limit:
   * isolate all appliances and repeat the test on pipework only.
   */
  if (
    pressureDrop <=
    matchingBand.allowableDrop
  ) {
    return {
      result: 'RETEST REQUIRED',
      allowableDrop:
        matchingBand.allowableDrop,
      bandMin:
        matchingBand.minIV,
      bandMax:
        matchingBand.maxIV,
      requiresRetest: true,
      actions: [
        'Pressure movement within permissible limits',
        'Isolate all appliances',
        'Repeat the tightness test on pipework only'
      ]
    }
  }

  /*
   * DROP outside the permissible IV-based limit:
   * the supplied flow chart directs the engineer to:
   * CAP OFF INSTALLATION.
   */
  return {
    result: 'FAIL',
    allowableDrop:
      matchingBand.allowableDrop,
    bandMin:
      matchingBand.minIV,
    bandMax:
      matchingBand.maxIV,
    requiresRetest: false,
    actions: [
      'Pressure drop exceeds permissible limits',
      'Cap off installation'
    ]
  }
}