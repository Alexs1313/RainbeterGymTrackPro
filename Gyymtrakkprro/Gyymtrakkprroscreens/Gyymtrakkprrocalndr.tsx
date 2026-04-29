// Calendar

import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';

import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type GymSet = {
  gyymtrakkrprroId: string;
  gyymtrakkrprroWeight: string;
  gyymtrakkrprroReps: string;
};

type GymExercise = {
  gyymtrakkrprroId: string;
  gyymtrakkrprroName: string;
  gyymtrakkrprroSets: GymSet[];
};

type GymDayWorkout = {
  gyymtrakkrprroExercises: GymExercise[];
  gyymtrakkrprroMuscleGroups: string[];
};

type NutrtnMeal = {
  gyymtrakkrprronutrtnId: string;
  gyymtrakkrprronutrtnName: string;
  gyymtrakkrprronutrtnKcal: string;
  gyymtrakkrprronutrtnType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
};

type NutrtnDay = {
  gyymtrakkrprronutrtnMeals: NutrtnMeal[];
};

const GYYMTRAKKRPRROWRKOT_KEY = 'gyymtrakkrprro_workouts';
const GYYMTRAKKRPRRONUTRTN_KEY = 'gyymtrakkrprro_nutrition';

const GYYMTRAKKRPRRO_WEEK_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const GYYMTRAKKRPRRO_MUSCLE_GROUPS: {
  id: string;
  label: string;
  emoji: string;
}[] = [
  {id: 'chest', label: 'Chest', emoji: '🫁'},
  {id: 'back', label: 'Back', emoji: '🔙'},
  {id: 'shoulders', label: 'Shoulders', emoji: '🤸'},
  {id: 'biceps', label: 'Biceps', emoji: '💪'},
  {id: 'triceps', label: 'Triceps', emoji: '🦾'},
  {id: 'legs', label: 'Legs', emoji: '🦵'},
  {id: 'core', label: 'Core', emoji: '⚡'},
  {id: 'glutes', label: 'Glutes', emoji: '🍑'},
  {id: 'calves', label: 'Calves', emoji: '🦶'},
  {id: 'forearms', label: 'Forearms', emoji: '🥊'},
  {id: 'cardio', label: 'Cardio', emoji: '🏃'},
  {id: 'fullbody', label: 'Full Body', emoji: '🏋️'},
];

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

const gyymtrakkrprroDayKeyFromDate = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate(),
  ).padStart(2, '0')}`;

const gyymtrakkrprroAddDays = (d: Date, days: number) => {
  const next = new Date(d);
  next.setDate(next.getDate() + days);
  return next;
};

const gyymtrakkrprroStartOfMonth = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), 1);
const gyymtrakkrprroEndOfMonth = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth() + 1, 0);
const gyymtrakkrprroIsSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const gyymtrakkrprroMonthTitle = (d: Date) =>
  d.toLocaleDateString('en-US', {month: 'long', year: 'numeric'});

const gyymtrakkrprroCalcStreak = (
  all: Record<string, GymDayWorkout>,
): number => {
  let streak = 0;
  for (let i = 0; i <= 365; i++) {
    const key = gyymtrakkrprroDayKeyFromDate(
      gyymtrakkrprroAddDays(new Date(), -i),
    );
    if (all[key]?.gyymtrakkrprroExercises?.length) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }
  return streak;
};

const gyymtrakkrprroCalcWeek = (
  all: Record<string, GymDayWorkout>,
): boolean[] => {
  const week: boolean[] = [];
  for (let i = 6; i >= 0; i--) {
    const key = gyymtrakkrprroDayKeyFromDate(
      gyymtrakkrprroAddDays(new Date(), -i),
    );
    week.push(!!all[key]?.gyymtrakkrprroExercises?.length);
  }
  return week;
};

const Gyymtrakkprrocalndr = () => {
  const today = useMemo(() => new Date(), []);
  const [gyymtrakkrprroMonthCursor, setGyymtrakkrprroMonthCursor] =
    useState<Date>(gyymtrakkrprroStartOfMonth(today));
  const [gyymtrakkrprroSelDate, setGyymtrakkrprroSelDate] =
    useState<Date>(today);

  const [gyymtrakkrprroWorkAll, setGyymtrakkrprroWorkAll] = useState<
    Record<string, GymDayWorkout>
  >({});
  const [gyymtrakkrprroNutrAll, setGyymtrakkrprroNutrAll] = useState<
    Record<string, NutrtnDay>
  >({});
  const [gyymtrakkrprroStreak, setGyymtrakkrprroStreak] = useState(0);
  const [gyymtrakkrprroWeekData, setGyymtrakkrprroWeekData] = useState<
    boolean[]
  >(Array(7).fill(false));

  const gyymtrakkrprroLoad = useCallback(async () => {
    try {
      const [rawWork, rawNutr] = await Promise.all([
        AsyncStorage.getItem(GYYMTRAKKRPRROWRKOT_KEY),
        AsyncStorage.getItem(GYYMTRAKKRPRRONUTRTN_KEY),
      ]);
      const work: Record<string, GymDayWorkout> = rawWork
        ? JSON.parse(rawWork)
        : {};
      const nutr: Record<string, NutrtnDay> = rawNutr
        ? JSON.parse(rawNutr)
        : {};
      setGyymtrakkrprroWorkAll(work);
      setGyymtrakkrprroNutrAll(nutr);
      setGyymtrakkrprroStreak(gyymtrakkrprroCalcStreak(work));
      setGyymtrakkrprroWeekData(gyymtrakkrprroCalcWeek(work));
    } catch (_) {}
  }, []);

  useFocusEffect(
    useCallback(() => {
      gyymtrakkrprroLoad();
    }, [gyymtrakkrprroLoad]),
  );

  const gyymtrakkrprroSelectedKey = useMemo(
    () => gyymtrakkrprroDayKeyFromDate(gyymtrakkrprroSelDate),
    [gyymtrakkrprroSelDate],
  );

  const gyymtrakkrprroSelWorkout =
    gyymtrakkrprroWorkAll[gyymtrakkrprroSelectedKey];
  const gyymtrakkrprroSelMeals = useMemo<NutrtnMeal[]>(
    () =>
      gyymtrakkrprroNutrAll[gyymtrakkrprroSelectedKey]
        ?.gyymtrakkrprronutrtnMeals ?? [],
    [gyymtrakkrprroNutrAll, gyymtrakkrprroSelectedKey],
  );

  const gyymtrakkrprroSelTotalKcal = useMemo(
    () =>
      gyymtrakkrprroSelMeals.reduce(
        (s, m) => s + (parseFloat(m.gyymtrakkrprronutrtnKcal) || 0),
        0,
      ),
    [gyymtrakkrprroSelMeals],
  );

  const gyymtrakkrprroMonthCells = useMemo(() => {
    const start = gyymtrakkrprroStartOfMonth(gyymtrakkrprroMonthCursor);
    const end = gyymtrakkrprroEndOfMonth(gyymtrakkrprroMonthCursor);
    const startOffset = start.getDay(); // 0..6
    const daysInMonth = end.getDate();

    const cells: Array<{date: Date | null; key: string}> = [];
    for (let i = 0; i < startOffset; i++) {
      cells.push({date: null, key: `pad-start-${i}`});
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(start.getFullYear(), start.getMonth(), day);
      cells.push({date: d, key: gyymtrakkrprroDayKeyFromDate(d)});
    }
    while (cells.length % 7 !== 0) {
      cells.push({date: null, key: `pad-end-${cells.length}`});
    }
    return cells;
  }, [gyymtrakkrprroMonthCursor]);

  const gyymtrakkrprroRenderHeader = () => (
    <View style={styles.gyymtrakkrprroHeader}>
      <View style={styles.gyymtrakkrprroStreakBadge}>
        <Image
          source={require('../../assets/i/gyymtrakkpwfir.png')}
          style={styles.gyymtrakkrprroFireIcon}
        />
        <Text style={styles.gyymtrakkrprroStreakText}>
          {Math.max(1, gyymtrakkrprroStreak)} day streak
        </Text>
      </View>

      <View style={styles.gyymtrakkrprroWeekRow}>
        {Array.from({length: 7}).map((_, idx) => {
          const d = gyymtrakkrprroAddDays(new Date(), idx - 6);
          const isToday = idx === 6;
          const hasDone = !!gyymtrakkrprroWeekData[idx] || isToday;
          return (
            <View key={idx} style={styles.gyymtrakkrprroWeekCell}>
              <Text style={styles.gyymtrakkrprroWeekLabel}>
                {GYYMTRAKKRPRRO_WEEK_LABELS[d.getDay()]}
              </Text>
              <View
                style={[
                  styles.gyymtrakkrprroWeekDot,
                  hasDone
                    ? styles.gyymtrakkrprroWeekDotDone
                    : isToday
                    ? styles.gyymtrakkrprroWeekDotToday
                    : styles.gyymtrakkrprroWeekDotMissed,
                ]}>
                {hasDone && (
                  <Text style={styles.gyymtrakkrprroWeekCheck}>✓</Text>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );

  const gyymtrakkrprroSelTitle = useMemo(() => {
    const daysDiff = Math.floor(
      (new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
      ).getTime() -
        new Date(
          gyymtrakkrprroSelDate.getFullYear(),
          gyymtrakkrprroSelDate.getMonth(),
          gyymtrakkrprroSelDate.getDate(),
        ).getTime()) /
        (1000 * 60 * 60 * 24),
    );
    if (daysDiff === 0) {
      return 'TODAY';
    }
    if (daysDiff === 1) {
      return 'YESTERDAY';
    }
    return gyymtrakkrprroSelDate
      .toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      })
      .toUpperCase();
  }, [gyymtrakkrprroSelDate, today]);

  const gyymtrakkrprroSelMuscleChips = useMemo(() => {
    const ids = gyymtrakkrprroSelWorkout?.gyymtrakkrprroMuscleGroups ?? [];
    return ids
      .map(id => GYYMTRAKKRPRRO_MUSCLE_GROUPS.find(g => g.id === id))
      .filter(Boolean) as {id: string; label: string; emoji: string}[];
  }, [gyymtrakkrprroSelWorkout]);

  const gyymtrakkrprroSelWorkoutFirst = useMemo(() => {
    const ex = gyymtrakkrprroSelWorkout?.gyymtrakkrprroExercises ?? [];
    if (!ex.length) {
      return null;
    }
    const first = ex[0];
    return {
      name: first.gyymtrakkrprroName,
      sets: first.gyymtrakkrprroSets?.length ?? 0,
    };
  }, [gyymtrakkrprroSelWorkout]);

  const gyymtrakkrprroSelMealsTop3 = useMemo(
    () => gyymtrakkrprroSelMeals.slice(0, 3),
    [gyymtrakkrprroSelMeals],
  );

  return (
    <View style={styles.gyymtrakkrprroRoot}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.gyymtrakkrprroScroll}>
        {gyymtrakkrprroRenderHeader()}
        <View style={{paddingHorizontal: 16}}>
          <View style={styles.gyymtrakkrprroMonthTop}>
            <TouchableOpacity
              onPress={() =>
                setGyymtrakkrprroMonthCursor(
                  new Date(
                    gyymtrakkrprroMonthCursor.getFullYear(),
                    gyymtrakkrprroMonthCursor.getMonth() - 1,
                    1,
                  ),
                )
              }
              activeOpacity={0.8}
              style={styles.gyymtrakkrprroMonthNavBtn}>
              <Image source={require('../../assets/i/gyymtrakkpwleft.png')} />
            </TouchableOpacity>

            <Text style={styles.gyymtrakkrprroMonthTitle}>
              {gyymtrakkrprroMonthTitle(gyymtrakkrprroMonthCursor)}
            </Text>

            <TouchableOpacity
              onPress={() =>
                setGyymtrakkrprroMonthCursor(
                  new Date(
                    gyymtrakkrprroMonthCursor.getFullYear(),
                    gyymtrakkrprroMonthCursor.getMonth() + 1,
                    1,
                  ),
                )
              }
              activeOpacity={0.8}
              style={styles.gyymtrakkrprroMonthNavBtn}>
              <Image source={require('../../assets/i/gyymtrakkpwrig.png')} />
            </TouchableOpacity>
          </View>

          <View style={styles.gyymtrakkrprroMonthCard}>
            <View style={styles.gyymtrakkrprroDowRow}>
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                <Text key={d} style={styles.gyymtrakkrprroDow}>
                  {d}
                </Text>
              ))}
            </View>

            <View style={styles.gyymtrakkrprroGrid}>
              {gyymtrakkrprroMonthCells.map(cell => {
                if (!cell.date) {
                  return (
                    <View key={cell.key} style={styles.gyymtrakkrprroDayCell} />
                  );
                }
                const key = cell.key;
                const isSelected = gyymtrakkrprroIsSameDay(
                  cell.date,
                  gyymtrakkrprroSelDate,
                );
                const hasWorkout =
                  !!gyymtrakkrprroWorkAll[key]?.gyymtrakkrprroExercises?.length;
                const hasMeals =
                  !!gyymtrakkrprroNutrAll[key]?.gyymtrakkrprronutrtnMeals
                    ?.length;

                return (
                  <TouchableOpacity
                    key={key}
                    onPress={() => setGyymtrakkrprroSelDate(cell.date!)}
                    activeOpacity={0.8}
                    style={[
                      styles.gyymtrakkrprroDayCell,
                      isSelected && styles.gyymtrakkrprroDayCellActive,
                    ]}>
                    <Text
                      style={[
                        styles.gyymtrakkrprroDayNum,
                        isSelected && styles.gyymtrakkrprroDayNumActive,
                      ]}>
                      {cell.date.getDate()}
                    </Text>

                    {(hasWorkout || hasMeals) && (
                      <View style={styles.gyymtrakkrprroDotsRow}>
                        {hasWorkout && (
                          <View
                            style={[
                              styles.gyymtrakkrprroDot,
                              styles.gyymtrakkrprroDotWork,
                            ]}
                          />
                        )}
                        {hasMeals && (
                          <View
                            style={[
                              styles.gyymtrakkrprroDot,
                              styles.gyymtrakkrprroDotNutr,
                            ]}
                          />
                        )}
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.gyymtrakkrprroLegendRow}>
              <View style={styles.gyymtrakkrprroLegendItem}>
                <View
                  style={[
                    styles.gyymtrakkrprroLegendDot,
                    styles.gyymtrakkrprroDotWork,
                  ]}
                />
                <Text style={styles.gyymtrakkrprroLegendText}>Workout</Text>
              </View>
              <View style={styles.gyymtrakkrprroLegendItem}>
                <View
                  style={[
                    styles.gyymtrakkrprroLegendDot,
                    styles.gyymtrakkrprroDotNutr,
                  ]}
                />
                <Text style={styles.gyymtrakkrprroLegendText}>Nutrition</Text>
              </View>
            </View>
          </View>

          <Text style={styles.gyymtrakkrprroDayTitle}>
            {gyymtrakkrprroSelTitle}
          </Text>

          {/* Workout card */}
          <View style={styles.gyymtrakkrprroInfoCard}>
            <View style={styles.gyymtrakkrprroInfoHead}>
              <Text style={styles.gyymtrakkrprroInfoIcon}>🏆</Text>
              <Text style={styles.gyymtrakkrprroInfoTitle}>WORKOUT</Text>
            </View>

            {gyymtrakkrprroSelWorkout?.gyymtrakkrprroExercises?.length ? (
              <>
                <View style={styles.gyymtrakkrprroChipRow}>
                  {gyymtrakkrprroSelMuscleChips.map(chip => (
                    <View key={chip.id} style={styles.gyymtrakkrprroChip}>
                      <Text style={styles.gyymtrakkrprroChipEmoji}>
                        {chip.emoji}
                      </Text>
                      <Text style={styles.gyymtrakkrprroChipText}>
                        {chip.label}
                      </Text>
                    </View>
                  ))}
                </View>

                {gyymtrakkrprroSelWorkoutFirst && (
                  <View style={styles.gyymtrakkrprroLineItem}>
                    <Text
                      style={styles.gyymtrakkrprroLineItemText}
                      numberOfLines={1}>
                      {gyymtrakkrprroSelWorkoutFirst.name}
                    </Text>
                    <Text style={styles.gyymtrakkrprroLineItemMeta}>
                      {gyymtrakkrprroSelWorkoutFirst.sets} sets
                    </Text>
                  </View>
                )}
              </>
            ) : (
              <Text style={styles.gyymtrakkrprroEmptyText}>
                No workout logged
              </Text>
            )}
          </View>

          {/* Nutrition card */}
          <View style={styles.gyymtrakkrprroInfoCard}>
            <View style={styles.gyymtrakkrprroInfoHeadBetween}>
              <View style={styles.gyymtrakkrprroInfoHead}>
                <Text style={styles.gyymtrakkrprroInfoIcon}>🍽️</Text>
                <Text style={styles.gyymtrakkrprroInfoTitle}>NUTRITION</Text>
              </View>
              {gyymtrakkrprroSelMeals.length > 0 && (
                <Text style={styles.gyymtrakkrprroKcalTotal}>
                  {gyymtrakkrprroSelTotalKcal} kcal
                </Text>
              )}
            </View>

            {gyymtrakkrprroSelMeals.length ? (
              <View style={styles.gyymtrakkrprroMealsList}>
                {gyymtrakkrprroSelMealsTop3.map(m => {
                  const mt = GYYMTRAKKRPRRONUTRTN_MEAL_TYPES.find(
                    t => t.id === m.gyymtrakkrprronutrtnType,
                  );
                  const color = mt?.color ?? '#5AB8FF';
                  const emoji = mt?.emoji ?? '🍽️';
                  return (
                    <View
                      key={m.gyymtrakkrprronutrtnId}
                      style={styles.gyymtrakkrprroMealRow}>
                      <Text style={styles.gyymtrakkrprroMealEmoji}>
                        {emoji}
                      </Text>
                      <Text
                        style={styles.gyymtrakkrprroMealName}
                        numberOfLines={1}>
                        {m.gyymtrakkrprronutrtnName}
                      </Text>
                      <Text style={[styles.gyymtrakkrprroMealKcal, {color}]}>
                        {m.gyymtrakkrprronutrtnKcal} kcal
                      </Text>
                    </View>
                  );
                })}
              </View>
            ) : (
              <Text style={styles.gyymtrakkrprroEmptyText}>
                No meals logged
              </Text>
            )}
          </View>

          <View style={styles.gyymtrakkrprroBottomSpace} />
        </View>
      </ScrollView>
    </View>
  );
};

export default Gyymtrakkprrocalndr;

const styles = StyleSheet.create({
  gyymtrakkrprroStreakBadge: {
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F973162E',
    borderWidth: 1,
    borderColor: '#F9731659',
  },

  gyymtrakkrprroStreakEmpty: {
    backgroundColor: '#252A50',
    borderColor: '#3D4670',
    gap: 4,
  },

  gyymtrakkrprroRoot: {flex: 1, backgroundColor: '#1A1E3D'},
  gyymtrakkrprroScroll: {paddingTop: 18},
  gyymtrakkrprroBottomSpace: {height: 140},

  gyymtrakkrprroHeader: {
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

  gyymtrakkrprroFireIcon: {width: 16, height: 16, marginRight: 4},
  gyymtrakkrprroStreakText: {color: '#fff', fontSize: 13, fontWeight: '600'},
  gyymtrakkrprroWeekRow: {flexDirection: 'row', gap: 6},
  gyymtrakkrprroWeekCell: {alignItems: 'center', gap: 4},
  gyymtrakkrprroWeekLabel: {color: '#8895B0', fontSize: 11, fontWeight: '600'},
  gyymtrakkrprroWeekDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  gyymtrakkrprroWeekDotMissed: {
    backgroundColor: '#EF444459',
    borderColor: '#EF44444D',
  },
  gyymtrakkrprroWeekDotToday: {
    backgroundColor: '#252A50',
    borderWidth: 1,
    borderColor: '#3D4670',
  },

  gyymtrakkrprroWeekDotDone: {
    backgroundColor: '#1A7A3C',
    borderColor: '#22C55E80',
  },
  gyymtrakkrprroWeekCheck: {color: '#fff', fontSize: 11, fontWeight: '700'},

  gyymtrakkrprroMonthCard: {
    backgroundColor: '#282E50',
    borderWidth: 1,
    borderColor: '#FFFFFF12',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  gyymtrakkrprroMonthTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
    marginTop: 10,
    backgroundColor: '#282E50',
    paddingHorizontal: 10,

    borderWidth: 1,
    borderColor: '#FFFFFF12',
    borderRadius: 16,
    minHeight: 60,
  },
  gyymtrakkrprroMonthNavBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFFFFF14',

    alignItems: 'center',
    justifyContent: 'center',
  },
  gyymtrakkrprroMonthNavIcon: {color: '#fff', fontSize: 22, fontWeight: '800'},
  gyymtrakkrprroMonthTitle: {color: '#fff', fontSize: 18, fontWeight: '800'},
  gyymtrakkrprroDowRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  gyymtrakkrprroDow: {
    width: '14.28%',
    textAlign: 'center',
    color: '#6B7299',
    fontSize: 12,
    fontWeight: '700',
  },
  gyymtrakkrprroGrid: {flexDirection: 'row', flexWrap: 'wrap', marginTop: 8},
  gyymtrakkrprroDayCell: {
    width: '14.28%',
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    marginVertical: 3,
  },
  gyymtrakkrprroDayCellActive: {
    backgroundColor: '#0378DE66',
    borderWidth: 1,
    borderColor: '#0378DECC',
  },
  gyymtrakkrprroDayNum: {color: '#D3DAE8', fontSize: 14, fontWeight: '700'},
  gyymtrakkrprroDayNumActive: {color: '#fff'},
  gyymtrakkrprroDotsRow: {flexDirection: 'row', gap: 4, marginTop: 4},
  gyymtrakkrprroDot: {width: 5, height: 5, borderRadius: 3},
  gyymtrakkrprroDotWork: {backgroundColor: '#3B82F6'},
  gyymtrakkrprroDotNutr: {backgroundColor: '#22C55E'},
  gyymtrakkrprroLegendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 10,
  },
  gyymtrakkrprroLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  gyymtrakkrprroLegendDot: {width: 6, height: 6, borderRadius: 3},
  gyymtrakkrprroLegendText: {color: '#8895B0', fontSize: 12, fontWeight: '600'},

  gyymtrakkrprroDayTitle: {
    color: '#6B7299',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.9,
    marginTop: 16,
    marginBottom: 10,
  },

  gyymtrakkrprroInfoCard: {
    backgroundColor: '#282E50',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#FFFFFF12',
    padding: 14,
    marginBottom: 12,
    minHeight: 90,
    justifyContent: 'center',
  },
  gyymtrakkrprroInfoHead: {flexDirection: 'row', alignItems: 'center', gap: 10},
  gyymtrakkrprroInfoHeadBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gyymtrakkrprroInfoIcon: {fontSize: 16},
  gyymtrakkrprroInfoTitle: {
    color: '#6B7299',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.9,
  },
  gyymtrakkrprroEmptyText: {
    color: '#FFFFFF40',
    marginTop: 12,
    fontSize: 13,
    fontWeight: '600',
  },

  gyymtrakkrprroChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  gyymtrakkrprroChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: '#0378DE30',
    borderWidth: 1,
    borderColor: '#0378DE40',
  },
  gyymtrakkrprroChipEmoji: {fontSize: 12},
  gyymtrakkrprroChipText: {color: '#BFE3FF', fontSize: 12, fontWeight: '700'},
  gyymtrakkrprroLineItem: {
    marginTop: 12,
    backgroundColor: '#1F2547',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FFFFFF12',
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  gyymtrakkrprroLineItemText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
  },
  gyymtrakkrprroLineItemMeta: {
    color: '#8895B0',
    fontSize: 12,
    fontWeight: '700',
  },

  gyymtrakkrprroKcalTotal: {color: '#22C55E', fontSize: 14, fontWeight: '800'},
  gyymtrakkrprroMealsList: {marginTop: 12, gap: 8},
  gyymtrakkrprroMealRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#1F2547',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FFFFFF12',
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  gyymtrakkrprroMealEmoji: {fontSize: 14},
  gyymtrakkrprroMealName: {
    flex: 1,
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  gyymtrakkrprroMealKcal: {fontSize: 12, fontWeight: '800'},
});
