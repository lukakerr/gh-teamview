import { lanesSaga } from 'sagas/lanes';
import { statsSaga } from 'sagas/stats';

const sagas = [
  lanesSaga,
  statsSaga,
];

export default sagas;
