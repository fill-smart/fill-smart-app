import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import styled from 'styled-components/native';
import THEME_COLORS from '../../styles/theme.styles';
import ShowStatusBarLayout from '../../layouts/show-status-bar.layout';
import { useNavigation, useNavigationParam } from 'react-navigation-hooks';
import ProfileDefaultIcon from '../../assets/icons/ic_profile_default.svg';
import CameraIcon from '../../assets/icons/ic_camera_circle.svg';
import useProfile from '../../hooks/use-profile';
import BackArrowIcon from '../../assets/icons/ic_arrow_back.svg';
import moment from 'moment';
import 'moment/locale/es'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Loader from '../../components/loader.component';
import Button from '../../components/button.component';
import { PROFILE_ROUTES, getRoutePath, HOME_ROUTE, APP_ROUTES } from '../../routing/routes';
import { StackActions, NavigationActions } from 'react-navigation';
import { SecurityContext } from '../../contexts/security.context';
import ImagePickerModal from '../../components/image-picker.modal.component';
import ImagePicker from 'react-native-image-picker';
import useProfileUploadImage from '../../hooks/use-profile-upload-image';


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
        marginBottom: 15
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
    },
    changePasswordText: {
        fontFamily: "LibreFranklin-Regular",
        fontSize: 14,
        color: THEME_COLORS.PRIMARY,
    },
    editButton: {
        borderRadius: 0,
        height: 45
    }
});

const ProfilePage = () => {
    const navigation = useNavigation();
    const [showImagePickerModal, setShowImagePickerModal] = useState(false);
    const { profile, loading: queryLoading, error: queryError, refetch } = useProfile();
    const { customerId, loading: uploadLoading, error: uploadError, executeUploadImage } = useProfileUploadImage();
    const [securityCtx] = useContext(SecurityContext);
    moment.locale("es");

    useEffect(() => {
        if (customerId) {
          refetch();
        }
      }, [customerId]);

    const goToChangePassword = () => {
        navigation.navigate(getRoutePath(PROFILE_ROUTES.ChangePassword, PROFILE_ROUTES));
    };

    const uploadImageFromGallery = () => {
        ImagePicker.launchImageLibrary({}, (response) => {
            if (!response.didCancel) {
                executeUploadImage({ image: response.data });
            }
        });
    }

    const openSelectedOption = (option: "camera" | "gallery") => {
        if (option === "camera") {
            navigation.navigate({routeName: getRoutePath(PROFILE_ROUTES.ProfileCamera, PROFILE_ROUTES), params: {refetch}});
        }
        else if (option === "gallery") {
            uploadImageFromGallery();
        }
        setShowImagePickerModal(false);
    };

    if (queryLoading || uploadLoading) {
        return <Loader />;
    }

    return (
        <ShowStatusBarLayout>
            <ImagePickerModal
                onOptionSelected={openSelectedOption}
                isModalVisible={showImagePickerModal}
                onClose={() => {setShowImagePickerModal(false)}}
            />
            <ScrollView>
                <View style={styles.actionBar}>
                    <TouchableOpacity onPress={() => {
                        const resetAction = StackActions.reset({
                            index: 0,
                            actions: [
                                NavigationActions.navigate({
                                routeName: getRoutePath(APP_ROUTES.Main),
                                }),
                            ],
                            });
                        navigation.dispatch(resetAction)}}>
                        <View style={{ width: 64, height:32, paddingRight: 24}}>
                            <BackArrowIcon />
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.picContainer}>
                    <View>
                        <View style={styles.circle} />
                        {profile?.customer.profileImage ? 
                            <Image style={{width: 150, height: 150, borderRadius: 150/2}} source={{
                                uri: `data:image/png;base64,${securityCtx.user?.customer.profileImage}`,
                            }}/>
                            : <ProfileDefaultIcon width={150} height={150} />
                        }
                        <View style={styles.cameraBackGround}>
                            <TouchableOpacity onPress={() => { setShowImagePickerModal(true) }}>
                                <CameraIcon />
                            </TouchableOpacity>
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

                    <View style={styles.formGroup}>
                        <Text style={styles.formLabel}>CBU</Text>
                        <Text style={styles.formValue}>{profile?.customer.cbu.length ? profile?.customer.cbu : "-"}</Text>
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.formLabel}>Alias</Text>
                        <Text style={styles.formValue}>{profile?.customer.cbuAlias.length ? profile?.customer.cbuAlias : "-"}</Text>
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.formLabel}>Email de Mercado Pago</Text>
                        <Text style={styles.formValue}>{profile?.customer.mercadopagoAccount.length ? profile?.customer.mercadopagoAccount : "-"}</Text>
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.formLabel}>Contraseña</Text>
                        <TouchableOpacity onPress={goToChangePassword}>
                            <Text style={styles.changePasswordText}>Cambiar contraseña</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            <Button label="Editar mis datos" onPress={() => navigation.navigate(getRoutePath(PROFILE_ROUTES.ProfileEditData, PROFILE_ROUTES), {profile: profile, refetch: refetch})} style={styles.editButton}/>
        </ShowStatusBarLayout>
    );
}

ProfilePage.navigationOptions = {
    header: null
};

export default ProfilePage;