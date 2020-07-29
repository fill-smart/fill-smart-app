import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import THEME_COLORS from '../styles/theme.styles';
import ShowStatusBarLayout from '../layouts/show-status-bar.layout';
import { useNavigation } from 'react-navigation-hooks';
import ProfileDefaultIcon from '../assets/icons/ic_profile_default.svg';
import CameraIcon from '../assets/icons/ic_camera_circle.svg';
import useProfile from '../hooks/use-profile';
import BackArrowIcon from '../assets/icons/ic_arrow_back.svg';
import moment from 'moment';
import 'moment/locale/es'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Loader from '../components/loader.component';

const styles = StyleSheet.create({
    actionBar: {
        backgroundColor: THEME_COLORS.PRIMARY,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        paddingVertical: 16,
        paddingHorizontal: 12
    },
    picContainer: {
        backgroundColor: THEME_COLORS.PRIMARY,
        width: '100%',
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: 25,
        marginTop: -20

    },
    dataContainer: {
        backgroundColor: THEME_COLORS.BACKGROUND_DARK,
        flex: 1,
        width: '100%',
        paddingTop: 25,
        paddingHorizontal: 50
    },
    userText: {
        fontFamily: "LibreFranklin-Medium",
        fontSize: 18,
        color: THEME_COLORS.WHITE,
        marginTop: 25,
    },
    circle: {
        width: 150,
        height: 150,
        borderRadius: 150 / 2,
        opacity: 0.2,
        backgroundColor: THEME_COLORS.WHITE,
        position: "absolute",
        marginLeft: -12, marginTop: -5
    },
    cameraBackGround: {
        width: 37,
        height: 37,
        borderRadius: 37 / 2,
        backgroundColor: THEME_COLORS.WHITE,
        position: "absolute",
        right: 0,
        bottom: 0
    },
    formGroup: {
        marginTop: 15
    },
    formLabel: {
        marginBottom: 3,
        fontFamily: "LibreFranklin-Regular",
        fontSize: 16,
        color: THEME_COLORS.FONT_REGULAR,

    },
    formValue: {
        fontFamily: "LibreFranklin-Regular",
        fontSize: 14,
        color: THEME_COLORS.FONT_NORMAL,
    }

});

const Profile = () => {
    const navigation = useNavigation();
    const { profile, loading, error } = useProfile();
    moment.locale("es");

    if (loading) {
        return <Loader />;
    }

    return (
        <ShowStatusBarLayout>
            <View style={styles.actionBar}>
                <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
                    <View style={{ width: 64, height:32, paddingRight: 24}}>
                        <BackArrowIcon />
                    </View>
                </TouchableWithoutFeedback>
            </View>
            <View style={styles.picContainer}>
                <View>
                    <View style={styles.circle} />
                    <ProfileDefaultIcon width={150} height={150} />
                    <View style={styles.cameraBackGround}>
                        <CameraIcon />
                    </View>
                </View>
                <Text style={styles.userText}>{profile?.customer.firstName} {profile?.customer.lastName}</Text>
            </View>

            <View style={styles.dataContainer}>
                <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>DNI</Text>
                    <Text style={styles.formValue}>{profile?.customer.documentNumber}</Text>
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Fecha de nacimiento</Text>
                    <Text style={styles.formValue}>{moment(profile?.customer.born).locale("es").format("DD [de] MMMM [de] YYYY")}</Text>
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Email / Usuario</Text>
                    <Text style={styles.formValue}>{profile?.username}</Text>
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Celular</Text>
                    <Text style={styles.formValue}>{profile?.customer.phone}</Text>
                </View>
            </View>

        </ShowStatusBarLayout>
    );
}

export default Profile;