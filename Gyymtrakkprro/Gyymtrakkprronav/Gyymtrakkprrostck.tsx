import {createStackNavigator} from '@react-navigation/stack';

import Gyymtrakkprroloadr from '../Gyymtrakkprrocpnt/Gyymtrakkprroloadr.tsx';

import Gyymtrakkprroonb from '../Gyymtrakkprroscreens/Gyymtrakkprroonb.tsx';
import Gyymtrakkprrotabs from '../../Gyymtrakkprrotabs.tsx';

const Stack = createStackNavigator();

const Gyymtrakkprrostck = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Gyymtrakkprroloadr" component={Gyymtrakkprroloadr} />
      <Stack.Screen name="Gyymtrakkprroonb" component={Gyymtrakkprroonb} />
      <Stack.Screen name="Gyymtrakkprrotabs" component={Gyymtrakkprrotabs} />
    </Stack.Navigator>
  );
};

export default Gyymtrakkprrostck;
