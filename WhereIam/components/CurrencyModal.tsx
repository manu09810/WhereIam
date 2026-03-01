import { useLocation } from "@/context/LocationContext";
import { getReadableTextColor } from "@/constants/functions";
import {
  ALPHA,
  FONT_SIZE,
  MODAL,
  RADIUS,
  SIZE,
  SPACING,
} from "@/constants/theme";
import { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { XMarkIcon } from "react-native-heroicons/solid";
import { ArrowsRightLeftIcon } from "react-native-heroicons/outline";
import { useCurrency } from "@/hooks/use-currency";

interface CurrencyModalProps {
  visible: boolean;
  onClose: () => void;
  currency: string | null;
}

export const CurrencyModal = ({
  visible,
  onClose,
  currency,
}: CurrencyModalProps) => {
  const { themeColors } = useLocation();
  const [amount, setAmount] = useState<string>("");
  const [converted, setConverted] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toUSD, setToUSD] = useState(true);
  const {
    boolean: currencyExists,
    isLoading,
    error: currencyError,
  } = useCurrency(currency);

  const sheetBg = themeColors?.[0] || "#ffffff";
  const textColor = getReadableTextColor(sheetBg);
  const isLight = textColor === "#111111";
  const cardBg = isLight ? ALPHA.lightCard : ALPHA.darkCard;
  const cardBorder = isLight ? ALPHA.lightCardBorder : ALPHA.darkCardBorder;
  const dimText = isLight ? ALPHA.lightDimText : ALPHA.darkDimText;
  const inputBg = isLight ? ALPHA.lightInput : ALPHA.darkInput;
  const inputBorder = isLight ? ALPHA.lightInputBorder : ALPHA.darkInputBorder;
  const btnBg = textColor;
  const btnText = isLight ? "#ffffff" : "#111111";

  const handleConvert = async () => {
    if (!currency || !amount || isNaN(Number(amount))) {
      setError("Please enter a valid amount.");
      return;
    }
    setLoading(true);
    setError(null);
    setConverted(null);
    try {
      const from = toUSD ? currency : "USD";
      const to = toUSD ? "USD" : currency;
      const response = await fetch(
        `https://juanmalorenzo.com/api/${from}/${to}/${amount}`,
      );
      const data = await response.json();
      if (typeof data === "number" && !isNaN(data)) {
        setConverted(data);
      } else {
        setError("Conversion failed.");
      }
    } catch (e) {
      setError("Error fetching conversion.");
    } finally {
      setLoading(false);
    }
  };

  const handleSwitch = () => {
    setToUSD((prev) => !prev);
    setConverted(null);
    setAmount("");
    setError(null);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: ALPHA.overlayBg,
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: sheetBg,
              borderTopLeftRadius: RADIUS.sheet,
              borderTopRightRadius: RADIUS.sheet,
              borderTopWidth: 1,
              borderLeftWidth: 1,
              borderRightWidth: 1,
              borderColor: isLight ? ALPHA.lightBorder : ALPHA.darkBorder,
              padding: SPACING.sheet,
              paddingBottom: Platform.OS === "ios" ? SPACING.iosBottom : SPACING.sheet,
              minHeight: MODAL.minHeight,
            }}
          >
            {/* Drag handle */}
            <View
              style={{
                width: SIZE.handleWidth,
                height: SIZE.handleHeight,
                borderRadius: RADIUS.handle,
                backgroundColor: isLight ? ALPHA.lightHandle : ALPHA.darkHandle,
                alignSelf: "center",
                marginBottom: SPACING.xxxl,
              }}
            />

            {/* Header */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: SPACING.xxxl,
              }}
            >
              <Text
                style={{ fontSize: FONT_SIZE.title, fontWeight: "800", color: textColor }}
              >
                Currency
              </Text>
              <TouchableOpacity
                onPress={onClose}
                style={{
                  backgroundColor: isLight ? ALPHA.lightBorder : ALPHA.darkBorder,
                  borderRadius: RADIUS.closeBtn,
                  padding: SPACING.md,
                }}
              >
                <XMarkIcon size={SIZE.icon} color={textColor} />
              </TouchableOpacity>
            </View>

            {isLoading ? (
              <View
                style={{
                  paddingVertical: SPACING.sectionGap,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ActivityIndicator size="large" color={textColor} />
              </View>
            ) : !currencyExists ? (
              <View
                style={{
                  paddingVertical: SPACING.sectionGap,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: FONT_SIZE.input,
                    color: dimText,
                    textAlign: "center",
                  }}
                >
                  Not available in this region
                </Text>
              </View>
            ) : (
              <>
                {/* Direction toggle */}
                <TouchableOpacity
                  onPress={handleSwitch}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: cardBg,
                    borderWidth: 1,
                    borderColor: cardBorder,
                    borderRadius: RADIUS.card,
                    paddingVertical: SPACING.lg,
                    paddingHorizontal: SPACING.inner,
                    marginBottom: SPACING.xxxl,
                    alignSelf: "center",
                    gap: SPACING.lg,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "700",
                      fontSize: FONT_SIZE.body,
                      color: textColor,
                      letterSpacing: 0.5,
                    }}
                  >
                    {toUSD ? `${currency} → USD` : `USD → ${currency}`}
                  </Text>
                  <ArrowsRightLeftIcon size={SIZE.switchIcon} color={textColor} />
                </TouchableOpacity>

                {/* Label */}
                <Text
                  style={{
                    fontSize: FONT_SIZE.label,
                    color: dimText,
                    fontWeight: "700",
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    marginBottom: SPACING.md,
                  }}
                >
                  {toUSD ? `Amount in ${currency}` : "Amount in USD"}
                </Text>

                {/* Input */}
                <TextInput
                  placeholder={toUSD ? `0.00 ${currency}` : "0.00 USD"}
                  placeholderTextColor={dimText}
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="numeric"
                  style={{
                    backgroundColor: inputBg,
                    borderWidth: 1,
                    borderColor: inputBorder,
                    borderRadius: RADIUS.input,
                    padding: SPACING.xl,
                    fontSize: FONT_SIZE.large,
                    fontWeight: "700",
                    marginBottom: SPACING.xl,
                    color: textColor,
                  }}
                />

                {/* Convert button */}
                <TouchableOpacity
                  onPress={handleConvert}
                  style={{
                    backgroundColor: btnBg,
                    borderRadius: RADIUS.input,
                    padding: MODAL.convertPadding,
                    alignItems: "center",
                    marginBottom: SPACING.xl,
                    opacity: loading ? ALPHA.loadingOpacity : 1,
                  }}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color={btnText} />
                  ) : (
                    <Text
                      style={{
                        color: btnText,
                        fontWeight: "700",
                        fontSize: FONT_SIZE.input,
                        letterSpacing: 0.3,
                      }}
                    >
                      Convert
                    </Text>
                  )}
                </TouchableOpacity>

                {/* Result */}
                {converted !== null && !loading && (
                  <View
                    style={{
                      backgroundColor: cardBg,
                      borderWidth: 1,
                      borderColor: cardBorder,
                      borderRadius: RADIUS.card,
                      padding: SPACING.xxl,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: FONT_SIZE.label,
                        color: dimText,
                        fontWeight: "700",
                        letterSpacing: 2,
                        textTransform: "uppercase",
                        marginBottom: SPACING.sm,
                      }}
                    >
                      Result
                    </Text>
                    <Text
                      style={{
                        fontSize: FONT_SIZE.result,
                        fontWeight: "800",
                        color: textColor,
                        letterSpacing: -0.5,
                      }}
                    >
                      {converted.toFixed(2)}{" "}
                      <Text style={{ fontSize: FONT_SIZE.input, fontWeight: "600" }}>
                        {toUSD ? "USD" : currency}
                      </Text>
                    </Text>
                    <Text
                      style={{ fontSize: FONT_SIZE.errorText, color: dimText, marginTop: SPACING.xs }}
                    >
                      from {amount} {toUSD ? currency : "USD"}
                    </Text>
                  </View>
                )}

                {error && (
                  <Text
                    style={{
                      color: dimText,
                      marginTop: SPACING.lg,
                      textAlign: "center",
                      fontSize: FONT_SIZE.error,
                    }}
                  >
                    {error}
                  </Text>
                )}
              </>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
