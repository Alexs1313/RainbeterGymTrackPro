import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  Image,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import {useFocusEffect} from '@react-navigation/native';

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

type TipLevel = 'beginner' | 'intermediate' | 'advanced';
type TipCategory =
  | 'strength'
  | 'technique'
  | 'nutrition'
  | 'recovery'
  | 'mindset';

type TipItem = {
  id: string;
  level: TipLevel;
  category: TipCategory;
  title: string;
  body: string;
  emoji: string;
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

const GYYMTRAKKRPRRO_TIP_LEVELS: {
  id: TipLevel;
  label: string;
  subtitle: string;
  dot: string;
  accent: string;
  glow: string;
  iconBg: string;
  iconBorder: string;
  icon: string;
}[] = [
  {
    id: 'beginner',
    label: 'Beginner',
    subtitle: 'Just starting out',
    dot: '🟢',
    accent: '#22C55E',
    glow: '#22C55E4D',
    iconBg: '#22C55E26',
    iconBorder: '#22C55E4D',
    icon: '🌱',
  },
  {
    id: 'intermediate',
    label: 'Intermediate',
    subtitle: 'Building momentum',
    dot: '🟡',
    accent: '#F59E0B',
    glow: '#F59E0B2A',
    iconBg: '#F59E0B26',
    iconBorder: '#F59E0B4D',
    icon: '⚡',
  },
  {
    id: 'advanced',
    label: 'Advanced',
    subtitle: 'Elite performance',
    dot: '🔴',
    accent: '#EF4444',
    glow: '#EF44442A',
    iconBg: '#EF444426',
    iconBorder: '#EF444480',
    icon: '🔥',
  },
];

const GYYMTRAKKRPRRO_TIPS: TipItem[] = [
  // Beginner
  {
    id: 'beg_start_light',
    level: 'beginner',
    category: 'strength',
    emoji: '🏋️',
    title: 'Start Light',
    body: 'Start training with minimal weights or even just your own body weight. This allows your body to adapt to the load without undue stress. Too much weight at the start often leads to incorrect technique, which significantly increases the risk of injury. It is better to gradually increase the load than to immediately overload your muscles and joints.',
  },
  {
    id: 'beg_technique',
    level: 'beginner',
    category: 'technique',
    emoji: '🎯',
    title: 'Learn Technique',
    body: 'Proper technique is the basis of any training. If you do the exercises incorrectly, you will not only not get the result, but you can also harm yourself. Spend time learning the basic movements: how to hold your back, how to breathe, how to distribute the weight. Use a mirror or record yourself on video to control your form.',
  },
  {
    id: 'beg_consistency',
    level: 'beginner',
    category: 'mindset',
    emoji: '🗓️',
    title: 'Stay Consistent',
    body: 'Regularity of training is more important than its complexity. It is better to do moderate training 3-4 times a week than rarely, but with overload. Consistency helps to form a habit and also gives the body the opportunity to gradually adapt and develop without stress.',
  },
  {
    id: 'beg_warmup',
    level: 'beginner',
    category: 'recovery',
    emoji: '🔥',
    title: 'Warm Up Always',
    body: 'Warming up before training is a mandatory stage that should not be skipped. It prepares muscles, joints and cardiovascular system for the load. Light cardio activity and basic movements help reduce the risk of injury and improve the effectiveness of training.',
  },
  {
    id: 'beg_rest',
    level: 'beginner',
    category: 'recovery',
    emoji: '🛌',
    title: 'Rest Matters',
    body: 'Rest is as important a part of training as the activity itself. It is during rest that muscles recover and grow. Insufficient sleep or lack of recovery days can lead to overfatigue, loss of progress and even injuries.',
  },
  {
    id: 'beg_water',
    level: 'beginner',
    category: 'nutrition',
    emoji: '💧',
    title: 'Drink Water',
    body: 'Hydration directly affects your performance. During training, the body loses water, and if it is not replenished, endurance and concentration decrease. Drink water before, during and after training, even if you do not feel very thirsty.',
  },
  {
    id: 'beg_track',
    level: 'beginner',
    category: 'mindset',
    emoji: '📈',
    title: 'Track Progress',
    body: 'Record your results: weights, repetitions, how you feel after training. This will help you see your progress and stay motivated. Even small improvements over time give big results.',
  },

  // Intermediate
  {
    id: 'int_gradual',
    level: 'intermediate',
    category: 'strength',
    emoji: '📊',
    title: 'Increase Gradually',
    body: 'Increase weight or intensity gradually. A sharp increase in load can lead to injuries or overtraining. Listen to your body and add complexity only when you feel ready for it.',
  },
  {
    id: 'int_mind_muscle',
    level: 'intermediate',
    category: 'technique',
    emoji: '🧠',
    title: 'Focus Mind-Muscle',
    body: 'Try to feel how each muscle works during the exercise. This approach helps to better involve the muscles in the work and makes the training more effective, even without a significant increase in weight.',
  },
  {
    id: 'int_mix',
    level: 'intermediate',
    category: 'mindset',
    emoji: '🔁',
    title: 'Mix Your Routine',
    body: "Don't get stuck on the same exercises. Changing the training program helps to avoid stagnation and stimulates muscles to grow. Add new exercises or change the order of execution.",
  },
  {
    id: 'int_tempo',
    level: 'intermediate',
    category: 'technique',
    emoji: '⏱️',
    title: 'Control Tempo',
    body: 'Controlling the speed of the exercises is very important. Slow and controlled movements allow you to work your muscles better and reduce the risk of injury. Take your time, quality is more important than quantity.',
  },
  {
    id: 'int_recovery',
    level: 'intermediate',
    category: 'recovery',
    emoji: '🧘',
    title: 'Improve Recovery',
    body: 'Pay attention to recovery: sleep, nutrition and stretching. Without quality recovery, even the best workouts will not yield results. Include easy days or active recovery in your schedule.',
  },
  {
    id: 'int_nutrition',
    level: 'intermediate',
    category: 'nutrition',
    emoji: '🥗',
    title: 'Watch Nutrition',
    body: 'Your results directly depend on nutrition. The balance of proteins, fats and carbohydrates helps maintain energy and restore muscles. Do not ignore this aspect if you want to progress.',
  },
  {
    id: 'int_motivated',
    level: 'intermediate',
    category: 'mindset',
    emoji: '🏁',
    title: 'Stay Motivated',
    body: 'Motivation may disappear, but discipline must remain. Set small goals for yourself and celebrate their achievement. This helps not to lose interest in training.',
  },

  // Advanced
  {
    id: 'adv_smart',
    level: 'advanced',
    category: 'mindset',
    emoji: '🧩',
    title: 'Train Smart',
    body: 'At a high level, it is important not to just train a lot, but to train smart. Plan the load, take into account recovery and avoid overload. The quality of training should come first.',
  },
  {
    id: 'adv_periodize',
    level: 'advanced',
    category: 'strength',
    emoji: '📅',
    title: 'Periodize Workouts',
    body: 'Use periodization — vary the intensity and volume of your workouts in different periods. This helps avoid plateaus and maintains constant progress.',
  },
  {
    id: 'adv_form',
    level: 'advanced',
    category: 'technique',
    emoji: '✅',
    title: 'Perfect Form',
    body: 'Even with heavy weights, your technique should remain perfect. Clean form not only reduces the risk of injury, but also ensures maximum efficiency.',
  },
  {
    id: 'adv_limits',
    level: 'advanced',
    category: 'strength',
    emoji: '🛡️',
    title: 'Push Limits Safely',
    body: 'Go beyond your comfort zone, but do it wisely. Use safety devices or safe methods to avoid injuries when working with heavy weights.',
  },
  {
    id: 'adv_optimize_recovery',
    level: 'advanced',
    category: 'recovery',
    emoji: '🧊',
    title: 'Optimize Recovery',
    body: 'Recovery becomes critical. Use massage, stretching, proper sleep and nutrition to keep your body in shape and avoid overexertion.',
  },
  {
    id: 'adv_track_all',
    level: 'advanced',
    category: 'mindset',
    emoji: '🧾',
    title: 'Track Everything',
    body: 'Record all the details: weights, sets, well-being, even sleep. This helps you analyze your progress and find weak points in your training.',
  },
  {
    id: 'adv_discipline',
    level: 'advanced',
    category: 'mindset',
    emoji: '🧱',
    title: 'Stay Disciplined',
    body: "At a high level, the result depends on discipline. Stick to your regimen, don't skip workouts, and keep working even when your motivation wanes.",
  },
];

const gyymtrakkrprroCategoryLabel = (c: TipCategory): string => {
  switch (c) {
    case 'strength':
      return 'Strength';
    case 'technique':
      return 'Technique';
    case 'nutrition':
      return 'Nutrition';
    case 'recovery':
      return 'Recovery';
    default:
      return 'Mindset';
  }
};

const Gyymtrakkprrotipps = () => {
  const [gyymtrakkrprroView, setGyymtrakkrprroView] = useState<
    'hub' | 'category' | 'detail'
  >('hub');
  const [gyymtrakkrprroLevel, setGyymtrakkrprroLevel] =
    useState<TipLevel>('beginner');
  const [gyymtrakkrprroSelectedTipId, setGyymtrakkrprroSelectedTipId] =
    useState<string | null>(null);

  const [gyymtrakkrprroStreak, setGyymtrakkrprroStreak] = useState(0);
  const [gyymtrakkrprroWeekData, setGyymtrakkrprroWeekData] = useState<
    boolean[]
  >(Array(7).fill(false));

  const gyymtrakkrprroLoad = useCallback(async () => {
    try {
      const rawWork = await AsyncStorage.getItem(GYYMTRAKKRPRROWRKOT_KEY);
      const work: Record<string, GymDayWorkout> = rawWork
        ? JSON.parse(rawWork)
        : {};
      setGyymtrakkrprroStreak(gyymtrakkrprroCalcStreak(work));
      setGyymtrakkrprroWeekData(gyymtrakkrprroCalcWeek(work));
    } catch (_) {}
  }, []);

  useEffect(() => {
    gyymtrakkrprroLoad();
  }, [gyymtrakkrprroLoad]);

  useFocusEffect(
    useCallback(() => {
      setGyymtrakkrprroView('hub');
    }, []),
  );

  const gyymtrakkrprroLevelMeta = useMemo(
    () => GYYMTRAKKRPRRO_TIP_LEVELS.find(l => l.id === gyymtrakkrprroLevel)!,
    [gyymtrakkrprroLevel],
  );

  const gyymtrakkrprroLevelTips = useMemo(
    () => GYYMTRAKKRPRRO_TIPS.filter(t => t.level === gyymtrakkrprroLevel),
    [gyymtrakkrprroLevel],
  );

  const gyymtrakkrprroTipsCountByLevel = useMemo(() => {
    const b = GYYMTRAKKRPRRO_TIPS.filter(t => t.level === 'beginner').length;
    const i = GYYMTRAKKRPRRO_TIPS.filter(
      t => t.level === 'intermediate',
    ).length;
    const a = GYYMTRAKKRPRRO_TIPS.filter(t => t.level === 'advanced').length;
    return {b, i, a, total: b + i + a};
  }, []);

  const gyymtrakkrprroSelectedTip = useMemo(() => {
    if (!gyymtrakkrprroSelectedTipId) {
      return null;
    }
    return (
      GYYMTRAKKRPRRO_TIPS.find(t => t.id === gyymtrakkrprroSelectedTipId) ??
      null
    );
  }, [gyymtrakkrprroSelectedTipId]);

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

  const gyymtrakkrprroOpenLevel = (lvl: TipLevel) => {
    setGyymtrakkrprroLevel(lvl);
    setGyymtrakkrprroView('category');
  };

  const gyymtrakkrprroOpenTip = (id: string) => {
    setGyymtrakkrprroSelectedTipId(id);
    setGyymtrakkrprroView('detail');
  };

  const gyymtrakkrprroRandomTip = () => {
    if (!gyymtrakkrprroLevelTips.length) {
      return;
    }
    const idx = Math.floor(Math.random() * gyymtrakkrprroLevelTips.length);
    gyymtrakkrprroOpenTip(gyymtrakkrprroLevelTips[idx].id);
  };

  const gyymtrakkrprroShareTip = async (tip?: TipItem) => {
    const tipToShare = tip ?? gyymtrakkrprroSelectedTip;
    if (!tipToShare) {
      return;
    }
    try {
      await Share.share({
        message: `${tipToShare.title}\n\n${tipToShare.body}`,
      });
    } catch (_) {}
  };

  // ── Tip detail view ─────────────────────────────────────────────────────────
  if (gyymtrakkrprroView === 'detail' && gyymtrakkrprroSelectedTip) {
    return (
      <View style={styles.gyymtrakkrprroRoot}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.gyymtrakkrprroPad}>
          {gyymtrakkrprroRenderHeader()}

          <View style={styles.gyymtrakkrprroTopBar}>
            <TouchableOpacity
              onPress={() => setGyymtrakkrprroView('category')}
              activeOpacity={0.8}
              style={styles.gyymtrakkrprroBackBtn}>
              <Image source={require('../../assets/i/gyymtrakkpwback.png')} />
              <Text style={styles.gyymtrakkrprroBackText}>Back</Text>
            </TouchableOpacity>
            <Text style={styles.gyymtrakkrprroTopTitle}>Tip</Text>
            <TouchableOpacity
              onPress={() => gyymtrakkrprroShareTip()}
              activeOpacity={0.85}>
              <Image source={require('../../assets/i/gyymtrakkpwlshr.png')} />
            </TouchableOpacity>
          </View>
          <View style={{paddingHorizontal: 16}}>
            <View style={styles.gyymtrakkrprroPillsRow}>
              <View
                style={[
                  styles.gyymtrakkrprroPill,
                  {
                    backgroundColor: gyymtrakkrprroLevelMeta.glow,
                    borderColor: gyymtrakkrprroLevelMeta.iconBorder,
                  },
                ]}>
                <Text
                  style={[
                    styles.gyymtrakkrprroPillText,
                    {color: gyymtrakkrprroLevelMeta.accent},
                  ]}>
                  {gyymtrakkrprroLevelMeta.label.toUpperCase()}
                </Text>
              </View>
              <View
                style={[
                  styles.gyymtrakkrprroPill,
                  {
                    backgroundColor: gyymtrakkrprroLevelMeta.glow,
                    borderColor: gyymtrakkrprroLevelMeta.iconBorder,
                  },
                ]}>
                <Text
                  style={[
                    styles.gyymtrakkrprroPillText,
                    {color: gyymtrakkrprroLevelMeta.accent},
                  ]}>
                  {gyymtrakkrprroCategoryLabel(
                    gyymtrakkrprroSelectedTip.category,
                  )}
                </Text>
              </View>
            </View>

            <View style={styles.gyymtrakkrprroTipCard}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  marginBottom: 13,
                }}>
                <Text style={styles.gyymtrakkrprroTipEmoji}>
                  {gyymtrakkrprroSelectedTip.emoji}
                </Text>
                <Text style={styles.gyymtrakkrprroTipTitle}>
                  {gyymtrakkrprroSelectedTip.title}
                </Text>
              </View>
              <Text style={styles.gyymtrakkrprroTipBody}>
                {gyymtrakkrprroSelectedTip.body}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => gyymtrakkrprroShareTip()}
              activeOpacity={0.9}
              style={styles.gyymtrakkrprroShareBtn}>
              <Image source={require('../../assets/i/gyymtrakkpwlshr.png')} />
              <Text style={styles.gyymtrakkrprroShareBtnText}>
                Share This Tip
              </Text>
            </TouchableOpacity>

            <View style={styles.gyymtrakkrprroSpacerBottom} />
          </View>
        </ScrollView>
      </View>
    );
  }

  // ── Category view ───────────────────────────────────────────────────────────
  if (gyymtrakkrprroView === 'category') {
    return (
      <View style={styles.gyymtrakkrprroRoot}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.gyymtrakkrprroPad}>
          {gyymtrakkrprroRenderHeader()}

          <View style={styles.gyymtrakkrprroTopBar}>
            <TouchableOpacity
              onPress={() => setGyymtrakkrprroView('hub')}
              activeOpacity={0.8}
              style={styles.gyymtrakkrprroBackBtn}>
              <Image source={require('../../assets/i/gyymtrakkpwback.png')} />
              <Text style={styles.gyymtrakkrprroBackText}>Back</Text>
            </TouchableOpacity>
            <Text style={styles.gyymtrakkrprroTopTitle}>
              {gyymtrakkrprroLevelMeta.label}
            </Text>
            <View style={styles.gyymtrakkrprroTopRightPad} />
          </View>
          <View style={{paddingHorizontal: 16}}>
            <View
              style={[
                styles.gyymtrakkrprroLevelHero,
                {
                  borderColor: `${gyymtrakkrprroLevelMeta.accent}55`,
                  backgroundColor: gyymtrakkrprroLevelMeta.glow,
                },
              ]}>
              <View
                style={[
                  styles.gyymtrakkrprroLevelIcon,
                  {backgroundColor: gyymtrakkrprroLevelMeta.iconBg},
                ]}>
                <Text style={styles.gyymtrakkrprroIconText}>
                  {gyymtrakkrprroLevelMeta.icon}
                </Text>
              </View>
              <View style={styles.gyymtrakkrprroFlex1}>
                <Text style={styles.gyymtrakkrprroLevelHeroTitle}>
                  {gyymtrakkrprroLevelMeta.label}
                </Text>
                <Text
                  style={[
                    styles.gyymtrakkrprroLevelHeroSub,
                    {color: gyymtrakkrprroLevelMeta.accent},
                  ]}>
                  {gyymtrakkrprroLevelMeta.subtitle} ·{' '}
                  {gyymtrakkrprroLevelTips.length} tips
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={gyymtrakkrprroRandomTip}
              activeOpacity={0.9}>
              <LinearGradient
                colors={['#0378DE59', '#0378DE26']}
                style={styles.gyymtrakkrprroRandomBtn}>
                <Image
                  source={require('../../assets/i/gyymtrakkpwlrand.png')}
                />
                <Text style={styles.gyymtrakkrprroRandomText}>Random Tip</Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.gyymtrakkrprroSpacerSm} />

            {gyymtrakkrprroLevelTips.map(t => (
              <TouchableOpacity
                key={t.id}
                onPress={() => gyymtrakkrprroOpenTip(t.id)}
                activeOpacity={0.85}>
                <View style={styles.gyymtrakkrprroTipRow}>
                  <View style={styles.gyymtrakkrprroTipRowLeft}>
                    <Text style={styles.gyymtrakkrprroTipRowEmoji}>
                      {t.emoji}
                    </Text>
                    <View style={styles.gyymtrakkrprroFlex1}>
                      <Text style={styles.gyymtrakkrprroTipRowTitle}>
                        {t.title}
                      </Text>
                      <Text
                        style={styles.gyymtrakkrprroTipRowBody}
                        numberOfLines={2}>
                        {t.body}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.gyymtrakkrprroTipRowMeta}>
                    <View style={styles.gyymtrakkrprroTag}>
                      <Text style={styles.gyymtrakkrprroTagText}>
                        {gyymtrakkrprroCategoryLabel(t.category)}
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 8,
                        marginTop: 7,
                      }}>
                      <TouchableOpacity
                        onPress={() => gyymtrakkrprroShareTip(t)}
                        activeOpacity={0.85}>
                        <Image
                          source={require('../../assets/i/gyymtrakkpwlshrc.png')}
                        />
                      </TouchableOpacity>
                      <Image
                        source={require('../../assets/i/gyymtrakkpwlarrg.png')}
                      />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}

            <View style={styles.gyymtrakkrprroSpacerBottom} />
          </View>
        </ScrollView>
      </View>
    );
  }

  // ── Hub view ────────────────────────────────────────────────────────────────
  return (
    <View style={styles.gyymtrakkrprroRoot}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.gyymtrakkrprroHubPad}>
        {gyymtrakkrprroRenderHeader()}
        <View style={{paddingHorizontal: 16}}>
          <Text style={styles.gyymtrakkrprroHubKicker}>KNOWLEDGE HUB</Text>
          <Text style={styles.gyymtrakkrprroHubTitle}>Tips & Advice</Text>
          <Text style={styles.gyymtrakkrprroHubSub}>
            Expert guidance for every fitness level
          </Text>

          <LinearGradient
            colors={['#0378DE40', '#0378DE1A']}
            style={styles.gyymtrakkrprroTotalCard}>
            <View
              style={{
                padding: 14,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
              }}>
              <View style={styles.gyymtrakkrprroTotalIcon}>
                <Text style={styles.gyymtrakkrprroIconText}>📚</Text>
              </View>
              <View style={styles.gyymtrakkrprroFlex1}>
                <Text style={styles.gyymtrakkrprroTotalTitle}>
                  {gyymtrakkrprroTipsCountByLevel.total} Tips
                </Text>
                <Text style={styles.gyymtrakkrprroTotalSub}>
                  Across 3 experience levels
                </Text>
              </View>
            </View>
          </LinearGradient>

          <View style={styles.gyymtrakkrprroSpacerMd} />

          {GYYMTRAKKRPRRO_TIP_LEVELS.map(lvl => {
            const count = GYYMTRAKKRPRRO_TIPS.filter(
              t => t.level === lvl.id,
            ).length;
            return (
              <TouchableOpacity
                key={lvl.id}
                onPress={() => gyymtrakkrprroOpenLevel(lvl.id)}
                activeOpacity={0.9}>
                <View style={styles.gyymtrakkrprroLevelRow}>
                  <View
                    style={[
                      styles.gyymtrakkrprroLevelIcon,
                      {backgroundColor: lvl.iconBg},
                      {borderColor: lvl.iconBorder},
                      {borderWidth: 1},
                    ]}>
                    <Text style={styles.gyymtrakkrprroIconText}>
                      {lvl.icon}
                    </Text>
                  </View>
                  <View style={styles.gyymtrakkrprroFlex1}>
                    <Text style={styles.gyymtrakkrprroLevelTitle}>
                      {lvl.label}
                    </Text>
                    <Text
                      style={[
                        styles.gyymtrakkrprroLevelSub,
                        {color: lvl.accent},
                      ]}>
                      {lvl.subtitle}
                    </Text>
                    <Text style={styles.gyymtrakkrprroLevelSmall}>
                      {count} tips available
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.gyymtrakkrprroLevelGo,
                      {
                        borderColor: lvl.iconBorder,
                        backgroundColor: lvl.iconBg,
                      },
                    ]}>
                    <Text
                      style={[
                        styles.gyymtrakkrprroLevelGoIcon,
                        {color: lvl.accent},
                      ]}>
                      ›
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}

          <View style={styles.gyymtrakkrprroSpacerBottom} />
        </View>
      </ScrollView>
    </View>
  );
};

export default Gyymtrakkprrotipps;

const styles = StyleSheet.create({
  gyymtrakkrprroHubSub: {
    color: '#8895B0',
    marginTop: 6,
    fontSize: 13,
    fontWeight: '600',
  },
  gyymtrakkrprroTotalCard: {
    marginTop: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#0378DE55',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 86,
    marginBottom: 7,
  },

  gyymtrakkrprroRoot: {flex: 1, backgroundColor: '#1A1E3D'},
  gyymtrakkrprroFlex1: {flex: 1},
  gyymtrakkrprroIconText: {fontSize: 18},
  gyymtrakkrprroSpacerSm: {height: 10},
  gyymtrakkrprroSpacerMd: {height: 12},
  gyymtrakkrprroSpacerBottom: {height: 140},
  gyymtrakkrprroTopRightPad: {width: 44},

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

  gyymtrakkrprroHubPad: {paddingTop: 18},
  gyymtrakkrprroHubKicker: {
    color: '#6B7299',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.9,
  },
  gyymtrakkrprroHubTitle: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '900',
    marginTop: 6,
  },

  gyymtrakkrprroTotalIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#0378DE40',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gyymtrakkrprroTotalTitle: {color: '#fff', fontSize: 18, fontWeight: '900'},
  gyymtrakkrprroTotalSub: {
    color: '#BFE3FF',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 5,
  },

  gyymtrakkrprroLevelRow: {
    backgroundColor: '#282E50',
    borderWidth: 1,
    borderColor: '#FFFFFF12',
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
    minHeight: 108,
  },
  gyymtrakkrprroLevelIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gyymtrakkrprroLevelTitle: {color: '#fff', fontSize: 16, fontWeight: '900'},
  gyymtrakkrprroLevelSub: {fontSize: 12, fontWeight: '800', marginTop: 3},
  gyymtrakkrprroLevelSmall: {
    color: '#8895B0',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  gyymtrakkrprroLevelGo: {
    width: 40,
    height: 40,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gyymtrakkrprroLevelGoIcon: {fontSize: 20, fontWeight: '700', bottom: 1},

  gyymtrakkrprroTopBar: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#252B52',
    marginBottom: 20,
  },
  gyymtrakkrprroTopTitle: {color: '#fff', fontSize: 16, fontWeight: '700'},
  gyymtrakkrprroBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  gyymtrakkrprroBackText: {color: '#5AB8FF', fontSize: 15, fontWeight: '700'},
  gyymtrakkrprroShareIcon: {
    color: '#5AB8FF',
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'right',
  },

  gyymtrakkrprroPad: {paddingTop: 18},
  gyymtrakkrprroLevelHero: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#282E50',
  },
  gyymtrakkrprroLevelHeroTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
  },
  gyymtrakkrprroLevelHeroSub: {fontSize: 12, fontWeight: '900', marginTop: 3},
  gyymtrakkrprroRandomBtn: {
    marginTop: 16,
    borderRadius: 16,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#0378DE55',
    marginBottom: 4,
  },
  gyymtrakkrprroRandomText: {color: '#5AB8FF', fontSize: 14, fontWeight: '700'},

  gyymtrakkrprroTipRow: {
    backgroundColor: '#282E50',
    borderWidth: 1,
    borderColor: '#FFFFFF12',
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  gyymtrakkrprroTipRowLeft: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    flex: 1,
  },
  gyymtrakkrprroTipRowEmoji: {fontSize: 18, marginTop: 2},
  gyymtrakkrprroTipRowTitle: {color: '#fff', fontSize: 14, fontWeight: '900'},
  gyymtrakkrprroTipRowBody: {
    color: '#8895B0',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  gyymtrakkrprroTipRowMeta: {alignItems: 'flex-end', gap: 8},
  gyymtrakkrprroTipRowArrow: {
    color: '#FFFFFF40',
    fontSize: 22,
    fontWeight: '900',
  },
  gyymtrakkrprroTag: {
    backgroundColor: '#0378DE33',
    borderWidth: 1,
    borderColor: '#0378DE40',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  gyymtrakkrprroTagText: {color: '#BFE3FF', fontSize: 11, fontWeight: '900'},

  gyymtrakkrprroPillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  gyymtrakkrprroPill: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderWidth: 1,
  },
  gyymtrakkrprroPillText: {fontSize: 11, fontWeight: '900', letterSpacing: 0.8},
  gyymtrakkrprroPillBlue: {
    backgroundColor: '#0378DE2A',
    borderColor: '#0378DE55',
  },
  gyymtrakkrprroPillTextBlue: {
    color: '#BFE3FF',
    fontSize: 11,
    fontWeight: '900',
  },

  gyymtrakkrprroTipCard: {
    backgroundColor: '#282E50',
    borderWidth: 1,
    borderColor: '#FFFFFF12',
    borderRadius: 18,
    padding: 16,
  },

  gyymtrakkrprroTipEmoji: {fontSize: 28},
  gyymtrakkrprroTipTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
  },
  gyymtrakkrprroTipBody: {
    color: '#B6C0D6',
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 22,
  },
  gyymtrakkrprroShareBtn: {
    marginTop: 24,
    backgroundColor: '#0378DE26',
    borderWidth: 1,
    borderColor: '#0378DE66',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  gyymtrakkrprroShareBtnText: {
    color: '#5AB8FF',
    fontSize: 15,
    fontWeight: '700',
  },
});
