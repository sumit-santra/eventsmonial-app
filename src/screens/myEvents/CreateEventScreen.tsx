import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'react-native-linear-gradient';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { Picker } from '@react-native-picker/picker';
import Toast from 'react-native-toast-message';
import protectedApi from '../../services/protectedApi'; 

const CreateEventScreen = ({ navigation }: { navigation: any }) => {
  const [step, setStep] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    eventType: "",
    eventDate: "",
    eventTime: "",
    eventCity: "",
    guestCount: null,
    budget: 100000,
    notes: "",
    religion: "",
    ethnicity: "",
    brideName: "",
    groomName: "",
    birthdayPersonName: "",
    wifeName: "",
    husbandName: "",
    celebration: ""
  });

  const submitForm = async () => {
    const eventTypeFields = {
      Wedding: ['brideName', 'groomName'],
      Birthday: ['birthdayPersonName'],
      Engagement: ['brideName', 'groomName'],
      Anniversary: ['wifeName', 'husbandName'],
      Other: ['celebration']
    };

    const fields = eventTypeFields[form.eventType as keyof typeof eventTypeFields] || [];
    const eventParticipants: any = {};
    
    fields.forEach(field => {
      if (form[field as keyof typeof form]) {
        eventParticipants[field] = form[field as keyof typeof form];
      }
    });

    const postData = {
      eventType: form.eventType,
      eventDate: form.eventDate,
      eventTime: form.eventTime,
      eventCity: form.eventCity,
      guestCount: parseInt(form.guestCount as any) || 0,
      budget: form.budget,
      notes: form.notes,
      religion: form.religion,
      ethnicity: form.ethnicity,
      eventParticipants
    };

    console.log('Submitting event data:', postData);

    try {
      setLoading(true);
      const response = await protectedApi.createEvent(postData);
      if (response.success || response.statusCode === 200 || response.statusCode === 201) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Event created successfully!'
        });

        
        setForm({
          eventType: "",
          eventDate: "",
          eventTime: "",
          eventCity: "",
          guestCount: null,
          budget: 100000,
          notes: "",
          religion: "",
          ethnicity: "",
          brideName: "",
          groomName: "",
          birthdayPersonName: "",
          wifeName: "",
          husbandName: "",
          celebration: ""
        });
        setStep(1);
        setErrors({});
        setSelectedDate(new Date());
        setSelectedTime(new Date());
        
        navigation.navigate('EventDetails', { cardData: response.data});
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to create event. Please try again.'
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to create event. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const validateStep1 = () => {
    const newErrors: any = {};
    
    if (!form.eventType) newErrors.eventType = 'Please select event type';
    if (!form.eventDate) newErrors.eventDate = 'Please select event date';
    if (!form.eventCity) newErrors.eventCity = 'Please enter event city';
    
    // Validate participant fields based on event type
    if (form.eventType === 'Wedding' || form.eventType === 'Engagement') {
      if (!form.brideName) newErrors.brideName = 'Please enter bride name';
      if (!form.groomName) newErrors.groomName = 'Please enter groom name';
    } else if (form.eventType === 'Anniversary') {
      if (!form.wifeName) newErrors.wifeName = 'Please enter wife name';
      if (!form.husbandName) newErrors.husbandName = 'Please enter husband name';
    } else if (form.eventType === 'Birthday') {
      if (!form.birthdayPersonName) newErrors.birthdayPersonName = 'Please enter birthday person name';
    } else if (form.eventType === 'Other') {
      if (!form.celebration) newErrors.celebration = 'Please specify event type';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const next = () => {
    if (step === 1 && !validateStep1()) return;
    if (step < 3) setStep(step + 1);
  };
  const back = () => step > 1 && setStep(step - 1);

  return (
    <LinearGradient colors={['#F8F8F9', '#F8F8F9']} style={styles.container}>
        

        <View style={styles.header}>

            <View style={{flexDirection:'row', alignItems:'center', justifyContent: 'space-between', paddingBottom: 10}}>
                <TouchableOpacity style={styles.iconTopLeft} onPress={() => navigation.goBack()}>
                    <MaterialIcons name="west" size={22} color="#888888" />
                </TouchableOpacity>
                <Text style={{fontSize:16, fontWeight:'600', color:'#888888'}}>
                    Step {step} of 3
                </Text>
                <View style={{width:44}}></View>
            </View>

            <View style={styles.progressWrapper}>
                <View style={styles.progressTrack}>
                    <View
                        style={[
                            styles.progressFill,
                            { width: `${(step / 3) * 100}%` },
                        ]}
                    />
                </View>
            </View>
        </View>

        <ScrollView contentContainerStyle={styles.ScrollViewContainer}>

            <View>
                <Text style={styles.title}>Plan your event in 3 easy steps</Text>
            </View>

            <View style={styles.card}>
                {step === 1 && (
                    <>
                        <Text style={styles.sectionTitle}>Tell us about your event</Text>


                        <Text style={styles.label}>Event Type</Text>

                        <View style={{borderWidth: 1, borderColor: '#eee', borderRadius: 8, overflow: 'hidden'}}>
                            <Picker
                                selectedValue={form.eventType}
                                onValueChange={(itemValue: any) => setForm({ ...form, eventType: itemValue })}
                                style={styles.picker} 
                            >
                                <Picker.Item label="Select Event Type" value="" />
                                <Picker.Item label="Wedding" value="Wedding" />
                                <Picker.Item label="Anniversary" value="Anniversary" />
                                <Picker.Item label="Engagement" value="Engagement" />
                                <Picker.Item label="Birthday" value="Birthday" />
                                <Picker.Item label="Other" value="Other" />
                            </Picker>
                        </View>
                        {errors.eventType && <Text style={styles.errorText}>{errors.eventType}</Text>}
                        
                        <Text style={styles.label}>Event date *</Text>
                        <TouchableOpacity 
                            style={styles.input} 
                            onPress={() => setShowDatePicker(true)}
                        >
                            <Text style={form.eventDate ? styles.dateText : styles.placeholderText}>
                                {form.eventDate ? selectedDate.toLocaleDateString('en-GB') : 'DD-MM-YYYY'}
                            </Text>
                        </TouchableOpacity>
                        {showDatePicker && (
                            <DateTimePicker
                                value={selectedDate}
                                mode="date"
                                display="default"
                                accentColor="#ff0066"
                                minimumDate={new Date(Date.now() + 24 * 60 * 60 * 1000)}
                                onChange={(event, date) => {
                                    setShowDatePicker(Platform.OS === 'ios');
                                    if (date) {
                                        setSelectedDate(date);
                                        const year = date.getFullYear();
                                        const month = date.getMonth() + 1;
                                        const day = date.getDate();
                                        const apiFormat = `${year}-${month}-${day}`;
                                        const displayFormat = date.toLocaleDateString('en-GB');
                                        setForm({ ...form, eventDate: apiFormat });
                                    }
                                }}
                            />
                        )}
                        {errors.eventDate && <Text style={styles.errorText}>{errors.eventDate}</Text>}

                        {form.eventType === 'Wedding' && (
                            <>
                                <Input
                                    label="Name of Bride"
                                    value={form.brideName}
                                    error={errors.brideName}
                                    onChange={(v: any) => setForm({ ...form, brideName: v })}
                                />
                                <Input
                                    label="Name of Groom"
                                    value={form.groomName}
                                    error={errors.groomName}
                                    onChange={(v: any) => setForm({ ...form, groomName: v })}
                                />
                            </>
                        )}

                        {form.eventType === 'Engagement' && (
                            <>
                                <Input
                                    label="Name of Bride"
                                    value={form.brideName}
                                    error={errors.brideName}
                                    onChange={(v: any) => setForm({ ...form, brideName: v })}
                                />
                                <Input
                                    label="Name of Groom"
                                    value={form.groomName}
                                    error={errors.groomName}
                                    onChange={(v: any) => setForm({ ...form, groomName: v })}
                                />
                            </>
                        )}

                        {form.eventType === 'Anniversary' && (
                            <>
                                <Input
                                    label="Name of Wife"
                                    value={form.wifeName}
                                    error={errors.wifeName}
                                    onChange={(v: any) => setForm({ ...form, wifeName: v })}
                                />
                                <Input
                                    label="Name of Husband"
                                    value={form.husbandName}
                                    error={errors.husbandName}
                                    onChange={(v: any) => setForm({ ...form, husbandName: v })}
                                />
                            </>
                        )}

                        {form.eventType === 'Birthday' && (
                            <Input
                                label="Birthday Person Name"
                                value={form.birthdayPersonName}
                                error={errors.birthdayPersonName}
                                onChange={(v: any) => setForm({ ...form, birthdayPersonName: v })}
                            />
                        )}

                        {form.eventType === 'Other' && (
                            <Input
                                label="Please specify"
                                placeholder="Enter event type"
                                value={form.celebration}
                                error={errors.celebration}
                                onChange={(v: any) => setForm({ ...form, celebration: v })}
                            />
                        )}
                        
                        <Input
                            label="Event city"
                            value={form.eventCity}
                            error={errors.eventCity}
                            onChange={(v: any) => setForm({ ...form, eventCity: v })}
                        />
                    </>
                )}

                {step === 2 && (
                    <>
                        <Text style={styles.sectionTitle}>Tell us about your event</Text>

                        <Text style={styles.label}>Event time *</Text>
                        <TouchableOpacity 
                            style={styles.input} 
                            onPress={() => setShowTimePicker(true)}
                        >
                            <Text style={form.eventTime ? styles.dateText : styles.placeholderText}>
                                {form.eventTime || 'Select event time'}
                            </Text>
                        </TouchableOpacity>
                        {showTimePicker && (
                            <DateTimePicker
                                value={selectedTime}
                                mode="time"
                                display="default"
                                accentColor="#ff0066"
                                onChange={(event, time) => {
                                    setShowTimePicker(Platform.OS === 'ios');
                                    if (time) {
                                        setSelectedTime(time);
                                        const formattedTime = time.toLocaleTimeString('en-US', {
                                            hour12: false,
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        });
                                        setForm({ ...form, eventTime: formattedTime });
                                    }
                                }}
                            />
                        )}

                        <Input
                            label="Guest count"
                            placeholder="Enter number of guests"
                            keyboardType="numeric"
                            value={form.guestCount}
                            onChange={(v: any) => setForm({ ...form, guestCount: v })}
                        />
                    </>
                )}

                {step === 3 && (
                <>
                    <Text style={styles.sectionTitle}>Tell us about your event</Text>

                    <Text style={styles.label}>Estimated budget</Text>
                    <Text style={styles.budgetText}>
                        ₹ {form.budget.toLocaleString('en-IN')}
                    </Text>

                    <Slider
                        minimumValue={10000}
                        maximumValue={10000000}
                        step={10000}
                        value={form.budget}
                        onValueChange={(v) =>
                            setForm({ ...form, budget: v })
                        }
                        minimumTrackTintColor="#ff0066"
                        maximumTrackTintColor="#ddd"
                    />

                    <Text style={styles.label}>Notes</Text>
                    <TextInput
                        style={styles.textArea}
                        multiline
                        maxLength={150}
                        placeholder="Enter notes about event (max 150 words)"
                        value={form.notes}
                        onChangeText={(v) =>
                            setForm({ ...form, notes: v })
                        }
                    />
                    <Text style={styles.counter}>
                        {form.notes.length}/150
                    </Text>

                    <Input
                        label="Religion"
                        value={form.religion}
                        onChange={(v: any) => setForm({ ...form, religion: v })}
                    />

                    <Input
                        label="Ethnicity"
                        value={form.ethnicity}
                        onChange={(v: any) => setForm({ ...form, ethnicity: v })}
                    />
                </>
                )}
            </View>
        </ScrollView>
        
        <View style={styles.footer}>
            <TouchableOpacity
                style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]}
                onPress={step === 3 ? submitForm : next}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" size="small" />
                ) : (
                    <Text style={styles.btnText}>
                        {step === 3 ? 'Submit' : 'Next'}
                    </Text>
                )}
            </TouchableOpacity>

            {step > 1 && (
                <TouchableOpacity onPress={back}>
                    <Text style={styles.back}>Back</Text>
                </TouchableOpacity>
            )}
        </View>
       
    </LinearGradient>
  );
};


const Input = ({ label, value, onChange, error, ...props }: any) => (
  <>
    <Text style={styles.label}>{label} *</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChange}
      {...props}
    />
    {error && <Text style={styles.errorText}>{error}</Text>}
  </>
);


const styles = StyleSheet.create({

    container: {
        flex: 1,
    },

    ScrollViewContainer:{
        padding: 20,
        paddingBottom: 120,
    },

    header:{
        paddingTop: 50,
        paddingHorizontal:20,
        paddingBottom: 5,
    },

    iconTopLeft:{
        marginRight: 5,
        backgroundColor: 'rgb(255,255,255)',
        padding: 8,
        borderRadius: 20,
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },

    title: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 20,
    },

    progressWrapper: {
        paddingBottom: 10,
    },

    progressTrack: {
        height: 3,
        backgroundColor: '#dfdfdf',
        borderRadius: 3,
        overflow: 'hidden',
    },

    progressFill: {
        height: '100%',
        backgroundColor: '#ff0066',
        borderRadius: 3,
    },

    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },

    label: {
        fontSize: 14,
        marginTop: 12,
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 8,
        padding: 12,
    },
    dateText: {
        color: '#000',
        fontSize: 16,
    },
    placeholderText: {
        color: '#999',
        fontSize: 16,
    },
    textArea: {
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 8,
        padding: 12,
        height: 100,
        textAlignVertical: 'top',
    },
    counter: {
        textAlign: 'right',
        fontSize: 12,
        color: '#888',
    },
    budgetText: {
        color: '#ff0066',
        fontSize: 18,
        textAlign: 'center',
        marginVertical: 8,
    },

    picker: {
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 0,
        height: 50,
        backgroundColor: '#fff',
        marginTop: -2,
    },

    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 30,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#E5E5E5',
        elevation: 5,
    },

    back: {
        color: '#909090',
        marginBottom: 10,
        textAlign: 'center',
        paddingVertical: 10,
    },

    primaryBtn: {
        backgroundColor: '#ff0066',
        paddingVertical: 14,
        paddingHorizontal: 50,
        borderRadius: 6,
    },
    primaryBtnDisabled: {
        backgroundColor: '#ccc',
    },
    btnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    inputError: {
        borderColor: '#ff0066',
    },
    errorText: {
        color: '#ff0066',
        fontSize: 12,
        marginTop: 4,
    },
});

export default CreateEventScreen;
