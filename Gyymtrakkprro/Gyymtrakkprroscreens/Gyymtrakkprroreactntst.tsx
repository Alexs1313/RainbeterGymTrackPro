import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';

import {useFocusEffect} from '@react-navigation/native';

import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Image,
  ScrollView,
  Share,
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

const GYYMTRAKKRPRROWRKOT_KEY = 'gyymtrakkrprro_workouts';
const GYYMTRAKKRPRRO_WEEK_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const gyymtrakkrprroDayKeyFromDate = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate(),
  ).padStart(2, '0')}`;

const gyymtrakkrprroAddDays = (d: Date, days: number) => {
  const next = new Date(d);
  next.setDate(next.getDate() + days);
  return next;
};

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

const GYYMTRAKKRPRRO_GAME_SECONDS = 20;
const GYYMTRAKKRPRRO_GRID_COLS = 4;
const GYYMTRAKKRPRRO_GRID_ROWS = 3;
const GYYMTRAKKRPRRO_ZONE_MS = 1200;
const GYYMTRAKKRPRRO_TICK_MS = 100;

type GamePhase = 'intro' | 'game' | 'results';

const Gyymtrakkprroreactntst = () => {
  const [gyymtrakkrprroPhase, setGyymtrakkrprroPhase] =
    useState<GamePhase>('intro');
  const [gyymtrakkrprroStreak, setGyymtrakkrprroStreak] = useState(0);
  const [gyymtrakkrprroWeek, setGyymtrakkrprroWeek] = useState<boolean[]>([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);

  const gyymtrakkrprroZonesCount =
    GYYMTRAKKRPRRO_GRID_COLS * GYYMTRAKKRPRRO_GRID_ROWS;

  const [gyymtrakkrprroTimeLeftMs, setGyymtrakkrprroTimeLeftMs] = useState(
    GYYMTRAKKRPRRO_GAME_SECONDS * 1000,
  );
  const [gyymtrakkrprroLitIndex, setGyymtrakkrprroLitIndex] = useState<
    number | null
  >(null);
  const [gyymtrakkrprroScore, setGyymtrakkrprroScore] = useState(0);
  const [gyymtrakkrprroMissed, setGyymtrakkrprroMissed] = useState(0);
  const [gyymtrakkrprroLastReactionMs, setGyymtrakkrprroLastReactionMs] =
    useState<number | null>(null);
  const [gyymtrakkrprroReactionHistory, setGyymtrakkrprroReactionHistory] =
    useState<number[]>([]);

  const gyymtrakkrprroGameStartAtRef = useRef<number | null>(null);
  const gyymtrakkrprroTickTimerRef = useRef<ReturnType<
    typeof setInterval
  > | null>(null);
  const gyymtrakkrprroZoneTimerRef = useRef<ReturnType<
    typeof setInterval
  > | null>(null);
  const gyymtrakkrprroLitIndexRef = useRef<number | null>(null);
  const gyymtrakkrprroLitAtRef = useRef<number | null>(null);
  const gyymtrakkrprroTappedThisZoneRef = useRef(false);

  const gyymtrakkrprroAccuracy = useMemo(() => {
    const attempts = gyymtrakkrprroScore + gyymtrakkrprroMissed;
    if (!attempts) {
      return 0;
    }
    return Math.round((gyymtrakkrprroScore / attempts) * 100);
  }, [gyymtrakkrprroScore, gyymtrakkrprroMissed]);

  const gyymtrakkrprroBestMs = useMemo(() => {
    if (!gyymtrakkrprroReactionHistory.length) {
      return null;
    }
    return Math.min(...gyymtrakkrprroReactionHistory);
  }, [gyymtrakkrprroReactionHistory]);

  const gyymtrakkrprroAvgMs = useMemo(() => {
    if (!gyymtrakkrprroReactionHistory.length) {
      return null;
    }
    const sum = gyymtrakkrprroReactionHistory.reduce((a, b) => a + b, 0);
    return Math.round(sum / gyymtrakkrprroReactionHistory.length);
  }, [gyymtrakkrprroReactionHistory]);

  const gyymtrakkrprroLoad = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(GYYMTRAKKRPRROWRKOT_KEY);
      const all = raw ? (JSON.parse(raw) as Record<string, GymDayWorkout>) : {};
      setGyymtrakkrprroStreak(gyymtrakkrprroCalcStreak(all));
      setGyymtrakkrprroWeek(gyymtrakkrprroCalcWeek(all));
    } catch (_) {
      console.log('error');
    }
  }, []);

  useEffect(() => {
    gyymtrakkrprroLoad();
  }, [gyymtrakkrprroLoad]);

  const gyymtrakkrprroStopTimers = useCallback(() => {
    if (gyymtrakkrprroTickTimerRef.current) {
      clearInterval(gyymtrakkrprroTickTimerRef.current);
      gyymtrakkrprroTickTimerRef.current = null;
    }
    if (gyymtrakkrprroZoneTimerRef.current) {
      clearInterval(gyymtrakkrprroZoneTimerRef.current);
      gyymtrakkrprroZoneTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      gyymtrakkrprroStopTimers();
    };
  }, [gyymtrakkrprroStopTimers]);

  useEffect(() => {
    gyymtrakkrprroLitIndexRef.current = gyymtrakkrprroLitIndex;
  }, [gyymtrakkrprroLitIndex]);

  const gyymtrakkrprroResetRun = useCallback(() => {
    setGyymtrakkrprroTimeLeftMs(GYYMTRAKKRPRRO_GAME_SECONDS * 1000);
    setGyymtrakkrprroLitIndex(null);
    setGyymtrakkrprroScore(0);
    setGyymtrakkrprroMissed(0);
    setGyymtrakkrprroLastReactionMs(null);
    setGyymtrakkrprroReactionHistory([]);
    gyymtrakkrprroGameStartAtRef.current = null;
    gyymtrakkrprroLitAtRef.current = null;
    gyymtrakkrprroTappedThisZoneRef.current = false;
  }, []);

  useFocusEffect(
    useCallback(() => {
      setGyymtrakkrprroPhase('intro');
    }, []),
  );

  const gyymtrakkrprroPickNextZone = useCallback(() => {
    setGyymtrakkrprroLitIndex(prev => {
      if (gyymtrakkrprroZonesCount <= 1) {
        return 0;
      }
      let next = Math.floor(Math.random() * gyymtrakkrprroZonesCount);
      if (prev !== null) {
        let guard = 0;
        while (next === prev && guard < 10) {
          next = Math.floor(Math.random() * gyymtrakkrprroZonesCount);
          guard++;
        }
      }
      return next;
    });
    gyymtrakkrprroLitAtRef.current = Date.now();
    if (gyymtrakkrprroLitAtRef.current !== null) {
      gyymtrakkrprroTappedThisZoneRef.current = false;
    }
  }, [gyymtrakkrprroZonesCount]);

  const gyymtrakkrprroStartGame = useCallback(() => {
    gyymtrakkrprroStopTimers();
    gyymtrakkrprroResetRun();
    setGyymtrakkrprroPhase('game');
    const startAt = Date.now();
    gyymtrakkrprroGameStartAtRef.current = startAt;

    gyymtrakkrprroPickNextZone();

    gyymtrakkrprroTickTimerRef.current = setInterval(() => {
      const s = gyymtrakkrprroGameStartAtRef.current;
      if (!s) {
        return;
      }
      const elapsed = Date.now() - s;
      const left = Math.max(0, GYYMTRAKKRPRRO_GAME_SECONDS * 1000 - elapsed);
      setGyymtrakkrprroTimeLeftMs(left);
      if (left <= 0) {
        gyymtrakkrprroStopTimers();
        setGyymtrakkrprroLitIndex(null);
        setGyymtrakkrprroPhase('results');
      }
    }, GYYMTRAKKRPRRO_TICK_MS);

    gyymtrakkrprroZoneTimerRef.current = setInterval(() => {
      if (
        gyymtrakkrprroLitIndexRef.current !== null &&
        !gyymtrakkrprroTappedThisZoneRef.current
      ) {
        setGyymtrakkrprroMissed(m => m + 1);
      }
      gyymtrakkrprroPickNextZone();
    }, GYYMTRAKKRPRRO_ZONE_MS);
  }, [
    gyymtrakkrprroPickNextZone,
    gyymtrakkrprroResetRun,
    gyymtrakkrprroStopTimers,
  ]);

  const gyymtrakkrprroBackToIntro = useCallback(() => {
    gyymtrakkrprroStopTimers();
    setGyymtrakkrprroPhase('intro');
  }, [gyymtrakkrprroStopTimers]);

  const gyymtrakkrprroTapZone = useCallback(
    (idx: number) => {
      if (gyymtrakkrprroPhase !== 'game') {
        return;
      }
      if (gyymtrakkrprroLitIndex === null) {
        return;
      }
      if (idx !== gyymtrakkrprroLitIndex) {
        return;
      }
      if (gyymtrakkrprroTappedThisZoneRef.current) {
        return;
      }
      gyymtrakkrprroTappedThisZoneRef.current = true;
      setGyymtrakkrprroScore(s => s + 1);

      const litAt = gyymtrakkrprroLitAtRef.current;
      if (litAt) {
        const rt = Math.max(0, Date.now() - litAt);
        setGyymtrakkrprroLastReactionMs(rt);
        setGyymtrakkrprroReactionHistory(h => [rt, ...h].slice(0, 50));
      }
    },
    [gyymtrakkrprroLitIndex, gyymtrakkrprroPhase],
  );

  const gyymtrakkrprroShareResults = useCallback(async () => {
    try {
      const avg = gyymtrakkrprroAvgMs ?? 0;
      const best = gyymtrakkrprroBestMs ?? 0;
      await Share.share({
        message: `Reaction Test Results\n\nScore: ${gyymtrakkrprroScore}\nAccuracy: ${gyymtrakkrprroAccuracy}%\nAvg reaction: ${avg}ms\nBest time: ${best}ms\nMissed: ${gyymtrakkrprroMissed}`,
      });
    } catch (_) {
      console.log('error');
    }
  }, [
    gyymtrakkrprroAccuracy,
    gyymtrakkrprroAvgMs,
    gyymtrakkrprroBestMs,
    gyymtrakkrprroMissed,
    gyymtrakkrprroScore,
  ]);

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
          const hasDone = !!gyymtrakkrprroWeek[idx] || isToday;
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

  const gyymtrakkrprroTimeLabel = useMemo(() => {
    return `${Math.ceil(gyymtrakkrprroTimeLeftMs / 1000)}s`;
  }, [gyymtrakkrprroTimeLeftMs]);

  const gyymtrakkrprroProgressPct = useMemo(() => {
    return Math.max(
      0,
      Math.min(
        1,
        gyymtrakkrprroTimeLeftMs / (GYYMTRAKKRPRRO_GAME_SECONDS * 1000),
      ),
    );
  }, [gyymtrakkrprroTimeLeftMs]);

  const gyymtrakkrprroMaxHistory = useMemo(() => {
    return Math.max(1, ...gyymtrakkrprroReactionHistory);
  }, [gyymtrakkrprroReactionHistory]);

  if (gyymtrakkrprroPhase === 'results') {
    return (
      <View style={styles.gyymtrakkrprroRoot}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.gyymtrakkrprroPad}>
          {gyymtrakkrprroRenderHeader()}
          <View style={{paddingHorizontal: 16}}>
            <Text style={styles.gyymtrakkrprroKicker}>MINI GAME</Text>
            <Text style={styles.gyymtrakkrprroTitle}>Results</Text>

            <LinearGradient
              colors={['#0A2D5A', '#062040']}
              style={styles.gyymtrakkrprroHeroCard}>
              <View style={{padding: 16, alignItems: 'center'}}>
                <Text style={styles.gyymtrakkrprroHeroEmoji}>👍</Text>
                <Text style={styles.gyymtrakkrprroHeroTitle}>Average</Text>
                <Text style={styles.gyymtrakkrprroHeroSub}>
                  Avg reaction:{' '}
                  <Text style={styles.gyymtrakkrprroHeroSubBold}>
                    {gyymtrakkrprroAvgMs ?? 0}ms
                  </Text>
                </Text>
              </View>
            </LinearGradient>

            <View style={styles.gyymtrakkrprroStatsGrid}>
              <View style={styles.gyymtrakkrprroStatCard}>
                <Image source={require('../../assets/i/gyymtrakkpaimns.png')} />
                <Text style={styles.gyymtrakkrprroStatValue}>
                  {gyymtrakkrprroScore}
                </Text>
                <Text style={styles.gyymtrakkrprroStatLabel}>Score</Text>
              </View>
              <View style={styles.gyymtrakkrprroStatCard}>
                <Image source={require('../../assets/i/gyymtrakkpaimn.png')} />
                <Text
                  style={[styles.gyymtrakkrprroStatValue, {color: '#22C55E'}]}>
                  {gyymtrakkrprroAccuracy}%
                </Text>
                <Text style={styles.gyymtrakkrprroStatLabel}>Accuracy</Text>
              </View>
              <View style={styles.gyymtrakkrprroStatCard}>
                <Image
                  source={require('../../assets/i/gyymtrakkpwltssf.png')}
                />
                <Text
                  style={[styles.gyymtrakkrprroStatValue, {color: '#4EA8FF'}]}>
                  {gyymtrakkrprroBestMs ?? 0}ms
                </Text>
                <Text style={styles.gyymtrakkrprroStatLabel}>Best Time</Text>
              </View>
              <View style={styles.gyymtrakkrprroStatCard}>
                <Image source={require('../../assets/i/gyymtrakkpwltm.png')} />
                <Text
                  style={[styles.gyymtrakkrprroStatValue, {color: '#FF5A6A'}]}>
                  {gyymtrakkrprroMissed}
                </Text>
                <Text style={styles.gyymtrakkrprroStatLabel}>Missed</Text>
              </View>
            </View>

            <Text style={styles.gyymtrakkrprroSectionTitle}>
              REACTION HISTORY
            </Text>
            <View style={styles.gyymtrakkrprroHistoryCard}>
              {gyymtrakkrprroReactionHistory.slice(0, 8).map((ms, i) => {
                const barPct = ms / gyymtrakkrprroMaxHistory;
                return (
                  <View
                    key={`${ms}-${String(i)}`}
                    style={styles.gyymtrakkrprroRow}>
                    <Text style={styles.gyymtrakkrprroRowLabel}>
                      #{gyymtrakkrprroScore - i}
                    </Text>
                    <View style={styles.gyymtrakkrprroRowBarTrack}>
                      <View
                        style={[
                          styles.gyymtrakkrprroRowBarFill,
                          {width: `${Math.max(0.12, barPct) * 100}%`},
                          i % 2 === 0
                            ? styles.gyymtrakkrprroRowBarFillOrange
                            : styles.gyymtrakkrprroRowBarFillBlue,
                        ]}
                      />
                    </View>
                    <Text style={styles.gyymtrakkrprroRowValue}>{ms}ms</Text>
                  </View>
                );
              })}
            </View>

            <TouchableOpacity
              onPress={gyymtrakkrprroShareResults}
              activeOpacity={0.9}
              style={styles.gyymtrakkrprroPrimaryBtn}>
              <Text style={styles.gyymtrakkrprroPrimaryBtnText}>Share</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={gyymtrakkrprroBackToIntro}
              activeOpacity={0.9}
              style={styles.gyymtrakkrprroSecondaryBtn}>
              <Text style={styles.gyymtrakkrprroSecondaryBtnText}>Back</Text>
            </TouchableOpacity>

            <View style={styles.gyymtrakkrprroSpacerBottom} />
          </View>
        </ScrollView>
      </View>
    );
  }

  if (gyymtrakkrprroPhase === 'game') {
    return (
      <View style={styles.gyymtrakkrprroRoot}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{flexGrow: 1, paddingBottom: 120}}>
          {gyymtrakkrprroRenderHeader()}

          <View style={styles.gyymtrakkrprroPad}>
            <View style={styles.gyymtrakkrprroGameHeader}>
              <View style={styles.gyymtrakkrprroMiniStat}>
                <Image source={require('../../assets/i/gyymtrakkwn.png')} />
                <Text style={styles.gyymtrakkrprroMiniStatValue}>
                  {gyymtrakkrprroScore}
                </Text>
              </View>

              <View style={styles.gyymtrakkrprroTimeWrap}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={styles.gyymtrakkrprroTimeLabel}>TIME</Text>
                  <Text style={styles.gyymtrakkrprroTimeText}>
                    {gyymtrakkrprroTimeLabel}
                  </Text>
                </View>
                <View style={styles.gyymtrakkrprroTimeBarTrack}>
                  <View
                    style={[
                      styles.gyymtrakkrprroTimeBarFill,
                      {width: `${gyymtrakkrprroProgressPct * 100}%`},
                    ]}
                  />
                </View>
              </View>

              <View style={styles.gyymtrakkrprroMiniStat}>
                <Image source={require('../../assets/i/gyymtrakkpaim.png')} />
                <Text style={styles.gyymtrakkrprroMiniStatValue}>
                  {gyymtrakkrprroMissed}
                </Text>
              </View>
            </View>

            <Text style={styles.gyymtrakkrprroHint}>
              Tap the{' '}
              <Text style={styles.gyymtrakkrprroHintAccent}>lit zones</Text> as
              fast as you can!
            </Text>

            <View style={styles.gyymtrakkrprroGameSubRow}>
              <Image source={require('../../assets/i/gyymtrakkpwback.png')} />
              <Text
                style={styles.gyymtrakkrprroBackLink}
                onPress={gyymtrakkrprroBackToIntro}>
                Back
              </Text>
            </View>

            <View style={styles.gyymtrakkrprroGrid}>
              {Array.from({length: gyymtrakkrprroZonesCount}).map((_, idx) => {
                const lit = idx === gyymtrakkrprroLitIndex;
                return (
                  <TouchableOpacity
                    key={String(idx)}
                    onPress={() => gyymtrakkrprroTapZone(idx)}
                    activeOpacity={0.9}
                    style={[
                      styles.gyymtrakkrprroZone,
                      lit && styles.gyymtrakkrprroZoneLit,
                    ]}>
                    {lit && <View style={styles.gyymtrakkrprroZoneDot} />}
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={{marginTop: 50, paddingHorizontal: 10}}>
              <View style={styles.gyymtrakkrprroGameFooter}>
                <Text style={styles.gyymtrakkrprroFooterLabel}>
                  Last reaction:
                </Text>
                <Text style={styles.gyymtrakkrprroFooterValue}>
                  {gyymtrakkrprroLastReactionMs ?? '—'}ms
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.gyymtrakkrprroRoot}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.gyymtrakkrprroPad}>
        {gyymtrakkrprroRenderHeader()}
        <View style={{paddingHorizontal: 16}}>
          <Text style={styles.gyymtrakkrprroKicker}>MINI GAME</Text>
          <Text style={styles.gyymtrakkrprroTitle}>Reaction Test</Text>

          <LinearGradient
            colors={['#0378DE4D', '#0378DE1A']}
            style={styles.gyymtrakkrprroHeroCard}>
            <View
              style={{
                padding: 16,
                justifyContent: 'center',
                alignItems: 'center',
                gap: 8,
              }}>
              <View style={styles.gyymtrakkrprroHeroIconWrap}>
                <Image source={require('../../assets/i/gyymtrakkpwlli.png')} />
              </View>
              <Text style={styles.gyymtrakkrprroHeroTitle}>
                Reaction Challenge
              </Text>
              <Text style={styles.gyymtrakkrprroHeroSub}>
                Test your athletic reflexes
              </Text>
            </View>
          </LinearGradient>

          <Text style={styles.gyymtrakkrprroSectionTitle}>HOW IT WORKS</Text>

          <View style={styles.gyymtrakkrprroHowList}>
            <View style={styles.gyymtrakkrprroHowItem}>
              <View style={styles.gyymtrakkrprroHowRow}>
                <Text style={styles.gyymtrakkrprroHowIcon}>👁️</Text>
                <View style={styles.gyymtrakkrprroFlex1}>
                  <Text style={styles.gyymtrakkrprroHowTitle}>
                    Watch the Grid
                  </Text>
                  <Text style={styles.gyymtrakkrprroHowSub}>
                    Zones will light up in blue on the 4×3 grid
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.gyymtrakkrprroHowItem}>
              <View style={styles.gyymtrakkrprroHowRow}>
                <Text style={styles.gyymtrakkrprroHowIcon}>☝️</Text>
                <View style={styles.gyymtrakkrprroFlex1}>
                  <Text style={styles.gyymtrakkrprroHowTitle}>Tap Fast</Text>
                  <Text style={styles.gyymtrakkrprroHowSub}>
                    Tap lit zones as quickly as possible before they disappear
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.gyymtrakkrprroHowItem}>
              <View style={styles.gyymtrakkrprroHowRow}>
                <Text style={styles.gyymtrakkrprroHowIcon}>⏱️</Text>
                <View style={styles.gyymtrakkrprroFlex1}>
                  <Text style={styles.gyymtrakkrprroHowTitle}>
                    {GYYMTRAKKRPRRO_GAME_SECONDS} Second Round
                  </Text>
                  <Text style={styles.gyymtrakkrprroHowSub}>
                    Each game lasts {GYYMTRAKKRPRRO_GAME_SECONDS} seconds —
                    score as many taps as you can
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.gyymtrakkrprroHowItem}>
              <View style={styles.gyymtrakkrprroHowRow}>
                <Text style={styles.gyymtrakkrprroHowIcon}>📊</Text>
                <View style={styles.gyymtrakkrprroFlex1}>
                  <Text style={styles.gyymtrakkrprroHowTitle}>
                    See Your Stats
                  </Text>
                  <Text style={styles.gyymtrakkrprroHowSub}>
                    View your average reaction time and score after the round
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.gyymtrakkrprroMiniCardsRow}>
            <View style={styles.gyymtrakkrprroMiniCard}>
              <Text style={styles.gyymtrakkrprroMiniCardIcon}>⏱️</Text>
              <Text style={styles.gyymtrakkrprroMiniCardValue}>
                {GYYMTRAKKRPRRO_GAME_SECONDS}s
              </Text>
              <Text style={styles.gyymtrakkrprroMiniCardLabel}>Duration</Text>
            </View>
            <View style={styles.gyymtrakkrprroMiniCard}>
              <Text style={styles.gyymtrakkrprroMiniCardIcon}>🎯</Text>
              <Text style={styles.gyymtrakkrprroMiniCardValue}>4×3</Text>
              <Text style={styles.gyymtrakkrprroMiniCardLabel}>Grid Size</Text>
            </View>
            <View style={styles.gyymtrakkrprroMiniCard}>
              <Text style={styles.gyymtrakkrprroMiniCardIcon}>⚡</Text>
              <Text style={styles.gyymtrakkrprroMiniCardValue}>
                {(GYYMTRAKKRPRRO_ZONE_MS / 1000).toFixed(1)}s
              </Text>
              <Text style={styles.gyymtrakkrprroMiniCardLabel}>Zone Time</Text>
            </View>
          </View>

          <View style={styles.gyymtrakkrprroSpacerBottom} />
        </View>
      </ScrollView>
      <View
        style={{
          position: 'absolute',
          bottom: 90,
          width: '92%',
          alignSelf: 'center',
        }}>
        <TouchableOpacity
          onPress={gyymtrakkrprroStartGame}
          activeOpacity={0.9}
          style={styles.gyymtrakkrprroPrimaryBtn}>
          <Image source={require('../../assets/i/gyymtrakkpwllig.png')} />
          <Text style={styles.gyymtrakkrprroPrimaryBtnText}>Start Game</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Gyymtrakkprroreactntst;

const styles = StyleSheet.create({
  gyymtrakkrprroSectionTitle: {
    color: '#FFFFFF80',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginTop: 14,
    marginBottom: 10,
  },

  gyymtrakkrprroHowList: {gap: 12, marginBottom: 14},
  gyymtrakkrprroHowItem: {
    backgroundColor: '#282E50',
    borderWidth: 1,
    borderColor: '#FFFFFF10',
    borderRadius: 16,
    padding: 12,
  },

  gyymtrakkrprroRoot: {
    flex: 1,
    backgroundColor: '#1A1E3D',
  },

  gyymtrakkrprroPad: {
    paddingTop: 18,
  },
  gyymtrakkrprroFlex1: {flex: 1},

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

  gyymtrakkrprroKicker: {
    color: '#FFFFFF80',
    fontSize: 12,
    letterSpacing: 1.5,
    fontWeight: '700',
    marginBottom: 6,
  },
  gyymtrakkrprroTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 14,
  },

  gyymtrakkrprroHeroCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#4EA8FF26',
    marginBottom: 16,
    minHeight: 160,
    justifyContent: 'center',
  },
  gyymtrakkrprroHeroIconWrap: {
    marginBottom: 12,
    alignItems: 'center',
  },
  gyymtrakkrprroHeroIcon: {width: 26, height: 26, tintColor: '#4EA8FF'},
  gyymtrakkrprroHeroEmoji: {fontSize: 46, marginBottom: 6},
  gyymtrakkrprroHeroTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 6,
  },
  gyymtrakkrprroHeroSub: {color: '#FFFFFFB3', fontSize: 13, fontWeight: '600'},
  gyymtrakkrprroHeroSubBold: {color: '#FFFFFF', fontWeight: '900'},

  gyymtrakkrprroHowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 6,
  },
  gyymtrakkrprroHowIcon: {fontSize: 18, width: 26, textAlign: 'center'},
  gyymtrakkrprroHowTitle: {color: '#FFFFFF', fontWeight: '800', fontSize: 14},
  gyymtrakkrprroHowSub: {color: '#FFFFFF99', fontWeight: '600', fontSize: 12},

  gyymtrakkrprroMiniCardsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  gyymtrakkrprroMiniCard: {
    flex: 1,
    backgroundColor: '#282E50',
    borderWidth: 1,
    borderColor: '#FFFFFF10',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    gap: 4,
  },
  gyymtrakkrprroMiniCardIcon: {fontSize: 16},
  gyymtrakkrprroMiniCardValue: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 16,
  },
  gyymtrakkrprroMiniCardLabel: {
    color: '#FFFFFF80',
    fontWeight: '700',
    fontSize: 11,
  },

  gyymtrakkrprroPrimaryBtn: {
    flexDirection: 'row',
    gap: 12,
    height: 54,
    borderRadius: 18,
    backgroundColor: '#0378DE',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  gyymtrakkrprroPrimaryBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 17,
  },
  gyymtrakkrprroSecondaryBtn: {
    height: 54,
    borderRadius: 18,
    backgroundColor: '#0378DE26',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#0378DE66',
  },
  gyymtrakkrprroSecondaryBtnText: {
    color: '#7CC0FF',
    fontWeight: '700',
    fontSize: 16,
  },

  gyymtrakkrprroGameHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },

  gyymtrakkrprroMiniStat: {
    width: 66,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#FFFFFF08',
    borderWidth: 1,
    borderColor: '#FFFFFF10',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  gyymtrakkrprroMiniStatIcon: {fontSize: 12},
  gyymtrakkrprroMiniStatValue: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 16,
  },
  gyymtrakkrprroTimeWrap: {flex: 1},
  gyymtrakkrprroTimeLabel: {
    color: '#FFFFFF80',
    fontWeight: '800',
    fontSize: 10,
  },
  gyymtrakkrprroTimeBarTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: '#FFFFFF14',
    marginTop: 6,
    overflow: 'hidden',
  },
  gyymtrakkrprroTimeBarFill: {
    height: 8,
    borderRadius: 999,
    backgroundColor: '#22C55E',
  },
  gyymtrakkrprroGameSubRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },

  gyymtrakkrprroBackLink: {color: '#7CC0FF', fontWeight: '800', fontSize: 14},
  gyymtrakkrprroTimeText: {color: '#22C55E', fontWeight: '900', fontSize: 14},
  gyymtrakkrprroHint: {
    marginTop: 10,
    color: '#FFFFFF80',
    fontWeight: '700',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 10,
  },
  gyymtrakkrprroHintAccent: {color: '#0378DE', fontWeight: '700'},

  gyymtrakkrprroGrid: {
    marginTop: 26,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 360,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  gyymtrakkrprroZone: {
    width: 74,
    height: 74,
    borderRadius: 16,
    backgroundColor: '#282E50',
    borderWidth: 1,
    borderColor: '#FFFFFF14',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gyymtrakkrprroZoneLit: {
    backgroundColor: '#0378DE',
    borderColor: '#4EA8FF',
    shadowColor: '#0378DE',
    shadowOpacity: 0.5,
    shadowRadius: 14,
    shadowOffset: {width: 0, height: 6},
    elevation: 10,
  },
  gyymtrakkrprroZoneDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    opacity: 0.9,
  },
  gyymtrakkrprroGameFooter: {
    marginTop: 26,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gyymtrakkrprroFooterLabel: {
    color: '#FFFFFF4D',
    fontWeight: '600',
    fontSize: 11,
  },
  gyymtrakkrprroFooterValue: {
    color: '#5AB8FF',
    fontWeight: '700',
    fontSize: 13,
  },

  gyymtrakkrprroStatsGrid: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gyymtrakkrprroStatCard: {
    width: '47.8%',
    backgroundColor: '#282E50',
    borderWidth: 1,
    borderColor: '#FFFFFF10',
    borderRadius: 16,
    padding: 14,
    gap: 6,
  },
  gyymtrakkrprroStatIcon: {fontSize: 14},
  gyymtrakkrprroStatValue: {color: '#F59E0B', fontWeight: '900', fontSize: 22},
  gyymtrakkrprroStatLabel: {
    color: '#FFFFFF80',
    fontWeight: '700',
    fontSize: 11,
  },

  gyymtrakkrprroHistoryCard: {
    backgroundColor: '#FFFFFF08',
    borderWidth: 1,
    borderColor: '#FFFFFF10',
    borderRadius: 16,
    padding: 12,
    gap: 10,
    marginBottom: 16,
  },
  gyymtrakkrprroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  gyymtrakkrprroRowLabel: {
    color: '#FFFFFF66',
    fontWeight: '800',
    fontSize: 11,
    width: 34,
  },
  gyymtrakkrprroRowBarTrack: {
    flex: 1,
    height: 8,
    borderRadius: 999,
    backgroundColor: '#FFFFFF12',
    overflow: 'hidden',
  },
  gyymtrakkrprroRowBarFill: {
    height: 6,
    borderRadius: 999,
  },
  gyymtrakkrprroRowBarFillOrange: {backgroundColor: '#F59E0B'},
  gyymtrakkrprroRowBarFillBlue: {backgroundColor: '#4EA8FF'},
  gyymtrakkrprroRowValue: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
    width: 52,
    textAlign: 'right',
  },

  gyymtrakkrprroSpacerBottom: {height: 140},
});
