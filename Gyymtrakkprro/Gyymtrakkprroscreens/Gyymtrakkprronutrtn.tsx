import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';

import React, {useState, useEffect, useCallback} from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from 'react-native';

interface NutrtnMeal {
  gyymtrakkrprronutrtnId: string;
  gyymtrakkrprronutrtnName: string;
  gyymtrakkrprronutrtnKcal: string;
  gyymtrakkrprronutrtnType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

interface NutrtnDay {
  gyymtrakkrprronutrtnMeals: NutrtnMeal[];
}

const GYYMTRAKKRPRRONUTRTN_KEY = 'gyymtrakkrprro_nutrition';
const GYYMTRAKKRPRROWRKOT_KEY = 'gyymtrakkrprro_workouts';
const GYYMTRAKKRPRRONUTRTN_WEEK_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const GYYMTRAKKRPRRONUTRTN_MEAL_TYPES: {
  id: NutrtnMeal['gyymtrakkrprronutrtnType'];
  label: string;
  emoji: string;
  color: string;
}[] = [
  {id: 'breakfast', label: 'Breakfast', emoji: '🌅', color: '#F5A623'},
  {id: 'lunch', label: 'Lunch', emoji: '☀️', color: '#2ECC71'},
  {id: 'dinner', label: 'Dinner', emoji: '🌙', color: '#9B59B6'},
  {id: 'snack', label: 'Snack', emoji: '🍎', color: '#E74C3C'},
];

const gyymtrakkrprronutrtnUid = () =>
  Math.random().toString(36).substring(2, 9);

const gyymtrakkrprronutrtnMakeKey = (daysAgo = 0): string => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    '0',
  )}-${String(d.getDate()).padStart(2, '0')}`;
};

const gyymtrakkrprronutrtnWeek7 = () => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push({
      letter: GYYMTRAKKRPRRONUTRTN_WEEK_LABELS[d.getDay()],
      num: d.getDate(),
      key: gyymtrakkrprronutrtnMakeKey(i),
      daysAgo: i,
    });
  }
  return days;
};

const gyymtrakkrprronutrtnDateTitle = (daysAgo: number): string => {
  if (daysAgo === 0) {
    return 'Today';
  }
  if (daysAgo === 1) {
    return 'Yesterday';
  }
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
};

const gyymtrakkrprronutrtnCalcStreak = (all: Record<string, any>): number => {
  let streak = 0;
  for (let i = 0; i <= 365; i++) {
    if (all[gyymtrakkrprronutrtnMakeKey(i)]?.gyymtrakkrprroExercises?.length) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }
  return streak;
};

const gyymtrakkrprronutrtnCalcWeek = (all: Record<string, any>): boolean[] => {
  const week: boolean[] = [];
  for (let i = 6; i >= 0; i--) {
    week.push(
      !!all[gyymtrakkrprronutrtnMakeKey(i)]?.gyymtrakkrprroExercises?.length,
    );
  }
  return week;
};

const Gyymtrakkprronutrtn = () => {
  const gyymtrakkrprronutrtnWeekDays = gyymtrakkrprronutrtnWeek7();

  const [gyymtrakkrprronutrtnView, setGyymtrakkrprronutrtnView] = useState<
    'main' | 'add'
  >('main');
  const [gyymtrakkrprronutrtnSelDay, setGyymtrakkrprronutrtnSelDay] =
    useState(6);
  const [gyymtrakkrprronutrtnAllData, setGyymtrakkrprronutrtnAllData] =
    useState<Record<string, NutrtnDay>>({});
  const [gyymtrakkrprronutrtnStreak, setGyymtrakkrprronutrtnStreak] =
    useState(0);
  const [gyymtrakkrprronutrtnWeekData, setGyymtrakkrprronutrtnWeekData] =
    useState<boolean[]>(Array(7).fill(false));

  const [gyymtrakkrprronutrtnFormType, setGyymtrakkrprronutrtnFormType] =
    useState<NutrtnMeal['gyymtrakkrprronutrtnType']>('breakfast');
  const [gyymtrakkrprronutrtnFormName, setGyymtrakkrprronutrtnFormName] =
    useState('');
  const [gyymtrakkrprronutrtnFormKcal, setGyymtrakkrprronutrtnFormKcal] =
    useState('0');
  const [gyymtrakkrprronutrtnEditingId, setGyymtrakkrprronutrtnEditingId] =
    useState<string | null>(null);

  const gyymtrakkrprronutrtnLoad = useCallback(async () => {
    try {
      const [rawNutr, rawWork] = await Promise.all([
        AsyncStorage.getItem(GYYMTRAKKRPRRONUTRTN_KEY),
        AsyncStorage.getItem(GYYMTRAKKRPRROWRKOT_KEY),
      ]);
      const nutr: Record<string, NutrtnDay> = rawNutr
        ? JSON.parse(rawNutr)
        : {};
      const work: Record<string, any> = rawWork ? JSON.parse(rawWork) : {};
      setGyymtrakkrprronutrtnAllData(nutr);
      setGyymtrakkrprronutrtnStreak(gyymtrakkrprronutrtnCalcStreak(work));
      setGyymtrakkrprronutrtnWeekData(gyymtrakkrprronutrtnCalcWeek(work));
    } catch (_) {}
  }, []);

  useEffect(() => {
    gyymtrakkrprronutrtnLoad();
  }, [gyymtrakkrprronutrtnLoad]);

  const gyymtrakkrprronutrtnSave = useCallback(
    async (dayKey: string, meals: NutrtnMeal[]) => {
      try {
        const raw = await AsyncStorage.getItem(GYYMTRAKKRPRRONUTRTN_KEY);
        const all: Record<string, NutrtnDay> = raw ? JSON.parse(raw) : {};
        all[dayKey] = {gyymtrakkrprronutrtnMeals: meals};
        await AsyncStorage.setItem(
          GYYMTRAKKRPRRONUTRTN_KEY,
          JSON.stringify(all),
        );
        setGyymtrakkrprronutrtnAllData({...all});
      } catch (_) {}
    },
    [],
  );

  const gyymtrakkrprronutrtnSelKey =
    gyymtrakkrprronutrtnWeekDays[gyymtrakkrprronutrtnSelDay].key;
  const gyymtrakkrprronutrtnSelDaysAgo =
    gyymtrakkrprronutrtnWeekDays[gyymtrakkrprronutrtnSelDay].daysAgo;
  const gyymtrakkrprronutrtnMeals: NutrtnMeal[] =
    gyymtrakkrprronutrtnAllData[gyymtrakkrprronutrtnSelKey]
      ?.gyymtrakkrprronutrtnMeals ?? [];

  const gyymtrakkrprronutrtnTotalKcal = gyymtrakkrprronutrtnMeals.reduce(
    (s, m) => s + (parseFloat(m.gyymtrakkrprronutrtnKcal) || 0),
    0,
  );
  const gyymtrakkrprronutrtnMealsOf = (
    type: NutrtnMeal['gyymtrakkrprronutrtnType'],
  ) =>
    gyymtrakkrprronutrtnMeals.filter(m => m.gyymtrakkrprronutrtnType === type);
  const gyymtrakkrprronutrtnKcalOf = (
    type: NutrtnMeal['gyymtrakkrprronutrtnType'],
  ) =>
    gyymtrakkrprronutrtnMealsOf(type).reduce(
      (s, m) => s + (parseFloat(m.gyymtrakkrprronutrtnKcal) || 0),
      0,
    );

  const gyymtrakkrprronutrtnFormKcalNorm = gyymtrakkrprronutrtnFormKcal
    .replace(',', '.')
    .replace(/[^\d.]/g, '')
    .replace(/(\..*)\./g, '$1')
    .trim();
  const gyymtrakkrprronutrtnFormKcalNum = parseFloat(
    gyymtrakkrprronutrtnFormKcalNorm,
  );
  const gyymtrakkrprronutrtnFormValid =
    gyymtrakkrprronutrtnFormName.trim().length > 0 &&
    gyymtrakkrprronutrtnFormKcalNorm.length > 0 &&
    !Number.isNaN(gyymtrakkrprronutrtnFormKcalNum) &&
    gyymtrakkrprronutrtnFormKcalNum >= 0;

  const gyymtrakkrprronutrtnOpenAdd = (
    defaultType: NutrtnMeal['gyymtrakkrprronutrtnType'] = 'breakfast',
  ) => {
    setGyymtrakkrprronutrtnEditingId(null);
    setGyymtrakkrprronutrtnFormType(defaultType);
    setGyymtrakkrprronutrtnFormName('');
    setGyymtrakkrprronutrtnFormKcal('0');
    setGyymtrakkrprronutrtnView('add');
  };

  const gyymtrakkrprronutrtnOpenEdit = (meal: NutrtnMeal) => {
    setGyymtrakkrprronutrtnEditingId(meal.gyymtrakkrprronutrtnId);
    setGyymtrakkrprronutrtnFormType(meal.gyymtrakkrprronutrtnType);
    setGyymtrakkrprronutrtnFormName(meal.gyymtrakkrprronutrtnName);
    setGyymtrakkrprronutrtnFormKcal(meal.gyymtrakkrprronutrtnKcal);
    setGyymtrakkrprronutrtnView('add');
  };

  const gyymtrakkrprronutrtnSubmit = () => {
    if (!gyymtrakkrprronutrtnFormValid) {
      return;
    }
    const gyymtrakkrprronutrtnKcalToSave =
      gyymtrakkrprronutrtnFormKcalNorm.length > 0
        ? gyymtrakkrprronutrtnFormKcalNorm
        : '0';
    let next: NutrtnMeal[];
    if (gyymtrakkrprronutrtnEditingId) {
      next = gyymtrakkrprronutrtnMeals.map(m =>
        m.gyymtrakkrprronutrtnId === gyymtrakkrprronutrtnEditingId
          ? {
              ...m,
              gyymtrakkrprronutrtnName: gyymtrakkrprronutrtnFormName.trim(),
              gyymtrakkrprronutrtnKcal: gyymtrakkrprronutrtnKcalToSave,
              gyymtrakkrprronutrtnType: gyymtrakkrprronutrtnFormType,
            }
          : m,
      );
    } else {
      next = [
        ...gyymtrakkrprronutrtnMeals,
        {
          gyymtrakkrprronutrtnId: gyymtrakkrprronutrtnUid(),
          gyymtrakkrprronutrtnName: gyymtrakkrprronutrtnFormName.trim(),
          gyymtrakkrprronutrtnKcal: gyymtrakkrprronutrtnKcalToSave,
          gyymtrakkrprronutrtnType: gyymtrakkrprronutrtnFormType,
        },
      ];
    }
    gyymtrakkrprronutrtnSave(gyymtrakkrprronutrtnSelKey, next);
    setGyymtrakkrprronutrtnView('main');
  };

  const gyymtrakkrprronutrtnDelete = (id: string) => {
    Alert.alert('Delete Meal', 'Are you sure?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () =>
          gyymtrakkrprronutrtnSave(
            gyymtrakkrprronutrtnSelKey,
            gyymtrakkrprronutrtnMeals.filter(
              m => m.gyymtrakkrprronutrtnId !== id,
            ),
          ),
      },
    ]);
  };

  const gyymtrakkrprronutrtnRenderHeader = () => (
    <View style={styles.gyymtrakkrprronutrtnHeader}>
      <View style={styles.gyymtrakkrprronutrtnStreakBadge}>
        <Image
          source={require('../../assets/i/gyymtrakkpwfir.png')}
          style={styles.gyymtrakkrprronutrtnFireIcon}
        />
        <Text style={styles.gyymtrakkrprronutrtnStreakText}>
          {Math.max(1, gyymtrakkrprronutrtnStreak)} day streak
        </Text>
      </View>

      <View style={styles.gyymtrakkrprronutrtnWeekRow}>
        {gyymtrakkrprronutrtnWeek7().map((day, idx) => {
          const isToday = idx === 6;
          const hasDone = !!gyymtrakkrprronutrtnWeekData[idx] || isToday;
          return (
            <View key={idx} style={styles.gyymtrakkrprronutrtnWeekCell}>
              <Text style={styles.gyymtrakkrprronutrtnWeekLabel}>
                {day.letter}
              </Text>
              <View
                style={[
                  styles.gyymtrakkrprronutrtnWeekDot,
                  hasDone
                    ? styles.gyymtrakkrprronutrtnWeekDotDone
                    : isToday
                    ? styles.gyymtrakkrprronutrtnWeekDotToday
                    : styles.gyymtrakkrprronutrtnWeekDotMissed,
                ]}>
                {hasDone && (
                  <Text style={styles.gyymtrakkrprronutrtnWeekCheck}>✓</Text>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );

  if (gyymtrakkrprronutrtnView === 'add') {
    return (
      <LinearGradient
        colors={['rgb(35, 44, 115)', 'rgb(9, 11, 32)']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.gyymtrakkrprronutrtnRoot}>
        <KeyboardAvoidingView
          style={styles.gyymtrakkrprronutrtnFlex1}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView
            contentContainerStyle={styles.gyymtrakkrprronutrtnFormScroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            {gyymtrakkrprronutrtnRenderHeader()}

            <View style={styles.gyymtrakkrprronutrtnFormPad}>
              <View style={styles.gyymtrakkrprronutrtnFormTopBar}>
                <TouchableOpacity
                  onPress={() => setGyymtrakkrprronutrtnView('main')}
                  style={styles.gyymtrakkrprronutrtnBackBtn}>
                  <Image
                    source={require('../../assets/i/gyymtrakkpwback.png')}
                    style={styles.gyymtrakkrprronutrtnBackIcon}
                  />
                  <Text style={styles.gyymtrakkrprronutrtnBackText}>Back</Text>
                </TouchableOpacity>
                <Text style={styles.gyymtrakkrprronutrtnFormTitle}>
                  Add Meal
                </Text>
                <TouchableOpacity
                  onPress={gyymtrakkrprronutrtnSubmit}
                  disabled={!gyymtrakkrprronutrtnFormValid}>
                  <Text
                    style={[
                      styles.gyymtrakkrprronutrtnSaveText,
                      !gyymtrakkrprronutrtnFormValid &&
                        styles.gyymtrakkrprronutrtnSaveDisabled,
                    ]}>
                    Save
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.gyymtrakkrprronutrtnFieldLabel}>
                MEAL TYPE
              </Text>
              <View style={styles.gyymtrakkrprronutrtnTypeGrid}>
                {GYYMTRAKKRPRRONUTRTN_MEAL_TYPES.map(t => {
                  const gyymtrakkrprronutrtnSel =
                    gyymtrakkrprronutrtnFormType === t.id;
                  return (
                    <TouchableOpacity
                      key={t.id}
                      style={[
                        styles.gyymtrakkrprronutrtnTypeBtn,
                        gyymtrakkrprronutrtnSel && {
                          borderColor: t.color,
                          backgroundColor: `${t.color}1A`,
                        },
                      ]}
                      onPress={() => setGyymtrakkrprronutrtnFormType(t.id)}
                      activeOpacity={0.75}>
                      <Text style={styles.gyymtrakkrprronutrtnTypeEmoji}>
                        {t.emoji}
                      </Text>
                      <Text
                        style={[
                          styles.gyymtrakkrprronutrtnTypeLbl,
                          gyymtrakkrprronutrtnSel && {color: t.color},
                        ]}>
                        {t.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={styles.gyymtrakkrprronutrtnFieldLabel}>
                DISH NAME *
              </Text>
              <TextInput
                style={styles.gyymtrakkrprronutrtnInput}
                placeholder="e.g. Grilled Chicken & Rice"
                placeholderTextColor="#FFFFFF80"
                value={gyymtrakkrprronutrtnFormName}
                onChangeText={setGyymtrakkrprronutrtnFormName}
              />

              <Text style={styles.gyymtrakkrprronutrtnFieldLabel}>
                CALORIES (KCAL) *
              </Text>
              <TextInput
                style={styles.gyymtrakkrprronutrtnInput}
                keyboardType="numeric"
                placeholderTextColor="#FFFFFF80"
                value={gyymtrakkrprronutrtnFormKcal}
                onChangeText={setGyymtrakkrprronutrtnFormKcal}
              />

              <View style={styles.gyymtrakkrprronutrtnSpacerSm} />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        <View style={styles.gyymtrakkrprronutrtnFormBottom}>
          <TouchableOpacity
            onPress={gyymtrakkrprronutrtnSubmit}
            disabled={!gyymtrakkrprronutrtnFormValid}
            activeOpacity={gyymtrakkrprronutrtnFormValid ? 0.85 : 1}>
            <View
              style={[
                styles.gyymtrakkrprronutrtnSubmitBtn,
                !gyymtrakkrprronutrtnFormValid &&
                  styles.gyymtrakkrprronutrtnSubmitOff,
              ]}>
              <Text
                style={[
                  styles.gyymtrakkrprronutrtnSubmitText,
                  !gyymtrakkrprronutrtnFormValid &&
                    styles.gyymtrakkrprronutrtnSubmitTextOff,
                ]}>
                ✓ Add Meal
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['rgb(35, 44, 115)', 'rgb(9, 11, 32)']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={styles.gyymtrakkrprronutrtnRoot}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.gyymtrakkrprronutrtnMainScroll}>
        {gyymtrakkrprronutrtnRenderHeader()}
        <View style={styles.gyymtrakkrprronutrtnMainPad}>
          <Text style={styles.gyymtrakkrprronutrtnJournalLabel}>
            FOOD JOURNAL
          </Text>
          <Text style={styles.gyymtrakkrprronutrtnDateTitle}>
            {gyymtrakkrprronutrtnDateTitle(gyymtrakkrprronutrtnSelDaysAgo)}
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.gyymtrakkrprronutrtnDateRow}>
            {gyymtrakkrprronutrtnWeekDays.map((day, idx) => {
              const gyymtrakkrprronutrtnActive =
                idx === gyymtrakkrprronutrtnSelDay;
              return (
                <TouchableOpacity
                  key={day.key}
                  onPress={() => setGyymtrakkrprronutrtnSelDay(idx)}
                  activeOpacity={0.75}
                  style={styles.gyymtrakkrprronutrtnDayCell}>
                  <View
                    style={[
                      styles.gyymtrakkrprronutrtnDayNumWrap,
                      gyymtrakkrprronutrtnActive &&
                        styles.gyymtrakkrprronutrtnDayNumWrapActive,
                    ]}>
                    <Text
                      style={[
                        styles.gyymtrakkrprronutrtnDayLetter,
                        gyymtrakkrprronutrtnActive &&
                          styles.gyymtrakkrprronutrtnDayLetterActive,
                      ]}>
                      {day.letter}
                    </Text>
                    <Text
                      style={[
                        styles.gyymtrakkrprronutrtnDayNum,
                        gyymtrakkrprronutrtnActive &&
                          styles.gyymtrakkrprronutrtnDayNumActive,
                      ]}>
                      {day.num}
                    </Text>
                    {gyymtrakkrprronutrtnActive && (
                      <View style={styles.gyymtrakkrprronutrtnDayDot} />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <LinearGradient
            colors={['#0378DE40', '#0378DE1A']}
            style={styles.gyymtrakkrprronutrtnTotalCard}>
            <View
              style={{
                padding: 16,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                width: '100%',
                justifyContent: 'space-between',
              }}>
              <View>
                <Text style={styles.gyymtrakkrprronutrtnTotalLabel}>
                  Total Calories
                </Text>
                <Text>
                  <Text style={styles.gyymtrakkrprronutrtnTotalBig}>
                    {gyymtrakkrprronutrtnTotalKcal}
                  </Text>
                  <Text style={styles.gyymtrakkrprronutrtnTotalUnit}>
                    {' '}
                    kcal
                  </Text>
                </Text>
              </View>
              <View style={styles.gyymtrakkrprronutrtnFlameBtn}>
                <Image source={require('../../assets/i/gyymtrakkpwblfr.png')} />
              </View>
            </View>
          </LinearGradient>

          {GYYMTRAKKRPRRONUTRTN_MEAL_TYPES.map(mealType => {
            const gyymtrakkrprronutrtnItems = gyymtrakkrprronutrtnMealsOf(
              mealType.id,
            );
            const gyymtrakkrprronutrtnSectionKcal = gyymtrakkrprronutrtnKcalOf(
              mealType.id,
            );
            return (
              <View
                key={mealType.id}
                style={styles.gyymtrakkrprronutrtnSection}>
                <View style={styles.gyymtrakkrprronutrtnSectionHead}>
                  <View style={styles.gyymtrakkrprronutrtnSectionLeft}>
                    <Text style={styles.gyymtrakkrprronutrtnSectionEmoji}>
                      {mealType.emoji}
                    </Text>
                    <Text style={styles.gyymtrakkrprronutrtnSectionLabel}>
                      {mealType.label.toUpperCase()}
                    </Text>
                  </View>
                  {gyymtrakkrprronutrtnSectionKcal > 0 && (
                    <Text
                      style={[
                        styles.gyymtrakkrprronutrtnSectionKcal,
                        {color: mealType.color},
                      ]}>
                      {gyymtrakkrprronutrtnSectionKcal} kcal
                    </Text>
                  )}
                </View>

                {gyymtrakkrprronutrtnItems.length === 0 ? (
                  <View style={styles.gyymtrakkrprronutrtnEmptyRow}>
                    <Text style={styles.gyymtrakkrprronutrtnEmptyTxt}>
                      No {mealType.label.toLowerCase()} logged
                    </Text>
                  </View>
                ) : (
                  gyymtrakkrprronutrtnItems.map(meal => (
                    <View
                      key={meal.gyymtrakkrprronutrtnId}
                      style={styles.gyymtrakkrprronutrtnMealRow}>
                      <View style={styles.gyymtrakkrprronutrtnMealIconWrap}>
                        <Text style={styles.gyymtrakkrprronutrtnMealIcon}>
                          {mealType.emoji}
                        </Text>
                      </View>
                      <View style={styles.gyymtrakkrprronutrtnMealInfo}>
                        <Text style={styles.gyymtrakkrprronutrtnMealName}>
                          {meal.gyymtrakkrprronutrtnName}
                        </Text>
                        <Text
                          style={[
                            styles.gyymtrakkrprronutrtnMealKcal,
                            {color: mealType.color},
                          ]}>
                          {meal.gyymtrakkrprronutrtnKcal} kcal
                        </Text>
                      </View>
                      <View style={styles.gyymtrakkrprronutrtnMealActions}>
                        <TouchableOpacity
                          onPress={() => gyymtrakkrprronutrtnOpenEdit(meal)}
                          style={styles.gyymtrakkrprronutrtnActionBtn}>
                          <Image
                            source={require('../../assets/i/gyymtrakkped.png')}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() =>
                            gyymtrakkrprronutrtnDelete(
                              meal.gyymtrakkrprronutrtnId,
                            )
                          }
                          style={styles.gyymtrakkrprronutrtnActionBtn}>
                          <Image
                            source={require('../../assets/i/gyymtrakkpwdel.png')}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))
                )}
              </View>
            );
          })}

          <View style={styles.gyymtrakkrprronutrtnSpacerMd} />
        </View>
      </ScrollView>

      <View style={styles.gyymtrakkrprronutrtnAddWrap}>
        <TouchableOpacity
          onPress={() => gyymtrakkrprronutrtnOpenAdd()}
          activeOpacity={0.85}>
          <LinearGradient
            colors={['#0378DE', '#0255A3']}
            style={styles.gyymtrakkrprronutrtnAddBtn}>
            <Image source={require('../../assets/i/gyymtrakkpwplss.png')} />
            <Text style={styles.gyymtrakkrprronutrtnAddBtnText}>Add Meal</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gyymtrakkrprronutrtnStreakBadge: {
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F973162E',
    borderWidth: 1,
    borderColor: '#F9731659',
  },

  gyymtrakkrprronutrtnStreakEmpty: {
    backgroundColor: '#252A50',
    borderColor: '#3D4670',
    gap: 4,
  },

  gyymtrakkrprronutrtnRoot: {
    flex: 1,
  },
  gyymtrakkrprronutrtnFlex1: {flex: 1},
  gyymtrakkrprronutrtnSpacerSm: {height: 120},
  gyymtrakkrprronutrtnSpacerMd: {height: 140},

  gyymtrakkrprronutrtnHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: '#282E50',
    marginTop: 50,
    marginBottom: 8,
  },

  gyymtrakkrprronutrtnFireIcon: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  gyymtrakkrprronutrtnStreakText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  gyymtrakkrprronutrtnWeekRow: {
    flexDirection: 'row',
    gap: 6,
  },
  gyymtrakkrprronutrtnWeekCell: {
    alignItems: 'center',
    gap: 4,
  },
  gyymtrakkrprronutrtnWeekLabel: {
    color: '#8895B0',
    fontSize: 11,
    fontWeight: '600',
  },
  gyymtrakkrprronutrtnWeekDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  gyymtrakkrprronutrtnWeekDotMissed: {
    backgroundColor: '#EF444459',
    borderColor: '#EF44444D',
  },
  gyymtrakkrprronutrtnWeekDotToday: {
    backgroundColor: '#252A50',
    borderWidth: 1,
    borderColor: '#3D4670',
  },
  gyymtrakkrprronutrtnWeekDotDone: {
    backgroundColor: '#1A7A3C',
    borderColor: '#22C55E80',
  },
  gyymtrakkrprronutrtnWeekCheck: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },

  gyymtrakkrprronutrtnMainScroll: {
    paddingTop: 18,
  },
  gyymtrakkrprronutrtnMainPad: {
    paddingHorizontal: 16,
  },
  gyymtrakkrprronutrtnJournalLabel: {
    color: '#6B7299',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  gyymtrakkrprronutrtnDateTitle: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 16,
  },

  // Date picker
  gyymtrakkrprronutrtnDateRow: {
    gap: 6,
    marginBottom: 16,
    paddingBottom: 4,
  },
  gyymtrakkrprronutrtnDayCell: {
    alignItems: 'center',
    width: 42,
    gap: 2,
  },
  gyymtrakkrprronutrtnDayLetter: {
    color: '#6B7299',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
  },
  gyymtrakkrprronutrtnDayLetterActive: {color: '#fff'},
  gyymtrakkrprronutrtnDayNumWrap: {
    width: 40,
    minHeight: 67,
    borderRadius: 16,
    backgroundColor: '#282E50',
    borderWidth: 1,
    gap: 3,
    borderColor: '#FFFFFF12',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gyymtrakkrprronutrtnDayNumWrapActive: {
    backgroundColor: '#0378DE',
    borderColor: '#0378DE',
  },
  gyymtrakkrprronutrtnDayNum: {
    color: '#8895B0',
    fontSize: 14,
    fontWeight: '700',
  },
  gyymtrakkrprronutrtnDayNumActive: {color: '#fff'},
  gyymtrakkrprronutrtnDayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF26',
    marginTop: 3,
  },

  // Total Calories
  gyymtrakkrprronutrtnTotalCard: {
    backgroundColor: '#282E50',
    borderWidth: 1,
    borderColor: '#FFFFFF12',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',

    marginBottom: 20,
  },
  gyymtrakkrprronutrtnTotalLabel: {
    color: '#8895B0',
    fontSize: 13,
    marginBottom: 4,
  },
  gyymtrakkrprronutrtnTotalBig: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '800',
  },
  gyymtrakkrprronutrtnTotalUnit: {
    color: '#8895B0',
    fontSize: 15,
    fontWeight: '500',
  },
  gyymtrakkrprronutrtnFlameBtn: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#0378DE40',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gyymtrakkrprronutrtnFlameEmoji: {fontSize: 20},

  gyymtrakkrprronutrtnSection: {marginBottom: 16},
  gyymtrakkrprronutrtnSectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  gyymtrakkrprronutrtnSectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 5,
  },
  gyymtrakkrprronutrtnSectionEmoji: {fontSize: 14},
  gyymtrakkrprronutrtnSectionLabel: {
    color: '#6B7299',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  gyymtrakkrprronutrtnSectionKcal: {
    fontSize: 12,
    fontWeight: '700',
  },

  gyymtrakkrprronutrtnEmptyRow: {
    backgroundColor: '#282E50',
    borderWidth: 1,
    borderColor: '#FFFFFF12',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    minHeight: 52,
    justifyContent: 'center',
  },
  gyymtrakkrprronutrtnEmptyTxt: {
    color: '#FFFFFF40',
    fontSize: 13,
  },

  gyymtrakkrprronutrtnMealRow: {
    backgroundColor: '#282E50',
    borderWidth: 1,
    borderColor: '#FFFFFF12',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 6,
    gap: 10,
  },
  gyymtrakkrprronutrtnMealIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#1A1E3D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gyymtrakkrprronutrtnMealIcon: {fontSize: 20},
  gyymtrakkrprronutrtnMealInfo: {flex: 1},
  gyymtrakkrprronutrtnMealName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  gyymtrakkrprronutrtnMealKcal: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '600',
  },
  gyymtrakkrprronutrtnMealActions: {
    flexDirection: 'row',
    gap: 4,
  },
  gyymtrakkrprronutrtnActionBtn: {padding: 6},
  gyymtrakkrprronutrtnActionIcon: {fontSize: 16},

  gyymtrakkrprronutrtnAddWrap: {
    position: 'absolute',
    bottom: 90,
    left: 16,
    right: 16,
  },
  gyymtrakkrprronutrtnAddBtn: {
    borderRadius: 20,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    shadowColor: '#0378DE',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  gyymtrakkrprronutrtnAddBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  gyymtrakkrprronutrtnFormScroll: {paddingTop: 18},
  gyymtrakkrprronutrtnFormPad: {paddingHorizontal: 16},
  gyymtrakkrprronutrtnFormTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#252B52',
    marginBottom: 4,
  },
  gyymtrakkrprronutrtnBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  gyymtrakkrprronutrtnBackIcon: {width: 16, height: 16},
  gyymtrakkrprronutrtnBackText: {
    color: '#5AB8FF',
    fontSize: 15,
    fontWeight: '600',
  },
  gyymtrakkrprronutrtnFormTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  gyymtrakkrprronutrtnSaveText: {
    color: '#0378DE',
    fontSize: 15,
    fontWeight: '600',
    minWidth: 60,
    textAlign: 'right',
  },
  gyymtrakkrprronutrtnSaveDisabled: {color: '#3D4670'},

  gyymtrakkrprronutrtnFieldLabel: {
    color: '#FFFFFF80',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 10,
    marginTop: 18,
  },

  gyymtrakkrprronutrtnTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 12,
    justifyContent: 'center',
  },
  gyymtrakkrprronutrtnTypeBtn: {
    width: '47%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#282E50',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#FFFFFF1A',
  },
  gyymtrakkrprronutrtnTypeEmoji: {fontSize: 20},
  gyymtrakkrprronutrtnTypeLbl: {
    color: '#8895B0',
    fontSize: 14,
    fontWeight: '600',
  },

  gyymtrakkrprronutrtnInput: {
    backgroundColor: '#282E50',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    color: '#fff',
    fontSize: 15,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#FFFFFF1A',
  },

  gyymtrakkrprronutrtnFormBottom: {
    paddingHorizontal: 16,
    paddingBottom: 100,
    paddingTop: 12,
  },
  gyymtrakkrprronutrtnSubmitBtn: {
    backgroundColor: '#0378DE',
    borderRadius: 16,
    paddingVertical: 17,
    alignItems: 'center',
  },
  gyymtrakkrprronutrtnSubmitOff: {backgroundColor: '#20264A'},
  gyymtrakkrprronutrtnSubmitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  gyymtrakkrprronutrtnSubmitTextOff: {color: '#FFFFFF4D'},
});

export default Gyymtrakkprronutrtn;
