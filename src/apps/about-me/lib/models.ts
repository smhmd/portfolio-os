import type { ThreeElements } from '@react-three/fiber'

import { HALF_PI, PI, THREE_QUARTER_PI } from 'src/lib/math'

export type ModelProps = ThreeElements['group'] & {
  path: string
  'rotation-y'?: number
}
export type ModelEntry = ModelProps & { key: string }

export const MODELS: ModelEntry[] = [
  {
    key: 'desk-chair',
    path: 'https://catalog-processed-eu.storage.home-design.ikea.com/2025/07/G-80532924-7b9b96b9d7d0822ee24e7e629b3672ca24798232-simple.glb',
    position: [-3.5272, 0, 1.4937],
    'rotation-y': -1.5708,
  },
  {
    key: 'coffee-table',
    path: 'https://catalog-processed-eu.storage.home-design.ikea.com/2025/04/G-20586552-8ae69729149e4b80ebe330d37977b8439d6da749-simple+draco.glb',
    position: [-0.7618, 0, 0.3868],
  },
  {
    key: 'painting',
    path: 'https://catalog-processed-eu.storage.home-design.ikea.com/2025/06/G-80601917-9daf49bf21c4d49e53457a7851e5d79d01926f7d-simple.glb',
    position: [-1.5478, 1.1398, 4.4452],
    'rotation-y': PI,
  },
  {
    key: 'desk-lamp',
    path: 'https://catalog-processed-eu.storage.home-design.ikea.com/2023/04/G-90510894-d3c828236083632c5788e602f7af90948e73be5f-simple+draco.glb',
    position: [-4.3574, 0.8416, 0.9521],
    'rotation-y': 1.5708,
  },
  {
    key: 'chair-mat',
    path: 'https://catalog-processed-eu.storage.home-design.ikea.com/2022/07/G-80507793-912689bf72281b003a1c54bee1a2ab0f1b79f51a-simple+draco.glb',
    position: [-3.5844, 0, 1.5128],
    'rotation-y': 1.5708,
  },
  {
    key: 'plant-medium',
    path: 'https://catalog-processed-eu.storage.home-design.ikea.com/2022/06/G-40395288-0695b42d39cf4733c3bbd8723af57964f71045e7-simple+draco.glb',
    position: [0.48, 0.538, 1.34],
    'rotation-y': -1.5681,
  },
  {
    key: 'side-table',
    path: 'https://catalog-processed-eu.storage.home-design.ikea.com/2025/04/G-60590415-80a3b075cefca2bde80c37b4be042290b9d02fb0-simple+draco.glb',
    position: [0.5, 0, 1.3],
    'rotation-y': 0.0163,
  },
  {
    key: 'plant-tall',
    path: 'https://catalog-processed-eu.storage.home-design.ikea.com/2026/03/G-60610606-a3d923f78b727565155fc8d7d726359385acf61b-simple+draco.glb',
    position: [0.9507, 0, -1.167],
    'rotation-y': PI,
  },
  {
    key: 'desk',
    path: 'https://catalog-processed-eu.storage.home-design.ikea.com/2025/11/G-30553240-e96be421e239481cb78a5c8c96c981c2a375783b-simple+draco.glb',
    position: [-4.1333, 0, 1.4185],
    'rotation-y': 1.5708,
  },
  {
    key: 'rug',
    path: 'https://catalog-processed-eu.storage.home-design.ikea.com/2025/03/G-60497078-09aa1c2c21e8bc2a98371817972e42c158bd6180-simple+draco.glb',
    position: [0.06, 0, 0.9],
    scale: 1.6,
  },
  {
    key: 'sideboard',
    path: 'https://catalog-processed-eu.storage.home-design.ikea.com/2025/05/G-10586604-8a80d264a3e2c33d36ac4697e0c5959889e30c76-simple+draco.glb',
    position: [-1.5178, 0, 4.1374],
    'rotation-y': PI,
  },
  {
    key: 'slippers',
    path: 'https://catalog-processed-eu.storage.home-design.ikea.com/2025/10/G-80512983-a791930349ec6bbd957cca7a597c5f27e109104a-simple+draco.glb',
    position: [-0.4501, 0, -1.454],
  },
  {
    key: 'suitcase',
    path: 'https://catalog-processed-eu.storage.home-design.ikea.com/2025/09/G-30603216-74504ab6bac2eecbf11301a8442e206a1d470e0f-simple+draco.glb',
    position: [1.0078, 0, 3.6255],
    'rotation-y': -1.5708,
  },
  {
    key: 'travel-mug',
    path: 'https://catalog-processed-eu.storage.home-design.ikea.com/2022/12/G-80511525-e8774bd46604218a7aebf7d76516b527f9780477-simple+draco.glb',
    position: [-3.9433, 0.7435, 0.9435],
    'rotation-y': 1.5708,
  },
  {
    key: 'sofa',
    path: 'https://catalog-processed-eu.storage.home-design.ikea.com/2024/06/G-99418612-71e22c00cfbd2d552576a074183e93cd2d90e6cf-simple+draco.glb',
    position: [0.5519, 0, 0.1942],
    'rotation-y': -1.5708,
  },
  {
    key: 'standing-mirror',
    path: 'https://catalog-processed-eu.storage.home-design.ikea.com/2021/05/G-30298396-504aaecfd6d78a99825ac034ede03ee5de892276-simple+draco.glb',
    position: [-4.0315, 0, 4.0482],
    'rotation-y': THREE_QUARTER_PI,
  },
  {
    key: 'trashcan',
    path: 'https://catalog-processed-eu.storage.home-design.ikea.com/2021/01/G-70493013-48bc834afaff947848aec9252f7b09acd7c4c899-simple.glb',
    position: [-4.3677, 0, 0.3099],
    'rotation-y': 1.5708,
  },
  {
    key: 'piano-stool',
    path: 'https://catalog-processed-eu.storage.home-design.ikea.com/2020/12/G-50363649-144345aba727d7176e7ef477e3808ca833568523-simple.glb',
    position: [-3.7179, 0, -0.55],
    'rotation-y': -1.5708,
  },
  {
    key: 'piano',
    path: '/models/piano.glb',
    position: [-4.2, 0, -0.6],
    'rotation-y': HALF_PI,
  },
  {
    key: 'rack',
    path: '/models/rack.glb',
    position: [1, 0, 3.8],
    // 'rotation-y': -HALF_PI,
    scale: 1.1,
  },
]
