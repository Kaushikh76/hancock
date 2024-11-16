import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TextInput, Easing, Image, Alert } from 'react-native';
import { Formik } from 'formik';
import { Button, CheckBox } from 'react-native-elements';
import Slider from '@react-native-community/slider';
import RNPickerSelect from 'react-native-picker-select';
import pickerSelectStyles from 'react-native-picker-select';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const questions = [
  { id: 'name', type: 'text', question: "What's your superhero alias?", placeholder: "Enter your secret identity..." },
  { id: 'Bio', type: 'text', question: "What's the one thing that makes you a legend?", placeholder: "Tell me your superpower!" },
  { id: 'age', type: 'slider', question: 'How many trips around the sun have you survived?', min: 14, max: 80 },
  { id: 'country', type: 'dropdown', question: 'Where do you call home in this wild world?' },
  { id: 'preferage', type: 'slider', question: 'What age range makes your heart skip a beat?', min: 18, max: 100 },
  { id: 'prefernose', type: 'slider', question: 'On a scale of 1 to 10, how nose-tastic is your preference?', min: 1, max: 10 },
  { id: 'preferlips', type: 'slider', question: 'Rate the lips: Are we talking pout perfection or just a cute smile?', min: 1, max: 10 },
  { id: 'preferjawline', type: 'slider', question: 'How jaw-dropping is that jawline? Rate it!', min: 1, max: 10 },
  { id: 'preferskin', type: 'radio', question: 'What skin tone makes your heart race?', options: ['Milk White', 'Hot Brownie', 'Dark Chocolate', 'Poisonous Peach'] },
];

const countries = [
  { label: 'United States', value: 'US' },
  { label: 'Canada', value: 'CA' },
  { label: 'United Kingdom', value: 'UK' },
  { label: 'Australia', value: 'AU' },
  { label: 'Germany', value: 'DE' },
  { label: 'France', value: 'FR' },
  { label: 'Japan', value: 'JP' },
  { label: 'Brazil', value: 'BR' },
  { label: 'India', value: 'IN' },
  { label: 'China', value: 'CN' },
];

const AnimatedView = Animated.createAnimatedComponent(View);

const TypeformClone = () => {
  const [username, setUsername] = useState('');
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    age: '',
    bio: '',
  });
  const [interests, setInterests] = useState(['']);
  const [profileData, setProfileData] = useState(null);
  const [matches, setMatches] = useState([]);
  const [targetUsername, setTargetUsername] = useState('');

  const totalQuestions = 10; // Set this to your actual total number
  const [answeredQuestions, setAnsweredQuestions] = useState(0);

  // Calculate progress percentage
  const progress = (answeredQuestions / totalQuestions) * 100;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const animateTransition = (direction) => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: direction === 'next' ? -1 : 1,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentQuestion((prev) => (direction === 'next' ? prev + 1 : prev - 1));
      slideAnim.setValue(direction === 'next' ? 1 : -1);
      fadeAnim.setValue(0);
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 4,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const renderQuestion = (question, formikProps) => {
    switch (question.type) {
      case 'text':
        return (
          <View>
            <Text style={styles.question}>{question.question}</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => formikProps.setFieldValue(question.id, text)}
              value={formikProps.values[question.id]}
              placeholder={question.placeholder}
              placeholderTextColor="#000000FF"
            />
            <TouchableOpacity
              onPress={() => {
                if (formikProps.values[question.id]) {
                  animateTransition('next');
                }
                setAnsweredQuestions(prev => prev + 1);
              }}
              style={styles.button}
            >
              <View style={styles.btnleft}>
                <Text style={styles.text}>Next</Text>
                <Ionicons name={'arrow-forward-outline'} size={25} />
              </View>
            </TouchableOpacity>
          </View>
        );
      case 'alert':
        return (
          <View>
            <Text style={styles.question}>{question.question}</Text>
            <TouchableOpacity
              onPress={() => {
                animateTransition('next');
                setAnsweredQuestions(answeredQuestions + 1);
              }}
              style={styles.button}
            >
              <View style={styles.btnleft}>
                <Text style={styles.text}>Let me Prefer!</Text>
                <Ionicons name={'arrow-forward-outline'} size={25} />
              </View>
            </TouchableOpacity>
          </View>
        );
      case 'slider':
        return (
          <View>
            <Text style={styles.question}>{question.question}</Text>
            <Slider
              value={formikProps.values[question.id] ?? question.min}
              onValueChange={(value) => formikProps.setFieldValue(question.id, value)}
              minimumValue={question.min}
              maximumValue={question.max}
              step={1}
              style={styles.slider}
              minimumTrackTintColor="#FFDA37FF"
              maximumTrackTintColor="#000000"
              thumbImage={require('../assets/images/thum.png')}
            />
            <Text style={styles.sliderValue}>
              {formikProps.values[question.id] ?? question.min}
            </Text>
            <TouchableOpacity
              onPress={() => {
                if (formikProps.values[question.id]) {
                  animateTransition('next');
                }
                setAnsweredQuestions(answeredQuestions + 1);
              }}
              style={styles.button}
            >
              <View style={styles.btnleft}>
                <Text style={styles.text}>Next</Text>
                <Ionicons name={'arrow-forward-outline'} size={25} />
              </View>
            </TouchableOpacity>
          </View>
        );
      case 'checkbox':
        return (
          <View>
            <Text style={styles.question}>{question.question}</Text>
            <CheckBox
              title="Yes"
              checked={formikProps.values[question.id]}
              onPress={() => formikProps.setFieldValue(question.id, !formikProps.values[question.id])}
              containerStyle={styles.checkboxContainer}
            />
            <CheckBox
              title="No"
              checked={!formikProps.values[question.id]}
              onPress={() => formikProps.setFieldValue(question.id, !formikProps.values[question.id])}
              containerStyle={styles.checkboxContainer}
            />
            <TouchableOpacity
              onPress={() => {
                animateTransition('next');
                setAnsweredQuestions(answeredQuestions + 1);
              }}
              style={styles.buttoncheck}
            >
              <View style={styles.btnleft}>
                <Text style={styles.text}>Next</Text>
                <Ionicons style={styles.icon} name={'arrow-forward-outline'} size={25} />
              </View>
            </TouchableOpacity>
          </View>
        );
      case 'radio':
        return (
          <View>
            <Text style={styles.question}>{question.question}</Text>
            {question.options.map((option, index) => (
              <CheckBox
                key={`${question.id}-${index}`} // Ensure unique key
                title={option}
                checked={formikProps.values[question.id] === option}
                onPress={() => formikProps.setFieldValue(question.id, option)}
                containerStyle={styles.checkboxContainer}
              />
            ))}
            <TouchableOpacity
              onPress={() => {
                animateTransition('next');
                setAnsweredQuestions(answeredQuestions + 1);
              }}
              style={styles.button}
            >
              <View style={styles.btnleft}>
                <Text style={styles.text}>Next</Text>
                <Ionicons name={'arrow-forward-outline'} size={25} />
              </View>
            </TouchableOpacity>
          </View>
        );
      case 'dropdown':
        return (
          <View>
            <Text style={styles.question}>{question.question}</Text>
            <View style={styles.dropdownContainer}>
              <RNPickerSelect
                onValueChange={(value) => formikProps.setFieldValue(question.id, value)}
                items={countries}
                style={{
                  ...pickerSelectStyles,
                  placeholder: {
                    borderWidth: 1,
                    color: 'black',
                    fontSize: 18,
                    fontWeight: 'bold',
                  },
                  inputIOS: {
                    borderWidth: 1,
                    borderColor: '#333',
                    borderRadius: 10,
                    padding: 10,
                    color: 'black',
                    fontSize: 18,
                    fontWeight: 'bold',
                  },
                  inputAndroid: {
                    borderWidth: 3,
                    borderColor: '#000',
                    borderRadius: 10,
                    padding: 10,
                    color: 'black',
                    fontSize: 18,
                    fontWeight: 'bold',
                  },
                }}
                value={formikProps.values[question.id]}
                placeholder={{ label: "Select a country", value: null }}
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                if (formikProps.values[question.id]) {
                  animateTransition('next');
                }
                setAnsweredQuestions(answeredQuestions + 1);
              }}
              style={styles.button}
            >
              <View style={styles.btnleft}>
                <Text style={styles.text}>Next</Text>
                <Ionicons name={'arrow-forward-outline'} size={25} />
              </View>
            </TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <Formik
      initialValues={{}}
      onSubmit={async (values) => {
        const jsonOutput = JSON.stringify(values, null, 2);
        console.log("Form Submission:");
        console.log("works in typeform", jsonOutput);
        try {
          await AsyncStorage.setItem('userinfo', jsonOutput);
          router.push('/(kyc)/');
        } catch (error) {
          console.error('Failed to save user info:', error);
          console.log("not saving it");
        }
      }}
    >
      {(formikProps) => (
        <View style={styles.container}>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
          </View>
          <AnimatedView
            style={[
              styles.questionContainer,
              {
                opacity: fadeAnim,
                transform: [
                  {
                    translateX: slideAnim.interpolate({
                      inputRange: [-1, 0, 1],
                      outputRange: [-300, 0, 300],
                    }),
                  },
                ],
              },
            ]}
          >
            {currentQuestion < questions.length ? (
              renderQuestion(questions[currentQuestion], formikProps)
            ) : (
              <View>
                <Text style={styles.question}>
                  {"Matching profiles for you are created! \nSign in to look at them!"}
                </Text>
                <TouchableOpacity
                  onPress={() => formikProps.handleSubmit()}
                  style={styles.button}
                >
                  <View style={styles.btnleft}>
                    <Text style={styles.text}>Sign up</Text>
                    <Ionicons name={'arrow-forward-outline'} size={25} />
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </AnimatedView>
          <Image
            source={require('../assets/images/nou.gif')}
            style={{ width: 200, height: 200, marginTop: -175 }}
          />
          {currentQuestion > 0 && (
            <TouchableOpacity
              onPress={() => animateTransition('prev')}
              style={styles.prevButton}
            >
              <Ionicons name={'arrow-back-outline'} size={25} />
            </TouchableOpacity>
          )}
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  icon: {
    marginLeft: 10,
  },
  btnleft: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Keeps items on the left side if needed
    alignItems: 'center',         // Vertically centers both icon and text
    marginLeft: 10,
    marginRight: 20,
  },
  text: {
    color: '#000000',
    paddingVertical: 15,
    fontSize: 18,
    fontWeight: '900',
    justifyContent: 'center',
    alignContent: 'center',
    textAlign: 'left',
    marginLeft: 10,
    marginRight: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 0,
    backgroundColor: '#f9e587',
    height: '100%',
  },
  progressBarContainer: {
    width: '100%',
    height: 10,
    backgroundColor: '#E0E0E0',
    position: 'absolute',
    top: 0,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#2E2E2E58',
  },
  questionContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    borderRadius: 10,
    padding: 20,
  },
  pickerStyle: {
    height: 50,
    width: '100%',
    color: '#f3342c',
    fontSize: 18,
    fontWeight: 'bold',
    justifyContent: 'center',
  },
  question: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 20,
    color: '#000000',
  },
  dropdownContainer: {
    borderWidth: 3,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  input: {
    borderWidth: 2,
    backgroundColor: 'white',
    borderColor: '#333',
    padding: 10,
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#0000002C',
    color: '#000000',
    borderRadius: 5,
    marginTop: 20,
  },
  buttoncheck: {
    backgroundColor: '#FFA3A0FF',
    color: '#000000',
    borderRadius: 5,
    marginTop: 40,
  },
  prevButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: '#0000002C',
    color: '#000000',
    borderRadius: 5,
    paddingVertical: 3,
    paddingHorizontal: 3,
    marginTop: 20,
  },
  sliderThumb: {
    backgroundColor: '#000000FF',
    width: 30,
    height: 30,
  },
  sliderTrack: {
    height: 5,
  },
  sliderValue: {
    textAlign: 'center',
    fontSize: 18,
    color: '#000000',
  },
  checkboxContainer: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderRadius: 8,
    borderColor: 'black',
    padding: 10,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 5,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  navbar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    width: '100%',
  },
});

export default TypeformClone;
