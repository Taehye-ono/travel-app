import Planner from './planner';
import places from '../britroute_places.json';

export default function Home() {
  return <Planner places={places} />;
}
