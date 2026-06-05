export const pipeVolumes = {

  '8': 0.00005,

  '10': 0.00008,

  '12': 0.00012,

  '15': 0.00018,

  '22': 0.00039,

  '28': 0.00065,

  '35': 0.00105,

  '42': 0.00155,

  '54': 0.00260

}

export function calculateIV(

  diameter: string,

  length: number

) {

  const volumePerMetre =
    pipeVolumes[
      diameter as keyof typeof pipeVolumes
    ]

  if (!volumePerMetre) {

    return 0

  }

  return (
    volumePerMetre * length
  )

}
