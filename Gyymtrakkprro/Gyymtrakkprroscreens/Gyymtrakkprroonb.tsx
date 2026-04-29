import LinearGradient from 'react-native-linear-gradient';

import Gyymtrakkprrolay from '../Gyymtrakkprrocpnt/Gyymtrakkprrolay';

import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Image,
  ScrollView,
} from 'react-native';

const {height: gyymtrakkrprroWindowHeight} = Dimensions.get('window');

const gyymtrakkrprroSlides = [
  {
    gyymtrakkrprroId: '1',
    gyymtrakkrprroTag: 'WELCOME',
    gyymtrakkrprroTitle: 'Welcome to\nFitTrack Pro',
    gyymtrakkrprroDescription:
      'Your ultimate fitness companion. Track workouts, monitor nutrition, and crush your goals every single day.',
    gyymtrakkrprroImage: require('../../assets/i/gyymtrakkprroonbg1.png'),
  },
  {
    gyymtrakkrprroId: '2',
    gyymtrakkrprroTag: 'WORKOUT',
    gyymtrakkrprroTitle: 'Track Every\nRep & Set',
    gyymtrakkrprroDescription:
      'Log exercises by muscle group with sets, weights, and reps. Watch your strength grow week over week.',
    gyymtrakkrprroImage: require('../../assets/i/gyymtrakkprroonbg2.png'),
  },
  {
    gyymtrakkrprroId: '3',
    gyymtrakkrprroTag: 'CONSISTENCY',
    gyymtrakkrprroTitle: 'Build Your\nStreak',
    gyymtrakkrprroDescription:
      'Maintain daily streaks and view your complete fitness journey on a unified calendar. Never miss a day.',
    gyymtrakkrprroImage: require('../../assets/i/gyymtrakkprroonbg3.png'),
  },
  {
    gyymtrakkrprroId: '4',
    gyymtrakkrprroTag: 'NUTRITION',
    gyymtrakkrprroTitle: 'Fuel Your\nBody Right',
    gyymtrakkrprroDescription:
      'Track meals and calories for every eating occasion. Stay on target with your nutrition and body composition goals.',
    gyymtrakkrprroImage: require('../../assets/i/gyymtrakkprroonbg2.png'),
  },
  {
    gyymtrakkrprroId: '5',
    gyymtrakkrprroTag: 'LEVEL UP',
    gyymtrakkrprroTitle: 'Level Up\nYour Game',
    gyymtrakkrprroDescription:
      'Get expert tips for your fitness level and sharpen your athletic reflexes with our reaction speed game.',
    gyymtrakkrprroImage: require('../../assets/i/gyymtrakkprroonbg5.png'),
  },
];

const gyymtrakkrprroTotalSlides = gyymtrakkrprroSlides.length;

interface Props {
  navigation: any;
}

const Gyymtrakkprroonb = ({navigation}: Props) => {
  const [gyymtrakkrprroScreenIndex, setGyymtrakkrprroScreenIndex] = useState(0);
  const gyymtrakkrprroIsDisclaimer =
    gyymtrakkrprroScreenIndex === gyymtrakkrprroTotalSlides;
  const gyymtrakkrprroCurrentSlide =
    gyymtrakkrprroSlides[gyymtrakkrprroScreenIndex];

  const gyymtrakkrprroHandleNext = () => {
    if (gyymtrakkrprroScreenIndex < gyymtrakkrprroTotalSlides - 1) {
      setGyymtrakkrprroScreenIndex(prev => prev + 1);
    } else {
      setGyymtrakkrprroScreenIndex(gyymtrakkrprroTotalSlides);
    }
  };

  const gyymtrakkrprroHandleSkip = () => {
    setGyymtrakkrprroScreenIndex(gyymtrakkrprroTotalSlides);
  };

  const gyymtrakkrprroHandleAgree = () => {
    navigation.navigate('Gyymtrakkprrotabs');
  };

  const gyymtrakkrprroHandleDecline = () => {
    setGyymtrakkrprroScreenIndex(0);
  };

  if (gyymtrakkrprroIsDisclaimer) {
    return (
      <Gyymtrakkprrolay>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            paddingHorizontal: 24,
          }}>
          <View style={styles.gyymtrakkrprroShieldWrapper}>
            <LinearGradient
              colors={['#0378DE4D', '#0378DE1A']}
              style={styles.gyymtrakkrprroShieldBg}>
              <Image source={require('../../assets/i/gyymtrakkprrst.png')} />
            </LinearGradient>
          </View>

          <Text style={styles.gyymtrakkrprroDisclaimerTitle}>
            Important Disclaimer
          </Text>
          <Text style={styles.gyymtrakkrprroDisclaimerSubtitle}>
            Please read before continuing
          </Text>

          <View style={styles.gyymtrakkrprroWarningCard}>
            <View style={styles.gyymtrakkrprroWarningHeader}>
              <Image source={require('../../assets/i/gyymtrakkpwarn.png')} />
              <Text style={styles.gyymtrakkrprroWarningTitle}>
                HEALTH & SAFETY WARNING
              </Text>
            </View>
            <Text style={styles.gyymtrakkrprroWarningText}>
              This app provides general recommendations and is not intended to
              be medical or professional sports advice. You use it at your own
              risk, and the developers are not responsible for any injuries or
              consequences. For safe and effective training, it is recommended
              to exercise under the supervision of a qualified trainer.
            </Text>
          </View>

          <View style={styles.gyymtrakkrprroAcknowledgmentBox}>
            <Text style={styles.gyymtrakkrprroAcknowledgmentText}>
              By tapping{' '}
              <Text style={styles.gyymtrakkrprroAcknowledgmentBold}>
                &ldquo;I Agree&rdquo;
              </Text>
              , you acknowledge that you have read and understood this
              disclaimer and accept full responsibility for your training
              activities.
            </Text>
          </View>

          <TouchableOpacity
            onPress={gyymtrakkrprroHandleAgree}
            style={{width: '100%'}}
            activeOpacity={0.85}>
            <LinearGradient
              colors={['#0378DE', '#0255A3']}
              style={styles.gyymtrakkrprroAgreeButton}>
              <Text style={styles.gyymtrakkrprroAgreeButtonText}>
                I Agree — Let's Go
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gyymtrakkrprroDeclineButton}
            onPress={gyymtrakkrprroHandleDecline}
            activeOpacity={0.7}>
            <Text style={styles.gyymtrakkrprroDeclineButtonText}>Decline</Text>
          </TouchableOpacity>
        </View>
      </Gyymtrakkprrolay>
    );
  }

  return (
    <View style={styles.gyymtrakkrprroSlideContainer}>
      {gyymtrakkrprroCurrentSlide.gyymtrakkrprroImage ? (
        <ImageBackground
          source={gyymtrakkrprroCurrentSlide.gyymtrakkrprroImage}
          style={styles.gyymtrakkrprroSlideBg}
        />
      ) : (
        <View style={styles.gyymtrakkrprroSlidePlaceholderBg} />
      )}

      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          style={styles.gyymtrakkrprroSkipButton}
          onPress={gyymtrakkrprroHandleSkip}
          activeOpacity={0.7}>
          <Text style={styles.gyymtrakkrprroSkipText}>Skip</Text>
        </TouchableOpacity>

        <View style={styles.gyymtrakkrprroSlideContent}>
          <View style={styles.gyymtrakkrprroTagBadge}>
            <Text style={styles.gyymtrakkrprroTagText}>
              {gyymtrakkrprroCurrentSlide.gyymtrakkrprroTag}
            </Text>
          </View>

          <Text style={styles.gyymtrakkrprroSlideTitle}>
            {gyymtrakkrprroCurrentSlide.gyymtrakkrprroTitle}
          </Text>

          <Text style={styles.gyymtrakkrprroSlideDescription}>
            {gyymtrakkrprroCurrentSlide.gyymtrakkrprroDescription}
          </Text>

          <View style={styles.gyymtrakkrprroFooter}>
            <View style={styles.gyymtrakkrprroDots}>
              {gyymtrakkrprroSlides.map((_, gyymtrakkrprroIdx) => (
                <View
                  key={gyymtrakkrprroIdx}
                  style={[
                    styles.gyymtrakkrprroDot,
                    gyymtrakkrprroIdx === gyymtrakkrprroScreenIndex &&
                      styles.gyymtrakkrprroDotActive,
                  ]}
                />
              ))}
            </View>

            <TouchableOpacity
              onPress={gyymtrakkrprroHandleNext}
              activeOpacity={0.85}>
              <LinearGradient
                colors={['#0378DE', '#0255A3']}
                style={styles.gyymtrakkrprroNextButton}>
                <Image source={require('../../assets/i/gyymtrakkprrnxt.png')} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  gyymtrakkrprroSkipText: {
    color: '#FFFFFF80',
    fontSize: 15,
    fontWeight: '500',
  },
  gyymtrakkrprroSlideContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 28,
    paddingBottom: 51,
  },

  gyymtrakkrprroSlideContainer: {
    flex: 1,
    backgroundColor: '#080d1e',
  },
  gyymtrakkrprroSlideBg: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  gyymtrakkrprroSlidePlaceholderBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0e1530',
  },
  gyymtrakkrprroSlideGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  gyymtrakkrprroSkipButton: {
    position: 'absolute',
    top: 56,
    right: 24,
    zIndex: 10,
  },

  gyymtrakkrprroTagBadge: {
    backgroundColor: '#0378DE40',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 5,
    alignSelf: 'flex-start',
    marginBottom: 14,
  },
  gyymtrakkrprroTagText: {
    color: '#5AB8FF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  gyymtrakkrprroSlideTitle: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '800',
    lineHeight: 42,
    marginBottom: 14,
  },
  gyymtrakkrprroSlideDescription: {
    color: '#FFFFFFA6',
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 36,
  },
  gyymtrakkrprroFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gyymtrakkrprroDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  gyymtrakkrprroDot: {
    width: 6,
    height: 6,
    borderRadius: 4,
    backgroundColor: '#2a3555',
  },
  gyymtrakkrprroDotActive: {
    width: 24,
    backgroundColor: '#0378DE',
  },
  gyymtrakkrprroNextButton: {
    width: 55,
    height: 55,
    borderRadius: 26,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: '#0378DE',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },

  gyymtrakkrprroNextArrow: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '300',
    marginTop: -2,
  },

  gyymtrakkrprroDisclaimerContainer: {
    flex: 1,
    minHeight: gyymtrakkrprroWindowHeight,
    backgroundColor: '#0d1225',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 40,
  },
  gyymtrakkrprroShieldWrapper: {
    marginBottom: 24,
  },

  gyymtrakkrprroShieldBg: {
    width: 80,
    height: 80,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#0378DE66',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gyymtrakkrprroShieldIcon: {
    fontSize: 32,
  },
  gyymtrakkrprroDisclaimerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  gyymtrakkrprroDisclaimerSubtitle: {
    color: '#8895b0',
    fontSize: 14,
    marginBottom: 28,
    textAlign: 'center',
  },

  gyymtrakkrprroWarningCard: {
    backgroundColor: '#FFC8000F',
    borderRadius: 16,
    padding: 18,
    width: '100%',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FFC80033',
  },
  gyymtrakkrprroWarningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  gyymtrakkrprroWarningTriangle: {
    fontSize: 16,
  },
  gyymtrakkrprroWarningTitle: {
    color: '#FBBF24',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  gyymtrakkrprroWarningText: {
    color: '#cdd4e0',
    fontSize: 14,
    lineHeight: 26,
  },
  gyymtrakkrprroAcknowledgmentBox: {
    backgroundColor: '#282E50',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    width: '100%',
    marginBottom: 28,
    borderWidth: 1,
    borderColor: '#1e2b45',
  },

  gyymtrakkrprroAcknowledgmentText: {
    color: '#FFFFFF80',
    fontSize: 12,
    lineHeight: 20,
    textAlign: 'center',
  },
  gyymtrakkrprroAcknowledgmentBold: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  gyymtrakkrprroAgreeButton: {
    borderRadius: 24,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
    height: 55,
    justifyContent: 'center',

    shadowColor: '#0378DE',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  gyymtrakkrprroAgreeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  gyymtrakkrprroDeclineButton: {
    borderRadius: 24,
    width: '100%',
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF1F',
  },
  gyymtrakkrprroDeclineButtonText: {
    color: '#8895b0',
    fontSize: 15,
    fontWeight: '500',
  },
});

export default Gyymtrakkprroonb;
