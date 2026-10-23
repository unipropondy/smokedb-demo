import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Modal,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { API_URL as BASE_URL } from '@/constants/Config';

// ======================================================
// TYPES
// ======================================================

interface KioskCustomerItem {
    CustomerVehicleId?: string;
    CustomerName?: string;
    CarNumber?: string;
    MobileNumber?: string;
    VehicleType?: string;
    DefaultDishId?: string;
    CreatedOn?: string;
    UpdatedOn?: string;
}

const EMPTY_FORM = {
    CustomerName: '',
    CarNumber: '',
    MobileNumber: '',
    VehicleType: '',
};

// ======================================================
// COMPONENT
// ======================================================

const KioskCustomer: React.FC = () => {
    const navigation = useNavigation<any>();

    const [customers, setCustomers] = useState<KioskCustomerItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [saving, setSaving] = useState<boolean>(false);
    const [deleting, setDeleting] = useState<string | null>(null);

    // Modal state
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [editTarget, setEditTarget] = useState<KioskCustomerItem | null>(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // ====================================================
    // API — GET ALL
    // ====================================================

    const loadKioskCustomers = async (): Promise<void> => {
        try {
            const response = await fetch(`${BASE_URL}/api/kiosk-customers`);
            const data = await response.json();
            if (!response.ok) throw new Error(data?.message || 'Failed to load');
            setCustomers(Array.isArray(data) ? data : []);
        } catch (error: any) {
            setCustomers([]);
            Alert.alert('Error', error?.message || 'Unable to load kiosk customers.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            loadKioskCustomers();
        }, [])
    );

    const handleRefresh = async () => {
        setRefreshing(true);
        await loadKioskCustomers();
    };

    // ====================================================
    // VALIDATE
    // ====================================================

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!form.CustomerName.trim()) newErrors.CustomerName = 'Customer name is required';
        if (!form.CarNumber.trim()) newErrors.CarNumber = 'Car number is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ====================================================
    // OPEN ADD MODAL
    // ====================================================

    const handleAdd = () => {
        setEditTarget(null);
        setForm(EMPTY_FORM);
        setErrors({});
        setModalVisible(true);
    };

    // ====================================================
    // OPEN EDIT MODAL
    // ====================================================

    const handleEdit = (item: KioskCustomerItem) => {
        setEditTarget(item);
        setForm({
            CustomerName: item.CustomerName || '',
            CarNumber: item.CarNumber || '',
            MobileNumber: item.MobileNumber || '',
            VehicleType: item.VehicleType || '',
        });
        setErrors({});
        setModalVisible(true);
    };

    // ====================================================
    // API — SAVE (INSERT OR UPDATE)
    // ====================================================

    const handleSave = async () => {
        if (!validate()) return;
        setSaving(true);
        try {
            const isEdit = !!editTarget?.CustomerVehicleId;
            const url = isEdit
                ? `${BASE_URL}/api/kiosk-customers/${editTarget!.CustomerVehicleId}`
                : `${BASE_URL}/api/kiosk-customers`;

            const response = await fetch(url, {
                method: isEdit ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerName: form.CustomerName.trim(),
                    carNumber: form.CarNumber.trim().toUpperCase(),
                    mobileNumber: form.MobileNumber.trim() || null,
                    vehicleType: form.VehicleType.trim() || null,
                }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data?.error || 'Save failed');

            setModalVisible(false);
            await loadKioskCustomers();
            Alert.alert('Success', isEdit ? 'Customer updated.' : 'Customer added.');
        } catch (error: any) {
            Alert.alert('Error', error?.message || 'Could not save customer.');
        } finally {
            setSaving(false);
        }
    };

    // ====================================================
    // API — DELETE (SOFT)
    // ====================================================

    const handleDelete = (item: KioskCustomerItem) => {
        Alert.alert(
            'Delete Customer',
            `Remove "${item.CustomerName || item.CarNumber}" from kiosk customers?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        const id = item.CustomerVehicleId!;
                        setDeleting(id);
                        try {
                            const response = await fetch(
                                `${BASE_URL}/api/kiosk-customers/${id}`,
                                { method: 'DELETE' }
                            );
                            const data = await response.json();
                            if (!response.ok) throw new Error(data?.error || 'Delete failed');
                            setCustomers(prev =>
                                prev.filter(c => c.CustomerVehicleId !== id)
                            );
                        } catch (error: any) {
                            Alert.alert('Error', error?.message || 'Could not delete customer.');
                        } finally {
                            setDeleting(null);
                        }
                    },
                },
            ]
        );
    };

    // ====================================================
    // HELPERS
    // ====================================================

    const formatDate = (dateValue?: string): string => {
        if (!dateValue) return '-';
        try {
            const d = new Date(dateValue);
            if (isNaN(d.getTime())) return dateValue;
            return d.toLocaleString();
        } catch {
            return dateValue;
        }
    };

    // ====================================================
    // CUSTOMER CARD
    // ====================================================

    const renderCustomer = ({
        item,
        index,
    }: {
        item: KioskCustomerItem;
        index: number;
    }) => {
        const isBeingDeleted = deleting === item.CustomerVehicleId;

        return (
            <View style={styles.customerCard}>

                {/* Serial */}
                <View style={styles.numberBox}>
                    <Text style={styles.numberText}>{index + 1}</Text>
                </View>

                {/* Details */}
                <View style={styles.customerDetails}>

                    {/* Name */}
                    <View style={styles.detailRow}>
                        <View style={styles.detailIcon}>
                            <Ionicons name="person-outline" size={18} color="#374151" />
                        </View>
                        <View style={styles.detailContent}>
                            <Text style={styles.detailLabel}>Customer Name</Text>
                            <Text style={styles.detailValue}>{item.CustomerName || '-'}</Text>
                        </View>
                    </View>

                    {/* Car */}
                    <View style={styles.detailRow}>
                        <View style={styles.detailIcon}>
                            <Ionicons name="car-outline" size={18} color="#374151" />
                        </View>
                        <View style={styles.detailContent}>
                            <Text style={styles.detailLabel}>Car Number</Text>
                            <Text style={styles.detailValue}>{item.CarNumber || '-'}</Text>
                        </View>
                    </View>

                    {/* Mobile */}
                    {!!item.MobileNumber && (
                        <View style={styles.detailRow}>
                            <View style={styles.detailIcon}>
                                <Ionicons name="call-outline" size={18} color="#374151" />
                            </View>
                            <View style={styles.detailContent}>
                                <Text style={styles.detailLabel}>Mobile</Text>
                                <Text style={styles.detailValue}>{item.MobileNumber}</Text>
                            </View>
                        </View>
                    )}

                    {/* Vehicle Type */}
                    {!!item.VehicleType && (
                        <View style={styles.detailRow}>
                            <View style={styles.detailIcon}>
                                <Ionicons name="construct-outline" size={18} color="#374151" />
                            </View>
                            <View style={styles.detailContent}>
                                <Text style={styles.detailLabel}>Vehicle Type</Text>
                                <Text style={styles.detailValue}>{item.VehicleType}</Text>
                            </View>
                        </View>
                    )}

                    {/* Default Dish */}
                    {!!item.DefaultDishId && (
                        <View style={styles.detailRow}>
                            <View style={styles.detailIcon}>
                                <Ionicons name="restaurant-outline" size={18} color="#374151" />
                            </View>
                            <View style={styles.detailContent}>
                                <Text style={styles.detailLabel}>Default Dish ID</Text>
                                <Text style={[styles.detailValue, { fontSize: 11 }]} numberOfLines={1}>
                                    {item.DefaultDishId}
                                </Text>
                            </View>
                        </View>
                    )}

                    {/* Date + Actions */}
                    <View style={styles.cardFooter}>
                        <View style={styles.dateRow}>
                            <Ionicons name="time-outline" size={14} color="#6B7280" />
                            <Text style={styles.dateText}>{formatDate(item.UpdatedOn || item.CreatedOn)}</Text>
                        </View>
                        <View style={styles.actionRow}>
                            {/* EDIT */}
                            <TouchableOpacity
                                style={styles.editBtn}
                                onPress={() => handleEdit(item)}
                                activeOpacity={0.75}
                            >
                                <Ionicons name="create-outline" size={16} color="#374151" />
                                <Text style={styles.editBtnText}>Edit</Text>
                            </TouchableOpacity>
                            {/* DELETE */}
                            <TouchableOpacity
                                style={styles.deleteBtn}
                                onPress={() => handleDelete(item)}
                                activeOpacity={0.75}
                                disabled={isBeingDeleted}
                            >
                                {isBeingDeleted
                                    ? <ActivityIndicator size="small" color="#fff" />
                                    : <>
                                        <Ionicons name="trash-outline" size={16} color="#fff" />
                                        <Text style={styles.deleteBtnText}>Delete</Text>
                                    </>
                                }
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
            </View>
        );
    };

    // ====================================================
    // EMPTY
    // ====================================================

    const renderEmpty = () => {
        if (loading) return null;
        return (
            <View style={styles.emptyContainer}>
                <View style={styles.emptyIcon}>
                    <Ionicons name="people-outline" size={45} color="#9CA3AF" />
                </View>
                <Text style={styles.emptyTitle}>No Kiosk Customers</Text>
                <Text style={styles.emptyDescription}>
                    Tap + Add Customer to get started.
                </Text>
            </View>
        );
    };

    // ====================================================
    // FORM MODAL (ADD / EDIT)
    // ====================================================

    const renderModal = () => (
        <Modal
            visible={modalVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalCard}>

                    {/* Modal Header */}
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>
                            {editTarget ? 'Edit Customer' : 'Add Customer'}
                        </Text>
                        <TouchableOpacity
                            onPress={() => setModalVisible(false)}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                            <Ionicons name="close" size={24} color="#374151" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

                        {/* Customer Name */}
                        <Text style={styles.fieldLabel}>Customer Name *</Text>
                        <TextInput
                            style={[styles.input, !!errors.CustomerName && styles.inputError]}
                            placeholder="e.g. John Doe"
                            placeholderTextColor="#9CA3AF"
                            value={form.CustomerName}
                            onChangeText={v => { setForm(f => ({ ...f, CustomerName: v })); setErrors(e => ({ ...e, CustomerName: '' })); }}
                        />
                        {!!errors.CustomerName && <Text style={styles.errorText}>{errors.CustomerName}</Text>}

                        {/* Car Number */}
                        <Text style={styles.fieldLabel}>Car Number *</Text>
                        <TextInput
                            style={[styles.input, !!errors.CarNumber && styles.inputError]}
                            placeholder="e.g. ABC1234"
                            placeholderTextColor="#9CA3AF"
                            autoCapitalize="characters"
                            value={form.CarNumber}
                            onChangeText={v => { setForm(f => ({ ...f, CarNumber: v.toUpperCase() })); setErrors(e => ({ ...e, CarNumber: '' })); }}
                        />
                        {!!errors.CarNumber && <Text style={styles.errorText}>{errors.CarNumber}</Text>}

                        {/* Mobile */}
                        <Text style={styles.fieldLabel}>Mobile Number</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Optional"
                            placeholderTextColor="#9CA3AF"
                            keyboardType="phone-pad"
                            value={form.MobileNumber}
                            onChangeText={v => setForm(f => ({ ...f, MobileNumber: v }))}
                        />

                        {/* Vehicle Type */}
                        <Text style={styles.fieldLabel}>Vehicle Type</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. Sedan, SUV"
                            placeholderTextColor="#9CA3AF"
                            value={form.VehicleType}
                            onChangeText={v => setForm(f => ({ ...f, VehicleType: v }))}
                        />

                    </ScrollView>

                    {/* Actions */}
                    <View style={styles.modalActions}>
                        <TouchableOpacity
                            style={styles.cancelBtn}
                            onPress={() => setModalVisible(false)}
                            disabled={saving}
                        >
                            <Text style={styles.cancelBtnText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.saveBtn}
                            onPress={handleSave}
                            disabled={saving}
                        >
                            {saving
                                ? <ActivityIndicator size="small" color="#fff" />
                                : <Text style={styles.saveBtnText}>{editTarget ? 'Update' : 'Add'}</Text>
                            }
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        </Modal>
    );

    // ====================================================
    // MAIN SCREEN
    // ====================================================

    return (
        <SafeAreaView style={styles.container}>

            {renderModal()}

            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}
                >
                    <Ionicons name="arrow-back" size={24} color="#374151" />
                </TouchableOpacity>

                <View style={styles.headerIcon}>
                    <Ionicons name="people-outline" size={25} color="#374151" />
                </View>

                <View style={styles.headerTextContainer}>
                    <Text style={styles.headerTitle}>Kiosk Customer</Text>
                    <Text style={styles.headerSubtitle}>Manage customer records</Text>
                </View>

                {/* ADD BUTTON */}
                <TouchableOpacity style={styles.addBtn} onPress={handleAdd} activeOpacity={0.8}>
                    <Ionicons name="add" size={22} color="#fff" />
                    <Text style={styles.addBtnText}>Add</Text>
                </TouchableOpacity>
            </View>

            {/* SUMMARY */}
            <View style={styles.summaryCard}>
                <View style={styles.summaryTextContainer}>
                    <Text style={styles.summaryTitle}>Total Customers</Text>
                    <Text style={styles.summarySubtitle}>Kiosk customer records</Text>
                </View>
                <View style={styles.countBox}>
                    <Text style={styles.countText}>{customers.length}</Text>
                </View>
            </View>

            {/* LIST */}
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#374151" />
                    <Text style={styles.loadingText}>Loading customers...</Text>
                </View>
            ) : (
                <FlatList
                    data={customers}
                    renderItem={renderCustomer}
                    keyExtractor={(item, index) =>
                        String(item.CustomerVehicleId || `customer-${index}`)
                    }
                    contentContainerStyle={
                        customers.length === 0 ? styles.emptyList : styles.listContainer
                    }
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                    }
                    ListEmptyComponent={renderEmpty}
                />
            )}

        </SafeAreaView>
    );
};

export default KioskCustomer;

// ======================================================
// STYLES
// ======================================================

const styles = StyleSheet.create({

    container: { flex: 1, backgroundColor: '#F8F9FB' },

    // HEADER
    header: {
        minHeight: 70,
        paddingHorizontal: 16,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#F1F3F5',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    headerIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#F1F3F5',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    headerTextContainer: { flex: 1 },
    headerTitle: { fontSize: 20, fontWeight: '700', color: '#374151' },
    headerSubtitle: { fontSize: 12, color: '#6B7280', marginTop: 1 },
    addBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#374151',
        paddingHorizontal: 14,
        paddingVertical: 9,
        borderRadius: 12,
        gap: 5,
    },
    addBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },

    // SUMMARY
    summaryCard: {
        marginHorizontal: 16,
        marginTop: 14,
        paddingHorizontal: 18,
        paddingVertical: 14,
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    summaryTextContainer: { flex: 1 },
    summaryTitle: { fontSize: 15, fontWeight: '700', color: '#374151' },
    summarySubtitle: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
    countBox: {
        minWidth: 46,
        height: 40,
        paddingHorizontal: 10,
        borderRadius: 10,
        backgroundColor: '#F1F3F5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    countText: { fontSize: 20, fontWeight: '700', color: '#374151' },

    // LIST
    listContainer: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 30 },
    emptyList: { flexGrow: 1 },

    // CUSTOMER CARD
    customerCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        padding: 14,
        marginBottom: 12,
        flexDirection: 'row',
    },
    numberBox: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#F1F3F5',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        marginTop: 2,
    },
    numberText: { fontSize: 14, fontWeight: '700', color: '#374151' },
    customerDetails: { flex: 1 },

    // DETAIL ROW
    detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    detailIcon: {
        width: 34,
        height: 34,
        borderRadius: 9,
        backgroundColor: '#F5F6F7',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    detailContent: { flex: 1 },
    detailLabel: { fontSize: 11, color: '#9CA3AF', marginBottom: 1 },
    detailValue: { fontSize: 15, fontWeight: '600', color: '#374151' },

    // CARD FOOTER
    cardFooter: {
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        paddingTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 8,
    },
    dateRow: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    dateText: { fontSize: 11, color: '#6B7280', marginLeft: 5 },
    actionRow: { flexDirection: 'row', gap: 8 },
    editBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 9,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        backgroundColor: '#F9FAFB',
    },
    editBtnText: { fontSize: 13, fontWeight: '600', color: '#374151' },
    deleteBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 9,
        backgroundColor: '#EF4444',
        minWidth: 72,
        justifyContent: 'center',
    },
    deleteBtnText: { fontSize: 13, fontWeight: '600', color: '#fff' },

    // LOADING
    loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    loadingText: { marginTop: 12, fontSize: 14, color: '#6B7280' },

    // EMPTY
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30,
    },
    emptyIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#F1F3F5',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
    },
    emptyTitle: { fontSize: 19, fontWeight: '700', color: '#374151' },
    emptyDescription: {
        marginTop: 6,
        fontSize: 14,
        color: '#9CA3AF',
        textAlign: 'center',
    },

    // MODAL
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'flex-end',
    },
    modalCard: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 22,
        borderTopRightRadius: 22,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 30,
        maxHeight: '88%',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    modalTitle: { fontSize: 20, fontWeight: '700', color: '#374151' },
    fieldLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 6,
        marginTop: 14,
    },
    input: {
        height: 48,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 12,
        paddingHorizontal: 14,
        fontSize: 15,
        color: '#374151',
        backgroundColor: '#F9FAFB',
    },
    inputError: { borderColor: '#EF4444' },
    errorText: { fontSize: 12, color: '#EF4444', marginTop: 4 },
    modalActions: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 24,
    },
    cancelBtn: {
        flex: 1,
        height: 50,
        borderRadius: 13,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F9FAFB',
    },
    cancelBtnText: { fontSize: 15, fontWeight: '600', color: '#374151' },
    saveBtn: {
        flex: 1,
        height: 50,
        borderRadius: 13,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#374151',
    },
    saveBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },

});