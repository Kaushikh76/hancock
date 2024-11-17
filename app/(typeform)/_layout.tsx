import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TextInput, Easing, Image } from 'react-native';
import { Formik } from 'formik';
import { Button, CheckBox } from 'react-native-elements';
import Slider from '@react-native-community/slider';
import RNPickerSelect from 'react-native-picker-select';
import pickerSelectStyles from 'react-native-picker-select'

import { router } from 'expo-router';

const questions = [
  { id: 'name', type: 'text', question: "What's your name?", placeholder: "Name ?" },
  { id: 'Bio', type: 'text', question: "So What's so special about you", placeholder: "Special ?"  },
  { id: 'age', type: 'slider', question: 'How old are you?', min: 14, max: 80 },
  { id: 'country', type: 'dropdown', question: 'Which country are you from?' },
  { id: 'alert', type: 'alert', question: 'What is your preference ?' },
  { id: 'preferage', type: 'slider', question: 'How old do you prefer 😏 ?', min: 18, max: 100 },
  { id: 'prefernose', type: 'slider', question: 'Whats your Nose type?', min: 1, max: 10 },
  { id: 'preferlips', type: 'slider', question: 'Ohhhhh Lips ? I know why you need this 😙 ?', min: 1, max: 10 },
  { id: 'preferjawline', type: 'slider', question: 'Is Jawline important 🤠 ?', min: 1, max: 10 },
  { id: 'preferskin', type: 'radio', question: 'Seriously ? Skin color 👤', options: ['White as milk', 'Hot Brown-ie', 'Dark Chocolate soup', 'poison ?'] },
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
              // placeholderStyle={{ fontWeight: 900, fontFamily: 'Arial' }} // Add this line to style the placeholder text
            />
            <Button
              title="Next"
              onPress={() => {
          if (formikProps.values[question.id]) {
            animateTransition('next');
          }
          setAnsweredQuestions(answeredQuestions + 1);

              }}
              buttonStyle={styles.button}
            />
          </View>
        );
        case 'alert':
            return (
              <View>
                <Text style={styles.question}>{question.question}</Text>
                
                <Button
                  title="Let me Prefer!"
                  onPress={() => {
                      animateTransition('next');      
                      setAnsweredQuestions(answeredQuestions + 1);
      
                  }}
                  buttonStyle={styles.button}
                />
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
                      thumbImage={require('../../assets/images/thum.png')}
                      
                    />
                    <Text style={styles.sliderValue}>
                      {formikProps.values[question.id] ?? question.min}
                    </Text>
                    <Button 
                      title="Next" 
                      onPress={() => {
                        if (formikProps.values[question.id] !== undefined) {
                          animateTransition('next');
                        }
                        setAnsweredQuestions(answeredQuestions + 1);

                      }} 
                      buttonStyle={styles.button} 
                    />
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
            <Button title="Next" onPress={() => {animateTransition('next')  
                setAnsweredQuestions(answeredQuestions + 1);
}
              
            } buttonStyle={styles.buttoncheck} />
          </View>
        );
      case 'radio':
        return (
          <View>
            <Text style={styles.question}>{question.question}</Text>
            {question.options.map((option) => (
              <CheckBox
                key={option}
                title={option}
                checked={formikProps.values[question.id] === option}
                onPress={() => formikProps.setFieldValue(question.id, option)}
                containerStyle={styles.checkboxContainer}
              />
            ))}
            <Button title="Next" onPress={() => {animateTransition('next')
                    setAnsweredQuestions(answeredQuestions + 1);

            }} buttonStyle={styles.button} />
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
              borderWidth: 1,
              borderColor: '#333',
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
            <Button 
              title="Next" 
              onPress={() => {
          if (formikProps.values[question.id]) {
            animateTransition('next');
          }
          setAnsweredQuestions(answeredQuestions + 1);
              }} 
              buttonStyle={styles.button} 
            />
          </View>
        );
      default:
        return null;
    }
  };

  
  return (
    <Formik
      initialValues={{}}
      onSubmit={(values) => {
        const jsonOutput = JSON.stringify(values, null, 2);
        console.log("Form Submission:");
        console.log(jsonOutput);
        alert("Preferences noted, your details are encrypted!");
        router.push('/(kyc)')
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
                <Text style={styles.question}>Thanks! {"\n"}Matching profiles for you {"\n"}are created! </Text>
                <Button title="Sign up" onPress={() => formikProps.handleSubmit()} buttonStyle={styles.button} />
              </View>
            )}
          </AnimatedView>
          <Image 
            source={require('../../assets/images/nou.gif')}
            style={{ width: 200, height: 200, marginTop: -175 }}
          />
          {currentQuestion > 0 && (
            <Button
              title="Previous"
              onPress={() => animateTransition('prev')}
              containerStyle={styles.prevButton}
              buttonStyle={styles.button}
            />
          )}
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 0,
    backgroundColor: '#FFF0BAFF',
    height: '100%',
  },
  progressBarContainer: {
    width: '100%',
    height: 4,
    backgroundColor: '#E0E0E0',
    position: 'absolute',
    top: 0,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FF1010FF',
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
    // fontFamily: 'Arial', // Change font here
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
    borderWidth: 3,
    backgroundColor: 'white',
    borderColor: '#333',
    padding: 10,

    borderRadius: 10,
  },
  button: {
    backgroundColor: '#f3342c',
    color: '#000000',
    borderRadius: 5,
    marginTop: 40,
  },
  buttoncheck: {
    backgroundColor: '#FFA3A0FF',
    color: '#000000',
    borderRadius: 5,
    marginTop: 40,
  },
  prevButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
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
    // fontFamily: 'Arial', // Change font here
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