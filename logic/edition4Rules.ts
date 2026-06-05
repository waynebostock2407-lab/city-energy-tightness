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

  const effectiveDrop =

  pressureDrop -
  perceptibleMovement

  // PASS — No perceptible movement

if (

  pressureDrop <=
  perceptibleMovement

) {

  return {

    result: 'PASS',

    allowableDrop: 0,

    bandMin: 0,

    bandMax: 0,

    requiresRetest: false,

    actions: [

      'No perceptible movement detected',

      'Installation considered gas tight',

      'Reconnect test point',

      'Test disturbed joints with LDF',

      'Confirm no smell of gas'

    ]

  }

}

  // FAIL — Pipework only should have no movement

  if (

    !appliancesConnected &&

    pressureDrop >
    perceptibleMovement

  ) {

    return {

      result: 'FAIL',

      allowableDrop: 0,

      bandMin: 0,

      bandMax: 0,

      requiresRetest: false,

      actions: [

        'Pipework-only test failed',

        'Any permissible movement is unacceptable',

        'Trace and repair gas escape',

        'Do not reconnect installation until resolved'

      ]

    }

  }

  // Find matching IV band

  const matchingBand =

    edition4Matrix.NG.find(

      band =>

        iv > band.minIV &&

        iv <= band.maxIV

    )

  // No matching band

  if (!matchingBand) {

    return {

      result: 'FAIL',

      allowableDrop: 0,

      bandMin: 0,

      bandMax: 0,

      requiresRetest: false,

      actions: [

        'Installation Volume outside supported range',

        'Verify IV calculation manually'

      ]

    }

  }

    // PASS — Within permissible movement

  if (

    effectiveDrop <=
    matchingBand.allowableDrop

  ) {

    return {

      result: 'PASS',

      allowableDrop:
        matchingBand.allowableDrop,

      bandMin:
        matchingBand.minIV,

      bandMax:
        matchingBand.maxIV,

      requiresRetest: false,

      actions: [

        'Pressure movement within permissible limits',

        'Installation considered gas tight',

        'Reconnect test point',

        'Test disturbed joints with LDF',

        'Confirm no smell of gas'

      ]

    }

  }

  // FAIL — Exceeds permissible movement

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

  'Pressure movement exceeds permissible limits',

  'All appliances must now be isolated',

  'Repeat test on pipework only',

  'Maximum permissible movement is 0.25 mbar (Fluid) or 0.2 mbar (Electronic)',

  'If movement persists, trace and repair gas escape'

]

  }

}