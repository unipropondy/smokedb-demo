const fs = require('fs');
const path = 'c:/Users/faiza/Downloads/smokedb-demo/frontend/app/(tabs)/category.tsx';
let content = fs.readFileSync(path, 'utf8');

// ─── 1. Replace TableItemComponent (lines 472..730) ─────────────────────────
const compStart = content.indexOf('// --- MEMOIZED TABLE COMPONENT (CAR WASH BAY) ---');
const compEnd   = content.indexOf('\nconst TableGridSkeleton = (');
if (compStart < 0 || compEnd < 0) { console.error('Component markers not found', compStart, compEnd); process.exit(1); }

const newComponent = `// --- MEMOIZED TABLE COMPONENT (CAR WASH BAY CARD) ---
const TableItemComponent = React.memo(
  ({
    tableId,
    item,
    itemSize,
    activeTab,
    onPress,
    numberFont,
    smallFont,
    isTabletPortrait,
    isAbsoluteLayout,
    layoutScale = 1,
    backgroundTheme = "light",
  }: {
    tableId: string;
    item: TableItem;
    itemSize: number;
    activeTab: string;
    onPress: (item: TableItem, tableData: any, isCheckout?: boolean) => void;
    numberFont: number;
    smallFont: number;
    isTabletPortrait?: boolean;
    isAbsoluteLayout?: boolean;
    layoutScale?: number;
    backgroundTheme?: string;
  }) => {
    const tableData = useTableStatusStore((state) => state.tableMap[tableId]);
    const terminalStatus = useTerminalPaymentStore((state) => state.sessions[tableId]?.status);

    const status = tableData
      ? tableData.status === "SENT" ? 1
        : tableData.status === "BILL_REQUESTED" ? 2
        : tableData.status === "HOLD" ? 3
        : tableData.status === "LOCKED" ? 5
        : 0
      : Number(item.Status);

    const billAmount = tableData?.totalAmount !== undefined ? tableData.totalAmount : Number(item.totalAmount) || 0;
    const rawStartTime = tableData?.startTime || (item.StartTime
      ? typeof item.StartTime === "string" ? parseDatabaseDate(item.StartTime).getTime() : item.StartTime
      : 0);
    const isOvertime = status !== 0 && (tableData?.isHoldOvertime || Number(item.isOvertime) === 1 || Number(item.isHoldOvertime) === 1);

    let effectiveStatus = status;
    if ((status === 1 || status === 3) && isOvertime) effectiveStatus = 4;

    const rawEntryStatus = (tableData?.entryStatus !== undefined && tableData?.entryStatus !== null) ? tableData.entryStatus : item.entryStatus;
    const rawPaymentStatus = (tableData as any)?.paymentStatus !== undefined ? (tableData as any).paymentStatus : item.paymentStatus;
    const isPaid = rawEntryStatus === "q" && Number(rawPaymentStatus) === 1;

    let timeText = "";
    if (rawStartTime && status !== 0 && status !== 5) {
      timeText = formatToSingaporeTime(rawStartTime, { hour: "2-digit", minute: "2-digit", hour12: false });
    }

    // ── Color palette per status ──────────────────────────────────────────────
    type StatusStyle = {
      cardBg: [string, string]; badge: string; badgeBg: string; badgeBorder: string;
      carColor: string; textColor: string; label: string;
    };
    let ss: StatusStyle;
    if (isPaid) {
      ss = { cardBg: ["#FFF1F2","#FFE4E6"], badge:"#EF4444", badgeBg:"#FEF2F2", badgeBorder:"#FCA5A5", carColor:"#EF4444", textColor:"#EF4444", label:"PAID" };
    } else {
      switch (effectiveStatus) {
        case 1: ss = { cardBg:["#EFF6FF","#DBEAFE"], badge:"#3B82F6", badgeBg:"#EFF6FF", badgeBorder:"#93C5FD", carColor:"#3B82F6", textColor:"#1D4ED8", label:"Washing" }; break;
        case 2: ss = { cardBg:["#FFFBEB","#FEF3C7"], badge:"#F97316", badgeBg:"#FFF7ED", badgeBorder:"#FED7AA", carColor:"#F97316", textColor:"#B45309", label:"Waiting" }; break;
        case 4: ss = { cardBg:["#F0FDF4","#DCFCE7"], badge:"#22C55E", badgeBg:"#F0FDF4", badgeBorder:"#86EFAC", carColor:"#16A34A", textColor:"#15803D", label:"Completed" }; break;
        case 5: ss = { cardBg:["#F5F3FF","#EDE9FE"], badge:"#8B5CF6", badgeBg:"#F5F3FF", badgeBorder:"#C4B5FD", carColor:"#8B5CF6", textColor:"#7C3AED", label:"Reserved" }; break;
        default: ss = { cardBg:["#FFFFFF","#F8FAFC"], badge:"#94A3B8", badgeBg:"#F8FAFC", badgeBorder:"#E2E8F0", carColor:"#94A3B8", textColor:"#64748B", label:"Available" };
      }
    }

    const isOccupied = effectiveStatus !== 0 && !isPaid;
    const cardW = isTablet ? 200 : 160;
    const cardH = isTablet ? 200 : 170;

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => onPress(item, tableData)}
        style={{ width: cardW, margin: 6 }}
      >
        <LinearGradient
          colors={ss.cardBg}
          style={{
            borderRadius: 14,
            padding: 12,
            minHeight: cardH,
            borderWidth: 1,
            borderColor: isOccupied ? ss.badgeBorder : "#E5E7EB",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 6,
            elevation: isOccupied ? 3 : 1,
          }}
        >
          {/* ── Row 1: Bay label + status badge + 3-dot ── */}
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <Text style={{ fontFamily: Fonts.bold, fontSize: 13, color: "#1E293B" }}>
              Bay {item.label}
            </Text>

            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              {/* Status badge */}
              <View style={{
                flexDirection: "row", alignItems: "center", gap: 4,
                backgroundColor: ss.badgeBg, borderRadius: 20, borderWidth: 1,
                borderColor: ss.badgeBorder, paddingHorizontal: 8, paddingVertical: 3,
              }}>
                {effectiveStatus === 1 && <Ionicons name="water" size={10} color={ss.badge} />}
                {effectiveStatus === 2 && <Ionicons name="time" size={10} color={ss.badge} />}
                {effectiveStatus === 4 && <Ionicons name="checkmark-circle" size={10} color={ss.badge} />}
                {effectiveStatus === 5 && <Ionicons name="calendar" size={10} color={ss.badge} />}
                <Text style={{ fontFamily: Fonts.semiBold, fontSize: 10, color: ss.badge }}>{ss.label}</Text>
              </View>

              {/* Three-dot menu */}
              <TouchableOpacity onPress={(e) => { e.stopPropagation(); }} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="ellipsis-vertical" size={16} color="#94A3B8" />
              </TouchableOpacity>
            </View>
          </View>

          {/* ── Row 2: Car icon ── */}
          <View style={{ alignItems: "center", justifyContent: "center", paddingVertical: 6, position: "relative" }}>
            {effectiveStatus === 1 && (
              <>
                <Ionicons name="water-outline" size={18} color="rgba(59,130,246,0.5)" style={{ position: "absolute", top: -4, left: "25%" }} />
                <Ionicons name="water-outline" size={14} color="rgba(59,130,246,0.4)" style={{ position: "absolute", top: 2, right: "22%" }} />
              </>
            )}
            {effectiveStatus === 4 && (
              <Ionicons name="sparkles" size={16} color="rgba(34,197,94,0.6)" style={{ position: "absolute", top: -2, right: "20%" }} />
            )}
            <Ionicons
              name={isOccupied || isPaid ? "car-sport" : "car"}
              size={isTablet ? 72 : 60}
              color={ss.carColor}
            />
          </View>

          {/* ── Row 3: Info (only when occupied) ── */}
          {(isOccupied || isPaid) ? (
            <View style={{ marginTop: 6 }}>
              {timeText ? (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 2 }}>
                  <Ionicons name="time-outline" size={11} color={ss.textColor} />
                  <Text style={{ fontFamily: Fonts.semiBold, fontSize: 11, color: ss.textColor }}>{timeText}</Text>
                </View>
              ) : null}
              {(tableData?.customerName || item.TableName) ? (
                <View style={{ backgroundColor: "#FFFFFF", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, marginBottom: 3, alignSelf: "flex-start", borderWidth: 1, borderColor: "#E5E7EB" }}>
                  <Text style={{ fontFamily: Fonts.bold, fontSize: 10, color: "#1E293B" }} numberOfLines={1}>
                    {tableData?.customerName || item.TableName || "TN 00 AB 0000"}
                  </Text>
                </View>
              ) : null}
              {(tableData?.lockedByName) ? (
                <Text style={{ fontFamily: Fonts.medium, fontSize: 10, color: "#64748B" }} numberOfLines={1}>
                  {tableData.lockedByName}
                </Text>
              ) : null}
              {billAmount > 0 && (
                <Text style={{ fontFamily: Fonts.black, fontSize: 13, color: ss.badge, marginTop: 3 }}>
                  \${billAmount.toFixed(2)}
                </Text>
              )}
            </View>
          ) : null}
        </LinearGradient>

        {/* Terminal processing indicator */}
        {terminalStatus && terminalStatus !== "idle" && (
          <TouchableOpacity
            style={{ position: "absolute", top: 8, right: 28, width: 22, height: 22, borderRadius: 11, backgroundColor: terminalStatus === "processing" ? "#EFF6FF" : "#FEF2F2", justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: terminalStatus === "processing" ? "#93C5FD" : "#FCA5A5", elevation: 3 }}
            onPress={(e) => { e.stopPropagation(); useTerminalPaymentStore.getState().clearSession(tableId); }}
          >
            {terminalStatus === "processing" ? (
              <RotatingSyncIcon size={14} color="#3b82f6" />
            ) : (
              <Ionicons name="alert" size={12} color="#EF4444" />
            )}
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  }
);
`;

content = content.slice(0, compStart) + newComponent + content.slice(compEnd + 1);

// ─── 2. Replace the CAR WASH BAY GRID section with grid + stats bar + footer ──
const gridStart = content.indexOf('{/* CAR WASH BAY GRID */}');
const gridEnd   = content.indexOf('      {/* \u3030\u3030\u3030\u3030\u3030\u3030\u3030\u3030\u3030\u3030\u3030 CUSTOMER GUEST');
if (gridStart < 0 || gridEnd < 0) { console.error('Grid markers not found', gridStart, gridEnd); process.exit(1); }

const newGrid = `{/* CAR WASH BAY GRID */}
      <View style={{ flex: 1, backgroundColor: '#EBF4FF' }}>

        {/* Stats + Legend Bar */}
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB', flexWrap: 'wrap', gap: 8 }}>
          {/* Total Bays */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingRight: 16, borderRightWidth: 1, borderRightColor: '#E5E7EB' }}>
            <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center' }}>
              <Ionicons name="car" size={18} color="#3B82F6" />
            </View>
            <View>
              <Text style={{ fontFamily: Fonts.medium, fontSize: 10, color: '#64748B' }}>Total Bays</Text>
              <Text style={{ fontFamily: Fonts.black, fontSize: 20, color: '#1E293B', marginTop: -2 }}>{currentTables.length}</Text>
            </View>
          </View>
          {/* Occupied */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, borderRightWidth: 1, borderRightColor: '#E5E7EB' }}>
            <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#DBEAFE', justifyContent: 'center', alignItems: 'center' }}>
              <Ionicons name="car-sport" size={18} color="#3B82F6" />
            </View>
            <View>
              <Text style={{ fontFamily: Fonts.medium, fontSize: 10, color: '#64748B' }}>Occupied</Text>
              <Text style={{ fontFamily: Fonts.black, fontSize: 20, color: '#1E293B', marginTop: -2 }}>
                {currentTables.filter(t => { const s = tableMap[t.id]?.status; return s === 'SENT' || s === 'BILL_REQUESTED' || s === 'HOLD' || s === 'LOCKED'; }).length}
              </Text>
            </View>
          </View>
          {/* Available */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingLeft: 16 }}>
            <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' }}>
              <Ionicons name="car" size={18} color="#94A3B8" />
            </View>
            <View>
              <Text style={{ fontFamily: Fonts.medium, fontSize: 10, color: '#64748B' }}>Available</Text>
              <Text style={{ fontFamily: Fonts.black, fontSize: 20, color: '#1E293B', marginTop: -2 }}>
                {currentTables.filter(t => { const s = tableMap[t.id]?.status; return !s || s === 'FREE'; }).length || currentTables.filter(t => Number(t.Status) === 0).length}
              </Text>
            </View>
          </View>

          {/* Legend */}
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 14, flexWrap: 'wrap' }}>
            {[
              { color: '#3B82F6', label: 'Washing' },
              { color: '#F97316', label: 'Waiting' },
              { color: '#22C55E', label: 'Completed' },
              { color: '#94A3B8', label: 'Available' },
            ].map(({ color, label }) => (
              <View key={label} style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: color }} />
                <Text style={{ fontFamily: Fonts.medium, fontSize: 11, color: '#64748B' }}>{label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Bay Grid */}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 10, paddingTop: 12, paddingBottom: isTablet ? 160 : 100, flexDirection: 'row', flexWrap: 'wrap' }}>
          {currentTables.length === 0 ? (
            <View style={[styles.emptyContainer, { width: '100%' }]}>
              <Ionicons name="car-sport-outline" size={48} color={Theme.border} />
              <Text style={styles.emptyText}>No wash bays found</Text>
              <TouchableOpacity onPress={fetchTables} style={styles.retryBtn}>
                <Ionicons name="refresh-outline" size={16} color={Theme.primary} />
                <Text style={styles.retryText}>Refresh</Text>
              </TouchableOpacity>
            </View>
          ) : (
            currentTables.map((item) => (
              <TableItemComponent
                key={item.id}
                tableId={item.id}
                item={item}
                itemSize={isTablet ? 180 : 150}
                activeTab={activeTab}
                onPress={handleTablePress}
                numberFont={numberFont}
                smallFont={smallFont}
                isTabletPortrait={!isLandscape && isTablet}
                backgroundTheme={backgroundTheme}
              />
            ))
          )}
        </ScrollView>

        {/* Footer */}
        <View style={{ backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingHorizontal: 20, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#DBEAFE' }}>
              <Ionicons name="storefront" size={20} color="#3B82F6" />
            </View>
            <View>
              <Text style={{ fontFamily: Fonts.bold, fontSize: 13, color: '#1E293B' }}>Car Wash Demo</Text>
              <Text style={{ fontFamily: Fonts.medium, fontSize: 10, color: '#64748B' }}>59 Madras Street, Singapore 208422</Text>
              <Text style={{ fontFamily: Fonts.medium, fontSize: 9, color: '#94A3B8' }}>\u00A9 2026 UNIPRO. All rights reserved.</Text>
            </View>
          </View>

          <Text style={{ fontFamily: Fonts.bold, fontSize: 15, color: '#93C5FD', fontStyle: 'italic', flex: 1, textAlign: 'center' }}>
            Clean Cars. Brighter Journeys
          </Text>

          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => currentTables.length > 0 && handleTablePress(currentTables[0], null)}
            style={{ backgroundColor: '#3B82F6', borderRadius: 28, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 20, paddingVertical: 12, shadowColor: '#3B82F6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 }}
          >
            <Ionicons name="add" size={20} color="#FFFFFF" />
            <Text style={{ fontFamily: Fonts.bold, fontSize: 14, color: '#FFFFFF' }}>New Entry</Text>
          </TouchableOpacity>
        </View>
      </View>

      `;

content = content.slice(0, gridStart) + newGrid + content.slice(gridEnd);

fs.writeFileSync(path, content, 'utf8');
console.log('Success! File size:', content.length, 'bytes');
