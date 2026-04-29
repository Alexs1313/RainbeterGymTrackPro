// wrkout

import LinearGradient from 'react-native-linear-gradient';

import {useFocusEffect} from '@react-navigation/native';

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
import AsyncStorage from '@react-native-async-storage/async-storage';

interface GymSet {
  gyymtrakkrprroId: string;
  gyymtrakkrprroWeight: string;
  gyymtrakkrprroReps: string;
}

interface GymExercise {
  gyymtrakkrprroId: string;
  gyymtrakkrprroName: string;
  gyymtrakkrprroSets: GymSet[];
}

interface GymDayWorkout {
  gyymtrakkrprroExercises: GymExercise[];
  gyymtrakkrprroMuscleGroups: string[];
}

const GYYMTRAKKRPRRO_STORAGE_KEY = 'gyymtrakkrprro_workouts';

const GYYMTRAKKRPRRO_MUSCLE_GROUPS = [
  {id: 'chest', label: 'Chest', emoji: '🫁'},
  {id: 'back', label: 'Back', emoji: '🔙'},
  {id: 'shoulders', label: 'Shoulders', emoji: '🤸'},
  {id: 'biceps', label: 'Biceps', emoji: '💪'},
  {id: 'triceps', label: 'Triceps', emoji: '🦾'},
  {id: 'legs', label: 'Legs', emoji: '🦵'},
  {id: 'core', label: 'Core', emoji: '⚡'},
  {id: 'glutes', label: 'Glutes', emoji: '🍑'},
  {id: 'calves', label: 'Calves', emoji: '🦶'},
  {id: 'forearms', label: 'Forearms', emoji: '🤜'},
  {id: 'cardio', label: 'Cardio', emoji: '🏃'},
  {id: 'fullbody', label: 'Full Body', emoji: '🏋️'},
];

const GYYMTRAKKRPRRO_WEEK_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const gyymtrakkrprroMakeDayKey = (daysAgo = 0): string => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    '0',
  )}-${String(d.getDate()).padStart(2, '0')}`;
};

const gyymtrakkrprroFormatDate = (): string =>
  new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

const gyymtrakkrprroUid = (): string =>
  Math.random().toString(36).substring(2, 9);

const gyymtrakkrprroGetWeekDayLabels = (): string[] => {
  const labels: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    labels.push(GYYMTRAKKRPRRO_WEEK_LABELS[d.getDay()]);
  }
  return labels;
};

const gyymtrakkrprroCalcStreak = (
  all: Record<string, GymDayWorkout>,
): number => {
  let streak = 0;
  for (let i = 0; i <= 365; i++) {
    const key = gyymtrakkrprroMakeDayKey(i);
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
    const key = gyymtrakkrprroMakeDayKey(i);
    week.push(!!all[key]?.gyymtrakkrprroExercises?.length);
  }
  return week;
};

const Gyymtrakkprrowrkot = () => {
  const gyymtrakkrprroTodayKey = gyymtrakkrprroMakeDayKey(0);
  const gyymtrakkrprroWeekLabels = gyymtrakkrprroGetWeekDayLabels();

  const [gyymtrakkrprroView, setGyymtrakkrprroView] = useState<'main' | 'add'>(
    'main',
  );

  const [gyymtrakkrprroExercises, setGyymtrakkrprroExercises] = useState<
    GymExercise[]
  >([]);
  const [gyymtrakkrprroSelGroups, setGyymtrakkrprroSelGroups] = useState<
    string[]
  >([]);
  const [gyymtrakkrprroStreak, setGyymtrakkrprroStreak] = useState(0);
  const [gyymtrakkrprroWeekData, setGyymtrakkrprroWeekData] = useState<
    boolean[]
  >(Array(7).fill(false));
  const [gyymtrakkrprroExpandedId, setGyymtrakkrprroExpandedId] = useState<
    string | null
  >(null);

  const [gyymtrakkrprroFormName, setGyymtrakkrprroFormName] = useState('');
  const [gyymtrakkrprroFormSets, setGyymtrakkrprroFormSets] = useState<
    GymSet[]
  >([
    {
      gyymtrakkrprroId: gyymtrakkrprroUid(),
      gyymtrakkrprroWeight: '0',
      gyymtrakkrprroReps: '0',
    },
  ]);
  const [gyymtrakkrprroEditingId, setGyymtrakkrprroEditingId] = useState<
    string | null
  >(null);

  const gyymtrakkrprroLoad = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(GYYMTRAKKRPRRO_STORAGE_KEY);
      const all: Record<string, GymDayWorkout> = raw ? JSON.parse(raw) : {};
      const today = all[gyymtrakkrprroTodayKey];
      if (today) {
        setGyymtrakkrprroExercises(today.gyymtrakkrprroExercises ?? []);
        setGyymtrakkrprroSelGroups(today.gyymtrakkrprroMuscleGroups ?? []);
      }
      setGyymtrakkrprroStreak(gyymtrakkrprroCalcStreak(all));
      setGyymtrakkrprroWeekData(gyymtrakkrprroCalcWeek(all));
    } catch (_) {
      console.log('error');
    }
  }, [gyymtrakkrprroTodayKey]);

  useEffect(() => {
    gyymtrakkrprroLoad();
  }, [gyymtrakkrprroLoad]);

  const gyymtrakkrprroSave = useCallback(
    async (patch: Partial<GymDayWorkout>) => {
      try {
        const raw = await AsyncStorage.getItem(GYYMTRAKKRPRRO_STORAGE_KEY);
        const all: Record<string, GymDayWorkout> = raw ? JSON.parse(raw) : {};
        all[gyymtrakkrprroTodayKey] = {
          ...(all[gyymtrakkrprroTodayKey] ?? {
            gyymtrakkrprroExercises: [],
            gyymtrakkrprroMuscleGroups: [],
          }),
          ...patch,
        };
        await AsyncStorage.setItem(
          GYYMTRAKKRPRRO_STORAGE_KEY,
          JSON.stringify(all),
        );
        setGyymtrakkrprroStreak(gyymtrakkrprroCalcStreak(all));
        setGyymtrakkrprroWeekData(gyymtrakkrprroCalcWeek(all));
      } catch (e) {
        console.log('error');
      }
    },
    [gyymtrakkrprroTodayKey],
  );

  useFocusEffect(
    useCallback(() => {
      setGyymtrakkrprroView('main');
      setGyymtrakkrprroExpandedId(null);
      return () => {
        setGyymtrakkrprroExpandedId(null);
        setGyymtrakkrprroSelGroups([]);
        gyymtrakkrprroSave({gyymtrakkrprroMuscleGroups: []});
      };
    }, [gyymtrakkrprroSave]),
  );

  const gyymtrakkrprroToggleGroup = (id: string) => {
    const next = gyymtrakkrprroSelGroups.includes(id)
      ? gyymtrakkrprroSelGroups.filter(g => g !== id)
      : [...gyymtrakkrprroSelGroups, id];
    setGyymtrakkrprroSelGroups(next);
    gyymtrakkrprroSave({gyymtrakkrprroMuscleGroups: next});
  };

  const gyymtrakkrprroOpenAdd = () => {
    setGyymtrakkrprroEditingId(null);
    setGyymtrakkrprroFormName('');
    setGyymtrakkrprroFormSets([
      {
        gyymtrakkrprroId: gyymtrakkrprroUid(),
        gyymtrakkrprroWeight: '0',
        gyymtrakkrprroReps: '0',
      },
    ]);
    setGyymtrakkrprroView('add');
  };

  const gyymtrakkrprroOpenEdit = (ex: GymExercise) => {
    setGyymtrakkrprroEditingId(ex.gyymtrakkrprroId);
    setGyymtrakkrprroFormName(ex.gyymtrakkrprroName);
    setGyymtrakkrprroFormSets(ex.gyymtrakkrprroSets.map(s => ({...s})));
    setGyymtrakkrprroView('add');
  };

  const gyymtrakkrprroSubmitExercise = () => {
    if (!gyymtrakkrprroFormName.trim()) {
      return;
    }
    let next: GymExercise[];
    if (gyymtrakkrprroEditingId) {
      next = gyymtrakkrprroExercises.map(e =>
        e.gyymtrakkrprroId === gyymtrakkrprroEditingId
          ? {
              ...e,
              gyymtrakkrprroName: gyymtrakkrprroFormName.trim(),
              gyymtrakkrprroSets: gyymtrakkrprroFormSets,
            }
          : e,
      );
    } else {
      next = [
        ...gyymtrakkrprroExercises,
        {
          gyymtrakkrprroId: gyymtrakkrprroUid(),
          gyymtrakkrprroName: gyymtrakkrprroFormName.trim(),
          gyymtrakkrprroSets: gyymtrakkrprroFormSets,
        },
      ];
    }
    setGyymtrakkrprroExercises(next);
    setGyymtrakkrprroSelGroups([]);
    gyymtrakkrprroSave({
      gyymtrakkrprroExercises: next,
      gyymtrakkrprroMuscleGroups: [],
    });
    setGyymtrakkrprroView('main');
  };

  const gyymtrakkrprroDeleteExercise = (id: string) => {
    Alert.alert('Delete Exercise', 'Are you sure?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          const next = gyymtrakkrprroExercises.filter(
            e => e.gyymtrakkrprroId !== id,
          );
          setGyymtrakkrprroExercises(next);
          gyymtrakkrprroSave({gyymtrakkrprroExercises: next});
        },
      },
    ]);
  };

  const gyymtrakkrprroAddSet = () =>
    setGyymtrakkrprroFormSets(prev => [
      ...prev,
      {
        gyymtrakkrprroId: gyymtrakkrprroUid(),
        gyymtrakkrprroWeight: '0',
        gyymtrakkrprroReps: '0',
      },
    ]);

  const gyymtrakkrprroRemoveSet = (id: string) => {
    if (gyymtrakkrprroFormSets.length <= 1) {
      return;
    }
    setGyymtrakkrprroFormSets(prev =>
      prev.filter(s => s.gyymtrakkrprroId !== id),
    );
  };

  const gyymtrakkrprroUpdateSet = (
    id: string,
    field: 'gyymtrakkrprroWeight' | 'gyymtrakkrprroReps',
    value: string,
  ) =>
    setGyymtrakkrprroFormSets(prev =>
      prev.map(s => (s.gyymtrakkrprroId === id ? {...s, [field]: value} : s)),
    );

  const gyymtrakkrprroTotalSets = gyymtrakkrprroExercises.reduce(
    (s, e) => s + e.gyymtrakkrprroSets.length,
    0,
  );
  const gyymtrakkrprroTotalVolume = gyymtrakkrprroExercises.reduce(
    (s, e) =>
      s +
      e.gyymtrakkrprroSets.reduce(
        (s2, set) =>
          s2 +
          (parseFloat(set.gyymtrakkrprroWeight) || 0) *
            (parseFloat(set.gyymtrakkrprroReps) || 0),
        0,
      ),
    0,
  );
  const gyymtrakkrprroFormValid = gyymtrakkrprroFormName.trim().length > 0;
  const gyymtrakkrprroStreakDisplay = Math.max(1, gyymtrakkrprroStreak);

  const gyymtrakkrprroRenderHeader = () => (
    <View style={styles.gyymtrakkrprroHeader}>
      <View style={styles.gyymtrakkrprroStreakBadge}>
        <Image
          source={require('../../assets/i/gyymtrakkpwfir.png')}
          style={{width: 16, height: 16, marginRight: 4}}
        />
        <Text style={styles.gyymtrakkrprroStreakText}>
          {gyymtrakkrprroStreakDisplay} day streak
        </Text>
      </View>

      <View style={styles.gyymtrakkrprroWeekRow}>
        {gyymtrakkrprroWeekLabels.map((label, idx) => {
          const isToday = idx === 6;
          const hasDone = !!gyymtrakkrprroWeekData[idx] || isToday;
          return (
            <View key={idx} style={styles.gyymtrakkrprroWeekCell}>
              <Text style={styles.gyymtrakkrprroWeekLabel}>{label}</Text>
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
                  <Text style={styles.gyymtrakkrprroWeekDotCheck}>✓</Text>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );

  if (gyymtrakkrprroView === 'add') {
    return (
      <View style={styles.gyymtrakkrprroRoot}>
        <KeyboardAvoidingView
          style={styles.gyymtrakkrprroFlex1}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView
            contentContainerStyle={styles.gyymtrakkrprroFormScroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            {gyymtrakkrprroRenderHeader()}
            <View style={{paddingHorizontal: 16}}>
              <View style={styles.gyymtrakkrprroFormTopBar}>
                <TouchableOpacity
                  onPress={() => setGyymtrakkrprroView('main')}
                  style={styles.gyymtrakkrprroBackBtn}>
                  <Image
                    source={require('../../assets/i/gyymtrakkpwback.png')}
                    style={{width: 16, height: 16}}
                  />

                  <Text style={styles.gyymtrakkrprroBackText}>Back</Text>
                </TouchableOpacity>
                <Text style={styles.gyymtrakkrprroFormTitle}>New Exercise</Text>
                <TouchableOpacity
                  onPress={gyymtrakkrprroSubmitExercise}
                  disabled={!gyymtrakkrprroFormValid}>
                  <Text
                    style={[
                      styles.gyymtrakkrprroSaveText,
                      !gyymtrakkrprroFormValid &&
                        styles.gyymtrakkrprroSaveDisabled,
                    ]}>
                    Save
                  </Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.gyymtrakkrprroFieldLabel}>
                EXERCISE NAME *
              </Text>
              <TextInput
                style={styles.gyymtrakkrprroNameInput}
                placeholder="e.g. Bench Press"
                placeholderTextColor="#FFFFFF80"
                value={gyymtrakkrprroFormName}
                onChangeText={setGyymtrakkrprroFormName}
              />

              <View style={styles.gyymtrakkrprroSetsHeaderRow}>
                <Text style={styles.gyymtrakkrprroFieldLabel}>SETS</Text>
                <Text style={styles.gyymtrakkrprroSetsCount}>
                  {gyymtrakkrprroFormSets.length}{' '}
                  {gyymtrakkrprroFormSets.length === 1 ? 'set' : 'sets'}
                </Text>
              </View>

              {gyymtrakkrprroFormSets.map((set, idx) => (
                <View
                  key={set.gyymtrakkrprroId}
                  style={styles.gyymtrakkrprroSetRow}>
                  <View style={styles.gyymtrakkrprroSetNumCircle}>
                    <Text style={styles.gyymtrakkrprroSetNumText}>
                      {idx + 1}
                    </Text>
                  </View>

                  <View style={styles.gyymtrakkrprroSetFields}>
                    <View style={styles.gyymtrakkrprroSetField}>
                      <Text style={styles.gyymtrakkrprroSetFieldLabel}>
                        WEIGHT (KG)
                      </Text>
                      <View style={styles.gyymtrakkrprroSetInputBox}>
                        <TextInput
                          style={styles.gyymtrakkrprroSetInput}
                          keyboardType="numeric"
                          value={set.gyymtrakkrprroWeight}
                          onChangeText={v =>
                            gyymtrakkrprroUpdateSet(
                              set.gyymtrakkrprroId,
                              'gyymtrakkrprroWeight',
                              v,
                            )
                          }
                        />
                      </View>
                    </View>
                    <View style={styles.gyymtrakkrprroSetField}>
                      <Text style={styles.gyymtrakkrprroSetFieldLabel}>
                        REPS
                      </Text>
                      <View style={styles.gyymtrakkrprroSetInputBox}>
                        <TextInput
                          style={styles.gyymtrakkrprroSetInput}
                          keyboardType="numeric"
                          value={set.gyymtrakkrprroReps}
                          onChangeText={v =>
                            gyymtrakkrprroUpdateSet(
                              set.gyymtrakkrprroId,
                              'gyymtrakkrprroReps',
                              v,
                            )
                          }
                        />
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      gyymtrakkrprroRemoveSet(set.gyymtrakkrprroId)
                    }
                    activeOpacity={0.75}>
                    <Image
                      source={require('../../assets/i/gyymtrakkpwrem.png')}
                    />
                  </TouchableOpacity>
                </View>
              ))}

              <TouchableOpacity
                style={styles.gyymtrakkrprroAddSetBtn}
                onPress={gyymtrakkrprroAddSet}
                activeOpacity={0.75}>
                <Image source={require('../../assets/i/gyymtrakkpwad.png')} />
                <Text style={styles.gyymtrakkrprroAddSetText}>Add Set</Text>
              </TouchableOpacity>

              <View style={styles.gyymtrakkrprroSpacerSm} />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        <View style={styles.gyymtrakkrprroFormBottom}>
          <TouchableOpacity
            onPress={gyymtrakkrprroSubmitExercise}
            disabled={!gyymtrakkrprroFormValid}
            activeOpacity={gyymtrakkrprroFormValid ? 0.85 : 1}>
            <View
              style={[
                styles.gyymtrakkrprroSubmitBtn,
                !gyymtrakkrprroFormValid && styles.gyymtrakkrprroSubmitBtnOff,
              ]}>
              <Text
                style={[
                  styles.gyymtrakkrprroSubmitBtnText,
                  !gyymtrakkrprroFormValid && ({color: '#FFFFFF4D'} as any),
                ]}>
                ✓ Add Exercise
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.gyymtrakkrprroRoot}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.gyymtrakkrprroMainScroll}>
        {gyymtrakkrprroRenderHeader()}
        <View style={{paddingHorizontal: 16}}>
          <View style={styles.gyymtrakkrprroDateBlock}>
            <Text style={styles.gyymtrakkrprroTodayLabel}>TODAY'S WORKOUT</Text>
            <Text style={styles.gyymtrakkrprroDateText}>
              {gyymtrakkrprroFormatDate()}
            </Text>
          </View>

          {gyymtrakkrprroExercises.length > 0 && (
            <View style={styles.gyymtrakkrprroStatsRow}>
              <View style={styles.gyymtrakkrprroStatCard}>
                <Text style={styles.gyymtrakkrprroStatValue}>
                  {gyymtrakkrprroExercises.length}
                </Text>
                <Text style={styles.gyymtrakkrprroStatLabel}>Exercises</Text>
              </View>
              <View style={styles.gyymtrakkrprroStatCard}>
                <Text style={styles.gyymtrakkrprroStatValue}>
                  {gyymtrakkrprroTotalSets}
                </Text>
                <Text style={styles.gyymtrakkrprroStatLabel}>Total Sets</Text>
              </View>
              <View style={styles.gyymtrakkrprroStatCard}>
                <Text style={styles.gyymtrakkrprroStatValue}>
                  {gyymtrakkrprroTotalVolume}kg
                </Text>
                <Text style={styles.gyymtrakkrprroStatLabel}>Volume</Text>
              </View>
            </View>
          )}

          <Text style={styles.gyymtrakkrprroSectionLabel}>MUSCLE GROUPS</Text>
          <View style={styles.gyymtrakkrprroMuscleGrid}>
            {GYYMTRAKKRPRRO_MUSCLE_GROUPS.map(group => {
              const gyymtrakkrprroSelected = gyymtrakkrprroSelGroups.includes(
                group.id,
              );
              return (
                <TouchableOpacity
                  key={group.id}
                  style={[
                    styles.gyymtrakkrprroMuscleCard,
                    gyymtrakkrprroSelected &&
                      styles.gyymtrakkrprroMuscleCardSelected,
                  ]}
                  onPress={() => gyymtrakkrprroToggleGroup(group.id)}
                  activeOpacity={0.75}>
                  <Text style={styles.gyymtrakkrprroMuscleEmoji}>
                    {group.emoji}
                  </Text>
                  <Text
                    style={[
                      styles.gyymtrakkrprroMuscleLabel,
                      gyymtrakkrprroSelected &&
                        styles.gyymtrakkrprroMuscleLabelSel,
                    ]}>
                    {group.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Exercises header */}
          <View style={styles.gyymtrakkrprroExHeader}>
            <Text style={styles.gyymtrakkrprroSectionLabel}>EXERCISES</Text>
            <Text style={styles.gyymtrakkrprroLoggedText}>
              {gyymtrakkrprroExercises.length} logged
            </Text>
          </View>

          {/* Exercises list */}
          {gyymtrakkrprroExercises.length === 0 ? (
            <View style={styles.gyymtrakkrprroEmptyCard}>
              <Text style={styles.gyymtrakkrprroEmptyEmoji}>🏋️</Text>
              <Text style={styles.gyymtrakkrprroEmptyTitle}>
                No exercises yet
              </Text>
              <Text style={styles.gyymtrakkrprroEmptySubtitle}>
                Tap + to add your first exercise
              </Text>
            </View>
          ) : (
            gyymtrakkrprroExercises.map((ex, exIdx) => {
              const gyymtrakkrprroExpanded =
                gyymtrakkrprroExpandedId === ex.gyymtrakkrprroId;
              return (
                <View
                  key={ex.gyymtrakkrprroId}
                  style={styles.gyymtrakkrprroExCard}>
                  <View style={styles.gyymtrakkrprroExRow}>
                    <LinearGradient
                      colors={['#0378DE', '#0255A3']}
                      style={styles.gyymtrakkrprroExNum}>
                      <Text style={styles.gyymtrakkrprroExNumText}>
                        {exIdx + 1}
                      </Text>
                    </LinearGradient>

                    <View style={styles.gyymtrakkrprroExInfo}>
                      <Text style={styles.gyymtrakkrprroExName}>
                        {ex.gyymtrakkrprroName}
                      </Text>
                      <Text style={styles.gyymtrakkrprroExSets}>
                        {ex.gyymtrakkrprroSets.length} sets
                      </Text>
                    </View>

                    <View style={styles.gyymtrakkrprroExActions}>
                      <TouchableOpacity
                        onPress={() => gyymtrakkrprroOpenEdit(ex)}
                        style={styles.gyymtrakkrprroExActionBtn}>
                        <Image
                          source={require('../../assets/i/gyymtrakkped.png')}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          gyymtrakkrprroDeleteExercise(ex.gyymtrakkrprroId)
                        }
                        style={styles.gyymtrakkrprroExActionBtn}>
                        <Image
                          source={require('../../assets/i/gyymtrakkpwdel.png')}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          setGyymtrakkrprroExpandedId(
                            gyymtrakkrprroExpanded ? null : ex.gyymtrakkrprroId,
                          )
                        }
                        style={styles.gyymtrakkrprroExActionBtn}>
                        <Image
                          source={
                            gyymtrakkrprroExpanded
                              ? require('../../assets/i/gyymtrakkpwarup.png')
                              : require('../../assets/i/gyymtrakkpwarr.png')
                          }
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {gyymtrakkrprroExpanded && (
                    <View style={styles.gyymtrakkrprroSetTable}>
                      <View style={styles.gyymtrakkrprroSetTableHead}>
                        <Text
                          style={[
                            styles.gyymtrakkrprroTableHeadTxt,
                            styles.gyymtrakkrprroFlex1,
                          ]}>
                          Set
                        </Text>
                        <Text
                          style={[
                            styles.gyymtrakkrprroTableHeadTxt,
                            styles.gyymtrakkrprroFlex2,
                          ]}>
                          Weight (kg)
                        </Text>
                        <Text
                          style={[
                            styles.gyymtrakkrprroTableHeadTxt,
                            styles.gyymtrakkrprroFlex2,
                          ]}>
                          Reps
                        </Text>
                      </View>
                      {ex.gyymtrakkrprroSets.map((set, si) => (
                        <View
                          key={set.gyymtrakkrprroId}
                          style={[
                            styles.gyymtrakkrprroSetTableRow,
                            si % 2 === 0 && styles.gyymtrakkrprroSetTableRowAlt,
                          ]}>
                          <Text
                            style={[
                              styles.gyymtrakkrprroTableSetNum,
                              styles.gyymtrakkrprroFlex1,
                            ]}>
                            #{si + 1}
                          </Text>
                          <Text
                            style={[
                              styles.gyymtrakkrprroTableCell,
                              styles.gyymtrakkrprroFlex2,
                            ]}>
                            {set.gyymtrakkrprroWeight} kg
                          </Text>
                          <Text
                            style={[
                              styles.gyymtrakkrprroTableCell,
                              styles.gyymtrakkrprroFlex2,
                            ]}>
                            {set.gyymtrakkrprroReps} reps
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              );
            })
          )}

          <View style={styles.gyymtrakkrprroSpacerMd} />
        </View>
      </ScrollView>

      {/* Add Exercise Button */}
      <View style={styles.gyymtrakkrprroAddBtnWrap}>
        <TouchableOpacity onPress={gyymtrakkrprroOpenAdd} activeOpacity={0.85}>
          <LinearGradient
            colors={['#0378DE', '#0255A3']}
            style={styles.gyymtrakkrprroAddBtn}>
            <Image source={require('../../assets/i/gyymtrakkpwplss.png')} />
            <Text style={styles.gyymtrakkrprroAddBtnText}>Add Exercise</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  gyymtrakkrprroStreakBadgeEmpty: {
    backgroundColor: '#252A50',
    borderColor: '#3D4670',
    gap: 4,
  },

  gyymtrakkrprroStreakText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  gyymtrakkrprroWeekRow: {
    flexDirection: 'row',
    gap: 6,
  },

  gyymtrakkrprroRoot: {
    flex: 1,
    backgroundColor: '#1A1E3D',
  },

  gyymtrakkrprroFlex1: {flex: 1},
  gyymtrakkrprroFlex2: {flex: 2},
  gyymtrakkrprroSpacerSm: {height: 130},
  gyymtrakkrprroSpacerMd: {height: 140},
  gyymtrakkrprroRemoveBtnDisabled: {opacity: 0.25},

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
  gyymtrakkrprroStreakBadge: {
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F973162E',
    borderWidth: 1,
    borderColor: '#F9731659',
  },

  gyymtrakkrprroWeekCell: {
    alignItems: 'center',
    gap: 4,
  },
  gyymtrakkrprroWeekLabel: {
    color: '#8895B0',
    fontSize: 11,
    fontWeight: '600',
  },
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
  gyymtrakkrprroWeekDotCheck: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },

  gyymtrakkrprroMainScroll: {
    paddingTop: 18,
  },
  gyymtrakkrprroDateBlock: {
    marginBottom: 16,
  },
  gyymtrakkrprroTodayLabel: {
    color: '#6B7299',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  gyymtrakkrprroDateText: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '800',
  },

  gyymtrakkrprroStatsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  gyymtrakkrprroStatCard: {
    flex: 1,
    backgroundColor: '#282E50',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF12',
    minHeight: 68,
    justifyContent: 'center',
  },
  gyymtrakkrprroStatValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  gyymtrakkrprroStatLabel: {
    color: '#6B7299',
    fontSize: 11,
    marginTop: 2,
  },

  gyymtrakkrprroSectionLabel: {
    color: '#6B7299',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 10,
  },

  gyymtrakkrprroMuscleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 4,
    justifyContent: 'center',
  },
  gyymtrakkrprroMuscleCard: {
    width: '22.5%',
    aspectRatio: 1,
    backgroundColor: '#282E50',
    borderRadius: 14,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.1,
    borderColor: '#FFFFFF0F',
  },
  gyymtrakkrprroMuscleCardSelected: {
    backgroundColor: '#0D2A5C',
    borderColor: '#0378DE',
  },
  gyymtrakkrprroMuscleEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  gyymtrakkrprroMuscleLabel: {
    color: '#8895B0',
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  gyymtrakkrprroMuscleLabelSel: {
    color: '#fff',
  },

  gyymtrakkrprroExHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  gyymtrakkrprroLoggedText: {
    color: '#6B7299',
    fontSize: 12,
  },

  gyymtrakkrprroEmptyCard: {
    backgroundColor: '#20264A',
    borderRadius: 16,
    paddingVertical: 40,
    alignItems: 'center',
  },
  gyymtrakkrprroEmptyEmoji: {
    fontSize: 36,
    marginBottom: 12,
  },
  gyymtrakkrprroEmptyTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
  },
  gyymtrakkrprroEmptySubtitle: {
    color: '#6B7299',
    fontSize: 13,
  },

  gyymtrakkrprroExCard: {
    backgroundColor: '#282E50',
    borderWidth: 1,
    borderColor: '#FFFFFF12',
    borderRadius: 16,
    marginBottom: 10,
    overflow: 'hidden',
  },
  gyymtrakkrprroExRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 12,
  },
  gyymtrakkrprroExNum: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gyymtrakkrprroExNumText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  gyymtrakkrprroExInfo: {
    flex: 1,
  },
  gyymtrakkrprroExName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  gyymtrakkrprroExSets: {
    color: '#6B7299',
    fontSize: 12,
    marginTop: 2,
  },
  gyymtrakkrprroExActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  gyymtrakkrprroExActionBtn: {
    padding: 4,
  },
  gyymtrakkrprroExActionIcon: {
    fontSize: 16,
  },
  gyymtrakkrprroChevron: {
    color: '#8895B0',
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 2,
  },

  gyymtrakkrprroSetTable: {
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  gyymtrakkrprroSetTableHead: {
    flexDirection: 'row',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#2E3560',
    marginBottom: 4,
  },
  gyymtrakkrprroTableHeadTxt: {
    color: '#6B7299',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  gyymtrakkrprroSetTableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderRadius: 8,
    paddingHorizontal: 4,
  },
  gyymtrakkrprroSetTableRowAlt: {
    backgroundColor: '#252B52',
  },
  gyymtrakkrprroTableSetNum: {
    color: '#4A80D0',
    fontSize: 13,
    fontWeight: '700',
  },
  gyymtrakkrprroTableCell: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },

  gyymtrakkrprroAddBtnWrap: {
    position: 'absolute',
    bottom: 90,
    left: 16,
    right: 16,
  },
  gyymtrakkrprroAddBtn: {
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
  gyymtrakkrprroAddBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  gyymtrakkrprroFormTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#252B52',
  },
  gyymtrakkrprroBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  gyymtrakkrprroBackText: {
    color: '#5AB8FF',
    fontSize: 15,
    fontWeight: '600',
  },
  gyymtrakkrprroFormTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  gyymtrakkrprroSaveText: {
    color: '#0378DE',
    fontSize: 15,
    fontWeight: '600',
    minWidth: 60,
    textAlign: 'right',
  },
  gyymtrakkrprroSaveDisabled: {
    color: '#3D4670',
  },

  gyymtrakkrprroFormScroll: {
    paddingTop: 18,
  },
  gyymtrakkrprroFieldLabel: {
    color: '#FFFFFF80',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginTop: 16,
  },
  gyymtrakkrprroNameInput: {
    backgroundColor: '#282E50',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    color: '#fff',
    fontSize: 15,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FFFFFF1A',
  },
  gyymtrakkrprroSetsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  gyymtrakkrprroSetsCount: {
    color: '#6B7299',
    fontSize: 12,
  },

  gyymtrakkrprroSetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#20264A',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 10,
    gap: 10,
    borderWidth: 1,
    borderColor: '#2E3560',
  },
  gyymtrakkrprroSetNumCircle: {
    width: 31,
    height: 31,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0378DE33',
  },
  gyymtrakkrprroSetNumText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  gyymtrakkrprroSetFields: {
    flex: 1,
    flexDirection: 'row',
    gap: 10,
  },
  gyymtrakkrprroSetField: {
    flex: 1,
  },
  gyymtrakkrprroSetFieldLabel: {
    color: '#6B7299',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  gyymtrakkrprroSetInputBox: {
    backgroundColor: '#282E50',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#FFFFFF1A',
  },
  gyymtrakkrprroSetInput: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    padding: 0,
  },
  gyymtrakkrprroRemoveBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#5C1A1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gyymtrakkrprroRemoveBtnX: {
    color: '#E74C3C',
    fontSize: 11,
    fontWeight: '700',
  },

  // Add Set button
  gyymtrakkrprroAddSetBtn: {
    borderRadius: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    borderWidth: 1.1,
    borderColor: '#0378DE80',
    marginTop: 8,
    minHeight: 48,
    justifyContent: 'center',
    backgroundColor: '#0378DE26',
  },
  gyymtrakkrprroAddSetText: {
    color: '#5AB8FF',
    fontSize: 14,
    fontWeight: '700',
  },

  // Submit button
  gyymtrakkrprroFormBottom: {
    paddingHorizontal: 16,
    paddingBottom: 100,
    paddingTop: 12,
  },
  gyymtrakkrprroSubmitBtn: {
    backgroundColor: '#0378DE',
    borderRadius: 16,
    paddingVertical: 17,
    alignItems: 'center',
  },
  gyymtrakkrprroSubmitBtnOff: {
    backgroundColor: '#20264A',
  },
  gyymtrakkrprroSubmitBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default Gyymtrakkprrowrkot;
